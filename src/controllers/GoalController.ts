import { Request, Response, NextFunction } from "express";
import { GoalService } from "../services/GoalService";
import { AppError } from "../middlewares/errorHandler";

export class GoalController {
  private goalService: GoalService;

  constructor() {
    this.goalService = new GoalService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { title, description, type, targetMinutes, startDate, endDate } =
        req.body;

      const result = await this.goalService.create(userId, {
        title,
        description,
        type,
        targetMinutes,
        startDate,
        endDate,
      });

      return res.status(201).json({
        status: "success",
        message: "Meta criada com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.goalService.findAll(userId);

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

      const result = await this.goalService.findById(id, userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { status } = req.params;

      if (Array.isArray(status)) {
        throw new AppError("Status inválido", 400);
      }

      const result = await this.goalService.findByStatus(userId, status);

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

      const result = await this.goalService.findActive(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { title, description, targetMinutes, currentMinutes, status } =
        req.body;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.goalService.update(id, userId, {
        title,
        description,
        targetMinutes,
        currentMinutes,
        status,
      });

      return res.status(200).json({
        status: "success",
        message: "Meta atualizada com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { minutesToAdd } = req.body;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.goalService.updateProgress(
        id,
        userId,
        minutesToAdd
      );

      return res.status(200).json({
        status: "success",
        message: "Progresso atualizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  markAsFailed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.goalService.markAsFailed(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Meta marcada como falhada",
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

      await this.goalService.delete(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Meta deletada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.goalService.getStats(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}