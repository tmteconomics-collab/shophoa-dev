import type { Metadata } from "next";
import Portfolio from "@/components/Portfolio";
import { getContent } from "@/content/i18n";
import { ogImage } from "@/content/site";

const c = getContent("vi");

export const metadata: Metadata = {
  title: c.site.title,
  description: c.site.description,
  alternates: { canonical: "/vi/", languages: { en: "/", vi: "/vi/", "x-default": "/" } },
  openGraph: {
    type: "profile",
    title: c.site.title,
    description: c.site.description,
    url: "/vi/",
    siteName: c.site.name,
    locale: "vi_VN",
    alternateLocale: "en_US",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: c.site.title, description: c.site.description, images: [ogImage.url] },
};

export default function ViHome() {
  return <Portfolio content={c} />;
}
