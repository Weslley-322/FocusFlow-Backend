import { Request, Response, NextFunction } from "express";

//Classe de erro customizada
export class AppError extends Error{
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

//Middleware de tratamento de erros
export const errorHandle = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //Se for um AppError custom
    if (err instanceof AppError){
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message
        });
    }

    //Erro genérico
    console.error("❌ Erro não tratado:", err);

    return res.json(500).json({
        status: "error",
        message: "Erro interno do servidor",
        ...(process.env.NODE_ENV === "development" && {
            error: err.message,
            stack: err.stack,
        }),
    });
};

// Função helper para criar erros
export const createError = (message: string, statusCode: number = 500) => {
  return new AppError(message, statusCode);
};