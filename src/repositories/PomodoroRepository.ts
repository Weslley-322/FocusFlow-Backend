import { AppDataSource } from "../database/data-source";
import { PomodoroSession } from "../database/entities/PomodoroSession";
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

interface FilterOptions {
  userId: string;
  subjectId?: string;
  topicId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class PomodoroRepository {
  private repository: Repository<PomodoroSession>;

  constructor() {
    this.repository = AppDataSource.getRepository(PomodoroSession);
  }

  /**
   * Criar nova sessão
   */
  async create(sessionData: Partial<PomodoroSession>): Promise<PomodoroSession> {
    const session = this.repository.create(sessionData);
    return await this.repository.save(session);
  }

  /**
   * Buscar sessão por ID
   */
  async findById(id: string): Promise<PomodoroSession | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["subject", "topic"],
    });
  }

  /**
   * Buscar sessão por ID e userId
   */
  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<PomodoroSession | null> {
    return await this.repository.findOne({
      where: { id, userId },
      relations: ["subject", "topic"],
    });
  }

  /**
   * Atualizar sessão
   */
  async update(
    id: string,
    sessionData: Partial<PomodoroSession>
  ): Promise<PomodoroSession | null> {
    await this.repository.update(id, sessionData);
    return await this.findById(id);
  }

  /**
   * Listar sessões do usuário com filtros
   */
  async findWithFilters(filters: FilterOptions): Promise<PomodoroSession[]> {
    const { userId, subjectId, topicId, startDate, endDate } = filters;

    const where: any = { userId };

    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (topicId) {
      where.topicId = topicId;
    }

    // Filtro de data
    if (startDate && endDate) {
      where.startTime = Between(startDate, endDate);
    } else if (startDate) {
      where.startTime = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.startTime = LessThanOrEqual(endDate);
    }

    return await this.repository.find({
      where,
      relations: ["subject", "topic"],
      order: { startTime: "DESC" },
    });
  }

  /**
   * Buscar sessões completadas do usuário
   */
  async findCompletedByUserId(userId: string): Promise<PomodoroSession[]> {
    return await this.repository.find({
      where: { userId, completed: true },
      relations: ["subject", "topic"],
      order: { startTime: "DESC" },
    });
  }

  /**
   * Buscar sessões em andamento do usuário
   */
  async findActiveByUserId(userId: string): Promise<PomodoroSession[]> {
    return await this.repository.find({
      where: { userId, completed: false },
      relations: ["subject", "topic"],
      order: { startTime: "DESC" },
    });
  }

  /**
   * Calcular tempo total estudado
   */
  async getTotalStudyTime(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("session")
      .select("SUM(session.duration)", "total")
      .where("session.userId = :userId", { userId })
      .andWhere("session.completed = :completed", { completed: true })
      .getRawOne();

    return parseInt(result?.total || "0");
  }

  /**
   * Calcular tempo estudado por matéria
   */
  async getStudyTimeBySubject(userId: string): Promise<any[]> {
    return await this.repository
      .createQueryBuilder("session")
      .select("subject.name", "subjectName")
      .addSelect("subject.color", "subjectColor")
      .addSelect("SUM(session.duration)", "totalMinutes")
      .addSelect("COUNT(session.id)", "sessionsCount")
      .leftJoin("session.subject", "subject")
      .where("session.userId = :userId", { userId })
      .andWhere("session.completed = :completed", { completed: true })
      .andWhere("session.subjectId IS NOT NULL")
      .groupBy("session.subjectId")
      .addGroupBy("subject.name")
      .addGroupBy("subject.color")
      .orderBy("totalMinutes", "DESC")
      .getRawMany();
  }

  /**
   * Deletar sessão
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}