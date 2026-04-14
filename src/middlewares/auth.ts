import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
}

const jwtSecret: string = JWT_SECRET;

interface JwtPayload {
  userId: string;
  email: string;
}

// Estender o Request do Express para incluir o userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido e extrai o userId
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Pegar o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      throw new AppError("Formato de token inválido", 401);
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new AppError("Token mal formatado", 401);
    }

    // Verificar o token
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Adicionar userId e userEmail ao request
      req.userId = decoded.userId;
      req.userEmail = decoded.email;

      return next();
    } catch (error) {
      throw new AppError("Token inválido ou expirado", 401);
    }
  } catch (error) {
    next(error);
  }
};