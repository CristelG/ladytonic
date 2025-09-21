import { Router } from "express";
import newsletterRoutes from "../features/newsletter/newsletter.route.js"
import healthRoutes from "../features/health/health.route.js";

//init router
const router = Router();

// catchall for any newsletter route
router.use('/newsletter', newsletterRoutes)
router.use('/health', healthRoutes)

export default router;