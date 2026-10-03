// All copy lives here. Facts come from the owner's LinkedIn profile and notes
// (see docs/original-brief.md). Do not add achievements, metrics, quotes or
// client names that the owner has not confirmed.

export const site = {
  name: "Devan",
  // Owner's LinkedIn name. Used only in structured data, never shown on the page.
  legalName: "Tuan Tran",
  role: "Strategic Account Executive",
  company: "Cốc Cốc Ad Platform",
  location: "Hanoi, Vietnam",
  // TODO: set the production domain once the site is deployed.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  linkedin: "https://www.linkedin.com/in/tuantran-ams",
  title: "Devan · Digital advertising in Vietnam",
  description:
    "Devan is a Strategic Account Executive at Cốc Cốc Ad Platform in Hanoi. He helps brands reach Vietnamese users at scale and builds his own tools with AI.",
};

export const hero = {
  // TODO: owner to confirm the positioning line (proposal from the brief).
  lead: "I help brands reach Vietnamese users at scale and turn awareness into",
  highlight: "measurable results.",
  tail: "I also build my own tools with AI.",
  primaryCta: { label: "Connect on LinkedIn", href: site.linkedin },
  secondaryCta: { label: "See ad solutions", href: "#solutions" },
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
  // TODO: verify both platform figures with Cốc Cốc before publishing.
  intro:
    "Cốc Cốc has spent nearly a decade building its ad platform. It reaches about 30 million users on PC and mobile through the Cốc Cốc browser. I match each brand's goal to the right placement and buying model.",
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
          // TODO: confirm CPD means cost per day on Cốc Cốc.
          text: "Pay per click when you need traffic, or book a placement by the day.",
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
      text: "The hero came first: particles that form my portrait, then a photo that follows your cursor.",
    },
    {
      name: "Iterate",
      text: "I review each version and ask for changes until it feels right.",
    },
  ],
  // TODO: owner to add one or two sentences on what he learned. Hidden while empty.
  lesson: "",
};

export const credentials = {
  title: "Skills, certifications and education",
  skills: ["SEO", "Inbound marketing", "Digital marketing", "Digital advertising", "Vibe coding with Claude"],
  // TODO: add issuers and dates.
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
