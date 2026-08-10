import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume Builder",
  description: "Build a professional resume online, choose a template, and download your resume in PDF or image format.",
  alternates: {
    canonical: "/resume-builder",
  },
  openGraph: {
    url: "/resume-builder",
    title: "Free Resume Builder | DocSprintHub",
    description: "Build a professional resume online and download it in PDF or image format.",
  },
};

export default function ResumeBuilderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
