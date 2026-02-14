import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { CategorizationService } from "../categorization-service";
import {
  categorizationResponseSchema,
  TransactionInput,
} from "../prompts/categorization";
import { GeminiClient } from "../gemini-client";

// Mock getGeminiClient
jest.mock("../gemini-client", () => ({
  __esModule: true,
  getGeminiClient: jest.fn(),
  GeminiClient: jest.fn(),
}));

// Use require to ensure we get the mock
const { getGeminiClient } = require("../gemini-client");

// Mock logger
jest.mock("@/lib/logger", () => ({
  logError: jest.fn(),
}));

describe("CategorizationService", () => {
  let service: CategorizationService;
  let mockGenerateObject: jest.Mock<any>;
  let mockFactory: jest.Mock<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategorizationService();

    // Setup mock Gemini Client
    mockGenerateObject = jest.fn() as any;
    mockFactory = (jest.fn() as any).mockResolvedValue({
      generateObject: mockGenerateObject,
    });

    // Inject mock factory
    const mockDb = {
      aISuggestion: {
        create: jest.fn(),
        update: jest.fn(),
      },
      $executeRaw: jest.fn(),
    };
    service = new CategorizationService(mockFactory as any, mockDb as any);
  });

  const mockInput: TransactionInput = {
    description: "Starbucks Coffee",
    amount: 5.5,
    type: "expense",
    merchant: "Starbucks",
    date: "2023-10-27",
  };

  it("should categorize transaction using AI", async () => {
    const mockResponse = {
      category: "Food & Dining",
      subcategory: "Coffee Shops",
      confidence: 0.95,
      reasoning: "Merchant is a known coffee shop",
    };

    mockGenerateObject.mockResolvedValue(mockResponse);

    const result = await service.categorizeTransaction(mockInput, "user-1");

    // Debug logging
    if (result.confidence !== 0.95) {
      // Did we hit fallback?
      const { logError } = require("@/lib/logger");
      if (logError.mock.calls.length > 0) {
        console.error("Categorization failed with:", logError.mock.calls[0]);
      }
    }

    expect(result).toEqual(mockResponse);
    expect(mockFactory).toHaveBeenCalledWith("user-1");
    expect(mockGenerateObject).toHaveBeenCalledWith(
      expect.stringContaining("Starbucks"),
      expect.any(String),
      expect.anything(), // Schema
    );
  });

  it("should fallback to rule-based categorization on AI failure", async () => {
    mockGenerateObject.mockRejectedValue(new Error("AI Failed"));

    const result = await service.categorizeTransaction(mockInput, "user-1");

    expect(result.category).toBe("Food & Dining");
    expect(result.subcategory).toBe("Coffee & Cafes"); // From fallback rule
    expect(result.reasoning).toContain("Fallback");
  });

  it("should handle completely unknown transactions in fallback", async () => {
    mockGenerateObject.mockRejectedValue(new Error("AI Failed"));

    const unknownInput: TransactionInput = {
      ...mockInput,
      description: "Unknown Thing XYZ",
      merchant: "Unknown",
    };

    const result = await service.categorizeTransaction(unknownInput, "user-1");

    expect(result.category).toBe("Other");
    expect(result.confidence).toBeLessThan(0.5);
  });
});
