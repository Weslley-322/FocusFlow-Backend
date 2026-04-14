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
import { Topic } from "./Topic";
import { PomodoroSession } from "./PomodoroSession";
import { Flashcard } from "./Flashcard";

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 7, default: "#3B82F6" })
  color: string; // Código hexadecimal de cor

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Relacionamento com User
  @ManyToOne(() => User, (user) => user.subjects, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar" })
  userId: string;

  // Relacionamentos
  @OneToMany(() => Topic, (topic) => topic.subject)
  topics: Topic[];

  @OneToMany(() => PomodoroSession, (session) => session.subject)
  pomodoroSessions: PomodoroSession[];

  @OneToMany(() => Flashcard, (flashcard) => flashcard.subject)
  flashcards: Flashcard[];
}