import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Portfolio from "@/components/Portfolio";
import { roleVersions } from "@/content/roles";
import { ogImage, site } from "@/content/site";

// Tailored versions of the home page for job applications. See src/content/roles.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return roleVersions.map((r) => ({ role: r.slug }));
}

type Props = { params: Promise<{ role: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const v = roleVersions.find((r) => r.slug === role);
  if (!v) return {};
  const title = `${site.name} · ${v.label}`;
  const path = `/for/${v.slug}/`;
  return {
    title,
    description: v.description,
    alternates: { canonical: path },
    robots: { index: false, follow: true },
    openGraph: {
      type: "profile",
      title,
      description: v.description,
      url: path,
      siteName: site.name,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description: v.description, images: [ogImage.url] },
  };
}

export default async function RolePage({ params }: Props) {
  const { role } = await params;
  const v = roleVersions.find((r) => r.slug === role);
  if (!v) notFound();
  return <Portfolio hero={v.hero} order={v.order} />;
}
