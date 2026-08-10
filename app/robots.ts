import type { MetadataRoute } from "next";

const siteUrl = "https://docsprinthub.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/login", "/admin/analytics", "/api", "/api/analytics", "/api/admin"],
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
