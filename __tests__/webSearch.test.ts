import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch before importing the tool
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Set env var
process.env.TAVILY_API_KEY = "test-key";

const { webSearchTool } = await import("@/lib/tools/webSearch");

describe("webSearchTool", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns formatted search results", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            title: "Test Result",
            url: "https://example.com",
            content: "This is test content.",
          },
        ],
      }),
    } as Response);

    const result = await webSearchTool.invoke({ query: "test query" });
    expect(result).toContain("Test Result");
    expect(result).toContain("https://example.com");
    expect(result).toContain("This is test content.");
  });

  it("returns 'No results found.' when results array is empty", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    const result = await webSearchTool.invoke({ query: "empty query" });
    expect(result).toBe("No results found.");
  });

  it("handles API errors gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({}),
    } as Response);

    const result = await webSearchTool.invoke({ query: "fail query" });
    expect(result).toMatch(/Search failed/i);
  });
});
