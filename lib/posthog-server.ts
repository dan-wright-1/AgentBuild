import { PostHog } from "posthog-node";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthog: PostHog | null = null;

if (!token || !host) {
  if (process.env.NODE_ENV !== "production") {
    if (!token) {
      console.warn(
        "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
      );
    }
    if (!host) {
      console.warn(
        "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
      );
    }
  }
} else {
  posthog = new PostHog(token, {
    host,
    privacyMode: false,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0,
    enableExceptionAutocapture: true,
  });
}

export interface AITraceContext {
  sessionId: string;
  traceId: string;
}

export function captureAIGeneration({
  sessionId,
  traceId,
  input,
  output,
  inputTokens,
  outputTokens,
  latency,
}: AITraceContext & {
  input: unknown;
  output: unknown;
  inputTokens: number;
  outputTokens: number;
  latency: number;
}): void {
  posthog?.capture({
    distinctId: sessionId,
    event: "$ai_generation",
    properties: {
      $ai_trace_id: traceId,
      $ai_session_id: sessionId,
      $ai_model: "claude-sonnet-4-6",
      $ai_provider: "anthropic",
      $ai_input: input,
      $ai_output_choices: [{ role: "assistant", content: output }],
      $ai_input_tokens: inputTokens,
      $ai_output_tokens: outputTokens,
      $ai_latency: latency,
      $process_person_profile: false,
    },
  });
}

export function captureAIEmbedding({
  sessionId,
  traceId,
  input,
  inputTokens,
  latency,
}: AITraceContext & {
  input: unknown;
  inputTokens: number;
  latency: number;
}): void {
  posthog?.capture({
    distinctId: sessionId,
    event: "$ai_embedding",
    properties: {
      $ai_trace_id: traceId,
      $ai_session_id: sessionId,
      $ai_model: "text-embedding-3-small",
      $ai_provider: "openai",
      $ai_input: input,
      $ai_input_tokens: inputTokens,
      $ai_latency: latency,
      $process_person_profile: false,
    },
  });
}

export async function flushPostHog(): Promise<void> {
  if (posthog) await posthog.flush().catch(() => {});
}
