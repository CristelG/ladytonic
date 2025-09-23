import type { NextFunction, Request, Response } from "express";
import { healthCheck } from "./health.service";
import { PrismaErrors } from "../../shared/errors/prisma-errors";


export const getHealth = async (
  req: Request,
  res: Response,
) => {
  const startTime = Date.now();
  try {
    const health = await healthCheck();
    if (health.status === "degraded") return res.status(503).json(health);
    res.status(200).json(health);
  } catch (err) {
    //this is an exception to the error architecture in place, due to needing different formats of responses and error logging server side
    
    const elapsed = Date.now() - startTime;
    res.status(503).json({
      status: "unavailable",
      timestamp: new Date(),
      version: "1.0.0",
      database: "unavailable",
      uptime: process.uptime(),
      timeElapsed: elapsed,
    });
    console.error("Health check failed", err)
  }
};
