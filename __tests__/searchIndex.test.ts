import { describe, it, expect } from "vitest";
import { Document } from "@langchain/core/documents";
import { buildIndex, getSearchIndex, tokenize } from "@/lib/rag/searchIndex";

describe("searchIndex", () => {
  it("tokenizes, drops stopwords and stems lightly", () => {
    expect(tokenize("How do the Agents stream tokens?")).toEqual(["agent", "stream", "token"]);
    expect(tokenize("streaming")).toEqual(["stream"]);
  });

  it("ranks the most relevant chunk first", async () => {
    const index = buildIndex([
      new Document({ pageContent: "Memory lets an agent remember earlier turns of a conversation.", metadata: { source: "memory.md" } }),
      new Document({ pageContent: "Streaming sends tokens to the client as the model generates them.", metadata: { source: "streaming.md" } }),
    ]);
    const results = await index.similaritySearch("how does token streaming work", 2);
    expect(results[0].metadata.source).toBe("streaming.md");
  });

  it("returns nothing when no words match", async () => {
    const index = buildIndex([new Document({ pageContent: "Checkpointers persist graph state.", metadata: { source: "a.md" } })]);
    expect(await index.similaritySearch("banana bread recipe")).toEqual([]);
  });

  it("finds the right document in the real knowledge base", async () => {
    const index = await getSearchIndex();
    const [top] = await index.similaritySearch("how does streaming work in LangGraph", 3);
    expect(top.metadata.source).toBe("langgraph-streaming.md");
    const [mem] = await index.similaritySearch("conversation memory checkpointer", 3);
    expect(mem.metadata.source).toBe("langgraph-memory.md");
  });
});
