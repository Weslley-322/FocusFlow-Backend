import { AppDataSource } from "../database/data-source";
import { MindMap } from "../database/entities/MindMap";
import { Repository } from "typeorm";

export class MindMapRepository {
  private repository: Repository<MindMap>;

  constructor() {
    this.repository = AppDataSource.getRepository(MindMap);
  }

  /**
   * Criar novo mapa mental
   */
  async create(mindMapData: Partial<MindMap>): Promise<MindMap> {
    const mindMap = this.repository.create(mindMapData);
    return await this.repository.save(mindMap);
  }

  /**
   * Buscar mapa mental por ID
   */
  async findById(id: string): Promise<MindMap | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["topic", "nodes"],
    });
  }

  /**
   * Buscar mapa mental por ID e userId
   */
  async findByIdAndUserId(id: string, userId: string): Promise<MindMap | null> {
    return await this.repository.findOne({
      where: { id, userId },
      relations: ["topic", "nodes"],
    });
  }

  /**
   * Listar todos os mapas mentais do usuário
   */
  async findByUserId(userId: string): Promise<MindMap[]> {
    return await this.repository.find({
      where: { userId, isActive: true },
      relations: ["topic"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Listar mapas mentais por tópico
   */
  async findByTopicId(topicId: string, userId: string): Promise<MindMap[]> {
    return await this.repository.find({
      where: { topicId, userId, isActive: true },
      relations: ["topic"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Atualizar mapa mental
   */
  async update(id: string, mindMapData: Partial<MindMap>): Promise<MindMap | null> {
    await this.repository.update(id, mindMapData);
    return await this.findById(id);
  }

  /**
   * Deletar mapa mental (soft delete)
   */
  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  /**
   * Contar mapas mentais do usuário
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId, isActive: true },
    });
  }
}