import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Lazy Prisma client initialization
 * Only creates the client when actually accessed (runtime), not at module load (build-time)
 * This prevents build failures when DATABASE_URL is not available
 */
function getPrismaClient(): PrismaClient {
  if (!global.prisma) {
    // Only validate DATABASE_URL at runtime, not build time
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!isBuildTime && !databaseUrl) {
      throw new Error(
        "DATABASE_URL is not configured. Please set it in your environment variables.\n" +
        "See .env.example for the correct format."
      );
    }
    
    global.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
    });
    
    // Graceful shutdown - disconnect Prisma on process termination
    if (typeof window === "undefined" && !isBuildTime) {
      process.on("beforeExit", async () => {
        await global.prisma?.$disconnect();
      });
    }
  }
  
  return global.prisma;
}

/**
 * Export prisma client via getter to ensure lazy initialization
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    return client[prop as keyof PrismaClient];
  },
});

