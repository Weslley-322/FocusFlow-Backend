import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { MindMap } from "./MindMap";

@Entity("mind_map_nodes")
export class MindMapNode {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @Column({ default: 0 })
  level: number;

  @Column({ type: "varchar", nullable: true, comment: "ID do nó pai" })
  parentId?: string;

  @Column({ type: "int", default: 0, comment: "Posição X no canvas" })
  positionX: number;

  @Column({ type: "int", default: 0, comment: "Posição Y no canvas" })
  positionY: number;

  @Column({ type: "varchar", length: 7, default: "#FFFFFF" })
  backgroundColor: string;

  @Column({ type: "varchar", length: 7, default: "#000000" })
  textColor: string;

  @Column({ type: "int", default: 0, comment: "Ordem de exibição" })
  order: number;

  // Handle de onde a seta SAI (no nó pai)
  @Column({ type: "varchar", length: 20, nullable: true, comment: "Handle de origem da conexão" })
  sourceHandle?: string;

  // Handle de onde a seta ENTRA (no nó filho)
  @Column({ type: "varchar", length: 20, nullable: true, comment: "Handle de destino da conexão" })
  targetHandle?: string;

  @ManyToOne(() => MindMap, (mindMap) => mindMap.nodes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "mindMapId" })
  mindMap: MindMap;

  @Column({ type: "varchar" })
  mindMapId: string;
}