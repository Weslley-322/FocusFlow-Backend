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
import { Subject } from "./Subject";
import { PomodoroSession } from "./PomodoroSession";
import { Flashcard } from "./Flashcard";
import { MindMap } from "./MindMap";

@Entity("topics")
export class Topic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Relacionamento com Subject
  @ManyToOne(() => Subject, (subject) => subject.topics, { onDelete: "CASCADE" })
  @JoinColumn({ name: "subjectId" })
  subject: Subject;

  @Column({ type: "varchar" })
  subjectId: string;

  // Relacionamentos
  @OneToMany(() => PomodoroSession, (session) => session.topic)
  pomodoroSessions: PomodoroSession[];

  @OneToMany(() => Flashcard, (flashcard) => flashcard.topic)
  flashcards: Flashcard[];

  @OneToMany(() => MindMap, (mindMap) => mindMap.topic)
  mindMaps: MindMap[];

}