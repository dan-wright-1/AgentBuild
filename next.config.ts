import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mathjs"],
  devIndicators: false,
  // The RAG tool reads its knowledge base from disk at runtime; make sure the
  // markdown files ship with the serverless function on Vercel.
  outputFileTracingIncludes: {
    "/api/chat": ["./lib/rag/docs/**/*"],
  },
};

export default nextConfig;
