// Illustrations for the WordPress section: an editor panel per step (theme and
// layout, blocks and patterns, WooCommerce store, responsive, speed and SEO). Drawn from scratch in
// the site's own style; no WordPress screenshots or logos. Decorative.

function Bar({ title }: { title: string }) {
  return (
    <div className="mk-bar">
      <span className="mk-dots">
        <i />
        <i />
        <i />
      </span>
      <span className="mk-title">{title}</span>
      <span className="mk-sample">Sample</span>
    </div>
  );
}

/** A tiny landing page used inside the editor panels. */
function PagePreview({ outline = false }: { outline?: boolean }) {
  return (
    <div className={`wp-page${outline ? " wp-outline" : ""}`}>
      <div className="wp-header" data-label="Header">
        <i className="wp-logo" />
        <span className="wp-nav">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="wp-hero">
        <b>New collection</b>
        <span className="wp-lines">
          <i />
          <i />
        </span>
        <span className="wp-btn">Shop now</span>
      </div>
      <div className="wp-cards">
        <i />
        <i />
        <i />
      </div>
      <div className="wp-footer" data-label="Footer" />
    </div>
  );
}

export function ThemeMock() {
  return (
    <>
      <Bar title="Site editor · Templates" />
      <div className="mk-body wp-editor">
        <aside className="wp-side">
          <p className="mk-h">Templates</p>
          <ul>
            <li className="on">Home</li>
            <li>Page</li>
            <li>Single post</li>
            <li>404</li>
          </ul>
          <p className="mk-h">Template parts</p>
          <ul>
            <li className="hot">Header</li>
            <li className="hot">Footer</li>
          </ul>
        </aside>
        <div className="wp-canvas">
          <PagePreview outline />
        </div>
      </div>
    </>
  );
}

export function BlocksMock() {
  const blocks = ["Heading", "Paragraph", "Image", "Columns", "Buttons", "Pattern: Hero"];
  return (
    <>
      <Bar title="Block editor · Landing page" />
      <div className="mk-body wp-editor">
        <aside className="wp-side">
          <p className="mk-h">Blocks</p>
          <ul className="wp-inserter">
            {blocks.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </aside>
        <div className="wp-canvas wp-build">
          <div className="wp-drop wp-d1">
            <b>New collection</b>
          </div>
          <div className="wp-drop wp-d2 wp-lines">
            <i />
            <i />
            <i />
          </div>
          <div className="wp-drop wp-d3 wp-img" />
          <div className="wp-drop wp-d4 wp-cols">
            <i />
            <i />
          </div>
          <div className="wp-drop wp-d5">
            <span className="wp-btn">Shop now</span>
          </div>
        </div>
        <span className="wp-ghost">Columns</span>
        <aside className="wp-styles">
          <p className="mk-h">Styles</p>
          <span className="wp-swatches">
            <i />
            <i />
            <i />
          </span>
          <p className="mk-h">Type size</p>
          <span className="wp-slider">
            <i />
          </span>
        </aside>
      </div>
    </>
  );
}

export function StoreMock() {
  // Two items in the cart add up to the new order: 390K + 250K = 640K VND.
  const products = [
    ["Linen shirt", "390K"],
    ["Canvas tote", "250K"],
    ["Desk lamp", "620K"],
    ["Ceramic mug", "150K"],
  ];
  return (
    <>
      <Bar title="WooCommerce · Store" />
      <div className="mk-body wc">
        <div className="wc-grid">
          {products.map(([name, price], i) => (
            <div key={name} className={`wc-card wc-c${i}`}>
              <i className="wc-thumb" />
              <b>{name}</b>
              <span>{price} VND</span>
              <em className="wc-add">Add to cart</em>
            </div>
          ))}
        </div>
        <div className="wc-side">
          <div className="wc-cart">
            <span>Cart</span>
            <b className="wc-count">2</b>
          </div>
          <p className="mk-h">Checkout</p>
          <ol className="wc-flow">
            <li>Cart</li>
            <li>Checkout</li>
            <li>Paid</li>
          </ol>
          <p className="mk-h">Orders</p>
          <ul className="wc-orders">
            <li className="wc-new">
              <span>#1042</span>
              <b>640K</b>
              <em>Processing</em>
            </li>
            <li>
              <span>#1041</span>
              <b>390K</b>
              <em>Completed</em>
            </li>
          </ul>
          <pre className="mk-code">{`purchase  >  GA4\nvalue: 640000, currency: "VND"`}</pre>
        </div>
      </div>
    </>
  );
}

export function ResponsiveMock() {
  return (
    <>
      <Bar title="Preview · Breakpoints" />
      <div className="mk-body wp-resp">
        <div className="wp-devices">
          <span className="wp-dev wp-dev1">Desktop</span>
          <span className="wp-dev wp-dev2">Tablet</span>
          <span className="wp-dev wp-dev3">Mobile</span>
        </div>
        <div className="wp-stagebox">
          <div className="wp-frame">
            <PagePreview />
          </div>
        </div>
      </div>
    </>
  );
}

export function SpeedMock() {
  const scores = [
    ["Performance", 96],
    ["Accessibility", 100],
    ["Best practices", 100],
    ["SEO", 100],
  ] as const;
  return (
    <>
      <Bar title="Page speed and SEO check" />
      <div className="mk-body wp-speed">
        <div className="wp-gauges">
          {scores.map(([name, v]) => (
            <div key={name} className="wp-gauge" style={{ "--v": v } as React.CSSProperties}>
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" className="wp-track" />
                <circle cx="20" cy="20" r="16" className="wp-arc" pathLength={100} />
              </svg>
              <b>{v}</b>
              <span>{name}</span>
            </div>
          ))}
        </div>
        <div className="mk-split">
          <div>
            <p className="mk-h">Core Web Vitals</p>
            <ul className="wp-vitals">
              <li>
                <span>LCP</span>
                <b>1.9 s</b>
                <em>Good</em>
              </li>
              <li>
                <span>INP</span>
                <b>140 ms</b>
                <em>Good</em>
              </li>
              <li>
                <span>CLS</span>
                <b>0.03</b>
                <em>Good</em>
              </li>
            </ul>
          </div>
          <div>
            <p className="mk-h">SEO basics</p>
            <ul className="mk-log">
              <li>Title and meta description</li>
              <li>XML sitemap</li>
              <li>Image alt text</li>
              <li>Clean permalinks</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

// Same order as websites.steps in src/content/site.ts.
export const websiteMocks = [ThemeMock, BlocksMock, StoreMock, ResponsiveMock, SpeedMock];
