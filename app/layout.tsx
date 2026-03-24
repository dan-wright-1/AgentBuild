import type { Metadata } from "next";
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
      <body className="h-full font-mono antialiased">{children}</body>
    </html>
  );
}
