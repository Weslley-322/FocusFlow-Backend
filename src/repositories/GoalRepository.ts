import { AppDataSource } from "../database/data-source";
import { StudyGoal, GoalStatus } from "../database/entities/StudyGoal";
import { Repository } from "typeorm";

export class GoalRepository {
  private repository: Repository<StudyGoal>;

  constructor() {
    this.repository = AppDataSource.getRepository(StudyGoal);
  }

  /**
   * Criar nova meta
   */
  async create(goalData: Partial<StudyGoal>): Promise<StudyGoal> {
    const goal = this.repository.create(goalData);
    return await this.repository.save(goal);
  }

  /**
   * Buscar meta por ID
   */
  async findById(id: string): Promise<StudyGoal | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Buscar meta por ID e userId
   */
  async findByIdAndUserId(id: string, userId: string): Promise<StudyGoal | null> {
    return await this.repository.findOne({
      where: { id, userId },
    });
  }

  /**
   * Listar todas as metas do usuário
   */
  async findByUserId(userId: string): Promise<StudyGoal[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Listar metas por status
   */
  async findByStatus(userId: string, status: GoalStatus): Promise<StudyGoal[]> {
    return await this.repository.find({
      where: { userId, status },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Listar metas ativas (pending ou in_progress)
   */
  async findActiveByUserId(userId: string): Promise<StudyGoal[]> {
    return await this.repository
      .createQueryBuilder("goal")
      .where("goal.userId = :userId", { userId })
      .andWhere("goal.status IN (:...statuses)", {
        statuses: [GoalStatus.PENDING, GoalStatus.IN_PROGRESS],
      })
      .orderBy("goal.createdAt", "DESC")
      .getMany();
  }

  /**
   * Atualizar meta
   */
  async update(id: string, goalData: Partial<StudyGoal>): Promise<StudyGoal | null> {
    await this.repository.update(id, goalData);
    return await this.findById(id);
  }

  /**
   * Deletar meta
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Contar metas do usuário
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId },
    });
  }

  /**
   * Contar metas completadas
   */
  async countCompletedByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId, status: GoalStatus.COMPLETED },
    });
  }

  /**
   * Contar metas falhadas
   */
  async countFailedByUserId(userId: string): Promise<number> {
    return await this.repository.count({
      where: { userId, status: GoalStatus.FAILED },
    });
  }

  /**
   * Calcular total de minutos estudados em metas completadas
   */
  async getTotalMinutesCompleted(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("goal")
      .select("SUM(goal.currentMinutes)", "total")
      .where("goal.userId = :userId", { userId })
      .andWhere("goal.status = :status", { status: GoalStatus.COMPLETED })
      .getRawOne();

    return parseInt(result?.total || "0");
  }
}