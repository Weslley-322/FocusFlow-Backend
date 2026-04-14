import { Request, Response, NextFunction } from "express";
import { SubjectService } from "../services/SubjectService";
import { AppError } from "../middlewares/errorHandler";

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { name, color, description } = req.body;

      const result = await this.subjectService.create(userId, {
        name,
        color,
        description,
      });

      return res.status(201).json({
        status: "success",
        message: "Matéria criada com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.subjectService.findAll(userId);

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

      // Validar se id é string
      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.subjectService.findById(id, userId);

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
      const { name, color, description, isActive } = req.body;

      // Validar se id é string
      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.subjectService.update(id, userId, {
        name,
        color,
        description,
        isActive,
      });

      return res.status(200).json({
        status: "success",
        message: "Matéria atualizada com sucesso",
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

      // Validar se id é string
      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      await this.subjectService.delete(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Matéria deletada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.subjectService.getStats(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}