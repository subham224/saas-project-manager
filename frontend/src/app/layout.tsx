import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS PM Tool",
  description: "Project Management for Startups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
