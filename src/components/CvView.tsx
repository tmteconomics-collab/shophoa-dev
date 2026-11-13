import PrintButton from "@/components/PrintButton";
import LangToggle from "@/components/LangToggle";
import type { Content } from "@/content/i18n";

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * The print-ready CV, shared by /cv/ (English) and /vi/cv/ (Vietnamese). The
 * downloadable PDF stays the English one (public/devan-cv.pdf); the Vietnamese
 * toolbar labels its button accordingly and prints the page itself instead.
 */
export default function CvView({ c, altCv }: { c: Content; altCv: string }) {
  const { site, credentials, cv, ui } = c;
  const publicUrl = /localhost|127\.0\.0\.1/.test(site.url) ? null : `${site.url}${c.cvPath}`;
  return (
    <>
      <a className="skip-link" href="#cv">
        {ui.cvUi.back}
      </a>
      <header className="cv-bar">
        <div className="cv-bar-inner">
          <a className="cv-back" href={c.home}>
            <span aria-hidden="true">←</span> {ui.cvUi.back}
          </a>
          <div className="cv-actions">
            <LangToggle c={c} href={altCv} />
            <a className="btn btn-sun cv-btn" href="/devan-cv.pdf" download>
              {ui.cvUi.download}
            </a>
            <PrintButton label={ui.cvUi.print} />
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
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
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
                  {ui.cvUi.profile}
                </h2>
                <p>{cv.profile}</p>
              </section>

              <section aria-labelledby="cv-experience">
                <h2 id="cv-experience" className="cv-h">
                  {ui.cvUi.experience}
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
                  {ui.cvUi.project}
                </h2>
                <p>
                  <b>{cv.project.name}.</b> {cv.project.text}
                </p>
              </section>
            </div>

            <div className="cv-side">
              <section aria-labelledby="cv-skills">
                <h2 id="cv-skills" className="cv-h">
                  {ui.cvUi.skills}
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
                  {ui.cvUi.certifications}
                </h2>
                <ul className="cv-list">
                  {credentials.certifications.map((cert) => (
                    <li key={cert.name}>
                      {cert.url ? <a href={cert.url}>{cert.name}</a> : cert.name}
                      {cert.issuer || cert.year ? (
                        <span className="cv-dim"> ({[cert.issuer, cert.year].filter(Boolean).join(", ")})</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="cv-education">
                <h2 id="cv-education" className="cv-h">
                  {ui.cvUi.education}
                </h2>
                <p className="cv-degree">{credentials.education.degree}</p>
                <p>{credentials.education.school}</p>
                <p className="cv-dim">
                  {credentials.education.years}. {credentials.education.note}
                </p>
              </section>

              <section aria-labelledby="cv-languages">
                <h2 id="cv-languages" className="cv-h">
                  {ui.cvUi.languages}
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
