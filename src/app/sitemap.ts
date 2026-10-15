import type { MetadataRoute } from "next";
import { routes } from "@/content/routes";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({ url: `${site.url}${r.path}`, lastModified, priority: r.priority }));
}
