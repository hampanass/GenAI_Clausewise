import type { AnalysisResult, CompanyProfile } from "@/lib/types";
import { DEMO_SCENARIOS } from "@/lib/demo-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function analyzeAmendment(
  originalFile: File,
  amendedFile: File,
  companyProfile?: CompanyProfile,
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("original_file", originalFile);
  formData.append("amended_file", amendedFile);

  if (companyProfile) {
    formData.append("company_profile", JSON.stringify(companyProfile));
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/amendments/analyze`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Could not reach ClauseWise. Check that the backend is running and try again.");
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
        ? body.detail
        : "Analysis failed. Please try again.";
    throw new Error(detail);
  }
  return body as AnalysisResult;
}

export async function fetchDemoScenario(
  scenarioId: string,
  profile?: CompanyProfile,
): Promise<AnalysisResult> {
  // First attempt to call backend endpoint
  try {
    const params = new URLSearchParams();
    if (profile?.turnover) params.set("turnover", profile.turnover);
    if (profile?.experience_years) params.set("experience_years", profile.experience_years);
    if (profile?.certifications?.length) params.set("certifications", profile.certifications.join(","));

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_BASE_URL}/api/v1/demo/${scenarioId}${query}`);
    if (response.ok) {
      return (await response.json()) as AnalysisResult;
    }
  } catch {
    // If backend is not running or network fails, fallback to local demo data
  }

  const matched = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
  if (matched) {
    return matched.result;
  }
  throw new Error(`Demo scenario '${scenarioId}' not found.`);
}
