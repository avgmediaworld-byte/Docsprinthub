import type { Metadata } from "next";
import "./globals.css";
import LanguageProvider from "./components/LanguageProvider";
import { AnalyticsTracker } from "./lib/analytics/client";

export const metadata: Metadata = {
  title: "DocSprintHub",
  description: "Your complete document hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><LanguageProvider><AnalyticsTracker />{children}</LanguageProvider></body>
    </html>
  );
}
