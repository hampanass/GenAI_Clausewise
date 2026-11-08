import type { AnalysisResult } from "@/lib/types";

export interface SavedAnalysis {
  id: string;
  title: string;
  createdAt: string;
  result: AnalysisResult;
}

const STORAGE_KEY = "clausewise_saved_analyses_v1";

export function getSavedAnalyses(): SavedAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(title: string, result: AnalysisResult): SavedAnalysis {
  const list = getSavedAnalyses();
  const item: SavedAnalysis = {
    id: `cw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim() || `Tender Comparison - ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toISOString(),
    result,
  };
  const updated = [item, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clausewise_saved_updated"));
  return item;
}

export function deleteSavedAnalysis(id: string) {
  const list = getSavedAnalyses();
  const updated = list.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clausewise_saved_updated"));
}

