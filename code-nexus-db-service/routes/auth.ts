import express, { Request, Response, Router } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

const JWT: string = process.env.JWT_SECRET
  ? process.env.JWT_SECRET
  : "JWT_CODE";

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT,
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.post("/refresh", async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ message: "Access Denied. No token provided." });
      return;
    }

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    jwt.verify(
      token.replace("Bearer ", ""),
      JWT,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const newToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role, name: user.name },
          JWT,
          { expiresIn: "1h" }
        );

        return res.json({ token: newToken });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

export default router;
