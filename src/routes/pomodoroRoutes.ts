import { Router } from "express";
import { PomodoroController } from "../controllers/PomodoroController";
import {
  validateCreateSession,
  validateCompleteSession,
  validateFilterSessions,
} from "../validators/pomodoroValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const pomodoroController = new PomodoroController();

// Todas as rotas de pomodoro requerem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/pomodoro
 * @desc    Criar nova sessão Pomodoro
 * @access  Private
 */
router.post("/", validateCreateSession, pomodoroController.createSession);

/**
 * @route   GET /api/pomodoro/stats
 * @desc    Obter estatísticas de tempo estudado
 * @access  Private
 */
router.get("/stats", pomodoroController.getStats);

/**
 * @route   GET /api/pomodoro/completed
 * @desc    Listar sessões completadas
 * @access  Private
 */
router.get("/completed", pomodoroController.findCompleted);

/**
 * @route   GET /api/pomodoro/active
 * @desc    Listar sessões em andamento
 * @access  Private
 */
router.get("/active", pomodoroController.findActive);

/**
 * @route   GET /api/pomodoro
 * @desc    Listar sessões com filtros
 * @access  Private
 */
router.get("/", validateFilterSessions, pomodoroController.findSessions);

/**
 * @route   GET /api/pomodoro/:id
 * @desc    Buscar sessão por ID
 * @access  Private
 */
router.get("/:id", pomodoroController.findById);

/**
 * @route   PUT /api/pomodoro/:id/complete
 * @desc    Completar sessão
 * @access  Private
 */
router.put(
  "/:id/complete",
  validateCompleteSession,
  pomodoroController.completeSession
);

/**
 * @route   DELETE /api/pomodoro/:id
 * @desc    Deletar sessão
 * @access  Private
 */
router.delete("/:id", pomodoroController.delete);

export default router;