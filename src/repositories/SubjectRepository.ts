import { AppDataSource } from "../database/data-source";
import { Subject } from "../database/entities/Subject";
import { Repository } from "typeorm";

export class SubjectRepository {
  private repository: Repository<Subject>;

  constructor() {
    this.repository = AppDataSource.getRepository(Subject);
  }

  /**
   * Criar uma nova matéria
   */
  async create(subjectData: Partial<Subject>): Promise<Subject> {
    const subject = this.repository.create(subjectData);
    return await this.repository.save(subject);
  }

  /**
   * Buscar matéria por ID
   */
  async findById(id: string): Promise<Subject | null> {
  return await this.repository
    .createQueryBuilder("subject")
    .leftJoinAndSelect("subject.topics", "topic", "topic.isActive = :active", { active: true })
    .where("subject.id = :id", { id })
    .getOne();
}

  /**
   * Buscar todas as matérias de um usuário
   */
  async findByUserId(userId: string): Promise<Subject[]> {
  return await this.repository
    .createQueryBuilder("subject")
    .leftJoinAndSelect("subject.topics", "topic", "topic.isActive = :active", { active: true })
    .where("subject.userId = :userId", { userId })
    .andWhere("subject.isActive = :isActive", { isActive: true })
    .orderBy("subject.createdAt", "DESC")
    .getMany();
}

  /**
   * Buscar matéria por ID e userId (para verificar propriedade)
   */
  async findByIdAndUserId(id: string, userId: string): Promise<Subject | null> {
  return await this.repository
    .createQueryBuilder("subject")
    .leftJoinAndSelect("subject.topics", "topic", "topic.isActive = :active", { active: true })
    .where("subject.id = :id", { id })
    .andWhere("subject.userId = :userId", { userId })
    .getOne();
}

  /**
   * Atualizar matéria
   */
  async update(id: string, subjectData: Partial<Subject>): Promise<Subject | null> {
    await this.repository.update(id, subjectData);
    return await this.findById(id);
  }

  /**
   * Deletar matéria (soft delete)
   */
  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  /**
   * Deletar matéria permanentemente
   */
  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Contar matérias de um usuário
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId, isActive: true },
    });
  }
}