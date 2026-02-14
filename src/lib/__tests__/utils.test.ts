/**
 * @jest-environment jsdom
 */
import { cn } from "../utils";

describe("utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional");
      expect(cn("base", false && "conditional")).toBe("base");
    });

    it("should handle undefined and null", () => {
      expect(cn("class1", undefined, "class2")).toBe("class1 class2");
      expect(cn("class1", null, "class2")).toBe("class1 class2");
    });

    it("should handle empty strings", () => {
      expect(cn("class1", "", "class2")).toBe("class1 class2");
    });

    it("should merge Tailwind classes correctly (override conflicts)", () => {
      // tailwind-merge should handle conflicting utilities
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["class1", "class2"])).toBe("class1 class2");
    });

    it("should handle objects with boolean values", () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe(
        "class1 class3",
      );
    });

    it("should handle complex combinations", () => {
      const result = cn(
        "base",
        {
          conditional: true,
          hidden: false,
        },
        ["array1", "array2"],
        undefined,
        "final",
      );
      expect(result).toBe("base conditional array1 array2 final");
    });

    it("should handle empty input", () => {
      expect(cn()).toBe("");
    });

    it("should trim and normalize whitespace", () => {
      expect(cn("  class1  ", "  class2  ")).toBe("class1 class2");
    });
  });
});
