# LangGraph Streaming

source: https://docs.langchain.com/oss/javascript/langgraph/streaming

## Overview

LangGraph provides a streaming system that delivers real-time updates during graph execution. This capability enhances application responsiveness by progressively displaying output, improving user experience particularly when dealing with LLM latency.

## Basic Usage

```typescript
for await (const chunk of await graph.stream(inputs, {
  streamMode: "updates",
})) {
  console.log(chunk);
}
```

## Stream Modes

| Mode | Purpose |
|------|---------|
| **values** | Full state after each execution step |
| **updates** | State changes following each step |
| **messages** | LLM tokens with associated metadata |
| **custom** | User-defined data from nodes/tools |
| **tools** | Tool lifecycle events (start, event, end, error) |
| **debug** | Comprehensive execution information |

## LLM Token Streaming

The messages mode returns tuples containing `[messageChunk, metadata]` pairs:

```typescript
for await (const [messageChunk, metadata] of await graph.stream(
  { topic: "ice cream" },
  { streamMode: "messages" }
)) {
  if (messageChunk.content) {
    console.log(messageChunk.content + "|");
  }
}
```

## streamEvents for Fine-Grained Control

Use `streamEvents` with `version: "v2"` for token-level streaming:

```typescript
const eventStream = agent.streamEvents({ messages }, { version: "v2" });

for await (const event of eventStream) {
  if (event.event === "on_chat_model_stream") {
    const chunk = event.data?.chunk;
    // handle token chunk
  }
  if (event.event === "on_tool_start") {
    console.log(`Tool started: ${event.name}`);
  }
  if (event.event === "on_tool_end") {
    console.log(`Tool finished: ${event.name}`);
  }
}
```

## Tool Progress Tracking

The tools mode emits four lifecycle events:

| Event | Timing | Payload |
|-------|--------|---------|
| `on_tool_start` | Invocation begins | name, input, toolCallId |
| `on_tool_event` | Intermediate data | name, data, toolCallId |
| `on_tool_end` | Final result | name, output, toolCallId |
| `on_tool_error` | Error occurs | name, error, toolCallId |

## Multiple Modes Simultaneously

```typescript
for await (const [mode, chunk] of await graph.stream(inputs, {
  streamMode: ["updates", "custom"],
})) {
  console.log(chunk);
}
```

## SSE Streaming Pattern (Next.js)

```typescript
const stream = new ReadableStream({
  async start(controller) {
    const encoder = new TextEncoder();
    const eventStream = agent.streamEvents({ messages }, { version: "v2" });
    for await (const event of eventStream) {
      if (event.event === "on_chat_model_stream") {
        const token = event.data?.chunk?.content;
        if (token) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
        }
      }
    }
    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
    controller.close();
  }
});

return new Response(stream, {
  headers: { "Content-Type": "text/event-stream" }
});
```
