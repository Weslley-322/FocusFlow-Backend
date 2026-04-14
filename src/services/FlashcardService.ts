import { FlashcardRepository } from "../repositories/FlashcardRepository";
import { FlashcardReviewRepository } from "../repositories/FlashcardReviewRepository";
import { SubjectRepository } from "../repositories/SubjectRepository";
import { TopicRepository } from "../repositories/TopicRepository";
import { SM2Algorithm, ReviewQuality } from "./SM2Algorithm";
import { AppError } from "../middlewares/errorHandler";

interface CreateFlashcardData {
  front: string;
  back: string;
  subjectId?: string;
  topicId?: string;
}

interface UpdateFlashcardData {
  front?: string;
  back?: string;
  isActive?: boolean;
}

interface ReviewFlashcardData {
  quality: ReviewQuality;
}

interface FlashcardResponse {
  id: string;
  front: string;
  back: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subjectId?: string;
  subjectName?: string;
  subjectColor?: string;
  topicId?: string;
  topicName?: string;
  reviewsCount?: number;
}

export class FlashcardService {
  private flashcardRepository: FlashcardRepository;
  private flashcardReviewRepository: FlashcardReviewRepository;
  private subjectRepository: SubjectRepository;
  private topicRepository: TopicRepository;

  constructor() {
    this.flashcardRepository = new FlashcardRepository();
    this.flashcardReviewRepository = new FlashcardReviewRepository();
    this.subjectRepository = new SubjectRepository();
    this.topicRepository = new TopicRepository();
  }

  /**
   * Criar novo flashcard
   */
  async create(
    userId: string,
    data: CreateFlashcardData
  ): Promise<FlashcardResponse> {
    const { front, back, subjectId, topicId } = data;

    // Validar se a matéria existe e pertence ao usuário
    if (subjectId) {
      const subject = await this.subjectRepository.findByIdAndUserId(
        subjectId,
        userId
      );

      if (!subject) {
        throw new AppError("Matéria não encontrada", 404);
      }
    }

    // Validar se o tópico existe
    if (topicId) {
      const topic = await this.topicRepository.findById(topicId);

      if (!topic) {
        throw new AppError("Tópico não encontrado", 404);
      }

      // Verificar se o tópico pertence à matéria (se matéria foi fornecida)
      if (subjectId && topic.subjectId !== subjectId) {
        throw new AppError("Tópico não pertence a esta matéria", 400);
      }
    }

    // Criar flashcard com valores iniciais do SM-2
    const flashcard = await this.flashcardRepository.create({
      userId,
      front,
      back,
      subjectId: subjectId || undefined,
      topicId: topicId || undefined,
      easeFactor: 2.5, // Valor inicial padrão
      interval: 0,
      repetitions: 0,
      nextReviewDate: new Date(), // Deve ser revisado imediatamente
    });

    return this.formatFlashcardResponse(flashcard);
  }

  /**
   * Listar todos os flashcards
   */
  async findAll(userId: string): Promise<FlashcardResponse[]> {
    const flashcards = await this.flashcardRepository.findByUserId(userId);
    return flashcards.map((card) => this.formatFlashcardResponse(card));
  }

  /**
   * Buscar flashcard por ID
   */
  async findById(id: string, userId: string): Promise<FlashcardResponse> {
    const flashcard = await this.flashcardRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!flashcard) {
      throw new AppError("Flashcard não encontrado", 404);
    }

