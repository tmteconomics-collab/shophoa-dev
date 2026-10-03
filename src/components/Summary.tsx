import { site, summary } from "@/content/site";

/** One card with the whole portfolio, for visitors who skim. */
export default function Summary() {
  return (
    <section id="summary" className="summary" aria-labelledby="summary-title">
      <div className="wrap">
        <div className="panel summary-card">
          <h2 id="summary-title" className="summary-title">
            {summary.title}
          </h2>
          <dl className="summary-list">
            <div>
              <dt>Now</dt>
              <dd>{summary.role}</dd>
            </div>
            <div>
              <dt>What I do</dt>
              <dd>
                <ul className="summary-pillars">
                  {summary.pillars.map((p) => (
                    <li key={p.href}>
                      <a href={p.href}>{p.text}</a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>{summary.tools.join(" · ")}</dd>
            </div>
            <div>
              <dt>Study</dt>
              <dd>{summary.education}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{summary.languages}</dd>
            </div>
          </dl>
          <div className="cta-row">
            <a className="btn btn-sun" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              Message me on LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="btn btn-ghost" href="/cv/">
              View CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
