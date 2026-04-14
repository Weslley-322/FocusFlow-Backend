import { Request, Response, NextFunction } from "express";
import { MindMapService } from "../services/MindMapService";
import { AppError } from "../middlewares/errorHandler";

export class MindMapController {
  private mindMapService: MindMapService;

  constructor() {
    this.mindMapService = new MindMapService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { title, description, topicId } = req.body;

      const result = await this.mindMapService.create(userId, {
        title,
        description,
        topicId,
      });

      return res.status(201).json({
        status: "success",
        message: "Mapa mental criado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.mindMapService.findAll(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.mindMapService.findById(id, userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findByTopicId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { topicId } = req.params;

      if (Array.isArray(topicId)) {
        throw new AppError("ID do tópico inválido", 400);
      }

      const result = await this.mindMapService.findByTopicId(topicId, userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { title, description, isActive } = req.body;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.mindMapService.update(id, userId, {
        title,
        description,
        isActive,
      });

      return res.status(200).json({
        status: "success",
        message: "Mapa mental atualizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      await this.mindMapService.delete(id, userId);

      return res.status(200).json({
        status: "success",
        message: "Mapa mental deletado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };

  createNode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { content, parentId, positionX, positionY, backgroundColor, textColor, order, sourceHandle, targetHandle } =
        req.body;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.mindMapService.createNode(id, userId, {
        content,
        parentId,
        positionX,
        positionY,
        backgroundColor,
        textColor,
      });

      return res.status(201).json({
        status: "success",
        message: "Nó criado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  findNodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      if (Array.isArray(id)) {
        throw new AppError("ID inválido", 400);
      }

      const result = await this.mindMapService.findNodesByMindMapId(id, userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateNode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { nodeId } = req.params;
      const {
        content,
        parentId,
        positionX,
        positionY,
        backgroundColor,
        textColor,
        order,
        sourceHandle,   
        targetHandle,   
      } = req.body;

      if (Array.isArray(nodeId)) {
        throw new AppError("ID do nó inválido", 400);
      }

      const result = await this.mindMapService.updateNode(nodeId, userId, {
        content,
        parentId,
        positionX,
        positionY,
        backgroundColor,
        textColor,
        order,
        sourceHandle,   
        targetHandle,   
      });

      return res.status(200).json({
        status: "success",
        message: "Nó atualizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

updateNodePosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const nodeId = req.params.nodeId as string;
    const { positionX, positionY } = req.body;
    const userId = req.userId!;

    console.log('💾 [BACKEND] Recebeu requisição:', { nodeId, positionX, positionY, userId });

    const node = await this.mindMapService.updateNode(nodeId, userId, {
      positionX,
      positionY,
    });

    console.log('✅ [BACKEND] Nó atualizado:', node);

    res.json({ success: true, data: node });
  } catch (error) {
    console.error('❌ [BACKEND] Erro ao atualizar:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar posição do nó",
      });
    }
  }
};

  deleteNode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { nodeId } = req.params;

      if (Array.isArray(nodeId)) {
        throw new AppError("ID do nó inválido", 400);
      }

      await this.mindMapService.deleteNode(nodeId, userId);

      return res.status(200).json({
        status: "success",
        message: "Nó deletado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      const result = await this.mindMapService.getStats(userId);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}