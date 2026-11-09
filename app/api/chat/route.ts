import { after, NextRequest } from "next/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { agent } from "@/lib/agent/graph";
import {
  captureAIGeneration,
  flushPostHog,
} from "@/lib/posthog-server";
import {
  emitPostHogLog,
  flushPostHogLogs,
} from "@/instrumentation";
import { SeverityNumber } from "@opentelemetry/api-logs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { message, history, sessionId } = (await req.json()) as {
    message: string;
    history: Array<{ role: "user" | "assistant"; content: string }>;
    sessionId?: string;
  };
  const posthogSessionId =
    sessionId && /^[A-Za-z0-9_~.@()!':|-]+$/.test(sessionId)
      ? sessionId
      : crypto.randomUUID();
  const posthogTraceId = crypto.randomUUID();

  emitPostHogLog("chat request started", SeverityNumber.INFO, {
    history_message_count: history.length,
    has_client_session_id: Boolean(sessionId),
  });
  after(flushPostHogLogs);

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
      let toolCallCount = 0;
      const generationStarts = new Map<
        string,
        { input: unknown; startedAt: number }
      >();
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const eventStream = agent.streamEvents(
          { messages },
          {
            version: "v2",
            metadata: {
              posthogSessionId,
              posthogTraceId,
            },
          }
        );

        for await (const event of eventStream) {
          if (event.event === "on_chat_model_start") {
            generationStarts.set(event.run_id, {
              input: event.data?.input,
              startedAt: Date.now(),
            });
          }

          if (event.event === "on_chat_model_end") {
            const generation = generationStarts.get(event.run_id);
            const output = event.data?.output as
              | {
                  content?: unknown;
                  usage_metadata?: {
                    input_tokens?: number;
                    output_tokens?: number;
                  };
                }
              | undefined;

            if (generation) {
              captureAIGeneration({
                sessionId: posthogSessionId,
                traceId: posthogTraceId,
                input: generation.input,
                output: output?.content,
                inputTokens: output?.usage_metadata?.input_tokens ?? 0,
                outputTokens: output?.usage_metadata?.output_tokens ?? 0,
                latency: (Date.now() - generation.startedAt) / 1000,
              });
              generationStarts.delete(event.run_id);
            }
          }

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
            toolCallCount += 1;
            send({ type: "tool_start", tool: event.name });
          }

          if (event.event === "on_tool_end") {
            send({ type: "tool_end", tool: event.name });
          }
        }

        emitPostHogLog("chat response completed", SeverityNumber.INFO, {
          tool_call_count: toolCallCount,
        });
        send({ type: "done" });
      } catch (error) {
        emitPostHogLog("chat response failed", SeverityNumber.ERROR, {
          failure_type: error instanceof Error ? error.name : "unknown",
          tool_call_count: toolCallCount,
        });
        send({
          type: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      } finally {
        await flushPostHog();
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
