import { GoalRepository } from "../repositories/GoalRepository";
import { GoalStatus, GoalType } from "../database/entities/StudyGoal";
import { AppError } from "../middlewares/errorHandler";

interface CreateGoalData {
  title: string;
  description?: string;
  type: string;
  targetMinutes: number;
  startDate: string;
  endDate: string;
}

interface UpdateGoalData {
  title?: string;
  description?: string;
  targetMinutes?: number;
  currentMinutes?: number;
  status?: GoalStatus;
}

interface GoalResponse {
  id: string;
  title: string;
  description?: string;
  type: string;
  targetMinutes: number;
  currentMinutes: number;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GoalService {
  private goalRepository: GoalRepository;

  constructor() {
    this.goalRepository = new GoalRepository();
  }

  /**
   * Converter string para GoalType
   */
  private stringToGoalType(type: string): GoalType {
    const typeMap: { [key: string]: GoalType } = {
      daily: GoalType.DAILY,
      weekly: GoalType.WEEKLY,
      monthly: GoalType.MONTHLY,
      custom: GoalType.CUSTOM,
    };

    return typeMap[type] || GoalType.CUSTOM;
  }

  /**
   * Converter string para GoalStatus
   */
  private stringToGoalStatus(status: string): GoalStatus {
    const statusMap: { [key: string]: GoalStatus } = {
      pending: GoalStatus.PENDING,
      in_progress: GoalStatus.IN_PROGRESS,
      completed: GoalStatus.COMPLETED,
      failed: GoalStatus.FAILED,
    };

    return statusMap[status] || GoalStatus.PENDING;
  }

  /**
   * Criar nova meta
   */
  async create(userId: string, data: CreateGoalData): Promise<GoalResponse> {
    const { title, description, type, targetMinutes, startDate, endDate } = data;

    const goal = await this.goalRepository.create({
      userId,
      title,
      description,
      type: this.stringToGoalType(type),
      targetMinutes,
      currentMinutes: 0,
      status: GoalStatus.PENDING,
      // T12:00:00 evita deslocamento de fuso horário (UTC-3 de Recife)
      startDate: new Date(startDate + 'T12:00:00'),
      endDate: new Date(endDate + 'T12:00:00'),
    });

    return this.formatGoalResponse(goal);
  }

  /**
   * Listar todas as metas
   */
  async findAll(userId: string): Promise<GoalResponse[]> {
    const goals = await this.goalRepository.findByUserId(userId);
    return goals.map((goal) => this.formatGoalResponse(goal));
  }

  /**
   * Buscar meta por ID
   */
  async findById(id: string, userId: string): Promise<GoalResponse> {
    const goal = await this.goalRepository.findByIdAndUserId(id, userId);

    if (!goal) {
      throw new AppError("Meta não encontrada", 404);
    }

    return this.formatGoalResponse(goal);
  }

  /**
   * Listar metas por status
   */
  async findByStatus(userId: string, status: string): Promise<GoalResponse[]> {
    const validStatuses = ["pending", "in_progress", "completed", "failed"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Status inválido", 400);
    }

    const goalStatus = this.stringToGoalStatus(status);
    const goals = await this.goalRepository.findByStatus(userId, goalStatus);
    return goals.map((goal) => this.formatGoalResponse(goal));
  }

  /**
   * Listar metas ativas
   */
  async findActive(userId: string): Promise<GoalResponse[]> {
    const goals = await this.goalRepository.findActiveByUserId(userId);
    return goals.map((goal) => this.formatGoalResponse(goal));
  }

  /**
   * Atualizar meta
   */
  async update(
    id: string,
    userId: string,
    data: UpdateGoalData
  ): Promise<GoalResponse> {
    const goal = await this.goalRepository.findByIdAndUserId(id, userId);

    if (!goal) {
      throw new AppError("Meta não encontrada", 404);
    }

    const updatedGoal = await this.goalRepository.update(id, data);

    if (!updatedGoal) {
      throw new AppError("Erro ao atualizar meta", 500);
    }

    return this.formatGoalResponse(updatedGoal);
  }

  /**
   * Atualizar progresso da meta
   */
  async updateProgress(
    id: string,
    userId: string,
    minutesToAdd: number
  ): Promise<GoalResponse> {
    const goal = await this.goalRepository.findByIdAndUserId(id, userId);

    if (!goal) {
      throw new AppError("Meta não encontrada", 404);
    }

    if (goal.status === GoalStatus.COMPLETED || goal.status === GoalStatus.FAILED) {
      throw new AppError("Não é possível atualizar uma meta finalizada", 400);
    }

    const newCurrentMinutes = goal.currentMinutes + minutesToAdd;
    let newStatus: GoalStatus = goal.status;

    if (newCurrentMinutes > 0 && goal.status === GoalStatus.PENDING) {
      newStatus = GoalStatus.IN_PROGRESS;
    }

    if (newCurrentMinutes >= goal.targetMinutes) {
      newStatus = GoalStatus.COMPLETED;
    }

    const updatedGoal = await this.goalRepository.update(id, {
      currentMinutes: newCurrentMinutes,
      status: newStatus,
    });

    if (!updatedGoal) {
      throw new AppError("Erro ao atualizar progresso", 500);
    }

    return this.formatGoalResponse(updatedGoal);
  }

  /**
   * Marcar meta como falhada
   */
  async markAsFailed(id: string, userId: string): Promise<GoalResponse> {
    const goal = await this.goalRepository.findByIdAndUserId(id, userId);

    if (!goal) {
      throw new AppError("Meta não encontrada", 404);
    }

    if (goal.status === GoalStatus.COMPLETED) {
      throw new AppError("Não é possível marcar uma meta completada como falhada", 400);
    }

    const updatedGoal = await this.goalRepository.update(id, {
      status: GoalStatus.FAILED,
    });

    if (!updatedGoal) {
      throw new AppError("Erro ao atualizar meta", 500);
    }

    return this.formatGoalResponse(updatedGoal);
  }

  /**
   * Deletar meta
   */
  async delete(id: string, userId: string): Promise<void> {
    const goal = await this.goalRepository.findByIdAndUserId(id, userId);

    if (!goal) {
      throw new AppError("Meta não encontrada", 404);
    }

    await this.goalRepository.delete(id);
  }

  /**
   * Obter estatísticas
   */
  async getStats(userId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    failedGoals: number;
    activeGoals: number;
    totalMinutesCompleted: number;
    completionRate: number;
  }> {
    const totalGoals = await this.goalRepository.countByUserId(userId);
    const completedGoals = await this.goalRepository.countCompletedByUserId(userId);
    const failedGoals = await this.goalRepository.countFailedByUserId(userId);
    const activeGoals = (await this.goalRepository.findActiveByUserId(userId)).length;
    const totalMinutesCompleted = await this.goalRepository.getTotalMinutesCompleted(userId);

    const completionRate =
      totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      failedGoals,
      activeGoals,
      totalMinutesCompleted,
      completionRate: parseFloat(completionRate.toFixed(2)),
    };
  }

  /**
   * Serializa um campo de data (Date ou string) para 'YYYY-MM-DD' usando UTC,
   * evitando deslocamento de fuso horário ao converter para JSON.
   */
  private toDateString(date: any): string {
  if (!date) return '';
  if (typeof date === 'string') return date.split('T')[0];
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  /**
   * Formatar resposta de meta
   */
  private formatGoalResponse(goal: any): GoalResponse {
    const progress =
      goal.targetMinutes > 0
        ? (goal.currentMinutes / goal.targetMinutes) * 100
        : 0;

    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      type: goal.type,
      targetMinutes: goal.targetMinutes,
      currentMinutes: goal.currentMinutes,
      status: goal.status,
      progress: parseFloat(progress.toFixed(2)),
      startDate: this.toDateString(goal.startDate),
      endDate: this.toDateString(goal.endDate),
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
  }
}