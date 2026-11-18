// Guardrails for the public demo. Every request that passes these checks spends
// real API credits (Anthropic, plus Tavily/OpenAI when those tools run), so:
//
//  - requests are size-checked before anything is called;
//  - each visitor (by IP) gets a limited number of questions per window;
//  - each server instance stops after a daily ceiling.
//
// The rate limits live in memory, so they are per server instance: Vercel may run
// several, and a cold start resets them. They stop casual overuse; the hard cap on
// spend is the monthly limit set on each API key in the providers' dashboards.
//
// Limits can be tuned with environment variables without a code change.

const num = (name: string, fallback: number) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
};

export const LIMITS = {
  messageChars: num("LIMIT_MESSAGE_CHARS", 1000),
  historyMessages: num("LIMIT_HISTORY_MESSAGES", 20),
  historyChars: num("LIMIT_HISTORY_CHARS", 16000),
  requestsPerWindow: num("LIMIT_REQUESTS_PER_WINDOW", 15),
  windowMinutes: num("LIMIT_WINDOW_MINUTES", 10),
  requestsPerDay: num("LIMIT_REQUESTS_PER_DAY", 400),
};

export type ChatBody = {
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  sessionId?: string;
};

/** Returns the parsed body, or an error message for the visitor. */
export function validateBody(body: unknown): { ok: true; body: ChatBody } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  const { message, history = [], sessionId } = body as Record<string, unknown>;

  if (typeof message !== "string" || !message.trim()) return { ok: false, error: "Please type a question." };
  if (message.length > LIMITS.messageChars) {
    return { ok: false, error: `Questions are limited to ${LIMITS.messageChars} characters in this demo.` };
  }
  if (!Array.isArray(history)) return { ok: false, error: "Invalid request." };
  if (history.length > LIMITS.historyMessages) {
    return { ok: false, error: "This conversation has reached the demo's length limit. Reload the page to start a new one." };
  }
  let chars = 0;
  for (const m of history) {
    if (!m || typeof m !== "object") return { ok: false, error: "Invalid request." };
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return { ok: false, error: "Invalid request." };
    chars += content.length;
  }
  if (chars > LIMITS.historyChars) {
    return { ok: false, error: "This conversation has reached the demo's length limit. Reload the page to start a new one." };
  }

  return {
    ok: true,
    body: {
      message,
      history: history as ChatBody["history"],
      sessionId: typeof sessionId === "string" ? sessionId : undefined,
    },
  };
}

// ---- in-memory rate limits (per server instance) ----

const hits = new Map<string, number[]>();
let day = new Date().toISOString().slice(0, 10);
let dayCount = 0;

/** Records a request; returns an error message if it is over a limit. */
export function checkRate(ip: string, now = Date.now()): string | null {
  const today = new Date(now).toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  if (dayCount >= LIMITS.requestsPerDay) {
    return "The demo has reached its daily limit. Please try again tomorrow.";
  }

  const windowMs = LIMITS.windowMinutes * 60_000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= LIMITS.requestsPerWindow) {
    const wait = Math.ceil((windowMs - (now - recent[0])) / 60_000);
    hits.set(ip, recent);
    return `You've reached the demo's limit of ${LIMITS.requestsPerWindow} questions per ${LIMITS.windowMinutes} minutes. Try again in about ${wait} minute${wait === 1 ? "" : "s"}.`;
  }

  recent.push(now);
  hits.set(ip, recent);
  dayCount += 1;

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(key);
  }
  return null;
}

/** Vercel sets x-forwarded-for to the visitor's address; fall back to a shared bucket. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
