import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.register({ name, email, password });
      return res.status(201).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({
          status: "error",
          message: "Token de verificação não fornecido",
        });
      }

      const result = await this.authService.verifyEmail(token);
      return res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      return res.status(200).json({
        status: "success",
        message: "Login realizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const result = await this.authService.getMe(userId);
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { name, avatar } = req.body;
      const result = await this.authService.updateProfile(userId, { name, avatar });
      return res.status(200).json({
        status: "success",
        message: "Perfil atualizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}