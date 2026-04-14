import { Router } from "express";
import { SubjectController } from "../controllers/SubjectController";
import {
  validateCreateSubject,
  validateUpdateSubject,
} from "../validators/subjectValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const subjectController = new SubjectController();

// Todas as rotas de subjects requerem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/subjects
 * @desc    Criar nova matéria
 * @access  Private
 */
router.post("/", validateCreateSubject, subjectController.create);

/**
 * @route   GET /api/subjects
 * @desc    Listar todas as matérias do usuário
 * @access  Private
 */
router.get("/", subjectController.findAll);

/**
 * @route   GET /api/subjects/stats
 * @desc    Obter estatísticas das matérias
 * @access  Private
 */
router.get("/stats", subjectController.getStats);

/**
 * @route   GET /api/subjects/:id
 * @desc    Buscar matéria por ID
 * @access  Private
 */
router.get("/:id", subjectController.findById);

/**
 * @route   PUT /api/subjects/:id
 * @desc    Atualizar matéria
 * @access  Private
 */
router.put("/:id", validateUpdateSubject, subjectController.update);

/**
 * @route   DELETE /api/subjects/:id
 * @desc    Deletar matéria
 * @access  Private
 */
router.delete("/:id", subjectController.delete);

export default router;