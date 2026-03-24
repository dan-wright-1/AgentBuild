import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { evaluate } from "mathjs";
import { log } from "@/lib/logger";

export const calculatorTool = tool(
  async ({ expression }: { expression: string }) => {
    const start = Date.now();
    try {
      const result = String(evaluate(expression));
      log({ tool: "calculator", args: { expression }, result, duration: Date.now() - start });
      return result;
    } catch (error) {
      const result = `Error: ${error instanceof Error ? error.message : "Invalid expression"}`;
      log({ tool: "calculator", args: { expression }, result, duration: Date.now() - start });
      return result;
    }
  },
  {
    name: "calculator",
    description:
      "Evaluates a mathematical expression. Use for arithmetic, algebra, or any math calculation. Examples: '2 + 2', '(3 * 4) / 2', 'sqrt(16)', 'sin(pi/2)'",
    schema: z.object({
      expression: z
        .string()
        .describe("The mathematical expression to evaluate"),
    }),
  }
);
