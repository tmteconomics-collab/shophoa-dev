// Two languages, one page. The English copy in site.ts is the source of truth for
// which fields exist; the Vietnamese copy in vi.ts mirrors it. This file assembles
// each language into one Content bundle and adds the UI chrome (nav, labels, the
// tool strings) that lives outside site.ts. Pages pass a bundle to <Portfolio> and
// <CvView>; nothing switches language at runtime.
import {
  about,
  ai,
  contact,
  credentials,
  cv,
  growth,
  hero,
  proof,
  site,
  solutions,
  summary,
  tools,
  websites,
  workflow,
} from "./site";
import {
  viAbout,
  viAi,
  viContact,
  viCredentials,
  viCv,
  viGrowth,
  viHero,
  viProof,
  viSite,
  viSolutions,
  viSummary,
  viTools,
  viWebsites,
  viWorkflow,
} from "./vi";

export type Locale = "en" | "vi";

// UI chrome, per language. Everything the components render that is not in site.ts.
export interface Ui {
  lang: string; // BCP-47, for <html lang> and og:locale
  skipToContent: string;
  skipIntro: string;
  backToTop: string;
  openNewTab: string;
  nav: { about: string; solutions: string; process: string; measurement: string; websites: string; contact: string };
  sectionsMenu: string;
  // Labels for the section dots and menu, keyed by section id (see sections.ts).
  sections: Record<string, string>;
  summaryTerms: { now: string; whatIDo: string; tools: string; study: string; languages: string };
  summaryCta: { linkedin: string; cv: string };
  creds: { skills: string; certifications: string; education: string; languages: string; verify: string };
  footer: { builtWith: string; cv: string; linkedin: string; email: string };
  motion: { pause: string; play: string };
  langToggle: { label: string; en: string; vi: string; enFull: string; viFull: string };
  toolsNeedJs: string;
  utmUi: {
    url: string;
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
    optional: string;
    taggedLink: string;
    empty: string;
    open: string;
    hide: string;
    copy: string;
    badUrl: string;
    copied: string;
    copyFail: string;
  };
  budgetUi: {
    model: string;
    budget: string;
    ctr: string;
    cvr: string;
    optional: string;
    estimate: string;
    empty: string;
    open: string;
    hide: string;
    rateCpm: string;
    rateCpc: string;
    rateCpd: string;
    budgetPlaceholder: string;
    ratePlaceholder: string;
    numLocale: string;
    money: string;
    rows: {
      impressions: string;
      clicks: string;
      costPerClick: string;
      conversions: string;
      costPerConversion: string;
      days: string;
    };
  };
  cvUi: {
    back: string;
    download: string;
    print: string;
    profile: string;
    experience: string;
    project: string;
    skills: string;
    certifications: string;
    education: string;
    languages: string;
  };
}

