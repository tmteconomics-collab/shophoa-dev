import Stage from "@/components/Stage";
import MotionToggle from "@/components/MotionToggle";
import LangToggle from "@/components/LangToggle";
import Summary from "@/components/Summary";
import SectionDots from "@/components/SectionDots";
import SectionMenu from "@/components/SectionMenu";
import Tools from "@/components/Tools";
import Proof, { hasProof } from "@/components/Proof";
import ScrollScenes from "@/components/ScrollScenes";
import HeroBackdrop from "@/components/HeroBackdrop";
import { FunnelArt, PromptArt, RailsArt } from "@/components/FallbackArt";
import { growthMocks } from "@/components/mocks/GrowthMocks";
import { websiteMocks } from "@/components/mocks/WebsiteMocks";
import { getContent, type Content } from "@/content/i18n";
import { defaultOrder, type HeroCopy, type SectionId } from "@/content/roles";

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function External({
  href,
  className,
  newTab,
  children,
}: {
  href: string;
  className: string;
  newTab: string;
  children: React.ReactNode;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" data-gaze>
      {children}
      <Arrow />
      <span className="sr-only">{newTab}</span>
    </a>
  );
}

/** Ad solutions: the funnel. */
function SolutionsSection({ c, rev }: { c: Content; rev: boolean }) {
  const { solutions } = c;
  return (
    <section
      id="solutions"
      className={`split${rev ? " split-rev" : ""}`}
      data-scene="funnel"
      data-steps
      aria-labelledby="solutions-title"
    >
      <div className="wrap split-grid">
        <div className="split-visual">
          <div className="visual-box" data-anchor>
            <FunnelArt />
          </div>
        </div>
        <div className="split-copy">
          <header className="scene-head">
            <h2 id="solutions-title" className="section-title">
              {solutions.title}
            </h2>
            <p className="scene-intro">{solutions.intro}</p>
          </header>
          <ol className="steps">
            {solutions.stages.map((stage, i) => (
              <li key={stage.id} className="panel step" data-step>
                <h3 className="step-title">
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {stage.name}
                </h3>
                <p className="step-summary">{stage.summary}</p>
                <dl className="items">
                  {stage.items.map((item) => (
                    <div key={item.name} className="item">
                      <dt>{item.name}</dt>
                      <dd>{item.text}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
          <p className="footnote">{solutions.footnote}</p>
        </div>
      </div>
    </section>
  );
}

/** How I work: four stops along the rails. */
function ProcessSection({ c, rev }: { c: Content; rev: boolean }) {
  const { workflow } = c;
  return (
    <section
      id="process"
      className={`split${rev ? " split-rev" : ""}`}
      data-scene="rails"
      data-steps
      aria-labelledby="process-title"
    >
      <div className="wrap split-grid">
        <div className="split-visual">
          <div className="visual-box" data-anchor>
            <RailsArt />
          </div>
        </div>
        <div className="split-copy">
          <header className="scene-head">
            <h2 id="process-title" className="section-title">
              {workflow.title}
            </h2>
            <p className="scene-intro">{workflow.intro}</p>
          </header>
          <ol className="steps">
            {workflow.steps.map((step, i) => (
              <li key={step.name} className="panel step" data-step>
                <h3 className="step-title">
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {step.name}
                </h3>
                <p className="step-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Measurement and performance marketing on Google's tools. */
function MeasurementSection({ c, rev }: { c: Content; rev: boolean }) {
  const { growth } = c;
  return (
    <section
      id="measurement"
      className={`split${rev ? " split-rev" : ""} split-mock`}
      data-scene="chart"
      data-steps
      data-focus-mobile="0.74"
      aria-labelledby="measurement-title"
    >
      <div className="wrap split-grid">
        <div className="split-visual">
          <div className="mk-stage" data-anchor aria-hidden="true">
            {growthMocks.map((Mock, i) => (
              <div key={i} className="mk" data-mock={i}>
                <Mock />
              </div>
            ))}
          </div>
        </div>
        <div className="split-copy">
          <header className="scene-head">
            <h2 id="measurement-title" className="section-title">
              {growth.title}
            </h2>
            <p className="scene-intro">{growth.intro}</p>
          </header>
          <ol className="steps">
            {growth.steps.map((step, i) => (
              <li key={step.name} className="panel step" data-step>
                <h3 className="step-title">
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {step.name}
                </h3>
                <p className="step-tool">{step.tool}</p>
                <p className="step-text">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="footnote">{growth.note}</p>
        </div>
      </div>
    </section>
  );
}

/** Websites on WordPress. */
function WebsitesSection({ c, rev }: { c: Content; rev: boolean }) {
  const { websites } = c;
  return (
    <section
      id="websites"
      className={`split${rev ? " split-rev" : ""} split-mock`}
      data-scene="blocks"
      data-steps
      data-focus-mobile="0.74"
      aria-labelledby="websites-title"
    >
      <div className="wrap split-grid">
        <div className="split-visual">
          <div className="mk-stage" data-anchor aria-hidden="true">
            {websiteMocks.map((Mock, i) => (
              <div key={i} className="mk" data-mock={i}>
                <Mock />
              </div>
            ))}
          </div>
        </div>
        <div className="split-copy">
          <header className="scene-head">
            <h2 id="websites-title" className="section-title">
              {websites.title}
            </h2>
            <p className="scene-intro">{websites.intro}</p>
          </header>
          <ol className="steps">
            {websites.steps.map((step, i) => (
              <li key={step.name} className="panel step" data-step data-key={step.key}>
                <h3 className="step-title">
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {step.name}
                </h3>
                <p className="step-text">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="footnote">{websites.note}</p>
        </div>
      </div>
    </section>
  );
}

const middleSections: Record<SectionId, (props: { c: Content; rev: boolean }) => React.ReactElement> = {
  solutions: SolutionsSection,
  process: ProcessSection,
  measurement: MeasurementSection,
  websites: WebsitesSection,
};

/**
 * The whole one-page portfolio. The home page uses the default English copy and
 * order; /vi/ passes the Vietnamese bundle; the role versions in
 * src/content/roles.ts pass their own hero line and order (English only).
 */
export default function Portfolio({
  content = getContent("en"),
  hero,
  order = defaultOrder,
}: {
  content?: Content;
  hero?: HeroCopy;
  order?: SectionId[];
}) {
  const c = content;
  const { site, ui } = c;
  const h = hero ?? c.hero;
  const showProof = hasProof(c.proof);
  const tailSep = /^[,.;:]/.test(h.tail) ? "" : " ";
  return (
    <>
      <a className="skip-link" href="#main">
        {ui.skipToContent}
      </a>
      <Stage />
      <ScrollScenes />

      <header className="site-header">
        <div className="wrap header-inner">
          <a className="wordmark" href="#top" aria-label={ui.backToTop}>
            Devan
            <span className="wordmark-dot" aria-hidden="true" />
          </a>
          <nav aria-label={ui.sectionsMenu}>
            <ul className="nav-list">
              <li className="nav-extra">
                <a href="#about">{ui.nav.about}</a>
              </li>
              <li className="nav-extra">
                <a href="#solutions">{ui.nav.solutions}</a>
              </li>
              <li className="nav-extra">
                <a href="#process">{ui.nav.process}</a>
              </li>
              <li className="nav-extra">
                <a href="#measurement">{ui.nav.measurement}</a>
              </li>
              <li className="nav-extra">
                <a href="#websites">{ui.nav.websites}</a>
              </li>
              <li>
                <a href="#contact">{ui.nav.contact}</a>
              </li>
            </ul>
          </nav>
          <SectionMenu order={order} proof={showProof} labels={ui.sections} menuLabel={ui.sectionsMenu} />
          <LangToggle c={c} />
          <MotionToggle pause={ui.motion.pause} play={ui.motion.play} />
        </div>
        <div className="read-bar" aria-hidden="true">
          <i data-read />
        </div>
      </header>

      <SectionDots order={order} proof={showProof} labels={ui.sections} navLabel={ui.sectionsMenu} />

      <main id="main">
        {/* 1. Hero */}
        <section id="top" className="hero" data-scene="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <HeroBackdrop />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="wrap hero-inner">
            <p className="hero-meta">
              {site.role}, {site.company}
              <span className="hero-meta-sep" aria-hidden="true" />
              {site.location}
            </p>
            <h1 id="hero-title" className="hero-name">
              {site.name}
            </h1>
            <p className="hero-lead">
              {h.lead} <mark>{h.highlight}</mark>
              {tailSep}
              {h.tail}
            </p>
            <div className="cta-row">
              <External className="btn btn-sun" href={c.hero.primaryCta.href} newTab={ui.openNewTab}>
                {c.hero.primaryCta.label}
              </External>
              <a className="btn btn-ghost" href={h.secondaryCta.href} data-gaze>
                {h.secondaryCta.label}
              </a>
            </div>
            <p className="hero-credit">{c.hero.credit}</p>
          </div>
          <button type="button" className="skip-intro" data-skip-intro>
            {ui.skipIntro}
          </button>
        </section>

        {/* The short version, for visitors who skim */}
        <Summary c={c} order={order} />

        {/* 2. About: a new tab that fills in as you scroll */}
        <section id="about" className="about" data-scene="browser" aria-labelledby="about-title">
          <div className="about-stick">
            <div className="browser" data-anchor>
              <div className="browser-top" aria-hidden="true">
                <span className="browser-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="browser-tab">New tab</span>
                <span className="browser-plus">+</span>
              </div>
              <div className="browser-bar" aria-hidden="true">
                <span className="omnibox">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span data-typed={c.about.query}>{c.about.query}</span>
                  <span className="caret" />
                </span>
              </div>
              <div className="browser-page">
                <div className="banner">
                  <span className="ad-pill" aria-hidden="true">
                    Ad
                  </span>
                  <h2 id="about-title">{c.about.bannerTitle}</h2>
                </div>
                <ul className="bio">
                  {c.about.lines.map((line) => (
                    <li key={line} data-line>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="about-caption">{c.about.caption}</p>
          </div>
        </section>

        {/* 3 to 6. The four middle sections, in the order this version asks for */}
        {order.map((id, i) => {
          const Section = middleSections[id];
          return <Section key={id} c={c} rev={i % 2 === 1} />;
        })}

        {/* Interactive tools, then proof (hidden until the owner adds entries) */}
        <Tools c={c} />
        <Proof c={c} />

        {/* 7. Built with AI */}
        <section id="built-with-ai" className="ai" data-scene="prompt" aria-labelledby="ai-title">
          <div className="wrap ai-grid">
            <div className="ai-copy">
              <h2 id="ai-title" className="section-title">
                {c.ai.title}
              </h2>
              <p className="scene-intro">{c.ai.intro}</p>
              <ol className="ai-steps">
                {c.ai.steps.map((step) => (
                  <li key={step.name} className="ai-step">
                    <span className="ai-step-name">{step.name}</span>
                    <span className="ai-step-text">{step.text}</span>
                  </li>
                ))}
              </ol>
              {c.ai.lesson ? <p className="ai-lesson">{c.ai.lesson}</p> : null}
            </div>
            <div className="ai-visual">
              <div className="visual-box visual-wide" data-anchor>
                <PromptArt />
              </div>
            </div>
          </div>
        </section>

        {/* 8. Skills, certifications, education */}
        <section id="skills" className="creds" data-scene="cloud" aria-labelledby="creds-title">
          <div className="wrap">
            <h2 id="creds-title" className="section-title">
              {c.credentials.title}
            </h2>
            <div className="creds-grid">
              <div className="panel">
                <h3 className="panel-title">{ui.creds.skills}</h3>
                <ul className="chips">
                  {c.credentials.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="panel">
                <h3 className="panel-title">{ui.creds.certifications}</h3>
                <ul className="ticks">
                  {c.credentials.certifications.map((cert) => (
                    <li key={cert.name}>
                      {cert.name}
                      {cert.issuer || cert.year ? (
                        <span className="cert-meta"> {[cert.issuer, cert.year].filter(Boolean).join(", ")}</span>
                      ) : null}
                      {cert.url ? (
                        <>
                          {" "}
                          <a className="cert-link" href={cert.url} target="_blank" rel="noopener noreferrer">
                            {ui.creds.verify}
                            <span className="sr-only">
                              {" "}
                              {cert.name}
                              {ui.openNewTab}
                            </span>
                          </a>
                        </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel">
                <h3 className="panel-title">{ui.creds.education}</h3>
                <p className="degree">{c.credentials.education.degree}</p>
                <p>{c.credentials.education.school}</p>
                <p className="muted">
                  {c.credentials.education.years}. {c.credentials.education.note}
                </p>
                <h3 className="panel-title panel-title-gap">{ui.creds.languages}</h3>
                <ul className="langs">
                  {c.credentials.languages.map((l) => (
                    <li key={l.name}>
                      <span>{l.name}</span>
                      <span className="muted">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Contact */}
        <section id="contact" className="contact" data-scene="portrait" aria-labelledby="contact-title">
          <div className="wrap contact-grid">
            <div className="contact-copy">
              <h2 id="contact-title" className="contact-title">
                {c.contact.title}
              </h2>
              <p className="contact-text">{c.contact.text}</p>
              <div className="contact-actions">
                <External className="btn btn-sun" href={c.contact.cta.href} newTab={ui.openNewTab}>
                  {c.contact.cta.label}
                </External>
                <a className="btn btn-ghost" href={c.contact.email.href}>
                  {c.contact.email.label}
                </a>
              </div>
              <p className="contact-meta">{c.contact.meta}</p>
            </div>
            <div className="contact-visual">
              <div className="portrait-box" data-anchor>
                <picture>
                  <source
                    media="(max-aspect-ratio: 19/20)"
                    srcSet="/portrait/particles-mobile.webp"
                    type="image/webp"
                  />
                  <img
                    className="fallback-photo"
                    src="/portrait/particles-desktop.webp"
                    alt=""
                    width={1800}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <p>
            © 2026 {site.name}. {ui.footer.builtWith}
          </p>
          <ul className="footer-links">
            <li>
              <a href={c.cvPath}>{ui.footer.cv}</a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                {ui.footer.linkedin}
                <span className="sr-only">{ui.openNewTab}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{ui.footer.email}</a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
