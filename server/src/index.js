import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationRoutes from "./routes/applicationRoutes.js";
import { getHealth } from "./controllers/applicationController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", getHealth);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
