import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Dynamic robots.txt — allows Googlebot and all crawlers on public pages.
 * Blocks transactional / API routes that should not appear in search.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/order/success"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/order/success"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
