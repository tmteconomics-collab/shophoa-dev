// Budget estimator: turns a budget and the visitor's own rates into a rough
// plan. No platform prices are built in. Pure helpers plus a binder for the
// server-rendered form in src/components/Tools.tsx.

export type Model = "cpm" | "cpc" | "cpd";

export interface BudgetInput {
  model: Model;
  budget: number;
  /** Price per 1,000 impressions (CPM), per click (CPC) or per day (CPD). */
  rate: number;
  /** Click-through rate in percent, CPM only. Optional. */
  ctr?: number;
  /** Conversion rate in percent of clicks. Optional. */
  cvr?: number;
}

export interface BudgetRow {
  label: string;
  value: number;
  /** "count" rounds down to whole units; "money" is VND; "days" keeps one decimal. */
  kind: "count" | "money" | "days";
}

/** Reads "25,000", "25 000" or "25000 VND" as 25000. NaN when empty or invalid. */
export function parseAmount(s: string): number {
  const t = s
    .replace(/vnd|đ|₫|%/gi, "")
    .replace(/[\s,]/g, "")
    .trim();
  if (!t || !/^\d*\.?\d+$/.test(t)) return NaN;
  return Number(t);
}

const ok = (n: number | undefined): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;

export function estimate(i: BudgetInput): BudgetRow[] {
  if (!ok(i.budget) || !ok(i.rate)) return [];
  if (i.model === "cpd") return [{ label: "Days on the placement", value: i.budget / i.rate, kind: "days" }];

  const rows: BudgetRow[] = [];
  let clicks: number | undefined;
  if (i.model === "cpm") {
    const impressions = (i.budget / i.rate) * 1000;
    rows.push({ label: "Impressions", value: impressions, kind: "count" });
    if (ok(i.ctr)) {
      clicks = impressions * (i.ctr / 100);
      rows.push({ label: "Clicks", value: clicks, kind: "count" });
      if (Math.floor(clicks) > 0) rows.push({ label: "Cost per click", value: i.budget / clicks, kind: "money" });
    }
  } else {
    clicks = i.budget / i.rate;
    rows.push({ label: "Clicks", value: clicks, kind: "count" });
  }
  if (clicks !== undefined && ok(i.cvr)) {
    const conversions = clicks * (i.cvr / 100);
    rows.push({ label: "Conversions", value: conversions, kind: "count" });
    if (Math.floor(conversions) > 0)
      rows.push({ label: "Cost per conversion", value: i.budget / conversions, kind: "money" });
  }
  return rows;
}

const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function formatRow(r: BudgetRow): string {
  if (r.kind === "count") return nf.format(Math.floor(r.value));
  if (r.kind === "money") return `${nf.format(Math.round(r.value))} VND`;
  return nf1.format(r.value);
}

const rateLabels: Record<Model, string> = {
  cpm: "Your price per 1,000 impressions (VND)",
  cpc: "Your price per click (VND)",
  cpd: "Your price per day (VND)",
};

export function bindBudgetEstimator(form: HTMLFormElement): () => void {
  const out = form.querySelector<HTMLElement>("[data-out]");
  const rateLabel = form.querySelector<HTMLElement>("[data-rate-label]");
  const ctrField = form.querySelector<HTMLElement>("[data-field='ctr']");
  const cvrField = form.querySelector<HTMLElement>("[data-field='cvr']");
  if (!out) return () => {};
  const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
  const empty = out.innerHTML;

  const update = () => {
    const model = ((form.elements.namedItem("model") as RadioNodeList | null)?.value || "cpm") as Model;
    if (rateLabel) rateLabel.textContent = rateLabels[model];
    if (ctrField) ctrField.hidden = model !== "cpm";
    if (cvrField) cvrField.hidden = model === "cpd";
    const rows = estimate({
      model,
      budget: parseAmount(value("budget")),
      rate: parseAmount(value("rate")),
      ctr: parseAmount(value("ctr")),
      cvr: parseAmount(value("cvr")),
    });
    if (!rows.length) {
      out.innerHTML = empty;
      return;
    }
    const dl = document.createElement("dl");
    dl.className = "tool-rows";
    for (const r of rows) {
      const div = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = r.label;
      dd.textContent = formatRow(r);
      div.append(dt, dd);
      dl.append(div);
    }
    out.replaceChildren(dl);
  };
  const onSubmit = (e: Event) => e.preventDefault();

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", onSubmit);
  update();
  return () => {
    form.removeEventListener("input", update);
    form.removeEventListener("change", update);
    form.removeEventListener("submit", onSubmit);
  };
}
