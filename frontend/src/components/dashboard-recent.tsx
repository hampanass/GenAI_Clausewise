"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, FileSearch, Plus } from "lucide-react";
import { getSavedAnalyses, type SavedAnalysis } from "@/lib/saved-store";
import type { EligibilityStatus } from "@/lib/types";

const verdictPills: Record<EligibilityStatus, { label: string; style: string }> = {
  eligible: { label: "Eligible", style: "bg-[#eaf6f0] text-[#26784f]" },
  conditionally_eligible: { label: "Conditional", style: "bg-[#fff8ea] text-[#a66a13]" },
  ineligible: { label: "No-Bid Barrier", style: "bg-[#fff0ef] text-[#b54d45]" },
};

export function DashboardRecent() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>(() => {
    if (typeof window === "undefined") return [];
    return getSavedAnalyses();
  });

  useEffect(() => {
    const onUpdate = () => setAnalyses(getSavedAnalyses());
    window.addEventListener("clausewise_saved_updated", onUpdate);
    return () => window.removeEventListener("clausewise_saved_updated", onUpdate);
  }, []);

  function openAnalysis(item: SavedAnalysis) {
    sessionStorage.setItem("clausewise-analysis", JSON.stringify(item.result));
    router.push("/results");
  }

  if (analyses.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-white/90 p-6 shadow-card backdrop-blur sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">Your workspace</p>
            <h2 className="mt-2 text-[19px] font-semibold tracking-[-0.03em] text-navy">
              Ready for your first comparison
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-5 text-slate-500">
              No analyses are saved yet. Upload two PDFs or test a preset scenario to get a structured change assessment.
            </p>
          </div>
          <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8f4f2] to-[#dcefeb] text-teal sm:flex">
            <FileSearch size={20} />
          </span>
        </div>
        <Link
          href="/workspace"
          className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-teal hover:text-[#116f69]"
        >
          <Plus size={15} /> Create a comparison <ArrowUpRight size={13} />
        </Link>
      </div>
    );
  }

  const recent = analyses.slice(0, 3);

  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-7">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-teal">Recent activity</p>
          <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.03em] text-navy">
            Saved Tender Analyses
          </h2>
        </div>
        <Link
          href="/saved"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal hover:text-[#116f69]"
        >
          View all ({analyses.length}) <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-line/60">
        {recent.map((item) => {
          const verdict = item.result.company_assessment?.verdict;
          const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={item.id}
              onClick={() => openAnalysis(item)}
              className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all hover:bg-[#f5faf9] hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-[12px] font-semibold text-navy group-hover:text-teal transition-colors">
                    {item.title}
                  </h3>
                  {verdict && (
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${verdictPills[verdict]?.style ?? "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {verdictPills[verdict]?.label}
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {dateStr}
                  </span>
                  <span>·</span>
                  <span>{item.result.changes.length} changes identified</span>
                </p>
              </div>

              <span className="ml-3 shrink-0 text-slate-300 group-hover:text-teal transition-colors">
                <ArrowRight size={14} />
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-teal hover:text-[#116f69]"
        >
          <Plus size={15} /> Start new comparison <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
