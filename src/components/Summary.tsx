import type { Content } from "@/content/i18n";
import type { SectionId } from "@/content/roles";

/** One card with the whole portfolio, for visitors who skim. Pillars follow the section order. */
export default function Summary({ c, order }: { c: Content; order: SectionId[] }) {
  const { summary, site, ui, cvPath } = c;
  const rank = (href: string) => order.indexOf(href.slice(1) as SectionId);
  const pillars = [...summary.pillars].sort((a, b) => rank(a.href) - rank(b.href));
  return (
    <section id="summary" className="summary" aria-labelledby="summary-title">
      <div className="wrap">
        <div className="panel summary-card">
          <h2 id="summary-title" className="summary-title">
            {summary.title}
          </h2>
          <dl className="summary-list">
            <div>
              <dt>{ui.summaryTerms.now}</dt>
              <dd>{summary.role}</dd>
            </div>
            <div>
              <dt>{ui.summaryTerms.whatIDo}</dt>
              <dd>
                <ul className="summary-pillars">
                  {pillars.map((p) => (
                    <li key={p.href}>
                      <a href={p.href}>{p.text}</a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>{ui.summaryTerms.tools}</dt>
              <dd>{summary.tools.join(" · ")}</dd>
            </div>
            <div>
              <dt>{ui.summaryTerms.study}</dt>
              <dd>{summary.education}</dd>
            </div>
            <div>
              <dt>{ui.summaryTerms.languages}</dt>
              <dd>{summary.languages}</dd>
            </div>
          </dl>
          <div className="cta-row">
            <a className="btn btn-sun" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              {ui.summaryCta.linkedin}
              <span className="sr-only">{ui.openNewTab}</span>
            </a>
            <a className="btn btn-ghost" href={cvPath}>
              {ui.summaryCta.cv}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
