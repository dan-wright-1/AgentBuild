import type { Metadata } from "next";
import { PostHogProvider } from "@/components/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentBuild",
  description: "Multi-tool AI agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full font-mono antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
