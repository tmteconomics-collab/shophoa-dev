import type { SectionId } from "./roles";

// Section ids and labels for the section dots and the Sections menu, in page order.
// Keep the ids in step with the section ids in src/components/Portfolio.tsx; the
// labels come from the active language (Ui.sections in src/content/i18n.ts).
export function sectionList(
  order: SectionId[],
  proof: boolean,
  labels: Record<string, string>,
): [id: string, label: string][] {
  const ids = [
    "top",
    "summary",
    "about",
    ...order,
    "tools",
    ...(proof ? ["proof"] : []),
    "built-with-ai",
    "skills",
    "contact",
  ];
  return ids.map((id) => [id, labels[id] ?? id]);
}
