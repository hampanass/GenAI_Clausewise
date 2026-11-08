"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { exportAnalysisToCsv } from "@/lib/export";
import { deleteSavedAnalysis, getSavedAnalyses, type SavedAnalysis } from "@/lib/saved-store";
import type { EligibilityStatus } from "@/lib/types";

const verdictPills: Record<EligibilityStatus, { label: string; style: string }> = {
  eligible: { label: "Bid Recommended", style: "bg-[#eaf6f0] text-[#26784f] border-[#26784f]/20" },
  conditionally_eligible: { label: "Conditional", style: "bg-[#fff8ea] text-[#a66a13] border-[#a66a13]/20" },
  ineligible: { label: "No-Bid Warning", style: "bg-[#fff0ef] text-[#b54d45] border-[#b54d45]/20" },
};

export default function SavedAnalysesPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>(() => {
    if (typeof window === "undefined") return [];
    return getSavedAnalyses();
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onUpdate = () => setAnalyses(getSavedAnalyses());
    window.addEventListener("clausewise_saved_updated", onUpdate);
    return () => window.removeEventListener("clausewise_saved_updated", onUpdate);
  }, []);

  function openAnalysis(item: SavedAnalysis) {
    sessionStorage.setItem("clausewise-analysis", JSON.stringify(item.result));
    window.dispatchEvent(new Event("clausewise_analysis_updated"));
    router.push("/results");
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this saved analysis?")) {
      deleteSavedAnalysis(id);
    }
  }

  const filtered = analyses.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.result.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#edf6f5] to-[#dcefeb] text-teal shadow-sm">
            <FolderOpen size={20} />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">Library</p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-navy">
            Saved Tender Analyses
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Revisit past amendment reports, track bid requirements, and export matrices.
          </p>
        </div>

        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal to-[#0f766e] px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:-translate-y-0.5 hover:from-[#11766f] hover:to-[#0b5f59]"
        >
          <Plus size={15} /> New comparison
        </Link>
      </div>

      {/* Search Bar */}
      {analyses.length > 0 && (
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved tenders by title or summary…"
            className="w-full rounded-lg border border-line bg-white/90 pl-8 pr-3 py-2 text-[12px] text-navy outline-none backdrop-blur transition-colors focus:border-teal focus:ring-2 focus:ring-teal/15"
          />
        </div>
      )}

      {/* Empty State */}
      {analyses.length === 0 ? (
        <section className="rounded-2xl border border-line bg-white/90 p-12 text-center shadow-card backdrop-blur">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#edf6f5] to-[#dcefeb] text-teal">
            <FolderOpen size={22} />
          </div>
          <h2 className="mt-4 text-[16px] font-semibold text-navy">No saved analyses yet</h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-5 text-slate-500">
            After running a tender comparison, click &quot;Save to library&quot; on the results page to store the report for your bidding team.
          </p>
          <Link
            href="/workspace"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal to-[#0f766e] px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:-translate-y-0.5 hover:from-[#11766f] hover:to-[#0b5f59]"
          >
            Start your first comparison <ArrowRight size={15} />
          </Link>
        </section>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-white/90 p-8 text-center text-[12px] text-slate-500 backdrop-blur">
          No saved tenders match &quot;{search}&quot;.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => {
            const verdict = item.result.company_assessment?.verdict;
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article
                key={item.id}
                onClick={() => openAnalysis(item)}
                className="group relative cursor-pointer rounded-xl border border-line bg-white/90 p-5 shadow-card backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/50 hover:shadow-lg"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-navy group-hover:text-teal transition-colors">
                        {item.title}
                      </h3>
                      {verdict && (
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${verdictPills[verdict]?.style ?? "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {verdictPills[verdict]?.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-600">
                      {item.result.summary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportAnalysisToCsv(item.result, `${item.title.replace(/\s+/g, "_")}.csv`);
                      }}
                      className="rounded-lg border border-line bg-white p-2 text-slate-500 hover:border-teal hover:text-teal shadow-sm"
                      title="Export CSV for Excel"
                    >
                      <FileSpreadsheet size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="rounded-lg border border-line bg-white p-2 text-slate-400 hover:border-red-200 hover:text-red-600 shadow-sm"
                      title="Delete saved analysis"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {dateStr}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <FileText size={12} /> {item.result.changes.length} requirement changes
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#eaf6f0] px-2 py-0.5 text-[10px] font-bold text-[#26784f]">
                      +{item.result.counts.added} Added
                    </span>
                    <span className="rounded bg-[#fff5e7] px-2 py-0.5 text-[10px] font-bold text-[#a66a13]">
                      ~{item.result.counts.modified} Modified
                    </span>
                    <span className="rounded bg-[#fff0ef] px-2 py-0.5 text-[10px] font-bold text-[#b54d45]">
                      -{item.result.counts.removed} Removed
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
