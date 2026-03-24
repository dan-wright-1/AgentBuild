import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { log } from "@/lib/logger";

interface WikiSearchResult {
  query: { search: Array<{ title: string }> };
}

interface WikiExtractResult {
  query: { pages: Record<string, { title: string; extract?: string }> };
}

export const wikipediaTool = tool(
  async ({ query }: { query: string }) => {
    const start = Date.now();
    try {
      // Step 1: search for the best matching article title
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&utf8=1&srlimit=1&origin=*`
      );
      const searchData = (await searchRes.json()) as WikiSearchResult;

      if (!searchData.query.search.length) {
        const result = "No Wikipedia article found for that query.";
        log({ tool: "wikipedia", args: { query }, result, duration: Date.now() - start });
        return result;
      }

      const title = searchData.query.search[0].title;

      // Step 2: fetch the intro extract for that article
      const extractRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(title)}&format=json&utf8=1&origin=*`
      );
      const extractData = (await extractRes.json()) as WikiExtractResult;
      const page = Object.values(extractData.query.pages)[0];
      const extract = (page.extract ?? "No content found.").slice(0, 1500);

      const slug = title.replace(/ /g, "_");
      const result = `${title}\n\n${extract}\n\nsource: https://en.wikipedia.org/wiki/${encodeURIComponent(slug)}`;

      log({ tool: "wikipedia", args: { query }, result: result.slice(0, 300), duration: Date.now() - start });
      return result;
    } catch (error) {
      const result = `Wikipedia lookup failed: ${error instanceof Error ? error.message : String(error)}`;
      log({ tool: "wikipedia", args: { query }, result, duration: Date.now() - start });
      return result;
    }
  },
  {
    name: "wikipedia",
    description:
      "Look up encyclopedic information on Wikipedia. Use for factual background, historical events, scientific concepts, notable people, and places. Complements web_search for deeper, stable reference knowledge.",
    schema: z.object({
      query: z.string().describe("The topic or subject to look up on Wikipedia"),
    }),
  }
);
