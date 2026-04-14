import "reflect-metadata";
import { initializeDatabase } from "./database/data-source";
import app from "./app";

const PORT = process.env.PORT || 300;

async function startServer() {
    try{
        //Inicializar DB
        await initializeDatabase();

        //Inicializar server Express
        app.listen(PORT, () =>{
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
        });
    }catch (error){
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
}

//Tratamento de erros não capturados 
process.on("unhandledRejection", (reason, promise) =>{
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaugh Exception:", error);
    process.exit(1);
});

startServer();