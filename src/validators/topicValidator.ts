import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de criação de tópico
 */
export const validateCreateTopic = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, subjectId } = req.body;

  // Validar campo name
  if (!name || name.trim().length === 0) {
    throw new AppError("Nome do tópico é obrigatório", 400);
  }

  if (name.length < 2) {
    throw new AppError("Nome deve ter no mínimo 2 caracteres", 400);
  }

  if (name.length > 150) {
    throw new AppError("Nome deve ter no máximo 150 caracteres", 400);
  }

  // Validar campo subjectId
  if (!subjectId || subjectId.trim().length === 0) {
    throw new AppError("ID da matéria é obrigatório", 400);
  }

  // Validar formato UUID (básico)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(subjectId)) {
    throw new AppError("ID da matéria inválido", 400);
  }

  // Validar campo description (opcional)
  if (description !== undefined && typeof description !== "string") {
    throw new AppError("Descrição deve ser uma string", 400);
  }

  next();
};

/**
 * Valida dados de atualização de tópico
 */
export const validateUpdateTopic = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, isActive } = req.body;

  // Pelo menos um campo deve ser enviado
  if (
    name === undefined &&
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

    if (name.length > 150) {
      throw new AppError("Nome deve ter no máximo 150 caracteres", 400);
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