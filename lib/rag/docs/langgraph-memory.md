# LangGraph Memory

source: https://docs.langchain.com/oss/javascript/langgraph/memory

## Introduction

Memory systems are essential for AI agents, enabling them to retain information across interactions. LangGraph provides two primary memory types: short-term and long-term memory.

## Short-Term Memory

Short-term memory (thread-scoped) maintains conversation history within a single session. LangGraph manages this through the agent's state, which persists via checkpoints.

**Key characteristics:**
- Tracks ongoing conversations by preserving message history
- Stored as part of the agent's state
- Thread-scoped to individual conversation sessions
- Automatically updated when the graph is invoked

### Managing Conversation History

Full message histories can challenge LLMs due to context window limitations. Solutions include:
- Manually removing stale information
- Filtering outdated messages
- Implementing token-conscious message management

## Long-Term Memory

Long-term memory retains information across different conversations using custom namespaces.

**Key characteristics:**
- Persists across multiple conversation threads
- Organized within custom namespaces
- Accessible at any time from any thread
- Stored as JSON documents in the memory store

## Memory Types

| Type | Purpose | Example |
|------|---------|---------|
| **Semantic** | Store facts and concepts | User preference data |
| **Episodic** | Record past experiences | Previous agent actions |
| **Procedural** | Retain instructions | System prompts and rules |

## In-Session Memory Pattern

Pass full conversation history on each request for stateless server-side memory:

```typescript
// Client sends full history on each request
const messages = [
  ...history.map((m) =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  ),
  new HumanMessage(currentMessage),
];

// Agent receives full context
await agent.streamEvents({ messages }, { version: "v2" });
```

## Memory Storage with InMemoryStore

```typescript
import { InMemoryStore } from "@langchain/langgraph";

const store = new InMemoryStore({ index: { embed, dims: 2 } });
const namespace = [userId, "preferences"];

// Store memory document
await store.put(namespace, "a-memory", {
  rules: ["User likes short, direct language"],
});

// Retrieve by ID
const item = await store.get(namespace, "a-memory");

// Search with semantic matching
const items = await store.search(namespace, { query: "language preferences" });
```

## Memory Writing Strategies

### In-the-Hot-Path
Real-time memory creation during runtime:
- Immediate availability for subsequent interactions
- User transparency about memory storage
- Adds latency

### Background Processing
Asynchronous memory creation:
- No latency impact on primary application
- Separation of memory management from core logic
