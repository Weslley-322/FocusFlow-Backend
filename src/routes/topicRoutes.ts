import { Router } from "express";
import { TopicController } from "../controllers/TopicController";
import {
  validateCreateTopic,
  validateUpdateTopic,
} from "../validators/topicValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const topicController = new TopicController();

// Todas as rotas de topics requerem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/topics
 * @desc    Criar novo tópico
 * @access  Private
 */
router.post("/", validateCreateTopic, topicController.create);

/**
 * @route   GET /api/topics/subject/:subjectId
 * @desc    Listar todos os tópicos de uma matéria
 * @access  Private
 */
router.get("/subject/:subjectId", topicController.findBySubjectId);

/**
 * @route   GET /api/topics/:id
 * @desc    Buscar tópico por ID
 * @access  Private
 */
router.get("/:id", topicController.findById);

/**
 * @route   PUT /api/topics/:id
 * @desc    Atualizar tópico
 * @access  Private
 */
router.put("/:id", validateUpdateTopic, topicController.update);

/**
 * @route   DELETE /api/topics/:id
 * @desc    Deletar tópico
 * @access  Private
 */
router.delete("/:id", topicController.delete);

export default router;