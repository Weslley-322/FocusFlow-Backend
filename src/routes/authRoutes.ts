import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} from "../validators/authValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 * @access  Public
 */
router.post("/register", validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Public
 */
router.post("/login", validateLogin, authController.login);

/**
 * @route
 * @desc
 * @access
 */
router.get("/verify-email", authController.verifyEmail);

/**
 * @route   GET /api/auth/me
 * @desc    Buscar dados do usuário logado
 * @access  Private
 */
router.get("/me", authMiddleware, authController.getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Atualizar perfil do usuário
 * @access  Private
 */
router.put(
  "/profile",
  authMiddleware,
  validateUpdateProfile,
  authController.updateProfile
);

export default router;