import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` in dev to preserve PrismaClient across module reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Configure Prisma with logging and error handling
const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("[Prisma] DATABASE_URL is not set — skipping client creation");
    // Return a proxy that throws helpful errors instead of crashing at import
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "then") return undefined; // avoid Promise-like behavior
        throw new Error(
          `PrismaClient is not available (DATABASE_URL not set). Attempted to access: ${String(prop)}`,
        );
      },
    });
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Graceful shutdown handling
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;

// Helper function for database operations with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.error(
        `Database operation failed (attempt ${attempt}/${maxRetries}):`,
        error.message,
      );

      // Don't retry on validation errors
      if (error.code === "P2002" || error.code === "P2025") {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
