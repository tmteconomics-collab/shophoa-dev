import ToolsBinder from "@/components/ToolsBinder";
import { tools } from "@/content/site";

/** UTM builder and budget estimator. Markup is static; src/tools/ binds it. */
export default function Tools({ rev }: { rev?: boolean }) {
  return (
    <section id="tools" className={`tools${rev ? " tools-rev" : ""}`} aria-labelledby="tools-title">
      <ToolsBinder />
      <div className="wrap">
        <h2 id="tools-title" className="section-title">
          {tools.title}
        </h2>
        <p className="scene-intro">{tools.intro}</p>
        <noscript>
          <p className="footnote">These tools need JavaScript.</p>
        </noscript>
        <div className="tools-grid">
          <form className="panel tool" data-tool="utm" aria-labelledby="utm-title" noValidate>
            <h3 id="utm-title" className="panel-title">
              {tools.utm.title}
            </h3>
            <p className="tool-note">{tools.utm.text}</p>
            <div className="field">
              <label htmlFor="utm-url">Landing page URL</label>
              <input id="utm-url" name="url" type="url" inputMode="url" autoComplete="off" placeholder="https://example.com/sale" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="utm-source">Source</label>
                <input id="utm-source" name="source" autoComplete="off" placeholder="coccoc" />
              </div>
              <div className="field">
                <label htmlFor="utm-medium">Medium</label>
                <input id="utm-medium" name="medium" autoComplete="off" placeholder="cpc" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="utm-campaign">Campaign</label>
              <input id="utm-campaign" name="campaign" autoComplete="off" placeholder="spring_sale" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="utm-term">
                  Term <span className="opt">optional</span>
                </label>
                <input id="utm-term" name="term" autoComplete="off" placeholder="running shoes" />
              </div>
              <div className="field">
                <label htmlFor="utm-content">
                  Content <span className="opt">optional</span>
                </label>
                <input id="utm-content" name="content" autoComplete="off" placeholder="banner_a" />
              </div>
            </div>
            <p className="tool-label" id="utm-out-label">
              Tagged link
            </p>
            <output className="tool-out" data-out aria-labelledby="utm-out-label" aria-live="polite">
              Fill in the page URL, source, medium and campaign.
            </output>
            <div className="tool-actions">
              <button type="button" className="btn btn-ghost tool-btn" data-copy disabled>
                Copy link
              </button>
              <span className="tool-status" data-copy-status role="status" />
            </div>
          </form>

          <form className="panel tool" data-tool="budget" aria-labelledby="budget-title" noValidate>
            <h3 id="budget-title" className="panel-title">
              {tools.budget.title}
            </h3>
            <p className="tool-note">{tools.budget.text}</p>
            <fieldset className="field seg">
              <legend>Buying model</legend>
              <div className="seg-row">
                {(
                  [
                    ["cpm", "CPM"],
                    ["cpc", "CPC"],
                    ["cpd", "CPD"],
                  ] as const
                ).map(([v, label], i) => (
                  <label key={v} className="seg-opt">
                    <input type="radio" name="model" value={v} defaultChecked={i === 0} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="budget-budget">Budget (VND)</label>
              <input id="budget-budget" name="budget" inputMode="numeric" autoComplete="off" placeholder="Your budget" />
            </div>
            <div className="field">
              <label htmlFor="budget-rate" data-rate-label>
                Your price per 1,000 impressions (VND)
              </label>
              <input id="budget-rate" name="rate" inputMode="numeric" autoComplete="off" placeholder="From your quote" />
            </div>
            <div className="field-row">
              <div className="field" data-field="ctr">
                <label htmlFor="budget-ctr">
                  Click-through rate (%) <span className="opt">optional</span>
                </label>
                <input id="budget-ctr" name="ctr" inputMode="decimal" autoComplete="off" />
              </div>
              <div className="field" data-field="cvr">
                <label htmlFor="budget-cvr">
                  Conversion rate (%) <span className="opt">optional</span>
                </label>
                <input id="budget-cvr" name="cvr" inputMode="decimal" autoComplete="off" />
              </div>
            </div>
            <p className="tool-label" id="budget-out-label">
              Estimate
            </p>
            <output className="tool-out" data-out aria-labelledby="budget-out-label" aria-live="polite">
              Enter a budget and your price to see an estimate.
            </output>
          </form>
        </div>
      </div>
    </section>
  );
}
