import type { AnalysisResult } from "@/lib/types";

function escapeCsvCell(cell: string | number | null | undefined): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportAnalysisToCsv(result: AnalysisResult, filename = "ClauseWise_Amendment_Impact_Report.csv") {
  const headers = [
    "Category",
    "Requirement",
    "Original Value",
    "Amended Value",
    "Explanation",
    "Compliance Impact",
    "Documents Requiring Review",
    "Original Citations",
    "Amended Citations",
    "Needs Review",
  ];

  const rows = result.changes.map((change) => {
    const origQuotes = change.evidence_original
      .map((e) => `[p.${e.page}] "${e.quote}"`)
      .join(" | ");
    const amendedQuotes = change.evidence_amended
      .map((e) => `[p.${e.page}] "${e.quote}"`)
      .join(" | ");

    return [
      escapeCsvCell(change.category.toUpperCase()),
      escapeCsvCell(change.requirement),
      escapeCsvCell(change.original_value ?? "Not stated"),
      escapeCsvCell(change.amended_value ?? "Not stated"),
      escapeCsvCell(change.explanation),
      escapeCsvCell(change.compliance_impact),
      escapeCsvCell(change.review_documents.join(", ")),
      escapeCsvCell(origQuotes),
      escapeCsvCell(amendedQuotes),
      escapeCsvCell(change.needs_review ? "YES" : "NO"),
    ].join(",");
  });

  // Include Company Assessment if present
  let csvContent = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  csvContent += `# ClauseWise Amendment Impact Assessment Report\n`;
  csvContent += `# Summary: ${result.summary.replace(/\n/g, " ")}\n`;
  csvContent += `# Total Changes: Added=${result.counts.added}, Modified=${result.counts.modified}, Removed=${result.counts.removed}\n`;

  if (result.company_assessment) {
    csvContent += `# Bid / No-Bid Verdict: ${result.company_assessment.verdict.toUpperCase()}\n`;
    csvContent += `# Eligibility Summary: ${result.company_assessment.summary.replace(/\n/g, " ")}\n`;
  }
  csvContent += "\n";

  csvContent += headers.join(",") + "\n" + rows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

