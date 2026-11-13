import type { Metadata } from "next";
import CvView from "@/components/CvView";
import { getContent } from "@/content/i18n";
import { ogImage } from "@/content/site";

const c = getContent("vi");
const { site, cv } = c;
const title = `${site.name} · ${cv.title}`;
const description = `CV của ${site.name}, ${site.role} tại ${site.company}, ${site.location}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vi/cv/", languages: { en: "/cv/", vi: "/vi/cv/", "x-default": "/cv/" } },
  openGraph: {
    type: "profile",
    title,
    description,
    url: "/vi/cv/",
    siteName: site.name,
    locale: "vi_VN",
    alternateLocale: "en_US",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
};

export default function ViCvPage() {
  return <CvView c={c} altCv="/cv/" />;
}
