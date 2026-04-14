import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Subject } from "./Subject";
import { Topic } from "./Topic";

@Entity("pomodoro_sessions")
export class PomodoroSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", comment: "Duração da sessão em minutos" })
  duration: number;

  @Column({ type: "int", comment: "Tempo de pausa em minutos" })
  breakTime: number;

  @Column({ type: "timestamp" })
  startTime: Date;

  @Column({ type: "timestamp", nullable: true })
  endTime?: Date;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  // Relacionamento com User
  @ManyToOne(() => User, (user) => user.pomodoroSessions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar" })
  userId: string;

  // Relacionamento com Subject
  @ManyToOne(() => Subject, (subject) => subject.pomodoroSessions, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "subjectId" })
  subject?: Subject;

  @Column({ type: "varchar", nullable: true })
  subjectId?: string;

  // Relacionamento com Topic
  @ManyToOne(() => Topic, (topic) => topic.pomodoroSessions, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "topicId" })
  topic?: Topic;

  @Column({ type: "varchar", nullable: true })
  topicId?: string;
}