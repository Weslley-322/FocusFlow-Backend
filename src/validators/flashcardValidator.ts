import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de criação de flashcard
 */
export const validateCreateFlashcard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { front, back, subjectId, topicId } = req.body;

  // Validar campo front
  if (!front || front.trim().length === 0) {
    throw new AppError("Frente do card é obrigatória", 400);
  }

  if (front.length > 500) {
    throw new AppError("Frente do card deve ter no máximo 500 caracteres", 400);
  }

  // Validar campo back
  if (!back || back.trim().length === 0) {
    throw new AppError("Verso do card é obrigatório", 400);
  }

  if (back.length > 1000) {
    throw new AppError("Verso do card deve ter no máximo 1000 caracteres", 400);
  }

  // Validar subjectId se fornecido (opcional)
  if (subjectId !== undefined && subjectId !== null) {
    if (typeof subjectId !== "string" || subjectId.trim().length === 0) {
      throw new AppError("ID da matéria inválido", 400);
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(subjectId)) {
      throw new AppError("Formato do ID da matéria inválido", 400);
    }
  }

  // Validar topicId se fornecido (opcional)
  if (topicId !== undefined && topicId !== null) {
    if (typeof topicId !== "string" || topicId.trim().length === 0) {
      throw new AppError("ID do tópico inválido", 400);
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(topicId)) {
      throw new AppError("Formato do ID do tópico inválido", 400);
    }
  }

  next();
};

/**
 * Valida dados de atualização de flashcard
 */
export const validateUpdateFlashcard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { front, back, isActive } = req.body;

  // Pelo menos um campo deve ser enviado
  if (front === undefined && back === undefined && isActive === undefined) {
    throw new AppError(
      "Pelo menos um campo deve ser informado para atualização",
      400
    );
  }

  // Validar front se fornecido
  if (front !== undefined) {
    if (typeof front !== "string" || front.trim().length === 0) {
      throw new AppError("Frente do card não pode ser vazia", 400);
    }

    if (front.length > 500) {
      throw new AppError(
        "Frente do card deve ter no máximo 500 caracteres",
        400
      );
    }
  }

  // Validar back se fornecido
  if (back !== undefined) {
    if (typeof back !== "string" || back.trim().length === 0) {
      throw new AppError("Verso do card não pode ser vazio", 400);
    }

    if (back.length > 1000) {
      throw new AppError(
        "Verso do card deve ter no máximo 1000 caracteres",
        400
      );
    }
  }

  // Validar isActive se fornecido
  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new AppError("isActive deve ser um booleano", 400);
  }

  next();
};

/**
 * Valida dados de revisão de flashcard
 */
export const validateReviewFlashcard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quality } = req.body;

  // Validar campo quality
  if (quality === undefined || quality === null) {
    throw new AppError("Qualidade da resposta é obrigatória", 400);
  }

  if (typeof quality !== "number") {
    throw new AppError("Qualidade deve ser um número", 400);
  }

  if (![0, 1, 2, 3].includes(quality)) {
    throw new AppError("Qualidade deve ser 0 (AGAIN), 1 (HARD), 2 (GOOD) ou 3 (EASY)", 400);
  }

  next();
};