import "dotenv/config";
import { prisma } from "./src/db/prisma/client";

async function testConnection() {
  try {
    console.log("🔄 Testando conexão com o banco de dados...");
    console.log(`📍 DATABASE_URL: ${process.env.DATABASE_URL}`);
    
    await prisma.$connect();
    console.log("✅ Conexão estabelecida com sucesso!");
    
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Query de teste executada:", result);
    
    await prisma.$disconnect();
    console.log("✅ Desconectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
    process.exit(1);
  }
}

testConnection();
