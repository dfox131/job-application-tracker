import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
} from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { analyzeAndSaveApplication } from "../controllers/applicationController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);
router.post("/:id/analyze", requireAuth, analyzeAndSaveApplication);

export default router;
