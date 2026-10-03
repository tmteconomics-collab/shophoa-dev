"use client";

/** Opens the browser's print dialog (save as PDF from there too). */
export default function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost cv-btn" data-print onClick={() => window.print()}>
      Print
    </button>
  );
}
