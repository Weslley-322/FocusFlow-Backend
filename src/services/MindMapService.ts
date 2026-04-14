import { MindMapRepository } from "../repositories/MindMapRepository";
import { MindMapNodeRepository } from "../repositories/MindMapNodeRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { AppError } from "../middlewares/errorHandler";
import { MindMapNode } from "../database/entities/MindMapNode";

interface CreateMindMapData {
  title: string;
  description?: string;
  topicId?: string;
}

interface UpdateMindMapData {
  title?: string;
  description?: string;
  isActive?: boolean;
}

interface CreateNodeData {
  content: string;
  parentId?: string;
  positionX?: number;
  positionY?: number;
  backgroundColor?: string;
  textColor?: string;
}

interface UpdateNodeData {
  content?: string;
  parentId?: string | null;
  positionX?: number;
  positionY?: number;
  backgroundColor?: string;
  textColor?: string;
  order?: number;
  sourceHandle?: string;
  targetHandle?: string;
}

interface MindMapResponse {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  topicId?: string;
  topicName?: string;
  nodesCount?: number;
}

interface NodeResponse {
  id: string;
  content: string;
  level: number;
  parentId?: string;
  positionX: number;
  positionY: number;
  backgroundColor: string;
  textColor: string;
  order: number;
  mindMapId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface MindMapWithNodesResponse extends MindMapResponse {
  nodes: NodeResponse[];
}

export class MindMapService {
  private mindMapRepository: MindMapRepository;
  private mindMapNodeRepository: MindMapNodeRepository;
  private topicRepository: TopicRepository;

  constructor() {
    this.mindMapRepository = new MindMapRepository();
    this.mindMapNodeRepository = new MindMapNodeRepository();
    this.topicRepository = new TopicRepository();
  }

  /**
   * Criar novo mapa mental
   */
  async create(
    userId: string,
    data: CreateMindMapData
  ): Promise<MindMapResponse> {
    const { title, description, topicId } = data;

    // Validar se o tópico existe
    if (topicId) {
      const topic = await this.topicRepository.findById(topicId);

      if (!topic) {
        throw new AppError("Tópico não encontrado", 404);
      }

      // Verificar se o tópico pertence ao usuário (através da matéria)
      // Aqui assumimos que você tem acesso à matéria através do tópico
      // e pode validar se pertence ao usuário
    }

    const mindMap = await this.mindMapRepository.create({
      userId,
      title,
      description,
      topicId: topicId || undefined,
    });

    return this.formatMindMapResponse(mindMap);
  }

  /**
 * Listar todos os mapas mentais do usuário
 */
async findAll(userId: string): Promise<MindMapResponse[]> {
  const mindMaps = await this.mindMapRepository.findByUserId(userId);
  
  // Para cada mapa, contar os nós
  const mapsWithCount = await Promise.all(
    mindMaps.map(async (map) => {
      const nodesCount = await this.mindMapNodeRepository.countByMindMapId(map.id);
      
      return {
        ...this.formatMindMapResponse(map),
        nodesCount,
      };
    })
  );
  
  return mapsWithCount;
}

  /**
   * Buscar mapa mental por ID (com todos os nós)
   */
  async findById(id: string, userId: string): Promise<MindMapWithNodesResponse> {
    const mindMap = await this.mindMapRepository.findByIdAndUserId(id, userId);

    if (!mindMap) {
      throw new AppError("Mapa mental não encontrado", 404);
    }

    const nodes = await this.mindMapNodeRepository.findByMindMapId(id);

    return {
      ...this.formatMindMapResponse(mindMap),
      nodes: nodes.map((node) => this.formatNodeResponse(node)),
    };
  }

  /**
   * Listar mapas mentais por tópico
   */
  async findByTopicId(
    topicId: string,
    userId: string
  ): Promise<MindMapResponse[]> {
    const topic = await this.topicRepository.findById(topicId);

    if (!topic) {
      throw new AppError("Tópico não encontrado", 404);
    }

    const mindMaps = await this.mindMapRepository.findByTopicId(topicId, userId);
    return mindMaps.map((map) => this.formatMindMapResponse(map));
  }

  /**
   * Atualizar mapa mental
   */
  async update(
    id: string,
    userId: string,
    data: UpdateMindMapData
  ): Promise<MindMapResponse> {
    const mindMap = await this.mindMapRepository.findByIdAndUserId(id, userId);

    if (!mindMap) {
      throw new AppError("Mapa mental não encontrado", 404);
    }

    const updatedMindMap = await this.mindMapRepository.update(id, data);

    if (!updatedMindMap) {
      throw new AppError("Erro ao atualizar mapa mental", 500);
    }

    return this.formatMindMapResponse(updatedMindMap);
  }

  /**
   * Deletar mapa mental
   */
  async delete(id: string, userId: string): Promise<void> {
    const mindMap = await this.mindMapRepository.findByIdAndUserId(id, userId);

    if (!mindMap) {
      throw new AppError("Mapa mental não encontrado", 404);
    }

    await this.mindMapRepository.delete(id);
  }

