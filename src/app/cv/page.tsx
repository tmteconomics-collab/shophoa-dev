import type { Metadata } from "next";
import CvView from "@/components/CvView";
import { getContent } from "@/content/i18n";
import { ogImage } from "@/content/site";

const c = getContent("en");
const { site, cv } = c;
const title = `${site.name} · ${cv.title}`;
const description = `CV of ${site.name}, ${site.role} at ${site.company}, ${site.location}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cv/", languages: { en: "/cv/", vi: "/vi/cv/", "x-default": "/cv/" } },
  openGraph: {
    type: "profile",
    title,
    description,
    url: "/cv/",
    siteName: site.name,
    locale: "en_US",
    alternateLocale: "vi_VN",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
};

export default function CvPage() {
  return <CvView c={c} altCv="/vi/cv/" />;
}
