# Architecture Document
*Created: 2026-03-23 | Last updated: 2026-03-23*

---

## System Overview
A Next.js full-stack application where the frontend (React) communicates with a LangGraph agent via Next.js API routes. The agent uses a ReAct loop to decide which tools to invoke, streams its response back via SSE, and maintains per-session message history for multi-turn conversations.

---

## Component Map

```
Browser (React UI)
    │
    │  POST /api/chat  (message + session history)
    │  SSE stream ←
    ▼
Next.js API Route  (app/api/chat/route.ts)
    │
    │  invokes
    ▼
LangGraph createReactAgent  (lib/agent/graph.ts)
    │
    ├──▶ Calculator Tool  (lib/tools/calculator.ts)
    │        └─ mathjs.evaluate()
    │
    ├──▶ Web Search Tool  (lib/tools/webSearch.ts)
    │        └─ TavilySearchResults (Tavily API)
    │
    └──▶ RAG Tool  (lib/tools/ragTool.ts)
             └─ MemoryVectorStore retriever
                  └─ Documents in lib/rag/docs/
```

---

## Data Flow

### Request
1. User types message → React sends `POST /api/chat` with `{ message, history[] }`
2. API route reconstructs message history, invokes LangGraph agent with `.stream()`
3. Agent enters ReAct loop: reason → select tool → execute → observe → continue
4. Each tool call is logged via `lib/logger.ts`
5. Agent streams final response chunks back through the API route as SSE

### Response
1. API route pipes LangGraph stream chunks as `data: {...}\n\n` SSE events
2. React client reads the stream, appends tokens to the message in real-time
3. When stream ends, UI marks the message complete and shows the tool-use badge

---

## Key Modules

| Module | Responsibility |
|--------|---------------|
| `lib/agent/graph.ts` | Creates and exports the LangGraph `createReactAgent` instance with all tools bound |
| `lib/tools/calculator.ts` | Zod-validated tool — parses math expression, evaluates via mathjs, returns string result |
| `lib/tools/webSearch.ts` | Zod-validated tool — calls Tavily, returns top N results as string |
| `lib/tools/ragTool.ts` | Zod-validated tool — similarity search on MemoryVectorStore, returns chunks + source filenames |
| `lib/rag/vectorStore.ts` | Loads markdown doc files, generates embeddings (Anthropic), builds MemoryVectorStore singleton |
| `lib/logger.ts` | Structured JSON logger — records tool name, args, result, duration, timestamp to stdout |
| `app/api/chat/route.ts` | Next.js route handler — deserializes request, streams agent output as SSE |
| `components/ChatInterface.tsx` | React component — renders message list, streams tokens, shows tool-use badges, handles input |

---

## State & Memory Model

- **No server-side session state** — message history is owned by the React client
- On each request the client sends the full `history[]` array to the API
- The API reconstructs `HumanMessage` / `AIMessage` objects and passes them to the agent
- Memory resets automatically on page reload (in-session only, by design)

---

## Streaming Protocol

- API route uses the `ReadableStream` / `TransformStream` Web API (native to Next.js edge/node)
- LangGraph `.stream()` yields events; the route filters for `on_chat_model_stream` events
- Each token chunk is serialized as `data: {"token": "..."}\n\n`
- Stream end is signaled with `data: [DONE]\n\n`
- Frontend uses `EventSource` or `fetch` with `ReadableStream` to consume

---

## RAG Design

- **Documents**: 5+ real LangChain/LangGraph markdown docs pulled via Context7 MCP, saved to `lib/rag/docs/`
- **Embeddings**: Anthropic embeddings model (or OpenAI `text-embedding-3-small` as fallback)
- **Store**: `MemoryVectorStore` — loaded once at server startup, held in module scope
- **Retrieval**: Top-3 similarity search; tool returns text chunks + `source: <filename>` per chunk
- **Attribution**: Every RAG response includes the filename of the source doc

---

## Environment Variables

| Variable | Used By | Notes |
|----------|---------|-------|
| `ANTHROPIC_API_KEY` | LLM + embeddings | Required |
| `TAVILY_API_KEY` | Web search tool | Required |
| `OPENAI_API_KEY` | Embeddings fallback | Optional |

---

## Constraints & Assumptions
- Single user, local only — no auth, no multi-user session isolation needed
- MemoryVectorStore is sufficient for 5–20 doc chunks
- mathjs provides safe expression evaluation (no `eval`)
- No database — all state is ephemeral
