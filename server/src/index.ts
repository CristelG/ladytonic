import express from "express";
import type { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import errorHandler from "./shared/middleware/error-handler.js";
import routes from "./routes/index.js";
import prisma from "./shared/prisma/index.js";

//init dotenv
dotenv.config();

//init express
const app: Application = express();

//define port for app
const port = process.env.PORT || 3001;

//json body parser
app.use(express.json({ limit: '50kb' }))

//API endpoints
app.use('/api', routes);

//404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).send({ message: "Route not found", path: req.originalUrl });
});

//GLOBAL ERROR HANDLER
app.use(errorHandler);

//graceful shutdown
const gracefulShutdown = async () => {
  console.info('Starting graceful shutdown...');
  await prisma.$disconnect();
  console.info('Prisma disconnected');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

//app run
const server = app.listen(port, () => {
  console.info(`Server is online on port ${port}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
