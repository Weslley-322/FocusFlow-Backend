import { Request, Response, NextFunction } from "express";
import { TopicService } from "../services/TopicService";
import { AppError } from "../middlewares/errorHandler";

export class TopicController {
  private topicService: TopicService;

  constructor() {
    this.topicService = new TopicService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { name, description, subjectId } = req.body;

      const result = await this.topicService.create(userId, {
        name,
        description,
        subjectId,
      });

      return res.status(201).json({
        status: "success",
        message: "Tópico criado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findBySubjectId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId!;
      const { subjectId } = req.params;

      // Validar se subjectId é string
      if (Array.isArray(subjectId)) {
        throw new AppError("ID da matéria inválido", 400);
      }

      const result = await this.topicService.findBySubjectId(
        subjectId,
        userId
      );

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

      const result = await this.topicService.findById(id, userId);

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
      const { name, description, isActive } = req.body;

      // Validar se id é string
      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.topicService.update(id, userId, {
        name,
        description,
        isActive,
      });

      return res.status(200).json({
        status: "success",
        message: "Tópico atualizado com sucesso",
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

      await this.topicService.delete(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Tópico deletado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };
}