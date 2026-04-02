import express from "express";
import { extractJobDescription } from "../controllers/jobController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/extract", requireAuth, extractJobDescription);

export default router;
