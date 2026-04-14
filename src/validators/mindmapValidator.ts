import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de criação de mapa mental
 */
export const validateCreateMindMap = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, topicId } = req.body;

  // Validar campo title
  if (!title || title.trim().length === 0) {
    throw new AppError("Título do mapa mental é obrigatório", 400);
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
 * Valida dados de atualização de mapa mental
 */
export const validateUpdateMindMap = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, isActive } = req.body;

  // Pelo menos um campo deve ser enviado
  if (
    title === undefined &&
    description === undefined &&
    isActive === undefined
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

  // Validar isActive se fornecido
  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new AppError("isActive deve ser um booleano", 400);
  }

  next();
};

/**
 * Valida dados de criação de nó
 */
export const validateCreateNode = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content, parentId, positionX, positionY, backgroundColor, textColor } = req.body;

  if (!content || content.trim().length === 0)
    throw new AppError("Conteúdo do nó é obrigatório", 400);

  if (content.length > 500)
    throw new AppError("Conteúdo deve ter no máximo 500 caracteres", 400);

  if (parentId !== undefined && parentId !== null) {
    if (typeof parentId !== "string" || parentId.trim().length === 0)
      throw new AppError("ID do nó pai inválido", 400);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(parentId))
      throw new AppError("Formato do ID do nó pai inválido", 400);
  }

  if (positionX !== undefined && typeof positionX !== "number")
    throw new AppError("Posição X deve ser um número", 400);

  if (positionY !== undefined && typeof positionY !== "number")
    throw new AppError("Posição Y deve ser um número", 400);

  if (backgroundColor !== undefined) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(backgroundColor))
      throw new AppError("Cor de fundo deve ser um código hexadecimal válido (ex: #FFFFFF)", 400);
  }

  if (textColor !== undefined) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(textColor))
      throw new AppError("Cor do texto deve ser um código hexadecimal válido (ex: #000000)", 400);
  }

  next();
};

/**
 * Valida dados de atualização de nó
 */
export const validateUpdateNode = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    content,
    parentId,
    positionX,
    positionY,
    backgroundColor,
    textColor,
    order,
    sourceHandle,
    targetHandle,
  } = req.body;

  if (
    content === undefined &&
    parentId === undefined &&
    positionX === undefined &&
    positionY === undefined &&
    backgroundColor === undefined &&
    textColor === undefined &&
    order === undefined &&
    sourceHandle === undefined &&
    targetHandle === undefined
  ) {
    throw new AppError(
      "Pelo menos um campo deve ser informado para atualização",
      400
    );
  }

  if (content !== undefined) {
    if (typeof content !== "string" || content.trim().length === 0)
      throw new AppError("Conteúdo não pode ser vazio", 400);
    if (content.length > 500)
      throw new AppError("Conteúdo deve ter no máximo 500 caracteres", 400);
  }

  if (positionX !== undefined && typeof positionX !== "number")
    throw new AppError("Posição X deve ser um número", 400);

  if (positionY !== undefined && typeof positionY !== "number")
    throw new AppError("Posição Y deve ser um número", 400);

  if (backgroundColor !== undefined) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(backgroundColor))
      throw new AppError("Cor de fundo deve ser um código hexadecimal válido", 400);
  }

  if (textColor !== undefined) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(textColor))
      throw new AppError("Cor do texto deve ser um código hexadecimal válido", 400);
  }

  if (order !== undefined && typeof order !== "number")
    throw new AppError("Ordem deve ser um número", 400);

  // sourceHandle e targetHandle são strings livres (ex: "top", "bottom-t", etc.)
  if (sourceHandle !== undefined && typeof sourceHandle !== "string")
    throw new AppError("sourceHandle deve ser uma string", 400);

  if (targetHandle !== undefined && typeof targetHandle !== "string")
    throw new AppError("targetHandle deve ser uma string", 400);

  next();
};