import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import * as recurringService from "../recurring-transaction-service";
import { prisma } from "@/lib/prisma";

// Mock dependencies
const mockPrisma = {
  recurringTransaction: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((callback: any) => callback(mockPrisma)),
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

describe("Recurring Transaction Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("calculateNextDate", () => {
    it("should calculate next date correctly", () => {
      const baseDate = new Date("2024-01-01T00:00:00Z");
      expect(
        recurringService.calculateNextDate(baseDate, "DAILY").toISOString(),
      ).toContain("2024-01-02");
      expect(
        recurringService.calculateNextDate(baseDate, "WEEKLY").toISOString(),
      ).toContain("2024-01-08");
      expect(
        recurringService.calculateNextDate(baseDate, "BIWEEKLY").toISOString(),
      ).toContain("2024-01-15");
      expect(
        recurringService.calculateNextDate(baseDate, "MONTHLY").toISOString(),
      ).toContain("2024-02-01");
      expect(
        recurringService.calculateNextDate(baseDate, "QUARTERLY").toISOString(),
      ).toContain("2024-04-01");
      expect(
        recurringService.calculateNextDate(baseDate, "YEARLY").toISOString(),
      ).toContain("2025-01-01");
    });
  });

  describe("createRecurringTransaction", () => {
    it("should create a recurring transaction", async () => {
      const input = {
        amount: 100,
        type: "EXPENSE" as const,
        category: "Rent",
        frequency: "MONTHLY" as const,
        startDate: new Date("2024-01-01T00:00:00Z"),
        isActive: true,
        nextDate: new Date("2024-02-01"),
      };

      const mockTx = {
        id: "rt-1",
        ...input,
        nextDate: new Date("2024-02-01"),
        isActive: true,
        userId: "user-1",
        description: null,
        notes: null,
        endDate: null,
      };
      (prisma.recurringTransaction.create as unknown as any).mockResolvedValue(
        mockTx,
      );

      const result = await recurringService.createRecurringTransaction(
        "user-1",
        input,
      );

      expect(result).toEqual(mockTx);
      expect(prisma.recurringTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            frequency: "MONTHLY",
            nextDate: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe("updateRecurringTransaction", () => {
    it("should update if found", async () => {
      (
        prisma.recurringTransaction.findFirst as unknown as any
      ).mockResolvedValue({ id: "rt-1" });
      (prisma.recurringTransaction.update as unknown as any).mockResolvedValue({
        id: "rt-1",
        amount: 200,
      });

      const result = await recurringService.updateRecurringTransaction(
        "user-1",
        "rt-1",
        { amount: 200 },
      );

      expect(result.amount).toBe(200);
      expect(prisma.recurringTransaction.update).toHaveBeenCalled();
    });

    it("should throw if not found", async () => {
      (
        prisma.recurringTransaction.findFirst as unknown as any
      ).mockResolvedValue(null);
      await expect(
        recurringService.updateRecurringTransaction("user-1", "rt-1", {
          amount: 200,
        }),
      ).rejects.toThrow("Recurring transaction not found");
    });
  });

  describe("deleteRecurringTransaction", () => {
    it("should delete if found", async () => {
      (
        prisma.recurringTransaction.deleteMany as unknown as any
      ).mockResolvedValue({ count: 1 });

      await recurringService.deleteRecurringTransaction("user-1", "rt-1");

      expect(prisma.recurringTransaction.deleteMany).toHaveBeenCalled();
    });

    it("should throw if not found", async () => {
      (
        prisma.recurringTransaction.deleteMany as unknown as any
      ).mockResolvedValue({ count: 0 });
      await expect(
        recurringService.deleteRecurringTransaction("user-1", "rt-1"),
      ).rejects.toThrow("Recurring transaction not found");
    });
  });
});
