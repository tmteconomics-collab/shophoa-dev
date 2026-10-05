// UTM link builder: pure helpers plus a binder for the server-rendered form in
// src/components/Tools.tsx. Runs in the browser only; nothing is sent anywhere.

export interface UtmFields {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

/** GA4 reads UTM values case-sensitively, so keep them lowercase with no spaces. */
export function cleanUtmValue(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, "-");
}

/** The tagged URL, or an error message when a required part is missing or invalid. */
export function buildUtmUrl(f: UtmFields): { url: string } | { error: string } {
  const raw = f.url.trim();
  if (!raw || !f.source.trim() || !f.medium.trim() || !f.campaign.trim()) {
    return { error: "Fill in the page URL, source, medium and campaign." };
  }
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { error: "That page URL does not look right. Try https://example.com/page" };
  }
  if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) {
    return { error: "That page URL does not look right. Try https://example.com/page" };
  }
  const pairs: [string, string | undefined][] = [
    ["utm_source", f.source],
    ["utm_medium", f.medium],
    ["utm_campaign", f.campaign],
    ["utm_term", f.term],
    ["utm_content", f.content],
  ];
  for (const [k, v] of pairs) {
    const c = v ? cleanUtmValue(v) : "";
    if (c) u.searchParams.set(k, c);
    else u.searchParams.delete(k);
  }
  return { url: u.toString() };
}

export function bindUtmBuilder(form: HTMLFormElement): () => void {
  const out = form.querySelector<HTMLElement>("[data-out]");
  const copy = form.querySelector<HTMLButtonElement>("[data-copy]");
  const status = form.querySelector<HTMLElement>("[data-copy-status]");
  if (!out || !copy) return () => {};
  const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
  let current = "";

  const update = () => {
    const r = buildUtmUrl({
      url: value("url"),
      source: value("source"),
      medium: value("medium"),
      campaign: value("campaign"),
      term: value("term"),
      content: value("content"),
    });
    current = "url" in r ? r.url : "";
    out.textContent = "url" in r ? r.url : r.error;
    out.classList.toggle("is-ready", !!current);
    copy.disabled = !current;
    if (status) status.textContent = "";
  };
  const onCopy = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current);
      if (status) status.textContent = "Copied.";
    } catch {
      if (status) status.textContent = "Copy did not work here. Select the link and copy it.";
    }
  };
  const onSubmit = (e: Event) => e.preventDefault();

  form.addEventListener("input", update);
  form.addEventListener("submit", onSubmit);
  copy.addEventListener("click", onCopy);
  update();
  return () => {
    form.removeEventListener("input", update);
    form.removeEventListener("submit", onSubmit);
    copy.removeEventListener("click", onCopy);
  };
}
