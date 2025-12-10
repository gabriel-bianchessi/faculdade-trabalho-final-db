import "dotenv/config";
import { PrismaClient } from "../../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const dbUrl = new URL(process.env.DATABASE_URL || "");

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  connectionLimit: 5
});

export const prisma = new PrismaClient({
  adapter: adapter,
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

prisma.$on('query', (e: any) => {
  console.log('------------------------------------------------');
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
  console.log('------------------------------------------------');
});

prisma.$on('error', (e: any) => {
  console.log('================================================');
  console.log('PRISMA ERROR');
  console.log('Message: ' + e.message);
  console.log('Target: ' + e.target);
  console.log('Timestamp: ' + e.timestamp);
  console.log('================================================');
});