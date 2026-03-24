import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const { wikipediaTool } = await import("@/lib/tools/wikipediaTool");

describe("wikipediaTool", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns article title, extract, and source URL", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({
          query: { search: [{ title: "Artificial intelligence" }] },
        }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({
          query: {
            pages: {
              "1": {
                title: "Artificial intelligence",
                extract: "Artificial intelligence (AI) is the simulation of human intelligence.",
              },
            },
          },
        }),
      } as Response);

    const result = await wikipediaTool.invoke({ query: "artificial intelligence" });

    expect(result).toContain("Artificial intelligence");
    expect(result).toContain("simulation of human intelligence");
    expect(result).toContain("source: https://en.wikipedia.org/wiki/");
  });

  it("returns no-results message when search is empty", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ query: { search: [] } }),
    } as Response);

    const result = await wikipediaTool.invoke({ query: "xyzzy123nonexistent" });

    expect(result).toBe("No Wikipedia article found for that query.");
  });

  it("handles fetch errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await wikipediaTool.invoke({ query: "anything" });

    expect(result).toMatch(/Wikipedia lookup failed/i);
  });
});
