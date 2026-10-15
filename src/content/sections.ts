import type { SectionId } from "./roles";

// Section ids and labels for the section dots and the Sections menu, in page order.
// Keep in step with the section ids in src/components/Portfolio.tsx.
const middle: Record<SectionId, string> = {
  solutions: "Ad solutions",
  process: "How I work",
  measurement: "Measurement",
  websites: "WordPress",
};

export function sectionList(order: SectionId[], proof: boolean): [id: string, label: string][] {
  return [
    ["top", "Start"],
    ["summary", "The short version"],
    ["about", "About"],
    ...order.map((id): [string, string] => [id, middle[id]]),
    ["tools", "Tools"],
    ...(proof ? [["proof", "Results and references"] as [string, string]] : []),
    ["built-with-ai", "Built with AI"],
    ["skills", "Skills"],
    ["contact", "Contact"],
  ];
}
