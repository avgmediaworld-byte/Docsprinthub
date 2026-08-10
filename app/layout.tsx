import type { Metadata } from "next";
import "./globals.css";
import LanguageProvider from "./components/LanguageProvider";
import { AnalyticsTracker } from "./lib/analytics/client";

const siteUrl = "https://docsprinthub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DocSprintHub | Free Document & PDF Tools",
    template: "%s | DocSprintHub",
  },
  description: "Create professional resumes, cover pages, PDFs, and QR codes with free online document tools from DocSprintHub.",
  applicationName: "DocSprintHub",
  keywords: ["resume builder", "cover page generator", "PDF tools", "QR code generator", "document tools"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "DocSprintHub",
    url: siteUrl,
    title: "DocSprintHub | Free Document & PDF Tools",
    description: "Create professional resumes, cover pages, PDFs, and QR codes with free online document tools from DocSprintHub.",
  },
  twitter: {
    card: "summary",
    title: "DocSprintHub | Free Document & PDF Tools",
    description: "Create professional resumes, cover pages, PDFs, and QR codes with free online document tools from DocSprintHub.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
