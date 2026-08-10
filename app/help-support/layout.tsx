import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help with DocSprintHub tools, report a problem, request a feature, or suggest an improvement.",
  alternates: {
    canonical: "/help-support",
  },
  openGraph: {
    url: "/help-support",
    title: "Help & Support | DocSprintHub",
    description: "Get help with DocSprintHub tools, report a problem, request a feature, or suggest an improvement.",
  },
};

export default function HelpSupportLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
