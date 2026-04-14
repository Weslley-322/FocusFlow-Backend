import { SubjectRepository } from "../repositories/SubjectRepository";
import { AppError } from "../middlewares/errorHandler";
import { Subject } from "../database/entities/Subject";

interface CreateSubjectData {
  name: string;
  color?: string;
  description?: string;
}

interface UpdateSubjectData {
  name?: string;
  color?: string;
  description?: string;
  isActive?: boolean;
}

interface SubjectResponse {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  topicsCount?: number;
}

export class SubjectService {
  private subjectRepository: SubjectRepository;

  constructor() {
    this.subjectRepository = new SubjectRepository();
  }

  /**
   * Criar nova matéria
   */
  async create(
    userId: string,
    data: CreateSubjectData
  ): Promise<SubjectResponse> {
    const subject = await this.subjectRepository.create({
      ...data,
      userId,
    });

    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      description: subject.description,
      isActive: subject.isActive,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      topicsCount: 0,
    };
  }

  /**
   * Listar todas as matérias do usuário
   */
  async findAll(userId: string): Promise<SubjectResponse[]> {
    const subjects = await this.subjectRepository.findByUserId(userId);

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      color: subject.color,
      description: subject.description,
      isActive: subject.isActive,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      topicsCount: subject.topics?.length || 0,
    }));
  }

  /**
   * Buscar matéria por ID
   */
  async findById(id: string, userId: string): Promise<SubjectResponse> {
    const subject = await this.subjectRepository.findByIdAndUserId(id, userId);

    if (!subject) {
      throw new AppError("Matéria não encontrada", 404);
    }

    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      description: subject.description,
      isActive: subject.isActive,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      topicsCount: subject.topics?.length || 0,
    };
  }

  /**
   * Atualizar matéria
   */
  async update(
    id: string,
    userId: string,
    data: UpdateSubjectData
  ): Promise<SubjectResponse> {
    // Verificar se a matéria existe e pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(id, userId);

    if (!subject) {
      throw new AppError("Matéria não encontrada", 404);
    }

    // Atualizar
    const updatedSubject = await this.subjectRepository.update(id, data);

    if (!updatedSubject) {
      throw new AppError("Erro ao atualizar matéria", 500);
    }

    return {
      id: updatedSubject.id,
      name: updatedSubject.name,
      color: updatedSubject.color,
      description: updatedSubject.description,
      isActive: updatedSubject.isActive,
      createdAt: updatedSubject.createdAt,
      updatedAt: updatedSubject.updatedAt,
      topicsCount: updatedSubject.topics?.length || 0,
    };
  }

  /**
   * Deletar matéria (soft delete)
   */
  async delete(id: string, userId: string): Promise<void> {
    // Verificar se a matéria existe e pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(id, userId);

    if (!subject) {
      throw new AppError("Matéria não encontrada", 404);
    }

    await this.subjectRepository.delete(id);
  }

  /**
   * Obter estatísticas das matérias do usuário
   */
  async getStats(userId: string): Promise<{
    totalSubjects: number;
    activeSubjects: number;
  }> {
    const totalSubjects = await this.subjectRepository.countByUserId(userId);

    return {
      totalSubjects,
      activeSubjects: totalSubjects, // Já conta apenas os ativos
    };
  }
}