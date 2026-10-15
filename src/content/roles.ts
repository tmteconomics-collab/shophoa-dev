// Tailored versions of the home page, to send with a job application: the same
// facts with a different opening line and section order. They live at
// /for/<slug>/ and are noindex, so search engines keep one main page.
// Copy follows the rules in site.ts: nothing the owner has not confirmed.

export type SectionId = "solutions" | "process" | "measurement" | "websites";

/** Order of the four middle sections on the main page. */
export const defaultOrder: SectionId[] = ["solutions", "process", "measurement", "websites"];

export interface HeroCopy {
  lead: string;
  highlight: string;
  tail: string;
  secondaryCta: { label: string; href: string };
}

export interface RoleVersion {
  slug: string;
  /** Kind of role this version is for, used in the page title. */
  label: string;
  description: string;
  hero: HeroCopy;
  order: SectionId[];
}

export const roleVersions: RoleVersion[] = [
  {
    slug: "account-management",
    label: "Account management and ad sales",
    description:
      "Devan manages brand and agency accounts at Cốc Cốc Ad Platform in Hanoi, from the first meeting through every campaign, and measures results with Google's tools.",
    hero: {
      lead: "I manage brand and agency accounts on Cốc Cốc Ad Platform,",
      highlight: "from the first meeting",
      tail: "through every campaign that follows, with results measured on Google's tools.",
      secondaryCta: { label: "See how I work", href: "#process" },
    },
    order: ["process", "solutions", "measurement", "websites"],
  },
  {
    slug: "performance-marketing",
    label: "Performance marketing and analytics",
    description:
      "Devan sets up Google Tag Manager, GA4 and Google Ads so every campaign is measured the same way, and sells and runs campaigns on Cốc Cốc Ad Platform in Hanoi.",
    hero: {
      lead: "I set up Tag Manager, GA4 and Google Ads so",
      highlight: "every campaign is measured the same way",
      tail: ", then use the data to improve results.",
      secondaryCta: { label: "See measurement work", href: "#measurement" },
    },
    order: ["measurement", "solutions", "websites", "process"],
  },
  {
    slug: "web",
    label: "WordPress and web projects",
    description:
      "Devan builds WordPress sites and WooCommerce stores that marketing teams can update on their own, with store events ready to measure in GA4.",
    hero: {
      lead: "I build WordPress sites and WooCommerce stores",
      highlight: "that marketing teams can update on their own",
      tail: ", with store events ready to measure in GA4.",
      secondaryCta: { label: "See WordPress work", href: "#websites" },
    },
    order: ["websites", "measurement", "solutions", "process"],
  },
];
