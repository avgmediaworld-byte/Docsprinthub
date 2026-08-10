import type { MetadataRoute } from "next";

const siteUrl = "https://docsprinthub.vercel.app";

const publicPages: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/resume-builder", changeFrequency: "monthly", priority: 0.9 },
  { path: "/cover-page-generator", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pdf-tools", changeFrequency: "monthly", priority: 0.9 },
  { path: "/qr-generator", changeFrequency: "monthly", priority: 0.8 },
  { path: "/help-support", changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency,
    priority,
  }));
}
