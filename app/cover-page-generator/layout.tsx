import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Page Generator",
  description: "Create professional cover pages for college assignments, projects, reports, and research papers online.",
  alternates: {
    canonical: "/cover-page-generator",
  },
  openGraph: {
    url: "/cover-page-generator",
    title: "Cover Page Generator | DocSprintHub",
    description: "Create professional cover pages for assignments, projects, reports, and research papers.",
  },
};

export default function CoverPageGeneratorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
