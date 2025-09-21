import express from "express";
import type { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import errorHandler from "./shared/middleware/error-handler.js";
import routes from "./routes/index.js";
import prisma from "./shared/prisma/index.js";
import cors, { type CorsOptions } from "cors";
import { rateLimit } from "express-rate-limit";
// import { rateLimit } from "express-slow-down";
import morgan from "morgan";



//init dotenv
dotenv.config();

//init express
const app: Application = express();

//logging
app.use(morgan("METHOD:[:method] | URL:[:url] | STATUS:[:status] | CONTENT-LENGTH:[:res[content-length]] | RESPONSE TIME (MS): [:response-time]"))

//define port for app
const port = process.env.PORT || 3001;

//json body parser
app.use(express.json({ limit: "50kb" }));

//cors
const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  maxAge: 86400, // Cache the preflight response for 24 hours
  credentials: true,
};

app.use(cors(corsOptions));

//rate limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 15, // each IP can make up to 15 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  skipFailedRequests: false, //already like this by default, but just to be aware
  skipSuccessfulRequests: true, //like above  
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // each IP can make up to 15 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  skipFailedRequests: false, //already like this by default, but just to be aware
  skipSuccessfulRequests: true, //like above  
});

//api limiter
app.use("/api", limiter);

//auth limiter
app.use('/auth', authLimiter)


//API endpoints
app.use("/api", routes);

//404 Handler
app.use((req: Request, res: Response) => {
  res
    .status(404)
    .send({ type: "Route not found", status: 404, path: req.originalUrl });
});

//GLOBAL ERROR HANDLER
app.use(errorHandler);

//graceful shutdown
const gracefulShutdown = async () => {
  console.info("Starting graceful shutdown...");
  await prisma.$disconnect();
  console.info("Prisma disconnected");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

//app run
const server = app.listen(port, () => {
  console.info(`Server is online on port ${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});
