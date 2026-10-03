import Stage from "@/components/Stage";
import MotionToggle from "@/components/MotionToggle";
import ScrollScenes from "@/components/ScrollScenes";
import HeroBackdrop from "@/components/HeroBackdrop";
import { FunnelArt, PromptArt, RailsArt } from "@/components/FallbackArt";
import { growthMocks } from "@/components/mocks/GrowthMocks";
import { websiteMocks } from "@/components/mocks/WebsiteMocks";
import { about, ai, contact, credentials, growth, hero, site, solutions, websites, workflow } from "@/content/site";

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function External({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" data-gaze>
      {children}
      <Arrow />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Stage />
      <ScrollScenes />

      <header className="site-header">
        <div className="wrap header-inner">
          <a className="wordmark" href="#top" aria-label="Devan, back to top">
            Devan<span className="wordmark-dot" aria-hidden="true" />
          </a>
          <nav aria-label="Primary">
            <ul className="nav-list">
              <li className="nav-extra">
                <a href="#about">About</a>
              </li>
              <li className="nav-extra">
                <a href="#solutions">Ad solutions</a>
              </li>
              <li className="nav-extra">
                <a href="#process">How I work</a>
              </li>
              <li className="nav-extra">
                <a href="#measurement">Analytics</a>
              </li>
              <li className="nav-extra">
                <a href="#websites">WordPress</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
          <MotionToggle />
        </div>
      </header>

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
              {hero.lead} <mark>{hero.highlight}</mark> {hero.tail}
            </p>
            <div className="cta-row">
              <External className="btn btn-sun" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </External>
              <a className="btn btn-ghost" href={hero.secondaryCta.href} data-gaze>
                {hero.secondaryCta.label}
              </a>
            </div>
            <p className="hero-credit">{hero.credit}</p>
          </div>
          <button type="button" className="skip-intro" data-skip-intro>
            Skip intro
          </button>
        </section>

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
                  <span data-typed={about.query}>{about.query}</span>
                  <span className="caret" />
                </span>
              </div>
              <div className="browser-page">
                <div className="banner">
                  <span className="ad-pill" aria-hidden="true">
                    Ad
                  </span>
                  <h2 id="about-title">{about.bannerTitle}</h2>
                </div>
                <ul className="bio">
                  {about.lines.map((line) => (
                    <li key={line} data-line>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="about-caption">{about.caption}</p>
          </div>
        </section>

        {/* 3. Ad solutions: the funnel */}
        <section id="solutions" className="split" data-scene="funnel" data-steps aria-labelledby="solutions-title">
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

        {/* 4. How I work: four stops along the rails */}
        <section id="process" className="split split-rev" data-scene="rails" data-steps aria-labelledby="process-title">
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

        {/* 5. Measurement and performance marketing on Google's tools */}
        <section
          id="measurement"
          className="split split-mock"
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

        {/* 6. Websites on WordPress */}
        <section
          id="websites"
          className="split split-rev split-mock"
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

        {/* 7. Built with AI */}
        <section id="built-with-ai" className="ai" data-scene="prompt" aria-labelledby="ai-title">
          <div className="wrap ai-grid">
            <div className="ai-copy">
              <h2 id="ai-title" className="section-title">
                {ai.title}
              </h2>
              <p className="scene-intro">{ai.intro}</p>
              <ol className="ai-steps">
                {ai.steps.map((step) => (
                  <li key={step.name} className="ai-step">
                    <span className="ai-step-name">{step.name}</span>
                    <span className="ai-step-text">{step.text}</span>
                  </li>
                ))}
              </ol>
              {ai.lesson ? <p className="ai-lesson">{ai.lesson}</p> : null}
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
              {credentials.title}
            </h2>
            <div className="creds-grid">
              <div className="panel">
                <h3 className="panel-title">Skills</h3>
                <ul className="chips">
                  {credentials.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="panel">
                <h3 className="panel-title">Certifications</h3>
                <ul className="ticks">
                  {credentials.certifications.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="panel">
                <h3 className="panel-title">Education</h3>
                <p className="degree">{credentials.education.degree}</p>
                <p>{credentials.education.school}</p>
                <p className="muted">
                  {credentials.education.years}. {credentials.education.note}
                </p>
                <h3 className="panel-title panel-title-gap">Languages</h3>
                <ul className="langs">
                  {credentials.languages.map((l) => (
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
                {contact.title}
              </h2>
              <p className="contact-text">{contact.text}</p>
              <External className="btn btn-sun" href={contact.cta.href}>
                {contact.cta.label}
              </External>
              <p className="contact-meta">{contact.meta}</p>
            </div>
            <div className="contact-visual">
              <div className="portrait-box" data-anchor>
                <picture>
                  <source media="(max-aspect-ratio: 19/20)" srcSet="/portrait/particles-mobile.webp" type="image/webp" />
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
          <p>© 2026 {site.name}. Built with Claude Code.</p>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </>
  );
}