const uiEn: Ui = {
  lang: "en",
  skipToContent: "Skip to content",
  skipIntro: "Skip intro",
  backToTop: "Devan, back to top",
  openNewTab: " (opens in a new tab)",
  nav: {
    about: "About",
    solutions: "Ad solutions",
    process: "How I work",
    measurement: "Analytics",
    websites: "WordPress",
    contact: "Contact",
  },
  sectionsMenu: "Sections",
  sections: {
    top: "Start",
    summary: "The short version",
    about: "About",
    solutions: "Ad solutions",
    process: "How I work",
    measurement: "Measurement",
    websites: "WordPress",
    tools: "Tools",
    proof: "Results and references",
    "built-with-ai": "Built with AI",
    skills: "Skills",
    contact: "Contact",
  },
  summaryTerms: { now: "Now", whatIDo: "What I do", tools: "Tools", study: "Study", languages: "Languages" },
  summaryCta: { linkedin: "Message me on LinkedIn", cv: "View CV" },
  creds: {
    skills: "Skills",
    certifications: "Certifications",
    education: "Education",
    languages: "Languages",
    verify: "Verify",
  },
  footer: { builtWith: "Built with Claude Code", cv: "CV", linkedin: "LinkedIn", email: "Email" },
  motion: { pause: "Pause motion", play: "Play motion" },
  langToggle: { label: "Language", en: "EN", vi: "VI", enFull: "English", viFull: "Tiếng Việt" },
  toolsNeedJs: "These tools need JavaScript.",
  utmUi: {
    url: "Landing page URL",
    source: "Source",
    medium: "Medium",
    campaign: "Campaign",
    term: "Term",
    content: "Content",
    optional: "optional",
    taggedLink: "Tagged link",
    empty: "Fill in the page URL, source, medium and campaign.",
    open: "Open the UTM builder",
    hide: "Hide",
    copy: "Copy link",
    badUrl: "That page URL does not look right. Try https://example.com/page",
    copied: "Copied.",
    copyFail: "Copy did not work here. Select the link and copy it.",
  },
  budgetUi: {
    model: "Buying model",
    budget: "Budget (VND)",
    ctr: "Click-through rate (%)",
    cvr: "Conversion rate (%)",
    optional: "optional",
    estimate: "Estimate",
    empty: "Enter a budget and your price to see an estimate.",
    open: "Open the budget estimator",
    hide: "Hide",
    rateCpm: "Your price per 1,000 impressions (VND)",
    rateCpc: "Your price per click (VND)",
    rateCpd: "Your price per day (VND)",
    budgetPlaceholder: "Your budget",
    ratePlaceholder: "From your quote",
    numLocale: "en-US",
    money: "VND",
    rows: {
      impressions: "Impressions",
      clicks: "Clicks",
      costPerClick: "Cost per click",
      conversions: "Conversions",
      costPerConversion: "Cost per conversion",
      days: "Days on the placement",
    },
  },
  cvUi: {
    back: "Back to the portfolio",
    download: "Download PDF",
    print: "Print",
    profile: "Profile",
    experience: "Experience",
    project: "Selected project",
    skills: "Skills",
    certifications: "Certifications",
    education: "Education",
    languages: "Languages",
  },
};

const uiVi: Ui = {
  lang: "vi",
  skipToContent: "Tới nội dung",
  skipIntro: "Bỏ qua phần mở đầu",
  backToTop: "Devan, về đầu trang",
  openNewTab: " (mở trong tab mới)",
  nav: {
    about: "Giới thiệu",
    solutions: "Giải pháp quảng cáo",
    process: "Cách làm việc",
    measurement: "Đo lường",
    websites: "WordPress",
    contact: "Liên hệ",
  },
  sectionsMenu: "Mục",
  sections: {
    top: "Mở đầu",
    summary: "Tóm tắt nhanh",
    about: "Giới thiệu",
    solutions: "Giải pháp quảng cáo",
    process: "Cách làm việc",
    measurement: "Đo lường",
    websites: "WordPress",
    tools: "Công cụ",
    proof: "Kết quả và tham chiếu",
    "built-with-ai": "Dựng bằng AI",
    skills: "Kỹ năng",
    contact: "Liên hệ",
  },
  summaryTerms: { now: "Hiện tại", whatIDo: "Tôi làm gì", tools: "Công cụ", study: "Học vấn", languages: "Ngôn ngữ" },
  summaryCta: { linkedin: "Nhắn tôi trên LinkedIn", cv: "Xem CV" },
  creds: {
    skills: "Kỹ năng",
    certifications: "Chứng chỉ",
    education: "Học vấn",
    languages: "Ngôn ngữ",
    verify: "Xác minh",
  },
  footer: { builtWith: "Dựng bằng Claude Code", cv: "CV", linkedin: "LinkedIn", email: "Email" },
  motion: { pause: "Tắt chuyển động", play: "Bật chuyển động" },
  langToggle: { label: "Ngôn ngữ", en: "EN", vi: "VI", enFull: "English", viFull: "Tiếng Việt" },
  toolsNeedJs: "Các công cụ này cần JavaScript.",
  utmUi: {
    url: "URL trang đích",
    source: "Nguồn (source)",
    medium: "Kênh (medium)",
    campaign: "Chiến dịch (campaign)",
    term: "Từ khóa (term)",
    content: "Nội dung (content)",
    optional: "không bắt buộc",
    taggedLink: "Link đã gắn thẻ",
    empty: "Điền URL trang, nguồn, kênh và chiến dịch.",
    open: "Mở trình tạo UTM",
    hide: "Ẩn",
    copy: "Sao chép link",
    badUrl: "URL trang chưa đúng. Thử dạng https://example.com/page",
    copied: "Đã sao chép.",
    copyFail: "Không sao chép được ở đây. Hãy chọn link và sao chép thủ công.",
  },
  budgetUi: {
    model: "Hình thức mua",
    budget: "Ngân sách (VNĐ)",
    ctr: "Tỷ lệ nhấp (CTR, %)",
    cvr: "Tỷ lệ chuyển đổi (%)",
    optional: "không bắt buộc",
    estimate: "Ước tính",
    empty: "Nhập ngân sách và mức giá của bạn để xem ước tính.",
    open: "Mở công cụ ước tính",
    hide: "Ẩn",
    rateCpm: "Giá của bạn cho 1.000 lượt hiển thị (VNĐ)",
    rateCpc: "Giá của bạn cho mỗi lượt nhấp (VNĐ)",
    rateCpd: "Giá của bạn cho mỗi ngày (VNĐ)",
    budgetPlaceholder: "Ngân sách của bạn",
    ratePlaceholder: "Theo báo giá của bạn",
    numLocale: "vi-VN",
    money: "VNĐ",
    rows: {
      impressions: "Lượt hiển thị",
      clicks: "Lượt nhấp",
      costPerClick: "Chi phí mỗi nhấp",
      conversions: "Lượt chuyển đổi",
      costPerConversion: "Chi phí mỗi chuyển đổi",
      days: "Số ngày giữ vị trí",
    },
  },
  cvUi: {
    back: "Về trang portfolio",
    download: "Tải PDF (tiếng Việt)",
    print: "In",
    profile: "Giới thiệu",
    experience: "Kinh nghiệm",
    project: "Dự án tiêu biểu",
    skills: "Kỹ năng",
    certifications: "Chứng chỉ",
    education: "Học vấn",
    languages: "Ngôn ngữ",
  },
};

