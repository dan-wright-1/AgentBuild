import { describe, it, expect } from "vitest";
import { calculatorTool } from "@/lib/tools/calculator";

describe("calculatorTool", () => {
  it("evaluates basic arithmetic", async () => {
    const result = await calculatorTool.invoke({ expression: "2 + 2" });
    expect(result).toBe("4");
  });

  it("handles multiplication", async () => {
    const result = await calculatorTool.invoke({ expression: "6 * 7" });
    expect(result).toBe("42");
  });

  it("handles division", async () => {
    const result = await calculatorTool.invoke({ expression: "10 / 4" });
    expect(result).toBe("2.5");
  });

  it("handles square root", async () => {
    const result = await calculatorTool.invoke({ expression: "sqrt(144)" });
    expect(result).toBe("12");
  });

  it("handles parentheses and order of operations", async () => {
    const result = await calculatorTool.invoke({ expression: "(2 + 3) * 4" });
    expect(result).toBe("20");
  });

  it("returns an error message for invalid expressions", async () => {
    const result = await calculatorTool.invoke({ expression: "not a number" });
    expect(result).toMatch(/Error/i);
  });
});
