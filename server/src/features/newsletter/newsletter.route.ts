import { Router } from "express";
import { create, getAll } from "./newsletter.controller.js";


//init router
const newsletterRouter = Router();

// /api
newsletterRouter.post("/", create);
newsletterRouter.get("/", getAll);

export default newsletterRouter;
