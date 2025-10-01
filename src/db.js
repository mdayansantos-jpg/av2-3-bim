// Conexão com o banco de dados usando Prisma
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tentar conectar e logar o status
prisma
  .$connect()
  .then(() => {
    console.log("Conectado ao banco de dados!");
  })
  .catch((error) => {
    // Isso nunca deve acontecer se o .env estiver OK
    console.error("X Erro ao conectar:", error.message);
  });

// Exportar a instância
export default prisma;