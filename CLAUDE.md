# AgentBuild — Claude Context
*This file is auto-loaded by Claude Code at session start.*

## Project Summary
A multi-tool AI agent chatbot built with LangChain.js, LangGraph, and Claude (Anthropic). Features a calculator tool, Tavily web search, RAG over real docs, conversation memory, streaming responses, and a minimalist Next.js chat UI. Individual coursework — Units 7 & 8.

## Environment
- **Language**: TypeScript (Node.js)
- **Framework**: Next.js App Router
- **LLM**: Claude via `@langchain/anthropic`
- **Agent**: LangGraph `createReactAgent`
- **Vector store**: MemoryVectorStore (in-memory, session-only)
- **Search**: Tavily (`@langchain/tavily`)
- **Math**: `mathjs`
- **Testing**: Vitest
- **Deployment**: Local only

## Key Paths
- `lib/tools/` — calculator, webSearch, ragTool
- `lib/agent/graph.ts` — LangGraph agent
- `lib/rag/` — embeddings, vectorStore, docs/
- `lib/logger.ts` — structured logging
- `app/api/chat/route.ts` — Next.js API route
- `components/ChatInterface.tsx` — React chat UI
- `__tests__/` — unit tests
- `aiDocs/` — all project documentation

## Session Start Checklist
When starting any new session on this project:
1. Read `aiDocs/index.md` to orient and check current phase
2. Check `aiDocs/roadmap.md` for open tasks
3. Check `aiDocs/prd-addend.md` for any requirement changes

## AI Guidelines
- PRD (`aiDocs/PRD.md`) is immutable — log any requirement changes to `aiDocs/prd-addend.md`
- Append completed work summaries to `aiDocs/changelog.md`
- Update checkbox status in `aiDocs/Roadmap.md` as tasks complete
- All tool calls must log through `lib/logger.ts` (name, args, result, timestamp)
- RAG responses must include source attribution
- When working with LangChain/LangGraph APIs, use Context7 MCP to pull current docs
