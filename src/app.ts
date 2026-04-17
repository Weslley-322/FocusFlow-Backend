import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandle } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:3001"];

app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.FRONTEND_URL || "http://localhost:3001";
    if (!origin || origin === allowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FocusFlow API está rodando!!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);
app.use(errorHandle);

export default app;