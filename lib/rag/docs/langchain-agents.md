# LangChain Agents

source: https://docs.langchain.com/oss/javascript/langchain/agents

## Overview

Agents combine language models with tools to create reasoning systems that can decide which actions to take and work toward solutions iteratively. The `createReactAgent` function provides a production-ready implementation using the ReAct (Reasoning + Acting) pattern.

Agents execute in a loop until reaching a stop condition — when the model produces final output or iteration limits are met.

## Core Architecture

The agent follows this flow:
1. Input query reaches the language model
2. Model decides on an action and calls appropriate tools
3. Tool observations feed back into the model
4. Process repeats until the model signals completion
5. Final answer is delivered

## createReactAgent

```typescript
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  temperature: 0,
});

const agent = createReactAgent({
  llm: model,
  tools: [calculatorTool, webSearchTool, ragTool],
});
```

## Defining Tools with Zod

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = tool(
  async ({ query }) => {
    return `Results for: ${query}`;
  },
  {
    name: "my_tool",
    description: "Description of what this tool does",
    schema: z.object({
      query: z.string().describe("The query to process"),
    }),
  }
);
```

## ReAct Pattern

Agents alternate between reasoning and targeted tool calls:

1. **Reasoning**: "I need current information for this"
   **Acting**: Call `web_search("query")`

2. Result feeds back into the model context

3. **Reasoning**: "Now I have enough information to answer"
   **Acting**: Deliver final response

## Invoking the Agent

```typescript
// Non-streaming
const result = await agent.invoke({
  messages: [new HumanMessage("What is 2 + 2?")],
});

// Streaming with streamEvents
const stream = agent.streamEvents(
  { messages: [new HumanMessage("Search for AI news")] },
  { version: "v2" }
);

for await (const event of stream) {
  if (event.event === "on_chat_model_stream") {
    process.stdout.write(event.data.chunk.content);
  }
}
```

## Multi-Turn Conversations

Pass full message history to maintain context:

```typescript
const messages = [
  new HumanMessage("My name is Alice"),
  new AIMessage("Hello Alice!"),
  new HumanMessage("What is my name?"),
];

const result = await agent.invoke({ messages });
// Agent will correctly respond "Your name is Alice"
```

## Tool Error Handling

Tools should return error strings rather than throwing, so the agent can reason about failures:

```typescript
const safeTool = tool(
  async ({ expression }) => {
    try {
      return String(evaluate(expression));
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },
  { name: "calculator", description: "...", schema: z.object({ expression: z.string() }) }
);
```
