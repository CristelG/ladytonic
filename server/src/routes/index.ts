import { Router } from "express";
import newsletterRoutes from "../features/newsletter/newsletter.route.js"

//init router
const router = Router();

// catchall for any newsletter route
router.use('/newsletter', newsletterRoutes)

export default router;