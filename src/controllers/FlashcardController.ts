import { Request, Response, NextFunction } from "express";
import { FlashcardService } from "../services/FlashcardService";
import { AppError } from "../middlewares/errorHandler";

export class FlashcardController {
  private flashcardService: FlashcardService;

  constructor() {
    this.flashcardService = new FlashcardService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { front, back, subjectId, topicId } = req.body;

      const result = await this.flashcardService.create(userId, {
        front,
        back,
        subjectId,
        topicId,
      });

      return res.status(201).json({
        status: "success",
        message: "Flashcard criado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.flashcardService.findAll(userId);

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

      const result = await this.flashcardService.findById(id, userId);

      return res.status(200).json({
        status: "success",
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

      if (Array.isArray(subjectId)) {
        throw new AppError("ID da matéria inválido", 400);
      }

      const result = await this.flashcardService.findBySubjectId(
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

  findByTopicId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { topicId } = req.params;

      if (Array.isArray(topicId)) {
        throw new AppError("ID do tópico inválido", 400);
      }

      const result = await this.flashcardService.findByTopicId(topicId, userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findDueForReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId!;

      const result = await this.flashcardService.findDueForReview(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  review = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { quality } = req.body;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.flashcardService.review(id, userId, {
        quality,
      });

      return res.status(200).json({
        status: "success",
        message: "Revisão registrada com sucesso",
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
    const { front, back } = req.body; 

    if (Array.isArray(id)) {
      throw new AppError("ID inválido", 400);
    }

    const result = await this.flashcardService.update(id, userId, {
      front,
      back, 
    });

    return res.status(200).json({
      status: "success",
      message: "Flashcard atualizado com sucesso",
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

      await this.flashcardService.delete(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Flashcard deletado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };

  getReviewHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.flashcardService.getReviewHistory(id, userId);

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

      const result = await this.flashcardService.getStats(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}