# Implementation Plan

## Approach
Build incrementally: get each layer working in isolation before wiring them together. Follow a vertical slice strategy — a minimal end-to-end path first, then layer in features.

---

## Step-by-Step Build Order

### Step 1: Project Scaffold
- Init repo, install deps, set up `.env`
- Confirm LLM call works (simple "Hello" to Claude)

### Step 2: Tools (isolated)
1. **Calculator** — pure function, wrap as LangChain tool
2. **Web search** — Tavily integration, wrap as LangChain tool
3. Test each tool independently before adding to agent

### Step 3: Agent Loop
- Create a LangGraph `createReactAgent` (or custom graph)
- Bind tools, run a few manual test prompts
- Confirm tool routing works (math question → calculator, "latest news on X" → Tavily)

### Step 4: Backend API
- Express (or FastAPI) server
- Single POST `/chat` route
- Pass user message to agent, return response JSON

### Step 5: Basic UI
- Single-page chat interface
- Fetch call to `/chat`, render assistant message
- No streaming yet — just confirm the loop works end-to-end

### Step 6: Streaming
- Switch backend to SSE or streamed chunked response
- Hook LangGraph `.stream()` into the response pipe
- Update frontend to read the stream and append tokens

### Step 7: RAG
- Prepare ~10-20 doc chunks (course notes, LangChain readme, etc.)
- Embed with OpenAI or Anthropic embeddings → MemoryVectorStore
- Expose as a tool: `searchDocs(query: string) → string`
- Add to agent, test retrieval questions

### Step 8: Memory
- Add LangGraph state to carry `messages[]` across turns
- Or use `BufferMemory` / `ConversationSummaryMemory`
- Test: ask a follow-up that requires prior context ("What did I just ask?")

### Step 9: Final Polish
- Error handling, loading indicators, UI cleanup
- README: setup instructions, `.env.example`, demo screenshots

---

## Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Language | TypeScript (Node.js) | Matches course stack, LangChain TS is first-class |
| LLM | Claude via `@langchain/anthropic` | Preferred model (Anthropic) |
| Vector store | MemoryVectorStore | No infra setup needed, in-memory is fine for small doc set |
| Frontend framework | Next.js App Router + React | Handles UI + API routes in one repo, TypeScript-first, clean |
| UI aesthetic | Minimalist / "Japanese monk" | Sleek, dark, no clutter; tool use displayed per response |
| Streaming | Out of scope (Phase 1); stretch credit (Phase 2) | Core agent first, streaming as enhancement |
| RAG source docs | Pulled via Context7 MCP | Live, real LangChain/LangGraph docs; no manual copy-paste |
| RAG attribution | Required | Each RAG response cites the source document |
| Calculator scope | Basic arithmetic only | Keeps evaluator simple and safe |
| Memory | In-session only | No persistence across page reloads |
| Logging | Structured logging for all tool calls | Rubric requirement: log tool name, args, result |
| Testing | Unit tests for tools | Vitest or Jest |
| Deployment | Local only | No hosting needed |