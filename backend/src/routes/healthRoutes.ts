import express from "express";
import { rateLimiter } from "../middleware/rateLimiter.js";
import * as HeathController from "../controllers/HealthController.js"

const router = express.Router();

router.get("/check", rateLimiter, HeathController.healthCheck)
export default router;