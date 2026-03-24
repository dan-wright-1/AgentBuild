# LangGraph Overview

source: https://docs.langchain.com/oss/javascript/langgraph/overview

## Introduction

LangGraph is a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents. The platform is trusted by companies shaping the future of agents.

LangGraph emphasizes agent orchestration rather than higher-level abstractions. While it can be used alongside LangChain components, it doesn't require LangChain to function.

## Key Capabilities

- **Durable execution**: Build agents that persist through failures and resume from previous checkpoints
- **Human-in-the-loop**: Inspect and modify agent state at any point during execution
- **Comprehensive memory**: Create stateful agents with short-term working memory and long-term session memory
- **LangSmith debugging**: Visualize execution paths, capture state transitions, and obtain detailed runtime metrics
- **Production-ready deployment**: Scale sophisticated agent systems with infrastructure designed for stateful workflows

## Installation

```bash
npm install @langchain/langgraph @langchain/core
```

## Hello World Example

```typescript
import { StateSchema, MessagesValue, GraphNode, StateGraph, START, END } from "@langchain/langgraph";

const State = new StateSchema({
  messages: MessagesValue,
});

const mockLlm: GraphNode<typeof State> = (state) => {
  return { messages: [{ role: "ai", content: "hello world" }] };
};

const graph = new StateGraph(State)
  .addNode("mock_llm", mockLlm)
  .addEdge(START, "mock_llm")
  .addEdge("mock_llm", END)
  .compile();

await graph.invoke({ messages: [{ role: "user", content: "hi!" }] });
```

## Ecosystem Integration

- **LangSmith Observability**: Trace requests, evaluate outputs, and monitor deployments
- **LangSmith Deployment**: Deploy and scale agents with visual prototyping in Studio
- **LangChain**: Access composable components and agent abstractions built on LangGraph

## Origins

LangGraph draws inspiration from Pregel and Apache Beam, with public interfaces influenced by NetworkX. Built by LangChain Inc.
