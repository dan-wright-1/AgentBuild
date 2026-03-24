# AgentBuild

A multi-tool AI agent chatbot built with LangChain.js, LangGraph, and Claude. Features a minimalist streaming chat interface with four tools and conversation memory.

## Tools

- **Calculator** — evaluates mathematical expressions via mathjs
- **Web Search** — searches the web using the Tavily API
- **RAG** — semantic search over a local knowledge base with source attribution (documents persist across restarts)
- **Wikipedia** — fetches summaries directly from Wikipedia

## Features

- Streaming responses — tokens render live as the agent thinks
- Conversation memory — follow-up questions work across turns
- Tool badges — the UI shows which tools were used for each response
- Structured logging — every tool call logs its name, arguments, result, and duration

## Tech Stack

TypeScript · Next.js 15 App Router · LangGraph · Claude Sonnet 4.6 (Anthropic) · Tavily · Vitest

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` and add your API keys:
   ```
   ANTHROPIC_API_KEY=...
   TAVILY_API_KEY=...
   OPENAI_API_KEY=...
   ```
   - `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com)
   - `TAVILY_API_KEY` — [tavily.com](https://tavily.com)
   - `OPENAI_API_KEY` — used for RAG embeddings

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Testing

```bash
npm test
```

## Project Docs

See [`aiDocs/`](./aiDocs/) for PRD, Roadmap, Architecture, and Plan.
