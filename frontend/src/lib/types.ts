export type ChangeCategory = "added" | "modified" | "removed";

export interface Evidence {
  quote: string;
  page: number;
}

export interface RequirementChange {
  category: ChangeCategory;
  requirement: string;
  original_value: string | null;
  amended_value: string | null;
  explanation: string;
  compliance_impact: string;
  evidence_original: Evidence[];
  evidence_amended: Evidence[];
  review_documents: string[];
  needs_review: boolean;
}

export interface AnalysisResult {
  summary: string;
  counts: {
    added: number;
    modified: number;
    removed: number;
  };
  changes: RequirementChange[];
  items_to_review: string[];
  warnings: string[];
}
