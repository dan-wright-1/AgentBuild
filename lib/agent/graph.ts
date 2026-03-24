import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import { calculatorTool } from "@/lib/tools/calculator";
import { webSearchTool } from "@/lib/tools/webSearch";
import { ragTool } from "@/lib/tools/ragTool";
import { wikipediaTool } from "@/lib/tools/wikipediaTool";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",
});

export const agent = createReactAgent({
  llm: model,
  tools: [calculatorTool, webSearchTool, ragTool, wikipediaTool],
});