    return this.formatFlashcardResponse(flashcard);
  }

  /**
   * Listar flashcards por matéria
   */
  async findBySubjectId(
    subjectId: string,
    userId: string
  ): Promise<FlashcardResponse[]> {
    // Verificar se a matéria existe e pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Matéria não encontrada", 404);
    }

    const flashcards = await this.flashcardRepository.findBySubjectId(
      subjectId,
      userId
    );
    return flashcards.map((card) => this.formatFlashcardResponse(card));
  }

  /**
   * Listar flashcards por tópico
   */
  async findByTopicId(
    topicId: string,
    userId: string
  ): Promise<FlashcardResponse[]> {
    const topic = await this.topicRepository.findById(topicId);

    if (!topic) {
      throw new AppError("Tópico não encontrado", 404);
    }

    // Verificar se a matéria do tópico pertence ao usuário
    const subject = await this.subjectRepository.findByIdAndUserId(
      topic.subjectId,
      userId
    );

    if (!subject) {
      throw new AppError("Acesso negado", 403);
    }

    const flashcards = await this.flashcardRepository.findByTopicId(
      topicId,
      userId
    );
    return flashcards.map((card) => this.formatFlashcardResponse(card));
  }

  /**
   * Buscar cards para revisar hoje
   */
  async findDueForReview(userId: string): Promise<FlashcardResponse[]> {
    const flashcards = await this.flashcardRepository.findDueForReview(userId);
    return flashcards.map((card) => this.formatFlashcardResponse(card));
  }

  /**
   * Revisar um flashcard (algoritmo SM-2)
   */
  async review(
    id: string,
    userId: string,
    data: ReviewFlashcardData
  ): Promise<FlashcardResponse> {
    const flashcard = await this.flashcardRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!flashcard) {
      throw new AppError("Flashcard não encontrado", 404);
    }

    const { quality } = data;

    // Aplicar algoritmo SM-2
    const sm2Result = SM2Algorithm.calculate(
      quality,
      flashcard.repetitions,
      flashcard.easeFactor,
      flashcard.interval
    );

    // Calcular próxima data de revisão
    const nextReviewDate = SM2Algorithm.getNextReviewDate(sm2Result.interval);

    // Atualizar flashcard com novos valores
    const updatedFlashcard = await this.flashcardRepository.update(id, {
      easeFactor: sm2Result.easeFactor,
      interval: sm2Result.interval,
      repetitions: sm2Result.repetitions,
      nextReviewDate,
    });

    if (!updatedFlashcard) {
      throw new AppError("Erro ao atualizar flashcard", 500);
    }

    // Registrar a revisão no histórico
    await this.flashcardReviewRepository.create({
      flashcardId: id,
      quality,
      intervalAfter: sm2Result.interval,
      easeFactorAfter: sm2Result.easeFactor,
    });

    return this.formatFlashcardResponse(updatedFlashcard);
  }

  /**
   * Atualizar flashcard
   */
  async update(
    id: string,
    userId: string,
    data: UpdateFlashcardData
  ): Promise<FlashcardResponse> {
    const flashcard = await this.flashcardRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!flashcard) {
      throw new AppError("Flashcard não encontrado", 404);
    }

    const updatedFlashcard = await this.flashcardRepository.update(id, data);

    if (!updatedFlashcard) {
      throw new AppError("Erro ao atualizar flashcard", 500);
    }

    return this.formatFlashcardResponse(updatedFlashcard);
  }

  /**
   * Deletar flashcard
   */
  async delete(id: string, userId: string): Promise<void> {
    const flashcard = await this.flashcardRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!flashcard) {
      throw new AppError("Flashcard não encontrado", 404);
    }

    await this.flashcardRepository.delete(id);
  }

  /**
   * Buscar histórico de revisões de um flashcard
   */
  async getReviewHistory(id: string, userId: string): Promise<any[]> {
    const flashcard = await this.flashcardRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!flashcard) {
      throw new AppError("Flashcard não encontrado", 404);
    }

    const reviews = await this.flashcardReviewRepository.findByFlashcardId(id);

    return reviews.map((review) => ({
      id: review.id,
      quality: review.quality,
      qualityLabel: this.getQualityLabel(review.quality),
      intervalAfter: review.intervalAfter,
      easeFactorAfter: review.easeFactorAfter,
      reviewedAt: review.reviewedAt,
    }));
  }

  /**
   * Obter estatísticas
   */
  async getStats(userId: string): Promise<{
    totalCards: number;
    dueForReview: number;
    newCards: number;
    masteredCards: number;
  }> {
    const totalCards = await this.flashcardRepository.countByUserId(userId);
    const dueForReview = await this.flashcardRepository.countDueForReview(
      userId
    );

    // Cards novos: repetitions === 0
    const allCards = await this.flashcardRepository.findByUserId(userId);
    const newCards = allCards.filter((card) => card.repetitions === 0).length;

    // Cards "dominados"
    const masteredCards = allCards.filter(
      (card) => card.repetitions >= 5 
    ).length;

    return {
      totalCards,
      dueForReview,
      newCards,
      masteredCards,
    };
  }

  /**
   * Formatar resposta de flashcard
   */
  private formatFlashcardResponse(flashcard: any): FlashcardResponse {
    return {
      id: flashcard.id,
      front: flashcard.front,
      back: flashcard.back,
      easeFactor: flashcard.easeFactor,
      interval: flashcard.interval,
      repetitions: flashcard.repetitions,
      nextReviewDate: flashcard.nextReviewDate,
      isActive: flashcard.isActive,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
      subjectId: flashcard.subjectId,
      subjectName: flashcard.subject?.name,
      subjectColor: flashcard.subject?.color,
      topicId: flashcard.topicId,
      topicName: flashcard.topic?.name,
      reviewsCount: flashcard.reviews?.length || 0,
    };
  }

  /**
   * Obter label da qualidade
   */
  private getQualityLabel(quality: ReviewQuality): string {
    const labels = {
      [ReviewQuality.AGAIN]: "Errei",
      [ReviewQuality.HARD]: "Difícil",
      [ReviewQuality.GOOD]: "Bom",
      [ReviewQuality.EASY]: "Fácil",
    };
    return labels[quality];
  }
}