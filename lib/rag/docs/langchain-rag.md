# LangChain RAG (Retrieval Augmented Generation)

source: https://docs.langchain.com/oss/javascript/langchain/rag

## Overview

RAG enables sophisticated question-answering chatbots that answer queries about specific source material. It combines:

- **Indexing**: Data ingestion pipeline — load, split, embed, store
- **Retrieval and generation**: Runtime process that fetches relevant data and generates responses

## Indexing Pipeline

### 1. Load Documents

```typescript
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const loader = new CheerioWebBaseLoader("https://example.com/doc", { selector: "p" });
const docs = await loader.load();
```

### 2. Split Documents

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const chunks = await splitter.splitDocuments(docs);
```

### 3. Embed and Store

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
```

## RAG Tool Pattern

Wrap retrieval as a LangChain tool for use inside an agent:

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const ragTool = tool(
  async ({ query }) => {
    const results = await vectorStore.similaritySearch(query, 3);
    return results
      .map((doc) => `${doc.pageContent}\n\nsource: ${doc.metadata.source}`)
      .join("\n\n---\n\n");
  },
  {
    name: "rag_search",
    description: "Search internal documentation for LangChain and LangGraph concepts.",
    schema: z.object({
      query: z.string().describe("The topic or question to search for"),
    }),
  }
);
```

## Source Attribution

Always include source metadata in RAG responses so users can verify information:

```typescript
const results = await vectorStore.similaritySearch(query, 3);
const formatted = results
  .map((doc) => `${doc.pageContent}\n\nsource: ${doc.metadata.source}`)
  .join("\n\n---\n\n");
```

## MemoryVectorStore

`MemoryVectorStore` is an in-memory vector store suitable for development and small document sets:

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";

// Build from documents
const store = await MemoryVectorStore.fromDocuments(documents, embeddings);

// Similarity search
const results = await store.similaritySearch("your query", 3);

// Each result has pageContent and metadata
results.forEach((doc) => {
  console.log(doc.pageContent);
  console.log(doc.metadata.source);
});
```

## Security: Prompt Injection

Retrieved documents may contain embedded instructions. Mitigate with:

1. **Defensive prompts**: Instruct models to treat retrieved content as data only
2. **Structural delimiters**: Use XML tags separating data from instructions
3. **Response validation**: Check output formats match expectations

## Singleton Pattern for Production

Initialize the vector store once and reuse across requests:

```typescript
let vectorStore: MemoryVectorStore | null = null;

export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (vectorStore) return vectorStore;
  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
  return vectorStore;
}
```
