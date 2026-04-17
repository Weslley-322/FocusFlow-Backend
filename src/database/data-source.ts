import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

import { User } from "./entities/User";
import { Subject } from "./entities/Subject";
import { Topic } from "./entities/Topic";
import { PomodoroSession } from "./entities/PomodoroSession";
import { Flashcard } from "./entities/Flashcard";
import { FlashcardReview } from "./entities/FlashcardReview";
import { MindMap } from "./entities/MindMap";
import { MindMapNode } from "./entities/MindMapNode";
import { StudyGoal } from "./entities/StudyGoal";

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "focusflow",
  synchronize: !isProduction,
  logging: !isProduction,
  entities: [
    User,
    Subject,
    Topic,
    PomodoroSession,
    Flashcard,
    FlashcardReview,
    MindMap,
    MindMapNode,
    StudyGoal,
  ],
  migrations: ["src/database/migrations/**/*.ts"],
  subscribers: [],
  charset: "utf8mb4",
  timezone: "-03:00",
  ssl: isProduction ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexão com banco de dados estabelecida!");
    console.log(`📊 Database: ${process.env.DB_DATABASE}`);
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
    throw error;
  }
};