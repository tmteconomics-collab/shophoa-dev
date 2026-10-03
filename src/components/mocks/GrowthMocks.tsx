// Illustrations for the measurement section: one panel per step (tag, measure,
// optimize, report). Drawn from scratch in the site's own style, with sample data
// that is internally consistent and clearly labelled. Decorative: the step text
// next to it says everything the panels show.

function Bar({ title }: { title: string }) {
  return (
    <div className="mk-bar">
      <span className="mk-dots">
        <i />
        <i />
        <i />
      </span>
      <span className="mk-title">{title}</span>
      <span className="mk-sample">Sample data</span>
    </div>
  );
}

function path(values: number[], w: number, h: number, pad = 4) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (values.length - 1);
      const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

// 28 days of users: weekly rhythm on a gentle rise.
const users = Array.from({ length: 28 }, (_, i) => 380 + i * 6 + [0, 30, 42, 38, 26, -40, -60][i % 7]);
// Cost per acquisition by week, in thousand VND, falling as the account is tuned.
const cpa = [96, 91, 88, 80, 74, 69, 65, 62];
// Weekly cost (million VND) and conversions; they sum to the scorecards.
const weekCost = [14.2, 15.1, 15.6, 15.2];
const weekConv = [212, 236, 251, 268];

export function TagMock() {
  return (
    <>
      <Bar title="Tag Manager · Preview" />
      <div className="mk-body mk-gtm">
        <div className="mk-col">
          <p className="mk-h">Event timeline</p>
          <ol className="mk-timeline">
            <li>Consent initialization</li>
            <li>Container loaded</li>
            <li>DOM ready</li>
            <li className="mk-hot">form_submit</li>
          </ol>
        </div>
        <div className="mk-col">
          <p className="mk-h">Tags fired</p>
          <ul className="mk-tags">
            <li>
              <b>Google tag</b>
              <span>All pages</span>
            </li>
            <li>
              <b>GA4 event · generate_lead</b>
              <span>Form submit</span>
            </li>
            <li>
              <b>Google Ads conversion · Lead</b>
              <span>Form submit</span>
            </li>
            <li>
              <b>Conversion linker</b>
              <span>All pages</span>
            </li>
          </ul>
          <p className="mk-h">Data layer</p>
          <pre className="mk-code">{`{ event: "form_submit",\n  form_id: "quote_request" }`}</pre>
        </div>
      </div>
    </>
  );
}

export function MeasureMock() {
  const sources = [
    ["google / cpc", 38],
    ["google / organic", 27],
    ["(direct) / (none)", 18],
    ["coccoc / cpm", 10],
    ["referral", 7],
  ] as const;
  return (
    <>
      <Bar title="Analytics · Last 28 days" />
      <div className="mk-body mk-ga">
        <div className="mk-kpis">
          <div>
            <span>Users</span>
            <b>12,480</b>
          </div>
          <div>
            <span>Sessions</span>
            <b>18,930</b>
          </div>
          <div>
            <span>Engagement rate</span>
            <b>61.4%</b>
          </div>
          <div>
            <span>Key events</span>
            <b>967</b>
          </div>
        </div>
        <div className="mk-chart">
          <p className="mk-h">Users by day</p>
          <svg viewBox="0 0 300 80" preserveAspectRatio="none">
            <path className="mk-area" d={`${path(users, 300, 80)} L296 80 L4 80 Z`} />
            <path className="mk-line" d={path(users, 300, 80)} pathLength={1} />
          </svg>
        </div>
        <div>
          <p className="mk-h">Sessions by source / medium</p>
          <ul className="mk-bars">
            {sources.map(([name, pct]) => (
              <li key={name} style={{ "--w": `${pct * 2.4}%` } as React.CSSProperties}>
                <span>{name}</span>
                <i />
                <b>{pct}%</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function OptimizeMock() {
  const rows = [
    ["Search · Brand", "Maximize conversions", "12.4M", "310", "40K"],
    ["Search · Generic", "Target CPA", "28.1M", "402", "70K"],
    ["Performance Max", "Maximize conv. value", "19.6M", "255", "77K"],
  ];
  return (
    <>
      <Bar title="Google Ads · Campaigns" />
      <div className="mk-body mk-ads">
        <table className="mk-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Bid strategy</th>
              <th>Cost (VND)</th>
              <th>Conv.</th>
              <th>CPA (VND)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mk-split">
          <div>
            <p className="mk-h">Changes this month</p>
            <ul className="mk-log">
              <li>Imported GA4 key events as conversions</li>
              <li>Added 38 negative keywords</li>
              <li>Moved Generic to Target CPA</li>
              <li>Paused 4 ads with low CTR</li>
            </ul>
          </div>
          <div className="mk-spark">
            <p className="mk-h">CPA by week (VND)</p>
            <svg viewBox="0 0 160 70" preserveAspectRatio="none">
              <path className="mk-line" d={path(cpa, 160, 70)} pathLength={1} />
            </svg>
            <p className="mk-delta">96K → 62K</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function ReportMock() {
  const maxCost = Math.max(...weekCost);
  return (
    <>
      <Bar title="Looker Studio · Weekly report" />
      <div className="mk-body mk-report">
        <div className="mk-cards">
          <div>
            <span>Cost (VND)</span>
            <b>60.1M</b>
            <em className="good">▼ 4%</em>
          </div>
          <div>
            <span>Conversions</span>
            <b>967</b>
            <em className="good">▲ 12%</em>
          </div>
          <div>
            <span>CPA (VND)</span>
            <b>62K</b>
            <em className="good">▼ 14%</em>
          </div>
          <div>
            <span>ROAS</span>
            <b>4.2</b>
            <em className="good">▲ 0.6</em>
          </div>
        </div>
        <div className="mk-combo">
          <p className="mk-h">Cost and conversions by week</p>
          <div className="mk-combo-plot">
            {weekCost.map((c, i) => (
              <div
                key={i}
                className="mk-col-bar"
                style={{ "--h": `${(c / maxCost) * 100}%`, "--i": i } as React.CSSProperties}
              >
                <i />
                <span>W{i + 1}</span>
              </div>
            ))}
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="mk-combo-line">
              <path className="mk-line" d={path(weekConv, 200, 100, 25)} pathLength={1} />
            </svg>
          </div>
        </div>
        <p className="mk-next">
          <b>Next week</b> Shift 10% of Generic budget to Brand, test a shorter lead form.
        </p>
      </div>
    </>
  );
}

export const growthMocks = [TagMock, MeasureMock, OptimizeMock, ReportMock];
