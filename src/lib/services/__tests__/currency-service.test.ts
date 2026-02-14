import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import * as currencyService from "../currency-service";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Mock dependencies
const mockPrisma = {
  user: {
    update: jest.fn(),
  },
};

(global as any).prisma = mockPrisma;

jest.mock("@/lib/logger", () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

describe("Currency Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("formatCurrency", () => {
    it("should format USD correctly", () => {
      expect(currencyService.formatCurrency(1000, "USD")).toContain(
        "$1,000.00",
      );
    });

    it("should format EUR correctly", () => {
      // Intl format depends on locale/node version but usually contains symbol
      const result = currencyService.formatCurrency(1000, "EUR");
      expect(result).toMatch(/€\s?1,000\.00|1.000,00\s?€/);
    });
  });

  describe("getCurrencySymbol", () => {
    it("should return correct symbols", () => {
      expect(currencyService.getCurrencySymbol("USD")).toBe("$");
      expect(currencyService.getCurrencySymbol("EUR")).toBe("€");
      expect(currencyService.getCurrencySymbol("JPY")).toBe("¥");
    });
  });

  describe("updateUserCurrency", () => {
    it("should update user currency", async () => {
      (prisma.user.update as unknown as any).mockResolvedValue({
        id: "u1",
        preferredCurrency: "EUR",
      });

      await currencyService.updateUserCurrency("u1", "EUR");

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "u1" },
        data: { preferredCurrency: "EUR" },
      });
    });

    it("should throw on error", async () => {
      (prisma.user.update as unknown as any).mockRejectedValue(
        new Error("DB Error"),
      );

      await expect(
        currencyService.updateUserCurrency("u1", "EUR"),
      ).rejects.toThrow("Failed to update currency preference");
    });
  });

  describe("configuration", () => {
    it("should have supported currencies", () => {
      expect(currencyService.SUPPORTED_CURRENCIES).toContain("USD");
      expect(currencyService.SUPPORTED_CURRENCIES).toContain("EUR");
      expect(currencyService.CURRENCIES.length).toBeGreaterThan(0);
    });
  });
});
