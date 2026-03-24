# Roadmap

## Phase 1 — Foundation (Unit 7)

### Project Setup
- [ ] Initialize Next.js App Router project (TypeScript)
- [ ] Configure `.env.local` and `.env.example`
- [ ] Set up `.gitignore` (no secrets, no node_modules)
- [ ] Initialize git repo with first commit

### Core Dependencies
- [ ] Install `langchain`, `@langchain/core`, `@langchain/langgraph`
- [ ] Install `@langchain/anthropic`
- [ ] Install `@langchain/tavily`
- [ ] Install `zod`
- [ ] Install `mathjs` (safe math evaluation)

### Calculator Tool
- [ ] Implement math expression evaluator using `mathjs`
- [ ] Wrap as a LangChain tool with Zod schema
- [ ] Add structured logging (tool name, args, result)
- [ ] Unit test the tool in isolation

### Web Search Tool
- [ ] Implement TavilySearch tool wrapper
- [ ] Add structured logging
- [ ] Unit test the tool in isolation

### Agent Core
- [ ] Create LangGraph `createReactAgent` with tool binding
- [ ] Add structured logging middleware for all tool calls
- [ ] Test agent routes correctly (math → calculator, web query → Tavily)

### Next.js API Route
- [ ] Create `app/api/chat/route.ts` — POST handler
- [ ] Wire agent invocation to API route
- [ ] Test with curl

### Web UI (React)
- [ ] Build chat interface component (dark, minimalist)
- [ ] Show tool use badge per response (which tool was called)
- [ ] Display conversation history in session

### Repo Hygiene (Rubric)
- [ ] README.md with setup + run instructions
- [ ] 5+ meaningful incremental commits
- [ ] Structured logging verified in console output

---

## Phase 2 — Enhancement (Unit 8)

### Streaming Responses
- [ ] Switch API route to SSE using `ReadableStream` / `TransformStream`
- [ ] Pipe LangGraph `.stream()` output through SSE as `data: {"token": "..."}`
- [ ] Frontend reads stream via `fetch` + `ReadableStream`, appends tokens live
- [ ] Signal stream end with `data: [DONE]`
- [ ] Test: tokens appear in real-time in UI

### RAG Tool
- [ ] Pull 5+ real LangChain/LangGraph docs via Context7 MCP
- [ ] Generate embeddings → MemoryVectorStore
- [ ] Wrap retriever as a LangChain tool with Zod schema
- [ ] Include source attribution in every RAG response
- [ ] Add structured logging for RAG queries
- [ ] Unit test RAG tool in isolation

### Conversation Memory
- [ ] Integrate LangGraph message history into agent state
- [ ] In-session multi-turn context (resets on page reload)
- [ ] Test follow-up questions work correctly

### Polish & QA
- [ ] Error handling for failed tool calls
- [ ] Loading indicator in UI
- [ ] Final end-to-end test: all 3 tools + memory
- [ ] Clean up code, finalize README

---

## Stretch Goals (Extra Credit)
- [ ] 4th custom tool
- [ ] Persistent vector store (survives restarts)
- [ ] Agent proposal write-up
