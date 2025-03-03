import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

router.post(
  "/:problem_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { problem_id } = req.params;
      const { input, output } = req.body;
        
      if (!input || !output) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const user = (req as any).user;
      const userId = user.id;
      if (!userId || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      // Retrieve the problem to get its associated contest
      const problem = await prisma.problem.findUnique({
        where: { id: problem_id, created_by: userId },
      });
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      const testCase = await prisma.testCases.create({
        data: {
          input,
          output,
          contest_id: problem.contest_id,
          problem_id,
          created_by: userId,
        },
      });

      return res.status(201).json({ testCase });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Get all testcases related to a problem
router.get(
  "/:problem_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { problem_id } = req.params;
      const problem = await prisma.problem.findUnique({
        where: { id: problem_id },
      });
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      const testCases = await prisma.testCases.findMany({
        where: { problem_id },
      });

      return res.status(200).json({ testCases });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.put(
  "/:testcase_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { testcase_id } = req.params;
      const { input, output } = req.body;

      if (!input || !output) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const user = (req as any).user;
      const userId = user.id;
      if (!userId || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const testCase = await prisma.testCases.findUnique({
        where: { id: testcase_id, created_by: userId },
      });
      if (!testCase) {
        return res.status(404).json({ message: "Testcase not found" });
      }

      const updatedTestCase = await prisma.testCases.update({
        where: { id: testcase_id },
        data: { input, output },
      });

      return res.status(200).json({ testCase: updatedTestCase });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.delete(
  "/:testcase_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { testcase_id } = req.params;
      const user = (req as any).user;
      const userId = user.id;
      if (!userId || user.role !== "ADMIN") {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const testCase = await prisma.testCases.findUnique({
        where: { id: testcase_id, created_by: userId },
      });
      if (!testCase) {
        return res.status(404).json({ message: "Testcase not found" });
      }

      await prisma.testCases.delete({
        where: { id: testcase_id },
      });

      return res.status(200).json({ message: "Testcase deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

export default router;
