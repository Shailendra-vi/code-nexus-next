import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

// Create Problem associated to a contest
router.post(
  "/:contest_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { contest_id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const user = (req as any).user;
      const userId = user.id;
      if (!userId || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const contest = await prisma.contests.findUnique({
        where: { id: contest_id, created_by: userId },
      });
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      const problem = await prisma.problem.create({
        data: {
          title,
          description,
          created_by: userId,
          contest_id,
        },
      });

      return res.status(201).json({ problem });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Get all problems related to a contest
router.get(
  "/:contest_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { contest_id } = req.params;
      const problems = await prisma.problem.findMany({
        where: { contest_id },
      });

      return res.status(200).json({ problems });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Get problem details
router.get(
  "/:problem_id/details",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { problem_id } = req.params;
      const problem = await prisma.problem.findUnique({
        where: { id: problem_id },
      });
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      return res.status(200).json({ problem });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Update problem details
router.put(
  "/:problem_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { problem_id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Please fill all fields" });
      }
      const user = (req as any).user;
      const userId = user.id;
      if (!userId || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized user" });
      }
      const problem = await prisma.problem.findUnique({
        where: { id: problem_id, created_by: userId },
      });
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      const updatedProblem = await prisma.problem.update({
        where: { id: problem_id, created_by: userId },
        data: {
          title,
          description,
        },
      });
      return res.status(200).json({ problem: updatedProblem });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Delete problem
router.delete(
  "/:problem_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { problem_id } = req.params;
      const user = (req as any).user;
      const userId = user.id;
      if (!userId || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized user" });
      }
      const problem = await prisma.problem.findUnique({
        where: { id: problem_id, created_by: userId },
      });
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      await prisma.testCases.deleteMany({
        where: { problem_id },
      });

      await prisma.submission.deleteMany({
        where: { problem_id },
      });

      await prisma.problem.delete({
        where: { id: problem_id },
      });
      return res.status(200).json({ message: "Problem deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

export default router;
