import { PrismaClient } from "./prisma/client.js";
import path from "path";

// This is important for Next.js/Vercel deployment
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

// In development, use a global variable to avoid multiple instances during hot reloading
if (process.env.NODE_ENV === "development") {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({
      datasourceUrl: process.env.SILVANA_DATABASE_URL,
    });
  }
  prisma = global.cachedPrisma;
} else {
  // In production, create a new client with the correct query engine path
  prisma = new PrismaClient({
    datasourceUrl: process.env.SILVANA_DATABASE_URL,
  });
}

export default prisma;
