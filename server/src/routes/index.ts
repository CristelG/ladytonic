import { Router } from "express";
import newsletterRoutes from "../features/newsletter/newsletter.route"
import healthRoutes from "../features/health/health.route";

//init router
const router = Router();

// catchall for any newsletter route
router.use('/newsletter', newsletterRoutes)
router.use('/health', healthRoutes)

export default router;