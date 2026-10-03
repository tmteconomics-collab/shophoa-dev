import { bindBudgetEstimator } from "./budget";
import { bindUtmBuilder } from "./utm";

/** Binds every tool form on the page ([data-tool]). Returns a cleanup function. */
export function bindTools(root: ParentNode = document): () => void {
  const cleanups: (() => void)[] = [];
  root.querySelectorAll<HTMLFormElement>("form[data-tool]").forEach((form) => {
    if (form.dataset.tool === "utm") cleanups.push(bindUtmBuilder(form));
    if (form.dataset.tool === "budget") cleanups.push(bindBudgetEstimator(form));
  });
  return () => cleanups.forEach((c) => c());
}
