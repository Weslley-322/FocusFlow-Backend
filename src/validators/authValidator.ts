import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

/**
 * Valida dados de registro
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  // Validar campo name
  if (!name || name.trim().length === 0) {
    throw new AppError("Nome é obrigatório", 400);
  }

  if (name.length < 3) {
    throw new AppError("Nome deve ter no mínimo 3 caracteres", 400);
  }

  if (name.length > 100) {
    throw new AppError("Nome deve ter no máximo 100 caracteres", 400);
  }

  // Validar campo email
  if (!email || email.trim().length === 0) {
    throw new AppError("Email é obrigatório", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Email inválido", 400);
  }

  if (email.length > 100) {
    throw new AppError("Email deve ter no máximo 100 caracteres", 400);
  }

  // Validar campo password
  if (!password || password.trim().length === 0) {
    throw new AppError("Senha é obrigatória", 400);
  }

  if (password.length < 6) {
    throw new AppError("Senha deve ter no mínimo 6 caracteres", 400);
  }

  if (password.length > 50) {
    throw new AppError("Senha deve ter no máximo 50 caracteres", 400);
  }

  next();
};

/**
 * Valida dados de login
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // Validar campo email
  if (!email || email.trim().length === 0) {
    throw new AppError("Email é obrigatório", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Email inválido", 400);
  }

  // Validar campo password
  if (!password || password.trim().length === 0) {
    throw new AppError("Senha é obrigatória", 400);
  }

  next();
};

/**
 * Valida dados de atualização de perfil
 */
export const validateUpdateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, avatar } = req.body;

  // Pelo menos um campo deve ser enviado
  if (!name && !avatar) {
    throw new AppError(
      "Pelo menos um campo (name ou avatar) deve ser informado",
      400
    );
  }

  // Validar name se fornecido
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new AppError("Nome não pode ser vazio", 400);
    }

    if (name.length < 3) {
      throw new AppError("Nome deve ter no mínimo 3 caracteres", 400);
    }

    if (name.length > 100) {
      throw new AppError("Nome deve ter no máximo 100 caracteres", 400);
    }
  }

  // Validar avatar se fornecido
  if (avatar !== undefined) {
    if (typeof avatar !== "string") {
      throw new AppError("Avatar deve ser uma string (URL)", 400);
    }

    if (avatar.length > 255) {
      throw new AppError("URL do avatar muito longa (máx 255 caracteres)", 400);
    }

    // Validação básica de URL (opcional)
    const urlRegex = /^https?:\/\/.+/;
    if (avatar.length > 0 && !urlRegex.test(avatar)) {
      throw new AppError("Avatar deve ser uma URL válida", 400);
    }
  }

  next();
};