import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de criação de matéria
 */
export const validateCreateSubject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, color, description } = req.body;

  // Validar campo name
  if (!name || name.trim().length === 0) {
    throw new AppError("Nome da matéria é obrigatório", 400);
  }

  if (name.length < 2) {
    throw new AppError("Nome deve ter no mínimo 2 caracteres", 400);
  }

  if (name.length > 100) {
    throw new AppError("Nome deve ter no máximo 100 caracteres", 400);
  }

  // Validar campo color (opcional, mas se fornecido deve ser válido)
  if (color !== undefined) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(color)) {
      throw new AppError(
        "Cor deve ser um código hexadecimal válido (ex: #3B82F6)",
        400
      );
    }
  }

  // Validar campo description (opcional)
  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Descrição deve ser uma string", 400);
  }

  next();
};

/**
 * Valida dados de atualização de matéria
 */
export const validateUpdateSubject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, color, description, isActive } = req.body;

  // Pelo menos um campo deve ser enviado
  if (
    name === undefined &&
    color === undefined &&
    description === undefined &&
    isActive === undefined
  ) {
    throw new AppError(
      "Pelo menos um campo deve ser informado para atualização",
      400
    );
  }

  // Validar name se fornecido
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new AppError("Nome não pode ser vazio", 400);
    }

    if (name.length < 2) {
      throw new AppError("Nome deve ter no mínimo 2 caracteres", 400);
    }

    if (name.length > 100) {
      throw new AppError("Nome deve ter no máximo 100 caracteres", 400);
    }
  }

  // Validar color se fornecido
  if (color !== undefined) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(color)) {
      throw new AppError(
        "Cor deve ser um código hexadecimal válido (ex: #3B82F6)",
        400
      );
    }
  }

  // Validar description se fornecido
  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Descrição deve ser uma string", 400);
  }

  // Validar isActive se fornecido
  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new AppError("isActive deve ser um booleano", 400);
  }

  next();
};