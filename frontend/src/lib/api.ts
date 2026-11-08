import type { AnalysisResult } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function analyzeAmendment(
  originalFile: File,
  amendedFile: File,
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("original_file", originalFile);
  formData.append("amended_file", amendedFile);

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
