# Context — Project Directory & Library

This file is the "yellow pages" for this project. Use it to locate anything quickly.

---

## Folder Structure (Planned)

```
AgentBuild/
├── aiDocs/                        # Project documentation
│   ├── PRD.md                     # Product requirements
│   ├── Roadmap.md                 # Feature checklist (phased)
│   ├── Plan.md                    # Build order + decisions log
│   ├── Context.md                 # This file — directory of everything
│   └── rubric.md                  # Course rubric
│
├── app/                           # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # POST /api/chat — agent invocation
│   ├── page.tsx                   # Root page (chat UI)
│   ├── layout.tsx                 # App layout
│   └── globals.css                # Global styles (minimalist theme)
│
├── components/
│   └── ChatInterface.tsx          # Chat UI component
│
├── lib/
│   ├── tools/                     # LangChain tool definitions
│   │   ├── calculator.ts          # mathjs-based math evaluator
│   │   ├── webSearch.ts           # Tavily search tool
│   │   └── ragTool.ts             # In-memory vector search (Unit 8)
│   │
│   ├── agent/
│   │   └── graph.ts               # LangGraph createReactAgent setup
│   │
│   ├── rag/                       # RAG pipeline (Unit 8)
│   │   ├── docs/                  # Source documents (pulled via Context7)
│   │   ├── vectorStore.ts         # Embeddings + MemoryVectorStore
│   │   └── retriever.ts           # Retriever interface
│   │
│   └── logger.ts                  # Structured logging utility
│
├── __tests__/                     # Unit tests
│   ├── calculator.test.ts
│   ├── webSearch.test.ts
│   └── ragTool.test.ts
│
├── .env.local                     # Secret keys (never commit)
├── .env.example                   # Template for required env vars
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Key Files & What They Do

| File | Purpose |
|---|---|
| `lib/tools/calculator.ts` | LangChain tool — evaluates math via `mathjs` |
| `lib/tools/webSearch.ts` | LangChain tool — Tavily search integration |
| `lib/tools/ragTool.ts` | LangChain tool — queries MemoryVectorStore, returns source-attributed results |
| `lib/agent/graph.ts` | LangGraph `createReactAgent` — binds tools, manages turn loop |
| `lib/rag/vectorStore.ts` | Loads docs, generates embeddings, builds MemoryVectorStore |
| `lib/rag/docs/` | Source documents fetched via Context7 MCP |
| `lib/logger.ts` | Structured logging — tool name, args, result, timestamps |
| `app/api/chat/route.ts` | Next.js API route — receives message, invokes agent, returns response |
| `app/page.tsx` | Root page rendering ChatInterface |
| `components/ChatInterface.tsx` | React chat UI — message list, tool use badge, input |
| `__tests__/` | Vitest unit tests for each tool |

---

## Environment Variables

| Variable | Used In | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `src/agent/graph.ts` | Claude LLM |
| `TAVILY_API_KEY` | `src/tools/webSearch.ts` | Web search |
| `OPENAI_API_KEY` | `src/rag/embeddings.ts` | Embeddings (optional) |

---

## Key Packages

| Package | Role |
|---|---|
| `langchain` | Core abstractions |
| `@langchain/core` | Runnables, tools, messages |
| `@langchain/anthropic` | Claude LLM + embeddings |
| `@langchain/langgraph` | Agent graph, state management |
| `@langchain/tavily` | Tavily search tool |
| `@langchain/community` | MemoryVectorStore |
| `mathjs` | Safe math expression evaluation |
| `zod` | Tool input schema validation |
| `next` | App framework (API routes + React UI) |
| `vitest` | Unit testing |

---

## External Services

| Service | Docs / URL | Key Location |
|---|---|---|
| Anthropic (Claude) | https://docs.anthropic.com | `.env` → `ANTHROPIC_API_KEY` |
| Tavily | https://docs.tavily.com | `.env` → `TAVILY_API_KEY` |
| LangChain JS | https://js.langchain.com/docs | — |
| LangGraph JS | https://langchain-ai.github.io/langgraphjs | — |
| Context7 MCP | Used via Claude Code for live LangChain docs | — |

---

## Conventions

- All tools defined with Zod schema (`tool(fn, { name, description, schema })`)
- Agent built with `createReactAgent` from `@langchain/langgraph/prebuilt`
- All tool calls pass through `lib/logger.ts` (name, args, result, timestamp)
- RAG responses always include `source:` attribution in the returned string
- Session message history passed per request (in-session, no persistence)
- UI shows a tool-use badge on any assistant message that invoked a tool
- Streaming is out of scope for Phase 1; treat as stretch in Phase 2
