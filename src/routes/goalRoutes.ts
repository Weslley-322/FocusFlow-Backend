import { Router } from "express";
import { GoalController } from "../controllers/GoalController";
import {
  validateCreateGoal,
  validateUpdateGoal,
  validateUpdateProgress,
} from "../validators/goalValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const goalController = new GoalController();

// Todas as rotas de goals requerem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/goals
 * @desc    Criar nova meta
 * @access  Private
 */
router.post("/", validateCreateGoal, goalController.create);

/**
 * @route   GET /api/goals/stats
 * @desc    Obter estatísticas de metas
 * @access  Private
 */
router.get("/stats", goalController.getStats);

/**
 * @route   GET /api/goals/active
 * @desc    Listar metas ativas
 * @access  Private
 */
router.get("/active", goalController.findActive);

/**
 * @route   GET /api/goals/status/:status
 * @desc    Listar metas por status
 * @access  Private
 */
router.get("/status/:status", goalController.findByStatus);

/**
 * @route   GET /api/goals
 * @desc    Listar todas as metas
 * @access  Private
 */
router.get("/", goalController.findAll);

/**
 * @route   GET /api/goals/:id
 * @desc    Buscar meta por ID
 * @access  Private
 */
router.get("/:id", goalController.findById);

/**
 * @route   POST /api/goals/:id/progress
 * @desc    Atualizar progresso da meta
 * @access  Private
 */
router.post("/:id/progress", validateUpdateProgress, goalController.updateProgress);

/**
 * @route   POST /api/goals/:id/fail
 * @desc    Marcar meta como falhada
 * @access  Private
 */
router.post("/:id/fail", goalController.markAsFailed);

/**
 * @route   PUT /api/goals/:id
 * @desc    Atualizar meta
 * @access  Private
 */
router.put("/:id", validateUpdateGoal, goalController.update);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Deletar meta
 * @access  Private
 */
router.delete("/:id", goalController.delete);

export default router;