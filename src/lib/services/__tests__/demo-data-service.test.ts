import { describe, it, expect } from "@jest/globals";
import { DemoDataService } from "../demo-data.service";

describe("DemoDataService", () => {
  describe("generateTransactions", () => {
    it("should generate requested number of transactions", () => {
      const count = 10;
      const transactions = DemoDataService.generateTransactions(
        count,
        "user-1",
      );
      expect(transactions).toHaveLength(count);
    });

    it("should have correct structure", () => {
      const transactions = DemoDataService.generateTransactions(1, "user-1");
      const tx = transactions[0];

      expect(tx).toHaveProperty("userId", "user-1");
      expect(tx).toHaveProperty("amount");
      expect(tx).toHaveProperty("category");
      expect(tx).toHaveProperty("date");
      expect(tx).toHaveProperty("type");
      expect(["INCOME", "EXPENSE"]).toContain(tx.type);
    });
  });

  describe("generateExperimentResults", () => {
    it("should generate experiment results", () => {
      // Logic in service generates 523 control + 509 variant = 1032
      const results = DemoDataService.generateExperimentResults(
        "exp-1",
        "user-1",
      );
      expect(results).toHaveLength(523 + 509);
    });

    it("should have control and variant groups", () => {
      const results = DemoDataService.generateExperimentResults(
        "exp-1",
        "user-1",
      );
      const control = results.filter((r) => r.variant === "control");
      const variant = results.filter((r) => r.variant === "variant");

      expect(control.length).toBe(523);
      expect(variant.length).toBe(509);
    });
  });
});
