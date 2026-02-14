import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import * as goalService from "../goal-service";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger";

// Mock dependencies
const mockPrisma = {
  goal: {
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  goalMilestone: {
    create: jest.fn(),
    update: jest.fn(),
  },
  goalContribution: {
    create: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
};

(global as any).prisma = mockPrisma;

jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("Goal Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createGoal", () => {
    it("should create a goal and milestones", async () => {
      const input = {
        userId: "user-1",
        name: "New Car",
        targetAmount: 10000,
        category: "Savings",
      };

      const mockGoal = {
        id: "goal-1",
        ...input,
        milestones: [],
        contributions: [],
      };
      (prisma.goal.create as unknown as any).mockResolvedValue(mockGoal);

      const result = await goalService.createGoal(input);

      expect(result).toEqual(mockGoal);
      expect(prisma.goal.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            user: { connect: { id: "user-1" } },
            name: "New Car",
            targetAmount: new Prisma.Decimal(10000),
          }),
        }),
      );

      // Check auto-milestones
      expect(prisma.goalMilestone.create).toHaveBeenCalledTimes(4); // 25, 50, 75, 100%
    });

    it("should handle creation errors", async () => {
      (prisma.goal.create as unknown as any).mockRejectedValue(
        new Error("DB Error"),
      );
      await expect(
        goalService.createGoal({
          userId: "u1",
          name: "G",
          targetAmount: 100,
        }),
      ).rejects.toThrow("Failed to create goal");
    });
  });

  describe("updateGoal", () => {
    it("should update goal if found and authorized", async () => {
      (prisma.goal.updateMany as unknown as any).mockResolvedValue({
        count: 1,
      });

      await goalService.updateGoal("goal-1", "user-1", {
        name: "Updated Name",
      });

      expect(prisma.goal.updateMany).toHaveBeenCalledWith({
        where: { id: "goal-1", userId: "user-1" },
        data: expect.objectContaining({ name: "Updated Name" }),
      });
    });

    it("should throw if goal not found", async () => {
      (prisma.goal.updateMany as unknown as any).mockResolvedValue({
        count: 0,
      });
      await expect(
        goalService.updateGoal("goal-1", "user-1", { name: "U" }),
      ).rejects.toThrow("Failed to update goal");
      // Ideally check for specific "Goal not found" if thrown, but service wraps it generic
    });
  });

  describe("addContribution", () => {
    it("should add contribution and update progress", async () => {
      const mockGoal = {
        id: "goal-1",
        name: "Car",
        currentAmount: new Prisma.Decimal(500),
        targetAmount: new Prisma.Decimal(1000),
        milestones: [
          {
            id: "m1",
            amount: new Prisma.Decimal(1000),
            achievedAt: null,
            description: "100% milestone",
          },
        ],
      };

      (prisma.goal.findFirst as unknown as any).mockResolvedValue(mockGoal);
      (prisma.goalContribution.create as unknown as any).mockResolvedValue({});
      (prisma.goal.update as unknown as any).mockResolvedValue({});
      (prisma.goalMilestone.update as unknown as any).mockResolvedValue({});

      await goalService.addContribution(
        { goalId: "goal-1", amount: 500 },
        "user-1",
      );

      // Check contribution creation
      expect(prisma.goalContribution.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: new Prisma.Decimal(500) }),
        }),
      );

      // Check goal update (total 500 + 500 = 1000)
      expect(prisma.goal.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "goal-1" },
          data: expect.objectContaining({
            currentAmount: new Prisma.Decimal(1000),
            status: "COMPLETED", // Reached target
          }),
        }),
      );

      // Check milestone achievement
      expect(prisma.goalMilestone.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "m1" },
          data: { achievedAt: expect.any(Date) },
        }),
      );

      // Check notification
      expect(prisma.notification.create).toHaveBeenCalled();
    });
  });

  describe("getGoalProgress", () => {
    it("should calculate progress metrics correctly", async () => {
      const mockGoal = {
        id: "goal-1",
        name: "Car",
        currentAmount: new Prisma.Decimal(250),
        targetAmount: new Prisma.Decimal(1000),
        targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days away
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        milestones: [],
      };
      (prisma.goal.findFirst as unknown as any).mockResolvedValue(mockGoal);

      const result = await goalService.getGoalProgress("goal-1", "user-1");

      expect(result.currentAmount).toBe(250);
      expect(result.targetAmount).toBe(1000);
      expect(result.progressPercentage).toBe(25);
      expect(result.daysRemaining).toBeCloseTo(10, 0); // Approx 10 days
    });
  });
});
