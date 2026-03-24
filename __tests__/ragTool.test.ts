import { describe, it, expect, vi, beforeEach } from "vitest";
import { Document } from "@langchain/core/documents";

// Mock the vector store module
vi.mock("@/lib/rag/vectorStore", () => ({
  getVectorStore: vi.fn(),
}));

import { getVectorStore } from "@/lib/rag/vectorStore";
import { ragTool } from "@/lib/tools/ragTool";

const mockStore = {
  similaritySearch: vi.fn(),
};

describe("ragTool", () => {
  beforeEach(() => {
    vi.mocked(getVectorStore).mockResolvedValue(mockStore as never);
    mockStore.similaritySearch.mockReset();
  });

  it("returns formatted results with source attribution", async () => {
    mockStore.similaritySearch.mockResolvedValueOnce([
      new Document({
        pageContent: "LangGraph is a framework for building agents.",
        metadata: { source: "langgraph-overview.md" },
      }),
    ]);

    const result = await ragTool.invoke({ query: "what is langgraph" });

    expect(result).toContain("LangGraph is a framework for building agents.");
    expect(result).toContain("source: langgraph-overview.md");
  });

  it("returns no-results message when store is empty", async () => {
    mockStore.similaritySearch.mockResolvedValueOnce([]);

    const result = await ragTool.invoke({ query: "unknown topic" });

    expect(result).toBe("No relevant documentation found.");
  });

  it("returns multiple results separated by ---", async () => {
    mockStore.similaritySearch.mockResolvedValueOnce([
      new Document({
        pageContent: "Chunk one content.",
        metadata: { source: "langchain-rag.md" },
      }),
      new Document({
        pageContent: "Chunk two content.",
        metadata: { source: "langgraph-memory.md" },
      }),
    ]);

    const result = await ragTool.invoke({ query: "rag memory" });

    expect(result).toContain("Chunk one content.");
    expect(result).toContain("source: langchain-rag.md");
    expect(result).toContain("---");
    expect(result).toContain("Chunk two content.");
    expect(result).toContain("source: langgraph-memory.md");
  });

  it("handles store errors gracefully", async () => {
    mockStore.similaritySearch.mockRejectedValueOnce(new Error("Store unavailable"));

    const result = await ragTool.invoke({ query: "any query" });

    expect(result).toMatch(/RAG search failed/i);
  });
});
