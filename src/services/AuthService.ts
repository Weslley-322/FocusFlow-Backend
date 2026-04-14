import { UserRepository } from "../repositories/UserRepository";
import { EmailService } from "./EmailService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AppError } from "../middlewares/errorHandler";

const SALT_ROUNDS = 10;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
}

const JWT_SECRET: string = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: Date;
  };
  token: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
  }

  /**
   * Registrar novo usuário — envia email de verificação, NÃO retorna token JWT
   */
  async register(data: RegisterData): Promise<{ message: string }> {
    const { name, email, password } = data;

    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new AppError("Email já está em uso", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Gerar token de verificação único com expiração de 24h
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Enviar email de verificação
    await this.emailService.sendVerificationEmail(email, name, verificationToken);

    return {
      message: "Cadastro realizado! Verifique seu email para ativar a conta.",
    };
  }

  /**
   * Verificar email com o token recebido
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByVerificationToken(token);

    if (!user) {
      throw new AppError("Token de verificação inválido", 400);
    }

    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      throw new AppError("Token de verificação expirado. Faça o cadastro novamente.", 400);
    }

    if (user.isVerified) {
      throw new AppError("Email já verificado", 400);
    }

    // Marcar como verificado e limpar o token
    await this.userRepository.update(user.id, {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });

    return { message: "Email verificado com sucesso! Você já pode fazer login." };
  }

  /**
   * Login — só permite usuários verificados
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    if (!user.isActive) {
      throw new AppError("Usuário desativado", 403);
    }

    if (!user.isVerified) {
      throw new AppError("Email não verificado. Verifique sua caixa de entrada.", 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Buscar dados do usuário logado
   */
  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new AppError("Usuário não encontrado", 404);
    if (!user.isActive) throw new AppError("Usuário desativado", 403);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new AppError("Usuário não encontrado", 404);
    if (!user.isActive) throw new AppError("Usuário desativado", 403);

    const updatedUser = await this.userRepository.update(userId, data);

    if (!updatedUser) throw new AppError("Erro ao atualizar perfil", 500);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}