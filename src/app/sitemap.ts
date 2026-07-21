import type { MetadataRoute } from "next";
import { availableProducts } from "@/data/products";
import { site } from "@/data/site";

/**
 * Programmatic sitemap — regenerates on each production deploy/build.
 * Add new public pages to `staticRoutes` so Google discovers them automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  // Product photos for the homepage image sitemap (helps Google image discovery)
  const productImages = availableProducts
    .map((p) => p.image)
    .filter((src): src is string => Boolean(src))
    .map((src) => `${base}${src}`);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: productImages.slice(0, 10),
    },
    {
      url: `${base}/order`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/policies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  return staticRoutes;
}
