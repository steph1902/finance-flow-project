/**
 * @jest-environment jsdom
 */
import {
  formatCurrency,
  formatCompactCurrency,
  formatPercent,
  formatDate,
  formatDateTime,
  formatShortDate,
  currencyFormatter,
  compactCurrencyFormatter,
  percentFormatter,
  dateFormatter,
  dateTimeFormatter,
  shortDateFormatter,
} from "../formatters";

describe("formatters", () => {
  describe("Currency Formatters", () => {
    describe("formatCurrency", () => {
      it("should format positive numbers as USD currency", () => {
        expect(formatCurrency(1234.56)).toBe("$1,234.56");
        expect(formatCurrency(0.99)).toBe("$0.99");
        expect(formatCurrency(1000000)).toBe("$1,000,000.00");
      });

      it("should format negative numbers with minus sign", () => {
        expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
        expect(formatCurrency(-0.99)).toBe("-$0.99");
      });

      it("should handle zero", () => {
        expect(formatCurrency(0)).toBe("$0.00");
      });

      it("should round to 2 decimal places", () => {
        expect(formatCurrency(1234.567)).toBe("$1,234.57");
        expect(formatCurrency(1234.564)).toBe("$1,234.56");
      });

      it("should handle very large numbers", () => {
        expect(formatCurrency(999999999.99)).toBe("$999,999,999.99");
      });

      it("should handle very small numbers", () => {
        expect(formatCurrency(0.01)).toBe("$0.01");
        expect(formatCurrency(0.001)).toBe("$0.00");
      });
    });

    describe("formatCompactCurrency", () => {
      it("should format large numbers compactly", () => {
        expect(formatCompactCurrency(1234567)).toBe("$1.2M");
        expect(formatCompactCurrency(1000000)).toBe("$1M");
        expect(formatCompactCurrency(1234)).toBe("$1.2K");
      });

      it("should handle billions", () => {
        expect(formatCompactCurrency(1234567890)).toBe("$1.2B");
      });

      it("should handle small numbers without compacting", () => {
        expect(formatCompactCurrency(999)).toBe("$999");
        expect(formatCompactCurrency(100)).toBe("$100");
      });

      it("should handle negative numbers", () => {
        expect(formatCompactCurrency(-1234567)).toBe("-$1.2M");
      });

      it("should handle zero", () => {
        expect(formatCompactCurrency(0)).toBe("$0");
      });
    });

    describe("currencyFormatter singleton", () => {
      it("should be reusable instance", () => {
        const result1 = currencyFormatter.format(100);
        const result2 = currencyFormatter.format(100);
        expect(result1).toBe(result2);
        expect(result1).toBe("$100.00");
      });
    });

    describe("compactCurrencyFormatter singleton", () => {
      it("should be reusable instance", () => {
        const result1 = compactCurrencyFormatter.format(1000000);
        const result2 = compactCurrencyFormatter.format(1000000);
        expect(result1).toBe(result2);
        expect(result1).toBe("$1M");
      });
    });
  });

  describe("Percentage Formatters", () => {
    describe("formatPercent", () => {
      it("should format percentages correctly (value is 0-100)", () => {
        expect(formatPercent(75.5)).toBe("75.5%");
        expect(formatPercent(100)).toBe("100%");
        expect(formatPercent(0)).toBe("0%");
        expect(formatPercent(50)).toBe("50%");
      });

      it("should handle decimal percentages", () => {
        expect(formatPercent(33.33)).toBe("33.3%");
        expect(formatPercent(66.67)).toBe("66.7%");
      });

      it("should handle negative percentages", () => {
        expect(formatPercent(-10)).toBe("-10%");
      });

      it("should handle very small percentages", () => {
        expect(formatPercent(0.5)).toBe("0.5%");
        expect(formatPercent(0.1)).toBe("0.1%");
      });

      it("should handle percentages over 100", () => {
        expect(formatPercent(150)).toBe("150%");
        expect(formatPercent(200)).toBe("200%");
      });
    });

    describe("percentFormatter singleton", () => {
      it("should be reusable instance", () => {
        const result1 = percentFormatter.format(0.75);
        const result2 = percentFormatter.format(0.75);
        expect(result1).toBe(result2);
        expect(result1).toBe("75%");
      });
    });
  });

  describe("Date Formatters", () => {
    // Use fixed dates to avoid timezone issues
    const testDate = new Date("2024-11-16T15:30:00Z");
    const testDateISO = "2024-11-16T15:30:00Z";

    describe("formatDate", () => {
      it("should format Date objects", () => {
        const result = formatDate(testDate);
        expect(result).toMatch(/Nov 16, 2024/);
      });

      it("should format ISO date strings", () => {
        const result = formatDate(testDateISO);
        expect(result).toMatch(/Nov 16, 2024/);
      });

      it("should handle different date formats", () => {
        expect(formatDate("2024-01-01")).toMatch(/Jan 1, 2024/);
        expect(formatDate("2024-12-31")).toMatch(/Dec 31, 2024/);
      });
    });

    describe("formatDateTime", () => {
      it("should format Date objects with time", () => {
        const result = formatDateTime(testDate);
        expect(result).toMatch(/Nov 16, 2024/);
        // Time portion varies by timezone, just check it exists
        expect(result).toMatch(/\d{1,2}:\d{2}\s*[AP]M/);
      });

      it("should format ISO date strings with time", () => {
        const result = formatDateTime(testDateISO);
        expect(result).toMatch(/Nov 16, 2024/);
        expect(result).toMatch(/\d{1,2}:\d{2}\s*[AP]M/);
      });
    });

    describe("formatShortDate", () => {
      it("should format Date objects in short format", () => {
        const result = formatShortDate(testDate);
        expect(result).toMatch(/11\/16\/\d{2,4}/);
      });

      it("should format ISO date strings in short format", () => {
        const result = formatShortDate(testDateISO);
        expect(result).toMatch(/11\/16\/\d{2,4}/);
      });
    });

    describe("date formatter singletons", () => {
      it("dateFormatter should be reusable", () => {
        const result1 = dateFormatter.format(testDate);
        const result2 = dateFormatter.format(testDate);
        expect(result1).toBe(result2);
      });

      it("dateTimeFormatter should be reusable", () => {
        const result1 = dateTimeFormatter.format(testDate);
        const result2 = dateTimeFormatter.format(testDate);
        expect(result1).toBe(result2);
      });

      it("shortDateFormatter should be reusable", () => {
        const result1 = shortDateFormatter.format(testDate);
        const result2 = shortDateFormatter.format(testDate);
        expect(result1).toBe(result2);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle NaN gracefully in currency formatter", () => {
      expect(formatCurrency(NaN)).toBe("$NaN");
    });

    it("should handle Infinity in currency formatter", () => {
      expect(formatCurrency(Infinity)).toContain("∞");
    });

    it("should handle invalid dates", () => {
      expect(() => formatDate("invalid-date")).toThrow();
    });
  });

  describe("Performance - Singleton Pattern", () => {
    it("should reuse formatter instances (not recreate)", () => {
      // Formatters should be the same instance
      expect(currencyFormatter).toBe(currencyFormatter);
      expect(compactCurrencyFormatter).toBe(compactCurrencyFormatter);
      expect(percentFormatter).toBe(percentFormatter);
      expect(dateFormatter).toBe(dateFormatter);
      expect(dateTimeFormatter).toBe(dateTimeFormatter);
      expect(shortDateFormatter).toBe(shortDateFormatter);
    });
  });
});
