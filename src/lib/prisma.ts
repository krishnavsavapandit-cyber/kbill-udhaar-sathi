import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const rawDbUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "").trim();
const dbUrl = rawDbUrl?.includes("connection_limit")
  ? rawDbUrl
  : `${rawDbUrl || "file:./dev.db"}?connection_limit=1`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
