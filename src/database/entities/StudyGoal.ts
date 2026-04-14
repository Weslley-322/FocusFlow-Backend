import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export enum GoalType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  CUSTOM = "custom",
}

export enum GoalStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

@Entity("study_goals")
export class StudyGoal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: GoalType,
    default: GoalType.DAILY,
  })
  type: GoalType;

  @Column({ type: "int", comment: "Meta em minutos" })
  targetMinutes: number;

  @Column({ type: "int", default: 0, comment: "Progresso atual em minutos" })
  currentMinutes: number;

  @Column({
    type: "enum",
    enum: GoalStatus,
    default: GoalStatus.PENDING,
  })
  status: GoalStatus;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Relacionamento com User
  @ManyToOne(() => User, (user) => user.studyGoals, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar" })
  userId: string;
}