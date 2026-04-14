import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de criação de meta
 */
export const validateCreateGoal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, type, targetMinutes, startDate, endDate } = req.body;

  // Validar campo title
  if (!title || title.trim().length === 0) {
    throw new AppError("Título da meta é obrigatório", 400);
  }

  if (title.length < 3) {
    throw new AppError("Título deve ter no mínimo 3 caracteres", 400);
  }

  if (title.length > 150) {
    throw new AppError("Título deve ter no máximo 150 caracteres", 400);
  }

  // Validar description se fornecido (opcional)
  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Descrição deve ser uma string", 400);
  }

  // Validar campo type
  if (!type || type.trim().length === 0) {
    throw new AppError("Tipo da meta é obrigatório", 400);
  }

  const validTypes = ["daily", "weekly", "monthly", "custom"];
  if (!validTypes.includes(type)) {
    throw new AppError(
      "Tipo deve ser: daily, weekly, monthly ou custom",
      400
    );
  }

  // Validar campo targetMinutes
  if (targetMinutes === undefined || targetMinutes === null) {
    throw new AppError("Meta de minutos é obrigatória", 400);
  }

  if (typeof targetMinutes !== "number") {
    throw new AppError("Meta de minutos deve ser um número", 400);
  }

  if (targetMinutes <= 0) {
    throw new AppError("Meta de minutos deve ser maior que zero", 400);
  }

  if (targetMinutes > 10000) {
    throw new AppError("Meta de minutos deve ser no máximo 10000", 400);
  }

  // Validar startDate (obrigatório)
  if (!startDate || startDate.trim().length === 0) {
    throw new AppError("Data de início é obrigatória", 400);
  }

  const startDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!startDateRegex.test(startDate)) {
    throw new AppError("Data de início deve estar no formato YYYY-MM-DD", 400);
  }

  // Validar endDate (obrigatório)
  if (!endDate || endDate.trim().length === 0) {
    throw new AppError("Data de término é obrigatória", 400);
  }

  const endDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!endDateRegex.test(endDate)) {
    throw new AppError("Data de término deve estar no formato YYYY-MM-DD", 400);
  }

  // Validar que endDate >= startDate
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    throw new AppError("Data de término deve ser posterior à data de início", 400);
  }

  next();
};

/**
 * Valida dados de atualização de meta
 */
export const validateUpdateGoal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, targetMinutes, currentMinutes, status } = req.body;

  // Pelo menos um campo deve ser enviado
  if (
    title === undefined &&
    description === undefined &&
    targetMinutes === undefined &&
    currentMinutes === undefined &&
    status === undefined
  ) {
    throw new AppError(
      "Pelo menos um campo deve ser informado para atualização",
      400
    );
  }

  // Validar title se fornecido
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new AppError("Título não pode ser vazio", 400);
    }

    if (title.length < 3) {
      throw new AppError("Título deve ter no mínimo 3 caracteres", 400);
    }

    if (title.length > 150) {
      throw new AppError("Título deve ter no máximo 150 caracteres", 400);
    }
  }

  // Validar description se fornecido
  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Descrição deve ser uma string", 400);
  }

  // Validar targetMinutes se fornecido
  if (targetMinutes !== undefined) {
    if (typeof targetMinutes !== "number") {
      throw new AppError("Meta de minutos deve ser um número", 400);
    }

    if (targetMinutes <= 0) {
      throw new AppError("Meta de minutos deve ser maior que zero", 400);
    }

    if (targetMinutes > 10000) {
      throw new AppError("Meta de minutos deve ser no máximo 10000", 400);
    }
  }

  // Validar currentMinutes se fornecido
  if (currentMinutes !== undefined) {
    if (typeof currentMinutes !== "number") {
      throw new AppError("Minutos atuais devem ser um número", 400);
    }

    if (currentMinutes < 0) {
      throw new AppError("Minutos atuais não podem ser negativos", 400);
    }
  }

  // Validar status se fornecido
  if (status !== undefined) {
    const validStatuses = ["pending", "in_progress", "completed", "failed"];
    if (!validStatuses.includes(status)) {
      throw new AppError(
        "Status deve ser: pending, in_progress, completed ou failed",
        400
      );
    }
  }

  next();
};

/**
 * Valida dados de atualização de progresso
 */
export const validateUpdateProgress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { minutesToAdd } = req.body;

  // Validar minutesToAdd (obrigatório)
  if (minutesToAdd === undefined || minutesToAdd === null) {
    throw new AppError("Minutos a adicionar é obrigatório", 400);
  }

  if (typeof minutesToAdd !== "number") {
    throw new AppError("Minutos a adicionar deve ser um número", 400);
  }

  if (minutesToAdd <= 0) {
    throw new AppError("Minutos a adicionar deve ser maior que zero", 400);
  }

  next();
};