import { PrismaErrors } from "../../shared/errors/prisma-errors";
import prisma from "../../shared/prisma/index";

export const healthCheck = async () => {
  try {
    const startTime = Date.now();
    const query = await prisma.$queryRaw`SELECT 1`;
    const elapsed = Date.now() - startTime;
    
    if (elapsed > 5000) {
      return {
        status: "degraded",
        timestamp: new Date(),
        version: "1.0.0",
        database: "connected",
        uptime: process.uptime(),
        timeElapsed: elapsed
      };
    }

    return {
      status: "healthy",
      timestamp: new Date(),
      version: "1.0.0",
      database: "connected",
      uptime: process.uptime(),
      timeElapsed: elapsed
    };
  } catch (err: any) {
    if (err?.code) throw PrismaErrors.code(err);
    throw err;
  }
};