// One bundle per language. The types come from the English objects, so the
// Vietnamese objects must match their shape or the build fails.
export interface Content {
  locale: Locale;
  site: typeof site;
  hero: typeof hero;
  summary: typeof summary;
  about: typeof about;
  solutions: typeof solutions;
  workflow: typeof workflow;
  growth: typeof growth;
  websites: typeof websites;
  tools: typeof tools;
  proof: typeof proof;
  ai: typeof ai;
  credentials: typeof credentials;
  contact: typeof contact;
  cv: typeof cv;
  ui: Ui;
  // Paths for the language toggle and cross-links.
  home: string;
  cvPath: string;
  alt: string; // the other language's equivalent page
  cvPdf: string; // the downloadable CV PDF for this language
  cvNameSuffix: string; // real name shown after the display name on the CV only (empty = none)
}

const en: Content = {
  locale: "en",
  site,
  hero,
  summary,
  about,
  solutions,
  workflow,
  growth,
  websites,
  tools,
  proof,
  ai,
  credentials,
  contact,
  cv,
  ui: uiEn,
  home: "/",
  cvPath: "/cv/",
  alt: "/vi/",
  cvPdf: "/devan-cv.pdf",
  cvNameSuffix: "",
};

const vi: Content = {
  locale: "vi",
  site: viSite,
  hero: viHero,
  summary: viSummary,
  about: viAbout,
  solutions: viSolutions,
  workflow: viWorkflow,
  growth: viGrowth,
  websites: viWebsites,
  tools: viTools,
  proof: viProof,
  ai: viAi,
  credentials: viCredentials,
  contact: viContact,
  cv: viCv,
  ui: uiVi,
  home: "/vi/",
  cvPath: "/vi/cv/",
  alt: "/",
  cvPdf: "/devan-cv-vi.pdf",
  cvNameSuffix: "Tuấn Trần",
};

const bundles: Record<Locale, Content> = { en, vi };

export function getContent(locale: Locale): Content {
  return bundles[locale];
}
