import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  ForecastService,
  ForecastInput,
  Transaction,
  RecurringTransaction,
} from "../forecast-service";

// Mock dependencies
const mockGenerateObject = jest.fn<any>();
const mockGeminiClient = {
  generateObject: mockGenerateObject,
};
const mockClientFactory = (jest.fn() as any).mockResolvedValue(
  mockGeminiClient,
);

describe("ForecastService", () => {
  let forecastService: ForecastService;

  const mockTransactions: Transaction[] = [
    {
      amount: 100,
      category: "Food",
      type: "EXPENSE",
      date: new Date(),
      description: "Groceries",
    },
    {
      amount: 50,
      category: "Transport",
      type: "EXPENSE",
      date: new Date(),
      description: "Uber",
    },
    {
      amount: 100,
      category: "Food",
      type: "EXPENSE",
      date: new Date(),
      description: "Groceries 2",
    },
    {
      amount: 2000,
      category: "Salary",
      type: "INCOME",
      date: new Date(),
      description: "Paycheck",
    },
  ];

  const mockRecurring: RecurringTransaction[] = [
    {
      amount: 1000,
      category: "Rent",
      type: "EXPENSE",
      frequency: "MONTHLY",
      description: "Rent",
    },
  ];

  const mockInput: ForecastInput = {
    transactions: mockTransactions,
    recurringTransactions: mockRecurring,
    months: 3,
    userId: "user-1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    forecastService = new ForecastService(mockClientFactory as any);
  });

  it("should generate forecast with AI insights", async () => {
    const mockAiResponse = {
      categoryExplanations: {
        Food: "Stable food spending",
        Transport: "Occasional transport",
        Rent: "Fixed rent",
      },
      insights: ["Spend less on food"],
      confidence: 0.9,
      methodology: "AI Analysis",
    };

    mockGenerateObject.mockResolvedValue(mockAiResponse);

    const result = await forecastService.generateForecast(mockInput);

    expect(result.months).toHaveLength(3);
    expect(result.insights).toEqual(["Spend less on food"]);
    expect(result.confidence).toBe(0.9);
    expect(mockClientFactory).toHaveBeenCalledWith("user-1");
    expect(mockGenerateObject).toHaveBeenCalled();

    // Check calculation logic
    // Food: 200 total / 2 count = 100 avg
    // Transport: 50 total / 1 count = 50 avg
    // Rent: 1000 monthly
    // Total Expense Projection = 100 + 50 + 1000 = 1150
    const firstMonth = result.months[0];
    const food = firstMonth.categories.find((c) => c.category === "Food");
    const rent = firstMonth.categories.find((c) => c.category === "Rent");

    expect(food?.projected).toBe(100);
    expect(rent?.projected).toBe(1000);
    expect(firstMonth.totalExpense).toBe(1150);
  });

  it("should fallback to basic forecast if AI fails", async () => {
    mockGenerateObject.mockRejectedValue(new Error("AI Error"));

    const result = await forecastService.generateForecast(mockInput);

    expect(result.months).toHaveLength(3);
    expect(result.confidence).toBeDefined();
    // Fallback insights should be generic
    expect(result.insights[0]).toContain("Forecast based on historical");

    // Calculations should still be correct
    const firstMonth = result.months[0];
    expect(firstMonth.totalExpense).toBe(1150);
  });

  it("should handle empty data gracefully", async () => {
    const emptyInput: ForecastInput = {
      transactions: [],
      recurringTransactions: [],
      months: 3,
      userId: "user-1",
    };

    const result = await forecastService.generateForecast(emptyInput);

    expect(result.months).toHaveLength(0);
    expect(result.totalProjected).toBe(0);
    expect(result.insights[0]).toContain("No transaction data available");
  });
});
