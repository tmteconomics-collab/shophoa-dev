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

/** Which figure a row shows; the visible label and money unit come from the markup. */
export type RowKey = "impressions" | "clicks" | "costPerClick" | "conversions" | "costPerConversion" | "days";

export interface BudgetRow {
  key: RowKey;
  value: number;
  /** "count" rounds down to whole units; "money" adds the currency; "days" keeps one decimal. */
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
  if (i.model === "cpd") return [{ key: "days", value: i.budget / i.rate, kind: "days" }];

  const rows: BudgetRow[] = [];
  let clicks: number | undefined;
  if (i.model === "cpm") {
    const impressions = (i.budget / i.rate) * 1000;
    rows.push({ key: "impressions", value: impressions, kind: "count" });
    if (ok(i.ctr)) {
      clicks = impressions * (i.ctr / 100);
      rows.push({ key: "clicks", value: clicks, kind: "count" });
      if (Math.floor(clicks) > 0) rows.push({ key: "costPerClick", value: i.budget / clicks, kind: "money" });
    }
  } else {
    clicks = i.budget / i.rate;
    rows.push({ key: "clicks", value: clicks, kind: "count" });
  }
  if (clicks !== undefined && ok(i.cvr)) {
    const conversions = clicks * (i.cvr / 100);
    rows.push({ key: "conversions", value: conversions, kind: "count" });
    if (Math.floor(conversions) > 0)
      rows.push({ key: "costPerConversion", value: i.budget / conversions, kind: "money" });
  }
  return rows;
}

export function formatRow(r: BudgetRow, nf: Intl.NumberFormat, nf1: Intl.NumberFormat, money: string): string {
  if (r.kind === "count") return nf.format(Math.floor(r.value));
  if (r.kind === "money") return `${nf.format(Math.round(r.value))} ${money}`;
  return nf1.format(r.value);
}

const enRateLabels: Record<Model, string> = {
  cpm: "Your price per 1,000 impressions (VND)",
  cpc: "Your price per click (VND)",
  cpd: "Your price per day (VND)",
};
const enRowLabels: Record<RowKey, string> = {
  impressions: "Impressions",
  clicks: "Clicks",
  costPerClick: "Cost per click",
  conversions: "Conversions",
  costPerConversion: "Cost per conversion",
  days: "Days on the placement",
};

export function bindBudgetEstimator(form: HTMLFormElement): () => void {
  const out = form.querySelector<HTMLElement>("[data-out]");
  const rateLabel = form.querySelector<HTMLElement>("[data-rate-label]");
  const ctrField = form.querySelector<HTMLElement>("[data-field='ctr']");
  const cvrField = form.querySelector<HTMLElement>("[data-field='cvr']");
  if (!out) return () => {};
  const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
  const empty = out.innerHTML;
  const d = form.dataset;
  // Labels, currency and number format come from the markup; English is the fallback.
  const rateLabels: Record<Model, string> = {
    cpm: d.rateCpm || enRateLabels.cpm,
    cpc: d.rateCpc || enRateLabels.cpc,
    cpd: d.rateCpd || enRateLabels.cpd,
  };
  const rowLabels: Record<RowKey, string> = {
    impressions: d.rowImpressions || enRowLabels.impressions,
    clicks: d.rowClicks || enRowLabels.clicks,
    costPerClick: d.rowCpc || enRowLabels.costPerClick,
    conversions: d.rowConversions || enRowLabels.conversions,
    costPerConversion: d.rowCpconv || enRowLabels.costPerConversion,
    days: d.rowDays || enRowLabels.days,
  };
  const money = d.money || "VND";
  const nf = new Intl.NumberFormat(d.numLocale || "en-US", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat(d.numLocale || "en-US", { maximumFractionDigits: 1 });

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
      dt.textContent = rowLabels[r.key];
      dd.textContent = formatRow(r, nf, nf1, money);
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
