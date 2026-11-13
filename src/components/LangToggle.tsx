import type { Content, Locale } from "@/content/i18n";

/**
 * EN | VI switch. The current language is marked and inert; the other links to the
 * matching page in that language (content.alt). Kept to short codes so it fits the
 * header next to the motion button; the full name is read out for screen readers.
 */
export default function LangToggle({ c, href }: { c: Content; href?: string }) {
  const { ui, locale } = c;
  const alt = href ?? c.alt;
  const items: { code: Locale; short: string; full: string }[] = [
    { code: "en", short: ui.langToggle.en, full: ui.langToggle.enFull },
    { code: "vi", short: ui.langToggle.vi, full: ui.langToggle.viFull },
  ];
  return (
    <div className="lang-toggle" role="group" aria-label={ui.langToggle.label}>
      {items.map((it) =>
        it.code === locale ? (
          <span key={it.code} className="lang-opt" aria-current="true">
            {it.short}
            <span className="sr-only"> ({it.full})</span>
          </span>
        ) : (
          <a key={it.code} className="lang-opt" href={alt} hrefLang={it.code}>
            {it.short}
            <span className="sr-only"> ({it.full})</span>
          </a>
        ),
      )}
    </div>
  );
}
