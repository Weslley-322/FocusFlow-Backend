import { Router } from "express";
import { FlashcardController } from "../controllers/FlashcardController";
import {
  validateCreateFlashcard,
  validateUpdateFlashcard,
  validateReviewFlashcard,
} from "../validators/flashcardValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const flashcardController = new FlashcardController();

// Todas as rotas de flashcards requerem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/flashcards
 * @desc    Criar novo flashcard
 * @access  Private
 */
router.post("/", validateCreateFlashcard, flashcardController.create);

/**
 * @route   GET /api/flashcards/stats
 * @desc    Obter estatísticas de flashcards
 * @access  Private
 */
router.get("/stats", flashcardController.getStats);

/**
 * @route   GET /api/flashcards/review/due
 * @desc    Buscar cards para revisar hoje
 * @access  Private
 */
router.get("/review/due", flashcardController.findDueForReview);

/**
 * @route   GET /api/flashcards/subject/:subjectId
 * @desc    Listar flashcards por matéria
 * @access  Private
 */
router.get("/subject/:subjectId", flashcardController.findBySubjectId);

/**
 * @route   GET /api/flashcards/topic/:topicId
 * @desc    Listar flashcards por tópico
 * @access  Private
 */
router.get("/topic/:topicId", flashcardController.findByTopicId);

/**
 * @route   GET /api/flashcards
 * @desc    Listar todos os flashcards
 * @access  Private
 */
router.get("/", flashcardController.findAll);

/**
 * @route   GET /api/flashcards/:id
 * @desc    Buscar flashcard por ID
 * @access  Private
 */
router.get("/:id", flashcardController.findById);

/**
 * @route   GET /api/flashcards/:id/history
 * @desc    Buscar histórico de revisões de um flashcard
 * @access  Private
 */
router.get("/:id/history", flashcardController.getReviewHistory);

/**
 * @route   POST /api/flashcards/:id/review
 * @desc    Revisar um flashcard (algoritmo SM-2)
 * @access  Private
 */
router.post("/:id/review", validateReviewFlashcard, flashcardController.review);

/**
 * @route   PUT /api/flashcards/:id
 * @desc    Atualizar flashcard
 * @access  Private
 */
router.put("/:id", validateUpdateFlashcard, flashcardController.update);

/**
 * @route   DELETE /api/flashcards/:id
 * @desc    Deletar flashcard
 * @access  Private
 */
router.delete("/:id", flashcardController.delete);

export default router;