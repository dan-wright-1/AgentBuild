# AgentBuild

A multi-tool AI agent chatbot built with LangChain.js, LangGraph, and Claude. Features a minimalist streaming chat interface with four tools and conversation memory.

## Tools

- **Calculator** — evaluates mathematical expressions via mathjs
- **Web Search** — searches the web using the Tavily API (enabled only when `TAVILY_API_KEY` is set)
- **RAG** — BM25 keyword search over a local knowledge base, with source attribution (no extra API key)
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
   ```
   - `ANTHROPIC_API_KEY` (required) — [console.anthropic.com](https://console.anthropic.com)
   - `TAVILY_API_KEY` (optional) — [tavily.com](https://tavily.com), free plan available. Without it the agent runs with the other three tools.

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Testing

```bash
npm test
```

## Deploying (Vercel)

The public demo runs on Vercel's free Hobby plan.

1. **Cap spending first.** Every question costs real API credits, so set a monthly limit on the Anthropic key before going live (Anthropic Console → Settings → Limits). Tavily's free plan is already capped at its monthly credit allowance.
2. Sign in at [vercel.com](https://vercel.com) with GitHub, choose **Add New → Project**, and import `dan-wright-1/AgentBuild`. The defaults (Next.js, `npm run build`) are correct.
3. Under **Environment Variables**, add `ANTHROPIC_API_KEY`. `TAVILY_API_KEY` is optional and turns on web search; add it later and redeploy if you like. PostHog's two `NEXT_PUBLIC_POSTHOG_*` variables are optional.
4. Deploy. Every push to `main` redeploys.

### Demo guardrails

`lib/guard.ts` rejects oversized questions and conversations, and rate-limits each visitor before any API is called. The agent is capped at 12 model/tool steps per question and 1,024 tokens per reply. The limits are in-memory per server instance, so the provider spending limits above are the real ceiling. Tune them with optional environment variables:

| Variable | Default | Meaning |
|---|---|---|
| `ANTHROPIC_MODEL` | `claude-sonnet-4-6` | Model the agent uses |
| `LIMIT_REQUESTS_PER_WINDOW` | `15` | Questions per visitor per window |
| `LIMIT_WINDOW_MINUTES` | `10` | Length of that window |
| `LIMIT_REQUESTS_PER_DAY` | `400` | Questions per server instance per day |
| `LIMIT_MESSAGE_CHARS` | `1000` | Longest question |
| `LIMIT_HISTORY_MESSAGES` | `20` | Longest conversation, in messages |
| `LIMIT_HISTORY_CHARS` | `16000` | Longest conversation, in characters |

## Project Docs

See [`aiDocs/`](./aiDocs/) for PRD, Roadmap, Architecture, and Plan.
