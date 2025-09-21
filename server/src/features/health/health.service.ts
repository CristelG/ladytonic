import { PrismaErrors } from "../../shared/errors/prisma-errors.js";
import prisma from "../../shared/prisma/index.js";

export const healthCheck = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "healthy",
      timestamp: new Date(),
      version: "1.0.0",
      database: "connected",
      uptime: process.uptime(),
    };
  } catch (err: any) {

    // if (err?.code) throw PrismaErrors.code(err.code);
    throw err;
  }
};
