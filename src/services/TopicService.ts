import { TopicRepository } from "../repositories/TopicRepository";
import { SubjectRepository } from "../repositories/SubjectRepository";
import { AppError } from "../middlewares/errorHandler";

interface CreateTopicData {
  name: string;
  description?: string;
  subjectId: string;
}

interface UpdateTopicData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

interface TopicResponse {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subjectId: string;
  subjectName?: string;
}

export class TopicService {
  private topicRepository: TopicRepository;
  private subjectRepository: SubjectRepository;

  constructor() {
    this.topicRepository = new TopicRepository();
    this.subjectRepository = new SubjectRepository();
  }

  /**
   * Criar novo tópico
   */
  async create(
    userId: string,
    data: CreateTopicData
  ): Promise<TopicResponse> {
    // Verificar se a matéria existe e pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      data.subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Matéria não encontrada", 404);
    }

    if (!subject.isActive) {
      throw new AppError("Não é possível adicionar tópicos a uma matéria inativa", 400);
    }

    const topic = await this.topicRepository.create(data);

    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      isActive: topic.isActive,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      subjectId: topic.subjectId,
      subjectName: subject.name,
    };
  }

  /**
   * Listar todos os tópicos de uma matéria
   */
  async findBySubjectId(
    subjectId: string,
    userId: string
  ): Promise<TopicResponse[]> {
    // Verificar se a matéria existe e pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Matéria não encontrada", 404);
    }

    const topics = await this.topicRepository.findBySubjectId(subjectId);

    return topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      isActive: topic.isActive,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      subjectId: topic.subjectId,
      subjectName: subject.name,
    }));
  }

  /**
   * Buscar tópico por ID
   */
  async findById(id: string, userId: string): Promise<TopicResponse> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new AppError("Tópico não encontrado", 404);
    }

    // Verificar se a matéria pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      topic.subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Acesso negado", 403);
    }

    return {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      isActive: topic.isActive,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      subjectId: topic.subjectId,
      subjectName: subject.name,
    };
  }

  /**
   * Atualizar tópico
   */
  async update(
    id: string,
    userId: string,
    data: UpdateTopicData
  ): Promise<TopicResponse> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new AppError("Tópico não encontrado", 404);
    }

    // Verificar se a matéria pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      topic.subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Acesso negado", 403);
    }

    const updatedTopic = await this.topicRepository.update(id, data);

    if (!updatedTopic) {
      throw new AppError("Erro ao atualizar tópico", 500);
    }

    return {
      id: updatedTopic.id,
      name: updatedTopic.name,
      description: updatedTopic.description,
      isActive: updatedTopic.isActive,
      createdAt: updatedTopic.createdAt,
      updatedAt: updatedTopic.updatedAt,
      subjectId: updatedTopic.subjectId,
      subjectName: subject.name,
    };
  }

  /**
   * Deletar tópico (soft delete)
   */
  async delete(id: string, userId: string): Promise<void> {
    const topic = await this.topicRepository.findById(id);

    if (!topic) {
      throw new AppError("Tópico não encontrado", 404);
    }

    // Verificar se a matéria pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      topic.subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Acesso negado", 403);
    }

    await this.topicRepository.delete(id);
  }
}