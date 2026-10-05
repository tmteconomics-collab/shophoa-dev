import { proof } from "@/content/site";

export const hasProof = proof.results.length + proof.testimonials.length + proof.samples.length > 0;

/** Results, testimonials and work samples. Renders nothing until the owner fills a list in site.ts. */
export default function Proof() {
  if (!hasProof) return null;
  return (
    <section id="proof" className="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <h2 id="proof-title" className="section-title">
          {proof.title}
        </h2>
        {proof.results.length > 0 ? (
          <ul className="proof-results">
            {proof.results.map((r) => (
              <li key={r.label} className="panel">
                <b className="proof-value">{r.value}</b>
                <span className="proof-label">{r.label}</span>
                <span className="proof-context">{r.context}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {proof.testimonials.length > 0 ? (
          <div className="proof-quotes">
            {proof.testimonials.map((t) => (
              <figure key={t.name} className="panel proof-quote">
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  {t.name}
                  <span className="muted">, {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
        {proof.samples.length > 0 ? (
          <ul className="proof-samples">
            {proof.samples.map((s) => (
              <li key={s.url} className="panel">
                <span className="proof-kind">{s.kind}</span>
                <h3 className="panel-title">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
