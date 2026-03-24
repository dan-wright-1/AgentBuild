import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import fs from "fs";
import path from "path";

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

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const docsDir = path.join(process.cwd(), "lib", "rag", "docs");
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"));

  const documents: Document[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(docsDir, file), "utf-8");
    const chunks = chunkText(content);

    for (const chunk of chunks) {
      documents.push(
        new Document({
          pageContent: chunk,
          metadata: { source: file },
        })
      );
    }
  }

  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
  return vectorStore;
}
