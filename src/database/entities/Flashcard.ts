import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Subject } from "./Subject";
import { Topic } from "./Topic";
import { FlashcardReview } from "./FlashcardReview";

@Entity("flashcards")
export class Flashcard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  front: string; // Pergunta/Frente do card

  @Column({ type: "text" })
  back: string; // Resposta/Verso do card

  @Column({ type: "int", default: 0, comment: "Fator de facilidade do algoritmo SM-2" })
  easeFactor: number;

  @Column({ type: "int", default: 0, comment: "Intervalo atual em dias" })
  interval: number;

  @Column({ type: "int", default: 0, comment: "Número de repetições" })
  repetitions: number;

  @Column({ type: "timestamp", nullable: true })
  nextReviewDate?: Date;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Relacionamento com User
  @ManyToOne(() => User, (user) => user.flashcards, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar" })
  userId: string;

  // Relacionamento com Subject
  @ManyToOne(() => Subject, (subject) => subject.flashcards, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "subjectId" })
  subject?: Subject;

  @Column({ type: "varchar", nullable: true })
  subjectId?: string;

  // Relacionamento com Topic
  @ManyToOne(() => Topic, (topic) => topic.flashcards, { onDelete: "SET NULL" })
  @JoinColumn({ name: "topicId" })
  topic?: Topic;

  @Column({ type: "varchar", nullable: true })
  topicId?: string;

  // Relacionamento com Reviews
  @OneToMany(() => FlashcardReview, (review) => review.flashcard)
  reviews: FlashcardReview[];
}