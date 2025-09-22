import type { Request, Response } from "express";
import { healthCheck } from "./health.service";
import { PrismaErrors } from "../../shared/errors/prisma-errors";

export const getHealth = async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const health = await healthCheck();
    if (health.status === "degraded") return res.status(503).json(health);
    res.status(200).json(health);
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    res.status(503).json({
      status: "unavailable",
      timestamp: new Date(),
      version: "1.0.0",
      database: "unavailable",
      uptime: process.uptime(),
      timeElapsed: elapsed,
    });
    throw err;
  }
};
