// Every public page, for the sitemap, with its English/Vietnamese pair for the
// hreflang alternates. The role versions under /for/ are noindex and stay out.
export const routes: { path: string; priority: number; alt: { en: string; vi: string } }[] = [
  { path: "/", priority: 1, alt: { en: "/", vi: "/vi/" } },
  { path: "/vi/", priority: 1, alt: { en: "/", vi: "/vi/" } },
  { path: "/cv/", priority: 0.8, alt: { en: "/cv/", vi: "/vi/cv/" } },
  { path: "/vi/cv/", priority: 0.8, alt: { en: "/cv/", vi: "/vi/cv/" } },
];
