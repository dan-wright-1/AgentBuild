# Roadmap

## Phase 1 — Foundation (Unit 7)

### Project Setup
- [x] Initialize Next.js App Router project (TypeScript)
- [x] Configure `.env.local` and `.env.example`
- [x] Set up `.gitignore` (no secrets, no node_modules)
- [x] Initialize git repo with first commit

### Core Dependencies
- [x] Install `langchain`, `@langchain/core`, `@langchain/langgraph`
- [x] Install `@langchain/anthropic`
- [x] Install `@langchain/tavily`
- [x] Install `zod`
- [x] Install `mathjs` (safe math evaluation)

### Calculator Tool
- [x] Implement math expression evaluator using `mathjs`
- [x] Wrap as a LangChain tool with Zod schema
- [x] Add structured logging (tool name, args, result)
- [x] Unit test the tool in isolation

### Web Search Tool
- [x] Implement TavilySearch tool wrapper
- [x] Add structured logging
- [x] Unit test the tool in isolation

### Agent Core
- [x] Create LangGraph `createReactAgent` with tool binding
- [x] Add structured logging middleware for all tool calls
- [x] Test agent routes correctly (math → calculator, web query → Tavily)

### Next.js API Route
- [x] Create `app/api/chat/route.ts` — POST handler
- [x] Wire agent invocation to API route
- [x] Test with curl

### Web UI (React)
- [x] Build chat interface component (dark, minimalist)
- [x] Show tool use badge per response (which tool was called)
- [x] Display conversation history in session

### Repo Hygiene (Rubric)
- [x] README.md with setup + run instructions
- [ ] 5+ meaningful incremental commits (in progress)
- [x] Structured logging verified in console output

---

## Phase 2 — Enhancement (Unit 8)

### Streaming Responses
- [x] Switch API route to SSE using `ReadableStream` / `TransformStream`
- [x] Pipe LangGraph `.streamEvents()` output through SSE as `data: {"token": "..."}`
- [x] Frontend reads stream via `fetch` + `ReadableStream`, appends tokens live
- [x] Signal stream end with `data: [DONE]`
- [x] Test: tokens appear in real-time in UI

### RAG Tool
- [x] Pull 5+ real LangChain/LangGraph docs via WebFetch (Context7 unavailable)
- [x] Generate embeddings → MemoryVectorStore (`@langchain/openai` text-embedding-3-small)
- [x] Wrap retriever as a LangChain tool with Zod schema
- [x] Include source attribution in every RAG response
- [x] Add structured logging for RAG queries
- [x] Unit test RAG tool in isolation

### Conversation Memory
- [x] Integrate LangGraph message history into agent state
- [x] In-session multi-turn context (resets on page reload)
- [x] Test follow-up questions work correctly

### Polish & QA
- [x] Error handling for failed tool calls
- [x] Loading indicator in UI (streaming cursor)
- [x] Final end-to-end test: all 3 tools + memory
- [x] Clean up code, finalize README

---

## Stretch Goals (Extra Credit)
- [ ] 4th custom tool
- [ ] Persistent vector store (survives restarts)
- [ ] Agent proposal write-up
