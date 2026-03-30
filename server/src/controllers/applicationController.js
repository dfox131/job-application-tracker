import { prisma } from "../prisma.js";

export async function getHealth(_req, res) {
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
}

export async function createApplication(req, res) {
  try {
    const {
      company,
      role,
      status,
      source,
      salary,
      location,
      dateApplied,
      link,
      notes,
      jobDescription,
    } = req.body || {};

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
        source: source?.trim() || null,
        salary: salary?.trim() || null,
        location: location?.trim() || null,
        dateApplied: dateApplied ? new Date(dateApplied) : null,
        link: link?.trim() || null,
        notes: notes?.trim() || null,
        jobDescription: jobDescription?.trim() || null,
        userId: req.user.userId,
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
}

export async function getApplications(req, res) {
  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      ok: true,
      applications,
    });
  } catch (error) {
    console.error("Fetch applications failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch applications.",
    });
  }
}

export async function getApplicationById(req, res) {
  try {
    const { id } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!application) {
      return res.status(404).json({
        ok: false,
        error: "Application not found.",
      });
    }

    res.json({
      ok: true,
      application,
    });
  } catch (error) {
    console.error("Fetch application failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch application.",
    });
  }
}

export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const {
      company,
      role,
      status,
      source,
      salary,
      location,
      dateApplied,
      link,
      notes,
      jobDescription,
    } = req.body || {};

    const existingApplication = await prisma.application.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        ok: false,
        error: "Application not found.",
      });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        company: company?.trim() ?? existingApplication.company,
        role: role?.trim() ?? existingApplication.role,
        status: status?.trim() ?? existingApplication.status,
        source:
          source !== undefined
            ? source?.trim() || null
            : existingApplication.source,
        salary:
          salary !== undefined
            ? salary?.trim() || null
            : existingApplication.salary,
        location:
          location !== undefined
            ? location?.trim() || null
            : existingApplication.location,
        dateApplied: dateApplied
          ? new Date(dateApplied)
          : existingApplication.dateApplied,
        link:
          link !== undefined ? link?.trim() || null : existingApplication.link,
        notes:
          notes !== undefined
            ? notes?.trim() || null
            : existingApplication.notes,
        jobDescription:
          jobDescription !== undefined
            ? jobDescription?.trim() || null
            : existingApplication.jobDescription,
      },
    });

    res.json({
      ok: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to update application.",
    });
  }
}

export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;

    const existingApplication = await prisma.application.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        ok: false,
        error: "Application not found.",
      });
    }

    await prisma.application.delete({
      where: { id },
    });

    res.json({
      ok: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete application failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to delete application.",
    });
  }
}
