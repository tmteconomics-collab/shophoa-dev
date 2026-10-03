import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Devan, over a particle night sky after Van Gogh's The Starry Night" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b3a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: decides motion and WebGL mode so the static layout
// never flashes. Software-rendered WebGL counts as low power and gets the static
// layout. ?static forces the fallback; ?gl=force keeps WebGL on software renderers.
const boot = `(function(){var d=document.documentElement;try{
var q=location.search;
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
d.dataset.motion=rm?'reduce':'full';
var pz=false;try{pz=localStorage.getItem('devan-motion')==='paused'}catch(_){}
d.dataset.paused=pz?'on':'off';
var n=navigator,c=n.connection||{};
var low=c.saveData||/(^|-)2g$/.test(c.effectiveType||'')||(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2);
var gl=false;
if(!rm&&!low&&q.indexOf('static')<0){var cv=document.createElement('canvas');var x=cv.getContext('webgl2');gl=!!x;
if(x){var ri=x.getExtension('WEBGL_debug_renderer_info');var rn=String(x.getParameter(ri?ri.UNMASKED_RENDERER_WEBGL:x.RENDERER)||'');
if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(rn)&&q.indexOf('gl=force')<0)gl=false;
var e=x.getExtension('WEBGL_lose_context');e&&e.loseContext();}}
d.dataset.gl=gl?'pending':'off';
d.dataset.intro=gl&&!pz&&q.indexOf('nointro')<0&&scrollY<innerHeight*0.3?'on':'off';
}catch(_){d.dataset.gl='off';d.dataset.intro='off';}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.legalName,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.company },
  address: { "@type": "PostalAddress", addressLocality: "Hanoi", addressCountry: "VN" },
  knowsLanguage: ["vi", "en"],
  sameAs: [site.linkedin],
  url: site.url,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-motion="full" data-gl="off" data-intro="off" data-paused="off" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preload" href="/fonts/bricolage-grotesque-latin-wdth-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/be-vietnam-pro-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
