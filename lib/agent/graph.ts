import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import { calculatorTool } from "@/lib/tools/calculator";
import { webSearchTool } from "@/lib/tools/webSearch";
import { ragTool } from "@/lib/tools/ragTool";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
  temperature: 0,
});

export const agent = createReactAgent({
  llm: model,
  tools: [calculatorTool, webSearchTool, ragTool],
});
