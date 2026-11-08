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

export type EligibilityStatus = "eligible" | "conditionally_eligible" | "ineligible";

export type ComplianceCheckStatus = "met" | "not_met" | "needs_verification";

export interface CompanyProfile {
  turnover?: string;
  experience_years?: string;
  certifications?: string[];
  notes?: string;
}

export interface RequirementCompliance {
  requirement: string;
  status: ComplianceCheckStatus;
  reason: string;
  recommendation?: string;
}

export interface CompanyAssessment {
  verdict: EligibilityStatus;
  summary: string;
  compliance_checks: RequirementCompliance[];
}

export interface GroqUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
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
  company_profile?: CompanyProfile | null;
  company_assessment?: CompanyAssessment | null;
  usage?: GroqUsage | null;
}
