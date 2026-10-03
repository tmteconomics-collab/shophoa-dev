import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Page not found · ${site.name}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div className="wrap">
        <p className="not-found-code">404</p>
        <h1 className="section-title">This page is off the rails.</h1>
        <p className="scene-intro">
          The link may be old or mistyped. The portfolio is one page, so everything is a click away.
        </p>
        <div className="cta-row">
          <a className="btn btn-sun" href="/">
            Back to the portfolio
          </a>
          <a className="btn btn-ghost" href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </main>
  );
}
