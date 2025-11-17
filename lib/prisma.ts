import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` in dev to preserve PrismaClient across module reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
