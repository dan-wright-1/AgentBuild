import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { log } from "@/lib/logger";

export const webSearchTool = tool(
  async ({ query }: { query: string }) => {
    const start = Date.now();
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) throw new Error("TAVILY_API_KEY not set");

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          max_results: 3,
          search_depth: "basic",
        }),
      });

      if (!response.ok) throw new Error(`Tavily error: ${response.status}`);

      const data = (await response.json()) as {
        results: Array<{ title: string; url: string; content: string }>;
      };

      const formatted = data.results
        .map(
          (r, i) =>
            `[${i + 1}] ${r.title}\n${r.url}\n${r.content}`
        )
        .join("\n\n");

      log({ tool: "web_search", args: { query }, result: formatted, duration: Date.now() - start });
      return formatted || "No results found.";
    } catch (error) {
      const result = `Search failed: ${error instanceof Error ? error.message : String(error)}`;
      log({ tool: "web_search", args: { query }, result, duration: Date.now() - start });
      return result;
    }
  },
  {
    name: "web_search",
    description:
      "Search the web for current information. Use for recent events, news, facts, or anything requiring up-to-date information.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);
