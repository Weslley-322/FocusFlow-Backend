import { AppDataSource } from "../database/data-source";
import { FlashcardReview } from "../database/entities/FlashcardReview";
import { Repository } from "typeorm";

export class FlashcardReviewRepository {
  private repository: Repository<FlashcardReview>;

  constructor() {
    this.repository = AppDataSource.getRepository(FlashcardReview);
  }

  /**
   * Criar nova revisão
   */
  async create(reviewData: Partial<FlashcardReview>): Promise<FlashcardReview> {
    const review = this.repository.create(reviewData);
    return await this.repository.save(review);
  }

  /**
   * Buscar revisões de um flashcard
   */
  async findByFlashcardId(flashcardId: string): Promise<FlashcardReview[]> {
    return await this.repository.find({
      where: { flashcardId },
      order: { reviewedAt: "DESC" },
    });
  }

  /**
   * Buscar última revisão de um flashcard
   */
  async findLastByFlashcardId(
    flashcardId: string
  ): Promise<FlashcardReview | null> {
    return await this.repository.findOne({
      where: { flashcardId },
      order: { reviewedAt: "DESC" },
    });
  }

  /**
   * Contar revisões de um flashcard
   */
  async countByFlashcardId(flashcardId: string): Promise<number> {
    return await this.repository.count({
      where: { flashcardId },
    });
  }
}