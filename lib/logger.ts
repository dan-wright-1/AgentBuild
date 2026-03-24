interface ToolCallEntry {
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
  duration: number;
}

export function log(entry: ToolCallEntry): void {
  const record = {
    timestamp: new Date().toISOString(),
    tool: entry.tool,
    args: entry.args,
    result:
      typeof entry.result === "string"
        ? entry.result.slice(0, 300)
        : entry.result,
    duration_ms: entry.duration,
  };
  console.log(JSON.stringify(record));
}
