import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de criação de sessão Pomodoro
 */
export const validateCreateSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { duration, breakTime, subjectId, topicId } = req.body;

  // Validar campo duration
  if (duration === undefined || duration === null) {
    throw new AppError("Duração da sessão é obrigatória", 400);
  }

  if (typeof duration !== "number") {
    throw new AppError("Duração deve ser um número", 400);
  }

  if (duration < 1) {
    throw new AppError("Duração mínima é 1 minuto", 400);
  }

  if (duration > 120) {
    throw new AppError("Duração máxima é 120 minutos", 400);
  }

  // Validar campo breakTime
  if (breakTime === undefined || breakTime === null) {
    throw new AppError("Tempo de pausa é obrigatório", 400);
  }

  if (typeof breakTime !== "number") {
    throw new AppError("Tempo de pausa deve ser um número", 400);
  }

  if (breakTime < 0) {
    throw new AppError("Tempo de pausa não pode ser negativo", 400);
  }

  if (breakTime > 60) {
    throw new AppError("Tempo de pausa máximo é 60 minutos", 400);
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
 * Valida dados de finalização de sessão
 */
export const validateCompleteSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { notes } = req.body;

  // Validar notes se fornecido (opcional)
  if (notes !== undefined && notes !== null) {
    if (typeof notes !== "string") {
      throw new AppError("Notas devem ser uma string", 400);
    }

    if (notes.length > 1000) {
      throw new AppError("Notas devem ter no máximo 1000 caracteres", 400);
    }
  }

  next();
};

/**
 * Valida parâmetros de filtro de sessões
 */
export const validateFilterSessions = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { subjectId, topicId, startDate, endDate } = req.query;

  // Validar subjectId se fornecido
  if (subjectId !== undefined && typeof subjectId !== "string") {
    throw new AppError("ID da matéria deve ser uma string", 400);
  }

  // Validar topicId se fornecido
  if (topicId !== undefined && typeof topicId !== "string") {
    throw new AppError("ID do tópico deve ser uma string", 400);
  }

  // Validar startDate se fornecido
  if (startDate !== undefined) {
    if (typeof startDate !== "string") {
      throw new AppError("Data inicial deve ser uma string", 400);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate as string)) {
      throw new AppError(
        "Data inicial deve estar no formato YYYY-MM-DD",
        400
      );
    }
  }

  // Validar endDate se fornecido
  if (endDate !== undefined) {
    if (typeof endDate !== "string") {
      throw new AppError("Data final deve ser uma string", 400);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(endDate as string)) {
      throw new AppError("Data final deve estar no formato YYYY-MM-DD", 400);
    }
  }

  next();
};