  /**
 * Criar nó em um mapa mental
 */
async createNode(
  mindMapId: string,
  userId: string,
  data: CreateNodeData
): Promise<NodeResponse> {
  // Verificar se o mapa mental existe e pertence ao usuário
  const mindMap = await this.mindMapRepository.findByIdAndUserId(
    mindMapId,
    userId
  );

  if (!mindMap) {
    throw new AppError("Mapa mental não encontrado", 404);
  }

  // Calcular level baseado no pai
  let level = 0;
  
  // Verificar se o nó pai existe (se fornecido)
  if (data.parentId) {
    const parentNode = await this.mindMapNodeRepository.findById(
      data.parentId
    );

    if (!parentNode || parentNode.mindMapId !== mindMapId) {
      throw new AppError("Nó pai não encontrado neste mapa mental", 404);
    }
    
    // Level = level do pai + 1
    level = (parentNode.level || 0) + 1;
  }

  // Obter a próxima ordem
  const nodesCount = await this.mindMapNodeRepository.countByMindMapId(
    mindMapId
  );

const levelColors = [
  { bg: '#3B82F6', text: '#FFFFFF' },
  { bg: '#10B981', text: '#FFFFFF' }, 
  { bg: '#F59E0B', text: '#FFFFFF' }, 
  { bg: '#8B5CF6', text: '#FFFFFF' }, 
  { bg: '#EC4899', text: '#FFFFFF' }, 
  { bg: '#06B6D4', text: '#FFFFFF' }, 
];

const colorIndex = Math.min(level, levelColors.length - 1);
const defaultColor = levelColors[colorIndex];

const node = await this.mindMapNodeRepository.create({
  mindMapId,
  content: data.content,
  level,
  parentId: data.parentId || undefined,
  positionX: data.positionX || 0,
  positionY: data.positionY || 0,
  backgroundColor: data.backgroundColor || defaultColor.bg,
  textColor: data.textColor || defaultColor.text,
  order: nodesCount,
});

  console.log('Nó criado no backend:', node);
  console.log('Level calculado:', level);

  return this.formatNodeResponse(node);
}

  /**
   * Listar nós de um mapa mental
   */
  async findNodesByMindMapId(
    mindMapId: string,
    userId: string
  ): Promise<NodeResponse[]> {
    // Verificar se o mapa mental existe e pertence ao usuário
    const mindMap = await this.mindMapRepository.findByIdAndUserId(
      mindMapId,
      userId
    );

    if (!mindMap) {
      throw new AppError("Mapa mental não encontrado", 404);
    }

    const nodes = await this.mindMapNodeRepository.findByMindMapId(mindMapId);
    return nodes.map((node) => this.formatNodeResponse(node));
  }

  /**
   * Buscar nó por ID
   */
  async findNodeById(
    nodeId: string,
    userId: string
  ): Promise<NodeResponse> {
    const node = await this.mindMapNodeRepository.findById(nodeId);

    if (!node) {
      throw new AppError("Nó não encontrado", 404);
    }

    // Verificar se o mapa mental do nó pertence ao usuário
    const mindMap = await this.mindMapRepository.findByIdAndUserId(
      node.mindMapId,
      userId
    );

    if (!mindMap) {
      throw new AppError("Acesso negado", 403);
    }

    return this.formatNodeResponse(node);
  }

  /**
   * Atualizar nó
   */
  async updateNode(
    nodeId: string,
    userId: string,
    data: UpdateNodeData
  ): Promise<NodeResponse> {
    const node = await this.mindMapNodeRepository.findById(nodeId);

    if (!node) {
      throw new AppError("Nó não encontrado", 404);
    }

    // Verificar se o mapa mental do nó pertence ao usuário
    const mindMap = await this.mindMapRepository.findByIdAndUserId(
      node.mindMapId,
      userId
    );

    if (!mindMap) {
      throw new AppError("Acesso negado", 403);
    }

    const updatedNode = await this.mindMapNodeRepository.update(nodeId, data as Partial<MindMapNode> & { parentId?: string | null });

    if (!updatedNode) {
      throw new AppError("Erro ao atualizar nó", 500);
    }

    return this.formatNodeResponse(updatedNode);
  }

  /**
   * Deletar nó
   */
  async deleteNode(nodeId: string, userId: string): Promise<void> {
    const node = await this.mindMapNodeRepository.findById(nodeId);

    if (!node) {
      throw new AppError("Nó não encontrado", 404);
    }

    // Verificar se o mapa mental do nó pertence ao usuário
    const mindMap = await this.mindMapRepository.findByIdAndUserId(
      node.mindMapId,
      userId
    );

    if (!mindMap) {
      throw new AppError("Acesso negado", 403);
    }

    await this.mindMapNodeRepository.delete(nodeId);
  }

  /**
   * Obter estatísticas
   */
  async getStats(userId: string): Promise<{
    totalMindMaps: number;
    totalNodes: number;
  }> {
    const totalMindMaps = await this.mindMapRepository.countByUserId(userId);
    const mindMaps = await this.mindMapRepository.findByUserId(userId);

    let totalNodes = 0;
    for (const mindMap of mindMaps) {
      const count = await this.mindMapNodeRepository.countByMindMapId(
        mindMap.id
      );
      totalNodes += count;
    }

    return {
      totalMindMaps,
      totalNodes,
    };
  }

  /**
   * Formatar resposta de mapa mental
   */
  private formatMindMapResponse(mindMap: any): MindMapResponse {
    return {
      id: mindMap.id,
      title: mindMap.title,
      description: mindMap.description,
      isActive: mindMap.isActive,
      createdAt: mindMap.createdAt,
      updatedAt: mindMap.updatedAt,
      topicId: mindMap.topicId,
      topicName: mindMap.topic?.name,
      nodesCount: mindMap.nodes?.length || 0,
    };
  }

  /**
   * Formatar resposta de nó
   */
  private formatNodeResponse(node: any): NodeResponse {
    return {
      id: node.id,
      content: node.content,
      level: node.level || 0,
      parentId: node.parentId,
      positionX: node.positionX,
      positionY: node.positionY,
      backgroundColor: node.backgroundColor,
      textColor: node.textColor,
      order: node.order,
      mindMapId: node.mindMapId,
      sourceHandle: node.sourceHandle,
      targetHandle: node.targetHandle,
    };
  }
}