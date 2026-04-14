import { PomodoroRepository } from "../repositories/PomodoroRepository";
import { SubjectRepository } from "../repositories/SubjectRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { GoalRepository } from "../repositories/GoalRepository";
import { GoalStatus } from "../database/entities/StudyGoal";
import { AppError } from "../middlewares/errorHandler";

interface CreateSessionData {
  duration: number;
  breakTime: number;
  subjectId?: string;
  topicId?: string;
}

interface CompleteSessionData {}

interface SessionResponse {
  id: string;
  duration: number;
  breakTime: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  createdAt: Date;
  subjectId?: string;
  subjectName?: string;
  subjectColor?: string;
  topicId?: string;
  topicName?: string;
}

interface FilterSessionsData {
  subjectId?: string;
  topicId?: string;
  startDate?: string;
  endDate?: string;
}

export class PomodoroService {
  private pomodoroRepository: PomodoroRepository;
  private subjectRepository: SubjectRepository;
  private topicRepository: TopicRepository;
  private goalRepository: GoalRepository;

  constructor() {
    this.pomodoroRepository = new PomodoroRepository();
    this.subjectRepository = new SubjectRepository();
    this.topicRepository = new TopicRepository();
    this.goalRepository = new GoalRepository();
  }

  /**
   * Criar nova sessão Pomodoro
   */
  async createSession(
    userId: string,
    data: CreateSessionData
  ): Promise<SessionResponse> {
    const { duration, breakTime, subjectId, topicId } = data;

    if (subjectId) {
      const subject = await this.subjectRepository.findByIdAndUserId(
        subjectId,
        userId
      );
      if (!subject) {
        throw new AppError("Matéria não encontrada", 404);
      }
    }

    if (topicId) {
      const topic = await this.topicRepository.findById(topicId);
      if (!topic) {
        throw new AppError("Tópico não encontrado", 404);
      }
      if (subjectId && topic.subjectId !== subjectId) {
        throw new AppError("Tópico não pertence a esta matéria", 400);
      }
    }

    const session = await this.pomodoroRepository.create({
      userId,
      duration,
      breakTime,
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      startTime: new Date(),
      completed: false,
    });

    return this.formatSessionResponse(session);
  }

  /**
   * Completar sessão e atualizar progresso das metas automaticamente
   */
  async completeSession(
    sessionId: string,
    userId: string,
    _data: CompleteSessionData
  ): Promise<SessionResponse> {
    const session = await this.pomodoroRepository.findByIdAndUserId(
      sessionId,
      userId
    );

    if (!session) {
      throw new AppError("Sessão não encontrada", 404);
    }

    if (session.completed) {
      throw new AppError("Sessão já foi completada", 400);
    }

    const updatedSession = await this.pomodoroRepository.update(sessionId, {
      completed: true,
      endTime: new Date(),
    });

    if (!updatedSession) {
      throw new AppError("Erro ao completar sessão", 500);
    }

    // Atualizar progresso das metas ativas automaticamente
    await this.updateActiveGoals(userId, session.duration);

    return this.formatSessionResponse(updatedSession);
  }

  /**
   * Atualizar todas as metas ativas com os minutos da sessão
   */
  private async updateActiveGoals(
    userId: string,
    minutesToAdd: number
  ): Promise<void> {
    try {
      const activeGoals = await this.goalRepository.findActiveByUserId(userId);

      for (const goal of activeGoals) {
        if (
          goal.status === GoalStatus.COMPLETED ||
          goal.status === GoalStatus.FAILED
        ) {
          continue;
        }

        const newCurrentMinutes = goal.currentMinutes + minutesToAdd;
        let newStatus: GoalStatus = goal.status;

        if (newCurrentMinutes > 0 && goal.status === GoalStatus.PENDING) {
          newStatus = GoalStatus.IN_PROGRESS;
        }

        if (newCurrentMinutes >= goal.targetMinutes) {
          newStatus = GoalStatus.COMPLETED;
        }

        await this.goalRepository.update(goal.id, {
          currentMinutes: newCurrentMinutes,
          status: newStatus,
        });
      }
    } catch (err) {
      // Não falhar a sessão se a atualização de metas der erro
      console.error("Erro ao atualizar metas após sessão Pomodoro:", err);
    }
  }

  /**
   * Listar sessões com filtros
   */
  async findSessions(
    userId: string,
    filters: FilterSessionsData
  ): Promise<SessionResponse[]> {
    const { subjectId, topicId, startDate, endDate } = filters;

    const sessions = await this.pomodoroRepository.findWithFilters({
      userId,
      subjectId,
      topicId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return sessions.map((session) => this.formatSessionResponse(session));
  }

  /**
   * Buscar sessão por ID
   */
  async findById(sessionId: string, userId: string): Promise<SessionResponse> {
    const session = await this.pomodoroRepository.findByIdAndUserId(
      sessionId,
      userId
    );

    if (!session) {
      throw new AppError("Sessão não encontrada", 404);
    }

    return this.formatSessionResponse(session);
  }

  /**
   * Listar sessões completadas
   */
  async findCompleted(userId: string): Promise<SessionResponse[]> {
    const sessions = await this.pomodoroRepository.findCompletedByUserId(userId);
    return sessions.map((session) => this.formatSessionResponse(session));
  }

  /**
   * Listar sessões em andamento
   */
  async findActive(userId: string): Promise<SessionResponse[]> {
    const sessions = await this.pomodoroRepository.findActiveByUserId(userId);
    return sessions.map((session) => this.formatSessionResponse(session));
  }

  /**
   * Obter estatísticas
   */
  async getStats(userId: string): Promise<{
    totalMinutes: number;
    totalSessions: number;
    completedSessions: number;
    activeSessions: number;
    bySubject: any[];
  }> {
    const totalMinutes = await this.pomodoroRepository.getTotalStudyTime(userId);
    const completed = await this.pomodoroRepository.findCompletedByUserId(userId);
    const active = await this.pomodoroRepository.findActiveByUserId(userId);
    const bySubject = await this.pomodoroRepository.getStudyTimeBySubject(userId);

    return {
      totalMinutes,
      totalSessions: completed.length + active.length,
      completedSessions: completed.length,
      activeSessions: active.length,
      bySubject: bySubject.map((item) => ({
        subjectName: item.subjectName,
        subjectColor: item.subjectColor,
        totalMinutes: parseInt(item.totalMinutes),
        sessionsCount: parseInt(item.sessionsCount),
      })),
    };
  }

  /**
   * Deletar sessão
   */
  async delete(sessionId: string, userId: string): Promise<void> {
    const session = await this.pomodoroRepository.findByIdAndUserId(
      sessionId,
      userId
    );

    if (!session) {
      throw new AppError("Sessão não encontrada", 404);
    }

    await this.pomodoroRepository.delete(sessionId);
  }

  /**
   * Formatar resposta de sessão
   */
  private formatSessionResponse(session: any): SessionResponse {
    return {
      id: session.id,
      duration: session.duration,
      breakTime: session.breakTime,
      startTime: session.startTime,
      endTime: session.endTime,
      completed: session.completed,
      createdAt: session.createdAt,
      subjectId: session.subjectId,
      subjectName: session.subject?.name,
      subjectColor: session.subject?.color,
      topicId: session.topicId,
      topicName: session.topic?.name,
    };
  }
}