import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import * as transactionService from "../transaction-service";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Mock Prisma
const mockPrisma = {
  transaction: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((promises: any[]) => Promise.all(promises)),
};

(global as any).prisma = mockPrisma;

describe("Transaction Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTransactions", () => {
    it("should return paginated transactions", async () => {
      const mockTx = [{ id: "tx-1", amount: 100 }];
      const mockCount = 1;

      (prisma.transaction.findMany as unknown as any).mockResolvedValue(mockTx);
      (prisma.transaction.count as unknown as any).mockResolvedValue(mockCount);

      const result = await transactionService.getTransactions("user-1", {
        page: 1,
        limit: 10,
        sort: "date",
        order: "desc",
      });

      expect(result.data).toEqual(mockTx);
      expect(result.meta.total).toBe(1);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: "user-1" }),
          take: 10,
          skip: 0,
        }),
      );
    });

    it("should apply filters", async () => {
      (prisma.transaction.findMany as unknown as any).mockResolvedValue([]);
      (prisma.transaction.count as unknown as any).mockResolvedValue(0);

      await transactionService.getTransactions("user-1", {
        page: 1,
        limit: 10,
        type: "EXPENSE",
        category: "Food",
        search: "Coffee",
        sort: "date",
        order: "desc",
      });

      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: "EXPENSE",
            category: "Food",
            OR: expect.arrayContaining([
              { description: { contains: "Coffee", mode: "insensitive" } },
            ]),
          }),
        }),
      );
    });

    it("should handle errors", async () => {
      (prisma.transaction.findMany as unknown as any).mockRejectedValue(
        new Error("DB Error"),
      );
      await expect(
        transactionService.getTransactions("user-1", {
          page: 1,
          limit: 10,
          sort: "date",
          order: "desc",
        }),
      ).rejects.toThrow("Failed to fetch transactions");
    });
  });

  describe("createTransaction", () => {
    it("should create a transaction", async () => {
      const input = {
        amount: 100,
        date: new Date(),
        type: "EXPENSE" as const,
        category: "Food",
        description: "Lunch",
      };

      const mockTx = { id: "tx-1", ...input };
      (prisma.transaction.create as unknown as any).mockResolvedValue(mockTx);

      const result = await transactionService.createTransaction(
        "user-1",
        input,
      );

      expect(result).toEqual(mockTx);
      expect(prisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            amount: new Prisma.Decimal(100),
          }),
        }),
      );
    });

    it("should handle creation errors", async () => {
      (prisma.transaction.create as unknown as any).mockRejectedValue(
        new Error("DB Error"),
      );
      await expect(
        transactionService.createTransaction("user-1", {
          amount: 100,
          date: new Date(),
          type: "EXPENSE",
          category: "Food",
        }),
      ).rejects.toThrow("Failed to create transaction");
    });
  });

  describe("getTransaction", () => {
    it("should return transaction if found", async () => {
      const mockTx = { id: "tx-1" };
      (prisma.transaction.findFirst as unknown as any).mockResolvedValue(
        mockTx,
      );

      const result = await transactionService.getTransaction("user-1", "tx-1");
      expect(result).toEqual(mockTx);
    });

    it("should return null if not found", async () => {
      (prisma.transaction.findFirst as unknown as any).mockResolvedValue(null);
      const result = await transactionService.getTransaction("user-1", "tx-1");
      expect(result).toBeNull();
    });
  });

  describe("updateTransaction", () => {
    it("should update transaction if found", async () => {
      (prisma.transaction.findFirst as unknown as any).mockResolvedValue({
        id: "tx-1",
      });
      (prisma.transaction.update as unknown as any).mockResolvedValue({
        id: "tx-1",
        amount: 200,
      });

      const result = await transactionService.updateTransaction(
        "user-1",
        "tx-1",
        { amount: 200 },
      );

      expect(result.amount).toBe(200);
      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "tx-1" },
          data: expect.objectContaining({ amount: new Prisma.Decimal(200) }),
        }),
      );
    });

    it("should throw if not found", async () => {
      (prisma.transaction.findFirst as unknown as any).mockResolvedValue(null);
      await expect(
        transactionService.updateTransaction("user-1", "tx-1", {}),
      ).rejects.toThrow("Transaction not found");
    });
  });

  describe("deleteTransaction", () => {
    it("should soft delete transaction", async () => {
      (prisma.transaction.findFirst as unknown as any).mockResolvedValue({
        id: "tx-1",
      });
      (prisma.transaction.update as unknown as any).mockResolvedValue({});

      await transactionService.deleteTransaction("user-1", "tx-1");

      expect(prisma.transaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "tx-1" },
          data: { deletedAt: expect.any(Date) },
        }),
      );
    });

    it("should throw if not found", async () => {
      (prisma.transaction.findFirst as unknown as any).mockResolvedValue(null);
      await expect(
        transactionService.deleteTransaction("user-1", "tx-1"),
      ).rejects.toThrow("Transaction not found");
    });
  });
});
