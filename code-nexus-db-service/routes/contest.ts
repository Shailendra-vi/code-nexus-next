import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = express.Router();
const prisma: PrismaClient = new PrismaClient();

// Create Contest
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, start_time, end_time, duration } = req.body;

    if (!title || !description || !start_time || !end_time) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = (req as any).user;
    const userId = user.id;
    if (!userId || user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const contest = await prisma.contests.create({
      data: {
        title,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        duration,
        created_by: userId,
      },
    });

    return res.status(201).json({ contest });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Get all contests created by the admin user
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const currentTime = new Date();
    let contests;
    if (user.role === "ADMIN") {
      contests = await prisma.contests.findMany({
        where: { created_by: userId },
        orderBy: { date_created: "desc" },
      });
    } else {
      contests = await prisma.contests.findMany({
        where: {
          start_time: { gte: currentTime },
        },
        orderBy: { start_time: "asc" },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    }

    return res.status(200).json({ contests });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Get contest by id
router.get(
  "/:contest_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { contest_id } = req.params;
      const contest = await prisma.contests.findUnique({
        where: { id: contest_id },
      });
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      return res.status(200).json({ contest });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// Update contest by id
router.put(
  "/:contest_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { contest_id } = req.params;
      const { title, description, start_time, end_time, duration } = req.body;

      if (!title || !description || !start_time || !end_time) {
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

      const updatedContest = await prisma.contests.update({
        where: { id: contest_id },
        data: {
          title,
          description,
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          duration,
        },
      });
      return res.status(200).json({ contest: updatedContest });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

router.delete(
  "/:contest_id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { contest_id } = req.params;
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

      await prisma.testCases.deleteMany({
        where: { contest_id },
      });

      await prisma.submission.deleteMany({
        where: { contest_id },
      });

      await prisma.problem.deleteMany({
        where: { contest_id },
      });

      await prisma.contests.delete({
        where: { id: contest_id },
      });
      return res.status(200).json({ message: "Contest deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

export default router;
