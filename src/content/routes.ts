// Every public page, for the sitemap. Add new pages here.
// The role versions under /for/ are noindex and stay out of the sitemap.
export const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/cv/", priority: 0.8 },
];
