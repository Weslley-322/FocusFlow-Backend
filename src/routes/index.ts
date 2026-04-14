import { Router } from "express";
import authRoutes from "./authRoutes";
import subjectRoutes from "./subjectRoutes";
import topicRoutes from "./topicRoutes";
import pomodoroRoutes from "./pomodoroRoutes";
import flashcardRoutes from "./flashcardRoutes";
import mindmapRoutes from "./mindmapRoutes";
import goalRoutes from "./goalRoutes";

const router = Router();

// Rota de boas-vindas da API
router.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo à API do FocusFlow! 📚",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      auth: "/api/auth",
      subjects: "/api/subjects",
      topics: "/api/topics",
      pomodoro: "/api/pomodoro",
      flashcards: "/api/flashcards",
      mindmaps: "/api/mindmaps",
      goals: "/api/goals",
    },
  });
});

// Rotas de autenticação
router.use("/auth", authRoutes);

// Rotas de matérias
router.use("/subjects", subjectRoutes);

// Rotas de tópicos
router.use("/topics", topicRoutes);

// Rotas de pomodoro
router.use("/pomodoro", pomodoroRoutes);

// Rotas de flashcards
router.use("/flashcards", flashcardRoutes);

// Rotas de mapas mentais
router.use("/mindmaps", mindmapRoutes);

// Rotas de metas
router.use("/goals", goalRoutes);

export default router;
