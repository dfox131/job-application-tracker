import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

export async function register(req, res) {
  try {
    const { email, password } = req.body || {};

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const pwd = String(password || "");

    if (!normalizedEmail || !pwd) {
      return res.status(400).json({
        ok: false,
        error: "Email and password are required.",
      });
    }

    if (pwd.length < 8) {
      return res.status(400).json({
        ok: false,
        error: "Password must be at least 8 characters.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        error: "An account with that email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(pwd, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });

    const token = createToken(user);

    res.status(201).json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to register user.",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const pwd = String(password || "");

    if (!normalizedEmail || !pwd) {
      return res.status(400).json({
        ok: false,
        error: "Email and password are required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Invalid email or password.",
      });
    }

    const isValidPassword = await bcrypt.compare(pwd, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        ok: false,
        error: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to log in.",
    });
  }
}

export async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: "User not found.",
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error("Fetch current user failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch current user.",
    });
  }
}
