import { Router } from "express";
import { analyzeJobMatch } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/job-match", requireAuth, analyzeJobMatch);

export default router;
