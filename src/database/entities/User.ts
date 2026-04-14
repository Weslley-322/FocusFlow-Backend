import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Subject } from "./Subject";
import { PomodoroSession } from "./PomodoroSession";
import { Flashcard } from "./Flashcard";
import { MindMap } from "./MindMap";
import { StudyGoal } from "./StudyGoal";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar?: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  // ← novos campos de verificação
  @Column({ type: "boolean", default: false })
  isVerified: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  verificationToken?: string;

  @Column({ type: "timestamp", nullable: true })
  verificationTokenExpires?: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => Subject, (subject) => subject.user)
  subjects: Subject[];

  @OneToMany(() => PomodoroSession, (session) => session.user)
  pomodoroSessions: PomodoroSession[];

  @OneToMany(() => Flashcard, (flashcard) => flashcard.user)
  flashcards: Flashcard[];

  @OneToMany(() => MindMap, (mindMap) => mindMap.user)
  mindMaps: MindMap[];

  @OneToMany(() => StudyGoal, (goal) => goal.user)
  studyGoals: StudyGoal[];
}