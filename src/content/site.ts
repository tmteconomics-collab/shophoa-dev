// All copy lives here. Facts come from the owner's LinkedIn profile and notes
// (see docs/original-brief.md). Do not add achievements, metrics, quotes or
// client names that the owner has not confirmed.

function siteUrl() {
  const env = process.env;
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (env.CF_PAGES_URL) return env.CF_PAGES_URL.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const site = {
  name: "Devan",
  // Owner's LinkedIn name. Used only in structured data, never shown on the page.
  legalName: "Tuan Tran",
  role: "Strategic Account Executive",
  company: "Cốc Cốc Ad Platform",
  location: "Hanoi, Vietnam",
  // Absolute base for canonical, Open Graph and sitemap links. Set NEXT_PUBLIC_SITE_URL
  // for a custom domain; otherwise the build uses the address Vercel or Cloudflare
  // Pages gives the project, so shared links never point at localhost.
  url: siteUrl(),
  linkedin: "https://www.linkedin.com/in/tuantran-ams",
  title: "Devan · Digital advertising in Vietnam",
  description:
    "Devan is a Strategic Account Executive at Cốc Cốc Ad Platform in Hanoi. He helps brands reach Vietnamese users at scale and builds his own tools with AI.",
};

export const hero = {
  // Positioning line from the brief, kept as decided.
  lead: "I help brands reach Vietnamese users at scale and turn awareness into",
  highlight: "measurable results.",
  tail: "I also build my own tools with AI.",
  primaryCta: { label: "Connect on LinkedIn", href: site.linkedin },
  secondaryCta: { label: "See ad solutions", href: "#solutions" },
  credit: "Sky after Vincent van Gogh, The Starry Night (1889)",
};

export const about = {
  query: "who is devan",
  bannerTitle: "Hi, I'm Devan.",
  lines: [
    "I'm a Strategic Account Executive at Cốc Cốc Ad Platform in Hanoi.",
    "I work with brands and agencies from the first meeting through every campaign that follows.",
    "I joined as an Account Manager in November 2024 and moved into my current role in June 2025.",
    "I'm studying for an MBA at Foreign Trade University, part-time, alongside full-time work.",
    "I also build my own tools with AI. This site is one of them.",
  ],
  caption:
    "The big banner on the new tab page is one of the placements I sell. On this page, the slot is mine.",
};

export const solutions = {
  title: "Ad solutions I work with",
  // Public figures for the browser range from 22 to 30 million users depending on the
  // year, so the copy says "tens of millions" rather than a number that may date.
  intro:
    "Cốc Cốc's ad platform reaches tens of millions of Vietnamese users on PC and mobile through the Cốc Cốc browser. I match each brand's goal to the right placement and buying model.",
  stages: [
    {
      id: "awareness",
      name: "Awareness",
      summary: "Get the brand seen by a broad audience.",
      items: [
        {
          name: "New-tab big banner",
          text: "A large banner on the page users see each time they open a new tab.",
        },
        {
          name: "CPM buying",
          text: "Pay per thousand impressions when reach is the goal.",
        },
      ],
    },
    {
      id: "consideration",
      name: "Consideration",
      summary: "Show up when people look into your category.",
      items: [
        {
          name: "Search keyword ads",
          text: "Appear when users search for the keywords you choose.",
        },
        {
          name: "Native ads",
          text: "Ads that match the content around them, so they read as part of the page.",
        },
        {
          name: "Audience targeting",
          text: "Reach people by interest and industry, not only by volume.",
        },
      ],
    },
    {
      id: "conversion",
      name: "Conversion",
      summary: "Turn interest into visits and sales.",
      items: [
        {
          name: "Shopping product ads",
          text: "Put products in front of people who are ready to compare and buy.",
        },
        {
          name: "Retargeting",
          text: "Bring back people who already saw the brand, across display and search.",
        },
        {
          name: "CPC and CPD buying",
          // CPD on Cốc Cốc is cost per duration: a fixed price for a placement over a set time.
          text: "Pay per click when you need traffic, or pay a fixed price to hold a placement for a set time.",
        },
      ],
    },
  ],
  footnote:
    "Campaigns can be measured with transparent third-party tracking, so both sides read the same numbers.",
};

export const workflow = {
  title: "How I work with clients",
  intro: "No case studies here. This is the work itself, step by step.",
  steps: [
    {
      name: "Understand the goal",
      text: "It starts at the first meeting. I learn what the brand needs, whether that is reach, traffic or sales, and what success looks like to them.",
    },
    {
      name: "Plan and run the campaign",
      text: "I manage several accounts and deadlines at once, coordinate our internal teams and outside partners, and handle requests and escalations quickly.",
    },
    {
      name: "Forecast with data",
      text: "I track the key metrics and forecast results, so we can adjust a campaign before it drifts, not after.",
    },
    {
      name: "Negotiate and close",
      text: "I negotiate contracts that work for both sides, then look for the next opportunity together. Long-term relationships beat one-off deals.",
    },
  ],
};

// Owner request (2026-10-03): show measurement and performance work on Google's tools.
// TODO: owner to confirm Looker Studio is part of his reporting.
export const growth = {
  title: "Measurement and performance marketing",
  intro:
    "I set up Google Tag Manager, Google Analytics 4 and Google Ads so every campaign is measured the same way, then use that data to improve results and report them plainly.",
  steps: [
    {
      tool: "Google Tag Manager",
      name: "Tag",
      text: "One container on the site, then tags, triggers and variables for the actions that matter: leads, sign-ups, purchases. Every change is checked in preview before it goes live.",
    },
    {
      tool: "Google Analytics 4",
      name: "Measure",
      text: "Data streams, events marked as key events, audiences, and a link to Google Ads, so traffic and results read the same in both tools.",
    },
    {
      tool: "Google Ads",
      name: "Optimize",
      text: "Key events imported as conversions, a bidding strategy that matches the goal, negative keywords to cut wasted clicks, and steady tests of ads and landing pages.",
    },
    {
      tool: "Looker Studio",
      name: "Report",
      text: "GA4 and Google Ads in one report a client can read in a minute: spend, results, cost per result, and what changes next.",
    },
  ],
  note: "Panels show sample data to illustrate the workflow. They are not client results.",
};

// Owner request (2026-10-03): show that he builds websites on WordPress.
// WooCommerce confirmed by the owner. TODO: block editor or a page builder (Elementor)?
// Each step's key drives the particle highlight in src/stage/engine.ts.
export const websites = {
  title: "Websites and stores on WordPress",
  intro:
    "I build WordPress sites and WooCommerce stores that marketing teams can update on their own: one design system, reusable blocks and fast pages.",
  steps: [
    {
      key: "theme",
      name: "Theme and layout",
      text: "Start from a theme, then shape the header, footer and page templates in the site editor so every page shares one system.",
    },
    {
      key: "blocks",
      name: "Blocks and patterns",
      text: "Build pages from blocks, save repeated sections as patterns, and keep colours and type in global styles so edits stay consistent.",
    },
    {
      key: "store",
      name: "Online store",
      text: "Set up WooCommerce products, prices, stock, cart and checkout, with store events like add to cart and purchase ready to measure in GA4.",
    },
    {
      key: "responsive",
      name: "Responsive",
      text: "Check every layout on desktop, tablet and phone before launch, and fix what breaks at each size.",
    },
    {
      key: "speed",
      name: "Speed and SEO",
      text: "Compress images, cache pages, and set titles, descriptions and a sitemap, so pages load fast and get found.",
    },
  ],
  note: "Editor panels are illustrations, with sample content.",
};

export const ai = {
  title: "Built with AI",
  intro:
    "I vibe-code with Claude, using both the Claude app and Claude Code. This site is the latest result: I set the direction and made the calls, and Claude Code wrote the code.",
  steps: [
    {
      name: "Brief",
      text: "I wrote down who the site is for, what it must say, and what it must never claim.",
    },
    {
      name: "References",
      text: "I collected examples of portraits, particles and scroll scenes, and noted what to learn from them without copying.",
    },
    {
      name: "Prototype",
      text: "The hero came first: thousands of particles that paint a night sky after Van Gogh's The Starry Night and move with your cursor.",
    },
    {
      name: "Iterate",
      text: "I review each version and ask for changes until it feels right.",
    },
  ],
  lesson:
    "The biggest lesson: a clear brief does most of the work. Writing down what the site must never claim, and what it must not copy, shaped every decision after it.",
};

export const credentials = {
  title: "Skills, certifications and education",
  skills: [
    "SEO",
    "Inbound marketing",
    "Digital marketing",
    "Digital advertising",
    "Google Analytics 4",
    "Google Tag Manager",
    "Google Ads",
    "Looker Studio",
    "WordPress",
    "WooCommerce",
    "Vibe coding with Claude",
  ],
  // Names only, as on LinkedIn.
  certifications: ["SEO Certificate", "SEO II", "Social Media Marketing", "Graphic Design Essentials"],
  education: {
    degree: "Master of Business Administration",
    school: "Foreign Trade University, Hanoi",
    years: "2026 to 2028",
    note: "In progress, part-time alongside full-time work.",
  },
  languages: [
    { name: "Vietnamese", level: "Native" },
    { name: "English", level: "Professional working" },
  ],
};

export const contact = {
  title: "Let's talk.",
  text: "Planning a campaign for Vietnamese users, or curious how I build with AI? Send me a message on LinkedIn.",
  cta: { label: "Message me on LinkedIn", href: site.linkedin },
  meta: "Hanoi, Vietnam · English and Vietnamese",
};
