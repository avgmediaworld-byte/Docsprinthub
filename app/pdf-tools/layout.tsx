import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Tools",
  description: "Merge, split, compress, convert, edit, and organize PDF documents online with DocSprintHub PDF Tools.",
  alternates: {
    canonical: "/pdf-tools",
  },
  openGraph: {
    url: "/pdf-tools",
    title: "Free PDF Tools | DocSprintHub",
    description: "Merge, split, compress, convert, edit, and organize PDF documents online.",
  },
};

export default function PdfToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
