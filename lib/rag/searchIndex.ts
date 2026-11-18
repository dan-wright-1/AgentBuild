import { Document } from "@langchain/core/documents";
import fs from "fs";
import path from "path";

// Keyword search over the local knowledge base (lib/rag/docs), ranked with BM25.
// The knowledge base is five short documents, so keyword ranking finds the right
// passages without an embeddings API: no extra key, no per-query cost, nothing to
// cache. Results keep the source filename for attribution.

const DOCS_DIR = path.join(process.cwd(), "lib", "rag", "docs");

// BM25 tuning: k1 controls term-frequency saturation, b controls length normalisation.
const K1 = 1.5;
const B = 0.75;

const STOPWORDS = new Set(
  "a an and are as at be but by can do does for from how i if in into is it its of on or so that the their them then there these this to was what when where which who why will with you your".split(
    " "
  )
);

/** Light stemming so "agents"/"agent" and "streaming"/"stream" match. */
function stem(w: string): string {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

/** Lowercase words, minus stopwords, lightly stemmed. */
export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => w.length > 1 && !STOPWORDS.has(w)).map(stem);
}

function chunkText(text: string, chunkSize = 800, overlap = 100): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks.filter((c) => c.trim().length > 50);
}

export interface SearchIndex {
  similaritySearch(query: string, k?: number): Promise<Document[]>;
}

/** Builds a BM25 index over the given documents. Exported for tests. */
export function buildIndex(documents: Document[]): SearchIndex {
  const docTokens = documents.map((d) => tokenize(d.pageContent));
  const avgLen = docTokens.reduce((n, t) => n + t.length, 0) / Math.max(1, docTokens.length);
  const docFreq = new Map<string, number>();
  for (const tokens of docTokens) for (const term of new Set(tokens)) docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
  const N = documents.length;
  const idf = (term: string) => {
    const df = docFreq.get(term) ?? 0;
    return Math.log(1 + (N - df + 0.5) / (df + 0.5));
  };

  return {
    async similaritySearch(query: string, k = 3) {
      const terms = [...new Set(tokenize(query))];
      if (terms.length === 0) return [];
      const scored = docTokens.map((tokens, i) => {
        const tf = new Map<string, number>();
        for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
        let score = 0;
        for (const term of terms) {
          const f = tf.get(term) ?? 0;
          if (!f) continue;
          score += idf(term) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * tokens.length) / avgLen)));
        }
        return { i, score };
      });
      return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map((s) => documents[s.i]);
    },
  };
}

let index: SearchIndex | null = null;

/** The knowledge-base index, built once per server instance from lib/rag/docs. */
export async function getSearchIndex(): Promise<SearchIndex> {
  if (index) return index;
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
  const documents: Document[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(DOCS_DIR, file), "utf-8");
    for (const chunk of chunkText(content)) {
      documents.push(new Document({ pageContent: chunk, metadata: { source: file } }));
    }
  }
  index = buildIndex(documents);
  console.log(`[searchIndex] Indexed ${documents.length} chunks from ${files.length} documents`);
  return index;
}
