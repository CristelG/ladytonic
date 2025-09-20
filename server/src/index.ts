import express from "express";
import type { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import errorHandler from "./middleware/error-handler.js";
import { ValidationError } from "./errors/custom-errors.js";

//init dotenv
dotenv.config();

//init express
const app: Application = express();

//define port for app
const port = process.env.PORT || 3000;

//root route
app.get("/", (req: Request, res: Response) => {
  res.send("GET Health Check OK");
  // throw new ValidationError("test validation error")
  // throw new Error()
});

app.post("/", (req: Request, res: Response) => {
  res.send("POST Health Check OK");
});

//404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).send({ message: "Route not found", path: req.originalUrl });
});

//GLOBAL ERROR HANDLER
app.use(errorHandler);

//app run
app.listen(port, () => {
  console.info(`Server is online on port ${port}`);
});
