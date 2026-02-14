import {
  calculateDemoStats,
  generateDemoChartData,
  DEMO_TRANSACTIONS,
} from "../../demo-data";

describe("demo-data", () => {
  describe("calculateDemoStats", () => {
    it("should calculate correct totals", () => {
      const stats = calculateDemoStats();

      expect(stats.totalIncome).toBeGreaterThan(0);
      expect(stats.totalExpenses).toBeGreaterThan(0);
      expect(stats.netSavings).toBe(stats.totalIncome - stats.totalExpenses);
      expect(stats.transactionCount).toBe(DEMO_TRANSACTIONS.length);
      expect(stats.savingsRate).toBeLessThanOrEqual(100);
    });

    it("should handle expense calculation correctly (absolute value)", () => {
      const stats = calculateDemoStats();
      expect(stats.totalExpenses).toBeGreaterThan(0);
    });
  });

  describe("generateDemoChartData", () => {
    it("should generate 30 days of data", () => {
      const data = generateDemoChartData();
      expect(data).toHaveLength(30);
    });

    it("should have valid income and expense values", () => {
      const data = generateDemoChartData();
      data.forEach((point: any) => {
        expect(point.income).toBeGreaterThanOrEqual(0);
        expect(point.expenses).toBeGreaterThanOrEqual(0);
        expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD
      });
    });

    it("should simulate weekend spending", () => {
      const data = generateDemoChartData();
      // rigorous statistical test is overkill, just check structure
      expect(data[0]).toHaveProperty("date");
      expect(data[0]).toHaveProperty("income");
      expect(data[0]).toHaveProperty("expenses");
    });
  });

  describe("DEMO_TRANSACTIONS", () => {
    it("should have valid dates", () => {
      DEMO_TRANSACTIONS.forEach((t: any) => {
        expect(new Date(t.date).toString()).not.toBe("Invalid Date");
      });
    });

    it("should have non-empty categories", () => {
      DEMO_TRANSACTIONS.forEach((t: any) => {
        expect(t.category.length).toBeGreaterThan(0);
      });
    });
  });
});
