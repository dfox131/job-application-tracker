import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const count = await prisma.application.count();

    res.json({
      ok: true,
      service: "job-tracker-api",
      applications: count,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const { company, role, status, dateApplied, link, notes } = req.body || {};

    if (!company || !role) {
      return res.status(400).json({
        ok: false,
        error: "Company and role are required.",
      });
    }

    const application = await prisma.application.create({
      data: {
        company: company.trim(),
        role: role.trim(),
        status: status?.trim() || "APPLIED",
        dateApplied: dateApplied ? new Date(dateApplied) : null,
        link: link?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    res.status(201).json({
      ok: true,
      application,
    });
  } catch (error) {
    console.error("Create application failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to create application.",
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
