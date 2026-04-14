import { AppDataSource } from "../database/data-source";
import { Flashcard } from "../database/entities/Flashcard";
import { Repository, IsNull, LessThanOrEqual } from "typeorm";

export class FlashcardRepository {
  private repository: Repository<Flashcard>;

  constructor() {
    this.repository = AppDataSource.getRepository(Flashcard);
  }

  /**
   * Criar novo flashcard
   */
  async create(flashcardData: Partial<Flashcard>): Promise<Flashcard> {
    const flashcard = this.repository.create(flashcardData);
    return await this.repository.save(flashcard);
  }

  /**
   * Buscar flashcard por ID
   */
  async findById(id: string): Promise<Flashcard | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["subject", "topic", "reviews"],
    });
  }

  /**
   * Buscar flashcard por ID e userId
   */
  async findByIdAndUserId(id: string, userId: string): Promise<Flashcard | null> {
    return await this.repository.findOne({
      where: { id, userId },
      relations: ["subject", "topic", "reviews"],
    });
  }

  /**
   * Listar todos os flashcards do usuário
   */
  async findByUserId(userId: string): Promise<Flashcard[]> {
    return await this.repository.find({
      where: { userId, isActive: true },
      relations: ["subject", "topic"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Listar flashcards por matéria
   */
  async findBySubjectId(subjectId: string, userId: string): Promise<Flashcard[]> {
    return await this.repository.find({
      where: { subjectId, userId, isActive: true },
      relations: ["subject", "topic"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Listar flashcards por tópico
   */
  async findByTopicId(topicId: string, userId: string): Promise<Flashcard[]> {
    return await this.repository.find({
      where: { topicId, userId, isActive: true },
      relations: ["subject", "topic"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Buscar cards que precisam de revisão hoje
   */
  async findDueForReview(userId: string): Promise<Flashcard[]> {
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);
  const todayStr = today.toISOString().slice(0, 19).replace('T', ' ');


  const cards = await this.repository
    .createQueryBuilder('flashcard')
    .leftJoinAndSelect('flashcard.subject', 'subject')
    .leftJoinAndSelect('flashcard.topic', 'topic')
    .where('flashcard.userId = :userId', { userId })
    .andWhere('flashcard.isActive = :isActive', { isActive: true })
    .andWhere('(flashcard.nextReviewDate <= :today OR flashcard.nextReviewDate IS NULL)', { today: todayStr })
    .orderBy('flashcard.nextReviewDate', 'ASC')
    .getMany();
  return cards;
}
  /**
   * Atualizar flashcard
   */
  async update(id: string, flashcardData: Partial<Flashcard>): Promise<Flashcard | null> {
    await this.repository.update(id, flashcardData);
    return await this.findById(id);
  }

  /**
   * Deletar flashcard (soft delete)
   */
  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  /**
   * Contar flashcards do usuário
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId, isActive: true },
    });
  }

  /**
   * Contar cards para revisar hoje
   */
  async countDueForReview(userId: string): Promise<number> {
    const cards = await this.findDueForReview(userId);
    return cards.length;
  }
}