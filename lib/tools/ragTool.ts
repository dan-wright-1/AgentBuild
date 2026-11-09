import type { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getVectorStore } from "@/lib/rag/vectorStore";
import { log } from "@/lib/logger";
import { captureAIEmbedding, type AITraceContext } from "@/lib/posthog-server";

export const ragTool = tool(
  async ({ query }: { query: string }, config: RunnableConfig) => {
    const start = Date.now();
    const metadata = config.metadata;
    const traceContext: AITraceContext | undefined =
      typeof metadata?.posthogSessionId === "string" &&
      typeof metadata?.posthogTraceId === "string"
        ? {
            sessionId: metadata.posthogSessionId,
            traceId: metadata.posthogTraceId,
          }
        : undefined;

    try {
      const store = await getVectorStore(traceContext);
      const embeddingStart = Date.now();
      const results = await store.similaritySearch(query, 3);
      if (traceContext) {
        captureAIEmbedding({
          ...traceContext,
          input: query,
          inputTokens: Math.ceil(query.length / 4),
          latency: (Date.now() - embeddingStart) / 1000,
        });
      }

      if (results.length === 0) {
        const result = "No relevant documentation found.";
        log({ tool: "rag_search", args: { query }, result, duration: Date.now() - start });
        return result;
      }

      const formatted = results
        .map((doc: { pageContent: string; metadata: Record<string, unknown> }) => `${doc.pageContent}\n\nsource: ${doc.metadata.source as string}`)
        .join("\n\n---\n\n");

      log({ tool: "rag_search", args: { query }, result: formatted, duration: Date.now() - start });
      return formatted;
    } catch (error) {
      const result = `RAG search failed: ${error instanceof Error ? error.message : String(error)}`;
      log({ tool: "rag_search", args: { query }, result, duration: Date.now() - start });
      return result;
    }
  },
  {
    name: "rag_search",
    description:
      "Search the internal knowledge base for documentation about LangChain, LangGraph, RAG, streaming, memory, agents, tools, and vector stores. Use this when asked about these frameworks or concepts.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "The topic or question to search documentation for, e.g. 'how does streaming work in LangGraph'"
        ),
    }),
  }
);
