import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mathjs"],
  devIndicators: false,
};

export default nextConfig;
