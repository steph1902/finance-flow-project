import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  calculateActualSpending,
  analyzeVariance,
  BudgetOptimizerService,
} from "../budget-optimizer-service";
import { GeminiClient } from "../gemini-client";

// Mock logger
jest.mock("@/lib/logger", () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

// Mock GeminiClient
jest.mock("../gemini-client", () => {
  return {
    GeminiClient: jest.fn().mockImplementation(() => ({
      generateObject: jest.fn(),
    })),
    geminiClient: {
      generateObject: jest.fn(),
    },
  };
});

describe("budget-optimizer-service", () => {
  describe("calculateActualSpending", () => {
    it("should calculate average spending per category", () => {
      const transactions = [
        {
          amount: 100,
          category: "Food",
          date: new Date("2024-01-15"),
        },
        {
          amount: 50,
          category: "Food",
          date: new Date("2024-02-15"),
        },
        {
          amount: 30,
          category: "Transport",
          date: new Date("2024-01-20"),
        },
        // Mocks for transaction interface not strictly needed if we pass objects matching what function needs
      ] as any[];

      const result = calculateActualSpending(transactions, 2);

      expect(result.get("Food")).toBe(75); // (100 + 50) / 2 months
      expect(result.get("Transport")).toBe(15); // 30 / 2 months
    });

    it("should handle empty transactions", () => {
      const result = calculateActualSpending([], 3);
      expect(result.size).toBe(0);
    });

    it("should handle single month", () => {
      const transactions = [
        {
          amount: 100,
          category: "Food",
          date: new Date(),
        },
      ] as any[];

      const result = calculateActualSpending(transactions, 1);
      expect(result.get("Food")).toBe(100);
    });
  });

  describe("analyzeVariance", () => {
    it("should categorize budgets as over/under/balanced", () => {
      const budgets = [
        { category: "Food", amount: 100 },
        { category: "Transport", amount: 50 },
        { category: "Entertainment", amount: 100 },
      ] as any[];

      const actualSpending = new Map<string, number>([
        ["Food", 150], // 50% over budget
        ["Transport", 25], // 50% under budget
        ["Entertainment", 95], // 5% under (balanced)
      ]);

      const result = analyzeVariance(budgets, actualSpending);

      expect(result.overBudget).toHaveLength(1);
      expect(result.overBudget[0].category).toBe("Food");
      expect(result.overBudget[0].variance).toBe(50);

      expect(result.underBudget).toHaveLength(1);
      expect(result.underBudget[0].category).toBe("Transport");
      expect(result.underBudget[0].variance).toBe(-25);

      expect(result.balanced).toHaveLength(1);
      expect(result.balanced[0].category).toBe("Entertainment");
    });

    it("should handle categories with no spending", () => {
      const budgets = [{ category: "Food", amount: 100 }] as any[];
      const actualSpending = new Map<string, number>(); // No spending

      const result = analyzeVariance(budgets, actualSpending);

      expect(result.underBudget).toHaveLength(1);
      expect(result.underBudget[0].actual).toBe(0);
    });
  });

  describe("optimizeBudgets", () => {
    let service: BudgetOptimizerService;
    let mockGenerateObject: jest.Mock<any>;
    let mockClient: any;

    beforeEach(() => {
      mockGenerateObject = jest.fn() as any;
      mockClient = {
        generateObject: mockGenerateObject,
      };
      service = new BudgetOptimizerService(mockClient as any);
    });

    it("should generate optimization suggestions using AI", async () => {
      const budgets = [
        { category: "Food", amount: 100, id: "1", month: 1, year: 2024 },
      ] as any[];
      const transactions = [
        { category: "Food", amount: 150, date: new Date() },
      ] as any[];

      const mockResponse = {
        suggestions: [
          {
            fromCategory: "Food",
            toCategory: "Transport",
            amount: 20,
            reason: "Overspending on food",
            impact: "Reduce variance",
            priority: "high",
          },
        ],
        insights: ["Eat less"],
        confidence: 0.9,
      };

      mockGenerateObject.mockResolvedValue(mockResponse);

      const result = await service.optimizeBudgets({
        budgets,
        transactions,
        months: 1,
        userId: "user1",
      });

      expect(result.suggestions).toEqual(mockResponse.suggestions);
      expect(result.insights).toEqual(mockResponse.insights);
      expect(result.totalSavings).toBe(20);
      expect(mockGenerateObject).toHaveBeenCalled();
    });

    it("should throw error on AI failure", async () => {
      mockGenerateObject.mockRejectedValue(new Error("AI Failed"));

      await expect(
        service.optimizeBudgets({
          budgets: [],
          transactions: [],
          months: 1,
          userId: "user1",
        }),
      ).rejects.toThrow("Failed to optimize budgets");
    });
  });
});
