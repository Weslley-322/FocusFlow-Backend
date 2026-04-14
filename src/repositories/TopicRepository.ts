import { AppDataSource } from "../database/data-source";
import { Topic } from "../database/entities/Topic";
import { Repository } from "typeorm";

export class TopicRepository {
  private repository: Repository<Topic>;

  constructor() {
    this.repository = AppDataSource.getRepository(Topic);
  }

  /**
   * Criar um novo tópico
   */
  async create(topicData: Partial<Topic>): Promise<Topic> {
    const topic = this.repository.create(topicData);
    return await this.repository.save(topic);
  }

  /**
   * Buscar tópico por ID
   */
  async findById(id: string): Promise<Topic | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["subject"],
    });
  }

  /**
   * Buscar todos os tópicos de uma matéria
   */
  async findBySubjectId(subjectId: string): Promise<Topic[]> {
    return await this.repository.find({
      where: { subjectId, isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Buscar tópico por ID e verificar se pertence à matéria
   */
  async findByIdAndSubjectId(
    id: string,
    subjectId: string
  ): Promise<Topic | null> {
    return await this.repository.findOne({
      where: { id, subjectId },
      relations: ["subject"],
    });
  }

  /**
   * Atualizar tópico
   */
  async update(id: string, topicData: Partial<Topic>): Promise<Topic | null> {
    await this.repository.update(id, topicData);
    return await this.findById(id);
  }

  /**
   * Deletar tópico (soft delete)
   */
  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  /**
   * Deletar tópico permanentemente
   */
  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Contar tópicos de uma matéria
   */
  async countBySubjectId(subjectId: string): Promise<number> {
    return await this.repository.count({
      where: { subjectId, isActive: true },
    });
  }
}