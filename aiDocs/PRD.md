# Product Requirements Document (PRD)
*Created: 2026-03-23*
*Status: IMMUTABLE — Do not edit after sign-off. Log changes in aiDocs/prd-addend.md*

## Project: AgentBuild — Mini Agentic Chatbot

### Overview
A full-stack conversational AI agent built individually as a mini version of the term project. Demonstrates the full agentic development workflow: tooling, RAG, memory, streaming, and a web UI.

---

## Goals
- Build a functional multi-tool AI agent using LangChain and LangGraph
- Implement a chat interface with streaming responses
- Demonstrate software engineering best practices (structure, process, documentation)

---

## Core Features

### 1. Calculator Tool
- Evaluates mathematical expressions submitted by the user
- Safe evaluation — no arbitrary code execution
- Returns the computed result as a string

### 2. Web Search Tool
- Integrates Tavily Search API
- Agent can retrieve current information from the web
- Returns summarized search results to the conversation

### 3. RAG Tool (Unit 8)
- In-memory vector store over a curated documentation set
- Embeddings generated via an Anthropic or OpenAI embeddings model
- Agent can query the knowledge base and return relevant context

### 4. Web UI (Chat Interface)
- Browser-based chat interface
- Supports multi-turn conversation display
- Streaming response rendering (tokens appear as they arrive)

### 5. Conversation Memory (Unit 8)
- Multi-turn context maintained across messages in a session
- LangGraph or LangChain message history integration

### 6. Streaming Responses
- Server-side streaming via LangChain streaming callbacks or LangGraph streaming
- UI updates token-by-token for better user experience

---

## Technical Stack

| Layer | Technology |
|---|---|
| Agent framework | LangChain + LangGraph |
| LLM | Claude (via `@langchain/anthropic`) |
| Web search | Tavily (`@langchain/tavily`) |
| Vector store | In-memory (LangChain MemoryVectorStore) |
| Embeddings | OpenAI or Anthropic embeddings |
| Schema validation | Zod |
| Math evaluation | mathjs (safe, no eval) |
| Backend | Next.js API Routes (TypeScript) |
| Frontend | Next.js App Router + React |
| UI style | Minimalist dark — tool use badge per response |
| Context retrieval | Context7 MCP (LangChain/LangGraph docs for RAG) |
| Structured logging | Custom logger — tool name, args, result, timestamp |
| Testing | Vitest (unit tests per tool) |

---

## API Keys Required

| Service | Purpose |
|---|---|
| Anthropic | LLM (Claude) |
| Tavily | Web search tool |
| OpenAI (optional) | Embeddings |

---

## Non-Functional Requirements
- Code organized with clear separation of concerns (tools, agent, server, UI)
- `.env.local` for secrets — never committed; `.env.example` committed
- Structured logging on all tool calls (name, args, result, timestamp)
- RAG responses must include source attribution (filename of source doc)
- 5+ meaningful incremental git commits showing progression
- README with setup and run instructions
- Repo demonstrates same infrastructure standards as term project
