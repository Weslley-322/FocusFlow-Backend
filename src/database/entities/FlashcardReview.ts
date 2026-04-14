import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Flashcard } from "./Flashcard";

export enum ReviewQuality {
  AGAIN = 0, // Não lembrou
  HARD = 1, // Difícil de lembrar
  GOOD = 2, // Lembrou bem
  EASY = 3, // Muito fácil
}

@Entity("flashcard_reviews")
export class FlashcardReview {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ReviewQuality,
    comment: "Qualidade da resposta (0-3)",
  })
  quality: ReviewQuality;

  @Column({ type: "int", comment: "Intervalo calculado após a revisão (em dias)" })
  intervalAfter: number;

  @Column({ type: "int", comment: "Fator de facilidade após a revisão" })
  easeFactorAfter: number;

  @CreateDateColumn({ type: "timestamp" })
  reviewedAt: Date;

  // Relacionamento com Flashcard
  @ManyToOne(() => Flashcard, (flashcard) => flashcard.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "flashcardId" })
  flashcard: Flashcard;

  @Column({ type: "varchar" })
  flashcardId: string;
}