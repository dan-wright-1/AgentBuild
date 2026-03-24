"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  isStreaming?: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  calculator: "calculator",
  web_search: "web search",
  rag_search: "knowledge base",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const userMessage: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, userMessage]);

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      tools: [],
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw) as {
              type: string;
              token?: string;
              tool?: string;
              message?: string;
            };

            if (event.type === "token" && event.token) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + event.token,
                  };
                }
                return updated;
              });
            }

            if (event.type === "tool_start" && event.tool) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    tools: [...(last.tools ?? []), event.tool!],
                  };
                }
                return updated;
              });
            }

            if (event.type === "done" || event.type === "error") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    isStreaming: false,
                    content:
                      event.type === "error"
                        ? `Error: ${event.message}`
                        : last.content,
                  };
                }
                return updated;
              });
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            isStreaming: false,
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          };
        }
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#080808] text-neutral-200 font-mono">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b border-neutral-900">
        <span className="text-xs tracking-[0.2em] text-neutral-500 uppercase">
          agentbuild
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-700 text-sm tracking-widest">
              — ask anything —
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 max-w-2xl ${
              msg.role === "user" ? "ml-auto items-end" : "items-start"
            }`}
          >
            {/* Tool badges */}
            {msg.role === "assistant" &&
              msg.tools &&
              msg.tools.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {[...new Set(msg.tools)].map((t) => (
                    <span
                      key={t}
                      className="text-[10px] tracking-widest text-neutral-600 border border-neutral-800 px-2 py-0.5 uppercase"
                    >
                      {TOOL_LABELS[t] ?? t}
                    </span>
                  ))}
                </div>
              )}

            {/* Message content */}
            <div
              className={`text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-neutral-400"
                  : "text-neutral-100"
              }`}
            >
              {msg.content}
              {msg.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 bg-neutral-500 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-none border-t border-neutral-900 px-6 py-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder=""
            rows={1}
            className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-700 resize-none outline-none border-b border-neutral-800 pb-1 focus:border-neutral-600 transition-colors duration-200 disabled:opacity-40"
            style={{ minHeight: "1.5rem", maxHeight: "8rem" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="text-neutral-500 hover:text-neutral-200 transition-colors duration-200 disabled:opacity-20 pb-1 text-base"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
