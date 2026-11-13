import ToolsBinder from "@/components/ToolsBinder";
import type { Content } from "@/content/i18n";

/**
 * UTM builder and budget estimator. Markup is static; src/tools/ binds it.
 * Runtime strings the JS writes (error messages, row labels) are passed as
 * data-* attributes here so the one shared bundle stays language-agnostic.
 */
export default function Tools({ c, rev }: { c: Content; rev?: boolean }) {
  const { tools, ui } = c;
  const u = ui.utmUi;
  const b = ui.budgetUi;
  return (
    <section id="tools" className={`tools${rev ? " tools-rev" : ""}`} aria-labelledby="tools-title">
      <ToolsBinder />
      <div className="wrap">
        <h2 id="tools-title" className="section-title">
          {tools.title}
        </h2>
        <p className="scene-intro">{tools.intro}</p>
        <noscript>
          <p className="footnote">{ui.toolsNeedJs}</p>
        </noscript>
        <div className="tools-grid">
          <form
            className="panel tool"
            data-tool="utm"
            aria-labelledby="utm-title"
            noValidate
            data-msg-fill={u.empty}
            data-msg-badurl={u.badUrl}
            data-msg-copied={u.copied}
            data-msg-copyfail={u.copyFail}
          >
            <h3 id="utm-title" className="panel-title">
              {tools.utm.title}
            </h3>
            <p className="tool-note">{tools.utm.text}</p>
            <details className="tool-body" data-collapse-narrow open>
              <summary className="btn btn-ghost tool-toggle">
                <span className="when-closed">{u.open}</span>
                <span className="when-open">{u.hide}</span>
              </summary>
              <div className="tool-fields">
                <div className="field">
                  <label htmlFor="utm-url">{u.url}</label>
                  <input
                    id="utm-url"
                    name="url"
                    type="url"
                    inputMode="url"
                    autoComplete="off"
                    placeholder="https://example.com/sale"
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="utm-source">{u.source}</label>
                    <input id="utm-source" name="source" autoComplete="off" placeholder="coccoc" />
                  </div>
                  <div className="field">
                    <label htmlFor="utm-medium">{u.medium}</label>
                    <input id="utm-medium" name="medium" autoComplete="off" placeholder="cpc" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="utm-campaign">{u.campaign}</label>
                  <input id="utm-campaign" name="campaign" autoComplete="off" placeholder="spring_sale" />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="utm-term">
                      {u.term} <span className="opt">{u.optional}</span>
                    </label>
                    <input id="utm-term" name="term" autoComplete="off" placeholder="running shoes" />
                  </div>
                  <div className="field">
                    <label htmlFor="utm-content">
                      {u.content} <span className="opt">{u.optional}</span>
                    </label>
                    <input id="utm-content" name="content" autoComplete="off" placeholder="banner_a" />
                  </div>
                </div>
                <p className="tool-label" id="utm-out-label">
                  {u.taggedLink}
                </p>
                <output className="tool-out" data-out aria-labelledby="utm-out-label" aria-live="polite">
                  {u.empty}
                </output>
                <div className="tool-actions">
                  <button type="button" className="btn btn-ghost tool-btn" data-copy disabled>
                    {u.copy}
                  </button>
                  <span className="tool-status" data-copy-status role="status" />
                </div>
              </div>
            </details>
          </form>

          <form
            className="panel tool"
            data-tool="budget"
            aria-labelledby="budget-title"
            noValidate
            data-rate-cpm={b.rateCpm}
            data-rate-cpc={b.rateCpc}
            data-rate-cpd={b.rateCpd}
            data-num-locale={b.numLocale}
            data-money={b.money}
            data-row-impressions={b.rows.impressions}
            data-row-clicks={b.rows.clicks}
            data-row-cpc={b.rows.costPerClick}
            data-row-conversions={b.rows.conversions}
            data-row-cpconv={b.rows.costPerConversion}
            data-row-days={b.rows.days}
          >
            <h3 id="budget-title" className="panel-title">
              {tools.budget.title}
            </h3>
            <p className="tool-note">{tools.budget.text}</p>
            <details className="tool-body" data-collapse-narrow open>
              <summary className="btn btn-ghost tool-toggle">
                <span className="when-closed">{b.open}</span>
                <span className="when-open">{b.hide}</span>
              </summary>
              <div className="tool-fields">
                <fieldset className="field seg">
                  <legend>{b.model}</legend>
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
                  <label htmlFor="budget-budget">{b.budget}</label>
                  <input
                    id="budget-budget"
                    name="budget"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={b.budgetPlaceholder}
                  />
                </div>
                <div className="field">
                  <label htmlFor="budget-rate" data-rate-label>
                    {b.rateCpm}
                  </label>
                  <input
                    id="budget-rate"
                    name="rate"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={b.ratePlaceholder}
                  />
                </div>
                <div className="field-row">
                  <div className="field" data-field="ctr">
                    <label htmlFor="budget-ctr">
                      {b.ctr} <span className="opt">{b.optional}</span>
                    </label>
                    <input id="budget-ctr" name="ctr" inputMode="decimal" autoComplete="off" />
                  </div>
                  <div className="field" data-field="cvr">
                    <label htmlFor="budget-cvr">
                      {b.cvr} <span className="opt">{b.optional}</span>
                    </label>
                    <input id="budget-cvr" name="cvr" inputMode="decimal" autoComplete="off" />
                  </div>
                </div>
                <p className="tool-label" id="budget-out-label">
                  {b.estimate}
                </p>
                <output className="tool-out" data-out aria-labelledby="budget-out-label" aria-live="polite">
                  {b.empty}
                </output>
              </div>
            </details>
          </form>
        </div>
      </div>
    </section>
  );
}
