import { NextRequest } from "next/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { agent } from "@/lib/agent/graph";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { message, history } = (await req.json()) as {
    message: string;
    history: Array<{ role: "user" | "assistant"; content: string }>;
  };

  const messages = [
    ...history.map((m) =>
      m.role === "user"
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)
    ),
    new HumanMessage(message),
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const eventStream = agent.streamEvents(
          { messages },
          { version: "v2" }
        );

        for await (const event of eventStream) {
          if (event.event === "on_chat_model_stream") {
            const chunk = event.data?.chunk;
            const content = chunk?.content;
            if (!content) continue;

            const token =
              typeof content === "string"
                ? content
                : Array.isArray(content)
                ? content
                    .map((c: { text?: string }) => c?.text ?? "")
                    .join("")
                : "";

            if (token) send({ type: "token", token });
          }

          if (event.event === "on_tool_start") {
            send({ type: "tool_start", tool: event.name });
          }

          if (event.event === "on_tool_end") {
            send({ type: "tool_end", tool: event.name });
          }
        }

        send({ type: "done" });
      } catch (error) {
        send({
          type: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
