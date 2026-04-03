import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { getHealth } from "./controllers/applicationController.js";
import { openai } from "./openai.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      // allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow all Vercel preview + prod domains
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());

app.get("/health", getHealth);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 4000;

app.get("/api/ai/test", async (_req, res) => {
  try {
    const response = await openai.responses.create({
      model: "gpt-5.4",
      input: "Reply with exactly: OpenAI connection working",
    });

    res.json({
      ok: true,
      output: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI test failed:", error);
    res.status(500).json({
      ok: false,
      error: "OpenAI test request failed.",
    });
  }
});

app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
