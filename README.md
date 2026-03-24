# AgentBuild

A multi-tool AI agent chatbot built with LangChain.js, LangGraph, and Claude. Features a minimalist streaming chat interface.

## Tools

- **Calculator** — evaluates mathematical expressions via mathjs
- **Web Search** — searches the web using the Tavily API
- **RAG** — semantic search over a documentation knowledge base *(Phase 2)*

## Tech Stack

TypeScript · Next.js 15 App Router · LangGraph · Claude (Anthropic) · Tavily · Vitest

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.example .env.local
   ```
   Required keys:
   - `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com)
   - `TAVILY_API_KEY` — [tavily.com](https://tavily.com)

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
