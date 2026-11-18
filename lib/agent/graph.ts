import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import { calculatorTool } from "@/lib/tools/calculator";
import { webSearchTool } from "@/lib/tools/webSearch";
import { ragTool } from "@/lib/tools/ragTool";
import { wikipediaTool } from "@/lib/tools/wikipediaTool";

const model = new ChatAnthropic({
  // Override with ANTHROPIC_MODEL in the deployment to trade quality for cost.
  model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
  // Caps the length (and cost) of each model reply.
  maxTokens: 1024,
});

// Web search needs a Tavily key. Without one the agent simply doesn't have the
// tool, rather than reaching for it and failing in front of a visitor.
const tavilyKey = process.env.TAVILY_API_KEY?.trim();
const hasWebSearch = Boolean(tavilyKey) && !tavilyKey!.startsWith("your_"); // ignore the .env.example placeholder
const tools = hasWebSearch
  ? [calculatorTool, webSearchTool, ragTool, wikipediaTool]
  : [calculatorTool, ragTool, wikipediaTool];

export const agent = createReactAgent({
  llm: model,
  tools,
});
