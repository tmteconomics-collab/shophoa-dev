import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import { credentials, cv, ogImage, site } from "@/content/site";

const title = `${site.name} · ${cv.title}`;
const description = `CV of ${site.name}, ${site.role} at ${site.company}, ${site.location}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cv/" },
  openGraph: { type: "profile", title, description, url: "/cv/", siteName: site.name, locale: "en_US", images: [ogImage] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
};

// The site address is printed only once the build knows its public URL.
const publicUrl = /localhost|127\.0\.0\.1/.test(site.url) ? null : site.url;
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function CvPage() {
  return (
    <>
      <a className="skip-link" href="#cv">
        Skip to CV
      </a>
      <header className="cv-bar">
        <div className="cv-bar-inner">
          <a className="cv-back" href="/">
            <span aria-hidden="true">←</span> Back to the portfolio
          </a>
          <div className="cv-actions">
            <a className="btn btn-sun cv-btn" href="/devan-cv.pdf" download>
              Download PDF
            </a>
            <PrintButton />
          </div>
        </div>
      </header>

      <main id="cv" className="cv-page">
        <article className="cv-sheet" aria-labelledby="cv-name">
          <header className="cv-head">
            <div>
              <h1 id="cv-name" className="cv-name">
                {site.name}
              </h1>
              <p className="cv-role">
                {site.role}, {site.company}
              </p>
            </div>
            <ul className="cv-contact">
              <li>{site.location}</li>
              <li>
                <a href={site.linkedin}>{bare(site.linkedin)}</a>
              </li>
              {publicUrl ? (
                <li>
                  <a href={publicUrl}>{bare(publicUrl)}</a>
                </li>
              ) : null}
            </ul>
          </header>

          <div className="cv-grid">
            <div className="cv-main">
              <section aria-labelledby="cv-profile">
                <h2 id="cv-profile" className="cv-h">
                  Profile
                </h2>
                <p>{cv.profile}</p>
              </section>

              <section aria-labelledby="cv-experience">
                <h2 id="cv-experience" className="cv-h">
                  Experience
                </h2>
                {cv.experience.map((job) => (
                  <div key={job.company} className="cv-job">
                    <h3 className="cv-company">
                      {job.company}
                      <span className="cv-place">, {job.place}</span>
                    </h3>
                    <ul className="cv-roles">
                      {job.roles.map((r) => (
                        <li key={r.title}>
                          <b>{r.title}</b>
                          <span>{r.dates}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="cv-points">
                      {job.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section aria-labelledby="cv-project">
                <h2 id="cv-project" className="cv-h">
                  Selected project
                </h2>
                <p>
                  <b>{cv.project.name}.</b> {cv.project.text}
                </p>
              </section>
            </div>

            <div className="cv-side">
              <section aria-labelledby="cv-skills">
                <h2 id="cv-skills" className="cv-h">
                  Skills
                </h2>
                <dl className="cv-skills">
                  {cv.skillGroups.map((g) => (
                    <div key={g.name}>
                      <dt>{g.name}</dt>
                      <dd>{g.items.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="cv-certs">
                <h2 id="cv-certs" className="cv-h">
                  Certifications
                </h2>
                <ul className="cv-list">
                  {credentials.certifications.map((c) => (
                    <li key={c.name}>
                      {c.url ? <a href={c.url}>{c.name}</a> : c.name}
                      {c.issuer || c.year ? (
                        <span className="cv-dim"> ({[c.issuer, c.year].filter(Boolean).join(", ")})</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="cv-education">
                <h2 id="cv-education" className="cv-h">
                  Education
                </h2>
                <p className="cv-degree">{credentials.education.degree}</p>
                <p>{credentials.education.school}</p>
                <p className="cv-dim">
                  {credentials.education.years}. {credentials.education.note}
                </p>
              </section>

              <section aria-labelledby="cv-languages">
                <h2 id="cv-languages" className="cv-h">
                  Languages
                </h2>
                <ul className="cv-list">
                  {credentials.languages.map((l) => (
                    <li key={l.name}>
                      {l.name} <span className="cv-dim">({l.level.toLowerCase()})</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
