"use client";

/** Opens the browser's print dialog (save as PDF from there too). */
export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-ghost cv-btn" data-print onClick={() => window.print()}>
      {label}
    </button>
  );
}
