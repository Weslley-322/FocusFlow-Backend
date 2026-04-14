import { Request, Response, NextFunction } from "express";
import { PomodoroService } from "../services/PomodoroService";
import { AppError } from "../middlewares/errorHandler";

export class PomodoroController {
  private pomodoroService: PomodoroService;

  constructor() {
    this.pomodoroService = new PomodoroService();
  }

  /**
   * POST /api/pomodoro
   * Criar nova sessão Pomodoro
   */
  createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { duration, breakTime, subjectId, topicId } = req.body;

      const result = await this.pomodoroService.createSession(userId, {
        duration,
        breakTime,
        subjectId,
        topicId,
      });

      return res.status(201).json({
        status: "success",
        message: "Sessão Pomodoro iniciada com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/pomodoro/:id/complete
   * Completar sessão
   */
  completeSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.pomodoroService.completeSession(id, userId, {});

      return res.status(200).json({
        status: "success",
        message: "Sessão completada com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { subjectId, topicId, startDate, endDate } = req.query;

      const result = await this.pomodoroService.findSessions(userId, {
        subjectId: subjectId as string,
        topicId: topicId as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.pomodoroService.findById(id, userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findCompleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.pomodoroService.findCompleted(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.pomodoroService.findActive(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.pomodoroService.getStats(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      await this.pomodoroService.delete(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Sessão deletada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };
}