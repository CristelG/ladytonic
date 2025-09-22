import type { Request, Response } from "express";
import { healthCheck } from "./health.service.js";

export const getHealth = async (req: Request, res: Response) => {
  try {
    const health = await healthCheck();
    if (health.status === "degraded") return res.status(503).json(health);
    res.status(200).json(health);
  } catch (err) {
    res.status(503).json("Health check failed");
    throw err;
  }
};
