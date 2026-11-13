import type { MetadataRoute } from "next";
import { routes } from "@/content/routes";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const abs = (p: string) => `${site.url}${p}`;
  return routes.map((r) => ({
    url: abs(r.path),
    lastModified,
    priority: r.priority,
    alternates: { languages: { en: abs(r.alt.en), vi: abs(r.alt.vi) } },
  }));
}
