import { Router } from "express";
import { MindMapController } from "../controllers/MindMapController";
import {
  validateCreateMindMap,
  validateUpdateMindMap,
  validateCreateNode,
  validateUpdateNode,
} from "../validators/mindmapValidator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const mindMapController = new MindMapController();

// Todas as rotas de mindmaps requerem autenticação
router.use(authMiddleware);


/**
 * @route   POST /api/mindmaps
 * @desc    Criar novo mapa mental
 * @access  Private
 */
router.post("/", validateCreateMindMap, mindMapController.create);

/**
 * @route   GET /api/mindmaps/stats
 * @desc    Obter estatísticas de mapas mentais
 * @access  Private
 */
router.get("/stats", mindMapController.getStats);

/**
 * @route   GET /api/mindmaps/topic/:topicId
 * @desc    Listar mapas mentais por tópico
 * @access  Private
 */
router.get("/topic/:topicId", mindMapController.findByTopicId);

/**
 * @route
 * @desc
 * @access
 */
router.patch("/nodes/:nodeId/position", mindMapController.updateNodePosition);

/**
 * @route   PUT /api/mindmaps/nodes/:nodeId
 * @desc    Atualizar nó
 * @access  Private
 */
router.put("/nodes/:nodeId", validateUpdateNode, mindMapController.updateNode);

/**
 * @route   DELETE /api/mindmaps/nodes/:nodeId
 * @desc    Deletar nó
 * @access  Private
 */
router.delete("/nodes/:nodeId", mindMapController.deleteNode);

/**
 * @route   GET /api/mindmaps
 * @desc    Listar todos os mapas mentais
 * @access  Private
 */
router.get("/", mindMapController.findAll);

/**
 * @route   GET /api/mindmaps/:id
 * @desc    Buscar mapa mental por ID (com todos os nós)
 * @access  Private
 */
router.get("/:id", mindMapController.findById);

/**
 * @route   POST /api/mindmaps/:id/nodes
 * @desc    Criar nó em um mapa mental
 * @access  Private
 */
router.post("/:id/nodes", validateCreateNode, mindMapController.createNode);

/**
 * @route   GET /api/mindmaps/:id/nodes
 * @desc    Listar nós de um mapa mental
 * @access  Private
 */
router.get("/:id/nodes", mindMapController.findNodes);

/**
 * @route   PUT /api/mindmaps/:id
 * @desc    Atualizar mapa mental
 * @access  Private
 */
router.put("/:id", validateUpdateMindMap, mindMapController.update);

/**
 * @route   DELETE /api/mindmaps/:id
 * @desc    Deletar mapa mental
 * @access  Private
 */
router.delete("/:id", mindMapController.delete);



export default router;