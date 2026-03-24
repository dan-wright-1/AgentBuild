# Changelog
*Append-only. Most recent entries at top.*

---

## 2026-03-23 — Phase 3 (stretch goals) complete
**Type:** Added
**Summary:** Wikipedia tool added as 4th custom tool — uses the free Wikipedia API (no key required), returns article extract with source URL, fully logged and unit tested. Persistent vector store implemented — embeddings cached to `lib/rag/vectorStore.cache.json` on first build and reloaded on restart (no re-embedding needed). Agent proposal template created in `aiDocs/agent-proposal.md`. All stretch goals complete.
**Components affected:** `lib/tools/wikipediaTool.ts`, `lib/rag/vectorStore.ts`, `lib/agent/graph.ts`, `__tests__/wikipediaTool.test.ts`, `aiDocs/agent-proposal.md`, `.gitignore`

---

## 2026-03-23 — Phase 2 complete
**Type:** Added
**Summary:** RAG tool built with MemoryVectorStore and OpenAI embeddings over 5 real LangChain/LangGraph docs (fetched live). Source attribution included in all RAG responses. Streaming responses via SSE + LangGraph streamEvents — tokens render live in UI. Conversation memory implemented via client-side history passed on every request (in-session). All 3 tools (calculator, web search, RAG) bound to agent. Unit tests added for RAG tool. Roadmap fully checked off.
**Components affected:** `lib/rag/`, `lib/tools/ragTool.ts`, `lib/agent/graph.ts`, `__tests__/ragTool.test.ts`, `package.json`, `.env.example`

---

## 2026-03-23 — Project initialized
**Type:** Added
**Summary:** Project scaffolded. Created full aiDocs suite: PRD, Roadmap, Plan, Context, architecture, CLAUDE.md, changelog, prd-addend, and index. Tech stack finalized: TypeScript, Next.js App Router, LangGraph, Claude (Anthropic), Tavily, mathjs, Vitest. Streaming added to scope. PRD locked.

---
