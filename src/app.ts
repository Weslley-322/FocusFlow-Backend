import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandle } from "./middlewares/errorHandler";

//Carregar variáveis de ambiente
dotenv.config();

const app: Application = express();

//Middlewares globais
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json()); //Parse do json no body
app.use(express.urlencoded({ extended: true }));

//Rota health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "FocusFlow API está rodando!!",
        timestamp: new Date().toISOString(),
    });
});

//Rotas de aplicação
app.use("/api", routes);

//Middlewares de tratamento de erros
app.use(errorHandle);

export default app;