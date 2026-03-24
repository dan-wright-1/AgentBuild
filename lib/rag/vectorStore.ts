import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), "lib", "rag", "vectorStore.cache.json");

interface MemoryVector {
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

interface CachedStore {
  documents: Array<{ pageContent: string; metadata: Record<string, unknown> }>;
  vectors: number[][];
}

let vectorStore: MemoryVectorStore | null = null;

function chunkText(text: string, chunkSize = 800, overlap = 100): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks.filter((c) => c.trim().length > 50);
}

export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (vectorStore) return vectorStore;

  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

  // Try loading from cache first
  if (fs.existsSync(CACHE_PATH)) {
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")) as CachedStore;
      vectorStore = new MemoryVectorStore(embeddings);
      (vectorStore as unknown as { memoryVectors: MemoryVector[] }).memoryVectors =
        cached.vectors.map((embedding, i) => ({
          content: cached.documents[i].pageContent,
          embedding,
          metadata: cached.documents[i].metadata,
        }));
      console.log(`[vectorStore] Loaded ${cached.documents.length} chunks from cache`);
      return vectorStore;
    } catch {
      console.warn("[vectorStore] Cache corrupt — rebuilding");
    }
  }

  // Build from source docs
  const docsDir = path.join(process.cwd(), "lib", "rag", "docs");
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));
  const documents: Document[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(docsDir, file), "utf-8");
    for (const chunk of chunkText(content)) {
      documents.push(new Document({ pageContent: chunk, metadata: { source: file } }));
    }
  }

  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

  // Persist to cache
  const mv = (vectorStore as unknown as { memoryVectors: MemoryVector[] }).memoryVectors;
  const toCache: CachedStore = {
    documents: mv.map((v) => ({ pageContent: v.content, metadata: v.metadata })),
    vectors: mv.map((v) => v.embedding),
  };
  fs.writeFileSync(CACHE_PATH, JSON.stringify(toCache));
  console.log(`[vectorStore] Built and cached ${documents.length} chunks`);

  return vectorStore;
}
