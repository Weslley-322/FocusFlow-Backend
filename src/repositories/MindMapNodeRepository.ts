import { AppDataSource } from "../database/data-source";
import { MindMapNode } from "../database/entities/MindMapNode";
import { Repository } from "typeorm";

export class MindMapNodeRepository {
  private repository: Repository<MindMapNode>;

  constructor() {
    this.repository = AppDataSource.getRepository(MindMapNode);
  }

  /**
   * Criar novo nó
   */
  async create(nodeData: Partial<MindMapNode>): Promise<MindMapNode> {
    const node = this.repository.create(nodeData);
    return await this.repository.save(node);
  }

  /**
   * Buscar nó por ID
   */
  async findById(id: string): Promise<MindMapNode | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["mindMap"],
    });
  }

  /**
   * Buscar todos os nós de um mapa mental
   */
  async findByMindMapId(mindMapId: string): Promise<MindMapNode[]> {
    return await this.repository.find({
      where: { mindMapId },
      order: { order: "ASC" },
    });
  }

  /**
   * Atualizar nó
   */
  async update(id: string, nodeData: Partial<MindMapNode> & { parentId?: string | null }): Promise<MindMapNode | null> {
    // Converter parentId null → undefined para o TypeORM aceitar
    const data: Partial<MindMapNode> = {
      ...nodeData,
      parentId: nodeData.parentId === null ? undefined : nodeData.parentId,
    };
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  /**
   * Deletar nó
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Deletar todos os nós de um mapa mental
   */
  async deleteByMindMapId(mindMapId: string): Promise<void> {
    await this.repository.delete({ mindMapId });
  }

  /**
   * Contar nós de um mapa mental
   */
  async countByMindMapId(mindMapId: string): Promise<number> {
    return await this.repository.count({
      where: { mindMapId },
    });
  }
}