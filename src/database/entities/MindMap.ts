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
import { MindMapNode } from "./MindMapNode";

@Entity("mind_maps")
export class MindMap {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 150 })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Relacionamento com User
  @ManyToOne(() => User, (user) => user.mindMaps, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar" })
  userId: string;

  // Relacionamento com Topic
  @ManyToOne(() => Topic, (topic) => topic.mindMaps, { onDelete: "SET NULL" })
  @JoinColumn({ name: "topicId" })
  topic?: Topic;

  @Column({ type: "varchar", nullable: true })
  topicId?: string;

  // Relacionamento com Nodes
  @OneToMany(() => MindMapNode, (node) => node.mindMap, { cascade: true })
  nodes: MindMapNode[];
}