"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookmarkCheck,
  BookmarkPlus,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { exportAnalysisToCsv } from "@/lib/export";
import { saveAnalysis } from "@/lib/saved-store";
import type {
  AnalysisResult,
  ChangeCategory,
  ComplianceCheckStatus,
  EligibilityStatus,
  RequirementChange,
} from "@/lib/types";

const categoryStyles: Record<ChangeCategory, string> = {
  added: "bg-[#eaf6f0] text-[#26784f] border-[#c2e4d3]",
  modified: "bg-[#fff5e7] text-[#a66a13] border-[#f8e0b6]",
  removed: "bg-[#fff0ef] text-[#b54d45] border-[#f9cac6]",
};

const verdictStyles: Record<EligibilityStatus, { bg: string; text: string; border: string; label: string; icon: typeof ShieldCheck }> = {
  eligible: {
    bg: "bg-[#eaf6f0]",
    text: "text-[#26784f]",
    border: "border-[#26784f]/30",
    label: "BID RECOMMENDED · ELIGIBLE",
    icon: ShieldCheck,
  },
  conditionally_eligible: {
    bg: "bg-[#fff8ea]",
    text: "text-[#a66a13]",
    border: "border-[#a66a13]/30",
    label: "CONDITIONAL BID · ACTION REQUIRED",
    icon: AlertTriangle,
  },
  ineligible: {
    bg: "bg-[#fff0ef]",
    text: "text-[#b54d45]",
    border: "border-[#b54d45]/30",
    label: "NO-BID WARNING · CRITICAL BARRIER",
    icon: XCircle,
  },
};

const checkStatusBadges: Record<ComplianceCheckStatus, { label: string; color: string }> = {
  met: { label: "Condition Met", color: "bg-[#eaf6f0] text-[#26784f]" },
  not_met: { label: "Barrier / Not Met", color: "bg-[#fff0ef] text-[#b54d45]" },
  needs_verification: { label: "Verification Needed", color: "bg-[#fff5e7] text-[#a66a13]" },
};

export default function ResultsPage() {
  const stored = useSyncExternalStore(subscribeToStorage, readStoredAnalysis, () => null);
  const result = useMemo(() => {
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AnalysisResult;
    } catch {
      return null;
    }
  }, [stored]);

  // Filtering & Search
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isSaved, setIsSaved] = useState(false);

  function handleSave() {
    if (!result || isSaved) return;
    saveAnalysis("Corrigendum Impact Assessment", result);
    setIsSaved(true);
  }

  const reviewNeededCount = useMemo(() => {
    return result?.changes.filter((c) => c.needs_review).length ?? 0;
  }, [result]);

  const filteredChanges = useMemo(() => {
    if (!result) return [];
    return result.changes.filter((change) => {
      // Category filter
      if (filterCategory === "added" && change.category !== "added") return false;
      if (filterCategory === "modified" && change.category !== "modified") return false;
      if (filterCategory === "removed" && change.category !== "removed") return false;
      if (filterCategory === "review" && !change.needs_review) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inReq = change.requirement.toLowerCase().includes(query);
        const inExp = change.explanation.toLowerCase().includes(query);
        const inImpact = change.compliance_impact.toLowerCase().includes(query);
        const inOrig = (change.original_value ?? "").toLowerCase().includes(query);
        const inAmended = (change.amended_value ?? "").toLowerCase().includes(query);
        return inReq || inExp || inImpact || inOrig || inAmended;
      }
      return true;
    });
  }, [result, filterCategory, searchQuery]);

  if (!result) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white/90 px-6 py-14 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#edf6f5] to-[#dcefeb] text-teal">
          <FileText size={22} />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-navy">No analysis to display</h1>
        <p className="mt-2 text-[13px] leading-5 text-slate-500">
          Run a tender comparison first. Results are held in this browser session. Extracted text is sent to Groq for analysis and is not saved by ClauseWise.
        </p>
        <Link
          href="/workspace"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal to-[#0f766e] px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:-translate-y-0.5 hover:from-[#11766f] hover:to-[#0b5f59]"
        >
          Start a comparison <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const taskKey = result
    ? `clausewise-tasks-${result.summary.slice(0, 60).replace(/\W/g, "")}`
    : "clausewise-tasks-none";

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div>
        <Link
          href="/workspace"
          className="mb-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-teal print:hidden"
        >
          <ArrowLeft size={13} /> New comparison
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">Analysis complete</p>
            <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-navy">
              Amendment Impact Assessment Report
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold shadow-sm backdrop-blur transition-all ${isSaved
                ? "border-teal bg-[#edf6f5] text-teal"
                : "border-line bg-white/90 text-navy hover:-translate-y-0.5 hover:border-teal hover:text-teal"
                }`}
              title="Save report to your library"
            >
              {isSaved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
              {isSaved ? "Saved to library" : "Save to library"}
            </button>
            <button
              type="button"
              onClick={() => exportAnalysisToCsv(result)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/90 px-3 py-2 text-[11px] font-semibold text-navy shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal hover:text-teal"
              title="Export report as CSV spreadsheet for Excel"
            >
              <FileSpreadsheet size={14} className="text-teal" /> Export CSV / Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/90 px-3 py-2 text-[11px] font-semibold text-navy shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal hover:text-teal"
              title="Print formatted executive summary or Save as PDF"
            >
              <Printer size={14} className="text-teal" /> Print / Save PDF
            </button>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal to-[#0f766e] px-3.5 py-2 text-[11px] font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:-translate-y-0.5 hover:from-[#11766f] hover:to-[#0b5f59]"
            >
              <Plus size={14} /> Compare another
            </Link>
          </div>
        </div>
      </div>

      {/* Bid / No-Bid Company Assessment Verdict (if available) */}
      {result.company_assessment && (
        <section
          className={`rounded-xl border p-5 sm:p-6 shadow-card ${verdictStyles[result.company_assessment.verdict]?.border ?? "border-line"
            } ${verdictStyles[result.company_assessment.verdict]?.bg ?? "bg-white"}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${verdictStyles[result.company_assessment.verdict]?.text ?? "text-teal"
                  }`}
              >
                {(() => {
                  const Icon = verdictStyles[result.company_assessment.verdict]?.icon ?? ShieldCheck;
                  return <Icon size={20} />;
                })()}
              </span>
              <div>
                <span
                  className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${verdictStyles[result.company_assessment.verdict]?.text ?? "text-teal"
                    }`}
                >
                  {verdictStyles[result.company_assessment.verdict]?.label}
                </span>
                <h2 className="mt-1 text-[17px] font-semibold text-navy">
                  Company Eligibility & Bid Decision Assessment
                </h2>
                <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-slate-700">
                  {result.company_assessment.summary}
                </p>
              </div>
            </div>

            {result.company_profile && (
              <div className="rounded-lg border border-line/60 bg-white/90 p-3 text-[11px] text-slate-600 sm:max-w-xs">
                <p className="font-semibold text-navy flex items-center gap-1.5">
                  <Building2 size={13} className="text-teal" /> Evaluated Company Profile
                </p>
                <div className="mt-1.5 space-y-0.5 text-[10px]">
                  {result.company_profile.turnover && (
                    <p>
                      <span className="text-slate-400">Turnover:</span> {result.company_profile.turnover}
                    </p>
                  )}
                  {result.company_profile.experience_years && (
                    <p>
                      <span className="text-slate-400">Experience:</span> {result.company_profile.experience_years} years
                    </p>
                  )}
                  {result.company_profile.certifications?.length ? (
                    <p>
                      <span className="text-slate-400">Certs:</span>{" "}
                      {result.company_profile.certifications.join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Compliance Checks Matrix */}
          {result.company_assessment.compliance_checks.length > 0 && (
            <div className="mt-4 border-t border-line/60 pt-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Requirement-by-Requirement Check
              </p>
              <div className="mt-2 space-y-2">
                {result.company_assessment.compliance_checks.map((check, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-white/80 border border-line/50 p-3"
                  >
                    <div>
                      <span className="text-[12px] font-semibold text-navy">{check.requirement}</span>
                      <p className="mt-0.5 text-[11px] text-slate-600">{check.reason}</p>
                      {check.recommendation && (
                        <p className="mt-1 text-[11px] font-medium text-teal flex items-center gap-1">
                          <Award size={12} /> Action: {check.recommendation}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex shrink-0 self-start sm:self-center rounded-md px-2 py-1 text-[10px] font-bold ${checkStatusBadges[check.status]?.color ?? "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {checkStatusBadges[check.status]?.label ?? check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Overall Summary Card */}
      <section className="rounded-2xl border border-line bg-white/90 p-5 shadow-card backdrop-blur sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf6f5] text-teal">
            <CheckCircle2 size={17} />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-navy">Executive Summary of Amendments</h2>
            <p className="mt-2 text-[13px] leading-6 text-slate-600">{result.summary}</p>
          </div>
        </div>
      </section>

      {/* Quick Counts */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CountCard label="Added requirements" count={result.counts.added} tone="green" />
        <CountCard label="Modified requirements" count={result.counts.modified} tone="amber" />
        <CountCard label="Removed requirements" count={result.counts.removed} tone="red" />
      </section>

      {/* Warnings Card */}
      {result.warnings.length > 0 && (
        <section className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-5 backdrop-blur">
          <h2 className="flex items-center gap-2 text-[12px] font-semibold text-amber-900">
            <AlertTriangle size={15} /> Warnings and Model Uncertainty
          </h2>
          <ul className="mt-3 space-y-2">
            {result.warnings.map((warning, index) => (
              <li key={`${warning}-${index}`} className="text-[12px] leading-5 text-amber-900/80">
                • {warning}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Interactive Compliance Action Checklist */}
      {result.items_to_review.length > 0 && (
        <ActionItemsChecklist
          key={taskKey}
          items={result.items_to_review}
          taskKey={taskKey}
        />
      )}

      {/* Detailed Comparison with Search & Filter Tabs */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-navy">Detailed Clause-by-Clause Comparison</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Showing {filteredChanges.length} of {result.changes.length} identified requirement changes
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] print:hidden">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses, values, impact…"
              className="w-full rounded-lg border border-line bg-white/90 pl-8 pr-3 py-1.5 text-[12px] text-navy outline-none backdrop-blur transition-colors focus:border-teal focus:ring-2 focus:ring-teal/15"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="sticky top-[72px] z-10 flex flex-wrap items-center gap-1.5 border-b border-line/80 bg-canvas/80 py-3 backdrop-blur-xl print:hidden">
          <FilterTab
            label="All Changes"
            count={result.changes.length}
            active={filterCategory === "all"}
            onClick={() => setFilterCategory("all")}
          />
          <FilterTab
            label="Modified"
            count={result.counts.modified}
            active={filterCategory === "modified"}
            onClick={() => setFilterCategory("modified")}
          />
          <FilterTab
            label="Added"
            count={result.counts.added}
            active={filterCategory === "added"}
            onClick={() => setFilterCategory("added")}
          />
          <FilterTab
            label="Removed"
            count={result.counts.removed}
            active={filterCategory === "removed"}
            onClick={() => setFilterCategory("removed")}
          />
          {reviewNeededCount > 0 && (
            <FilterTab
              label="⚠️ Needs Review"
              count={reviewNeededCount}
              active={filterCategory === "review"}
              onClick={() => setFilterCategory("review")}
            />
          )}
        </div>

        {/* Changes List */}
        {filteredChanges.length === 0 ? (
          <div className="rounded-xl border border-line bg-white/90 px-5 py-12 text-center text-[12px] text-slate-500 backdrop-blur">
            {searchQuery
              ? `No clauses match "${searchQuery}". Try a different keyword.`
              : "No requirement changes match the selected filter."}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChanges.map((change, index) => (
              <ChangeCard key={`${change.requirement}-${index}`} change={change} />
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-[10px] leading-5 text-slate-400">
        AI-generated analysis may be incomplete. Always cross-examine citations and verify clauses directly against official government tender PDFs before making bidding commitments.
      </p>
    </div>
  );
}

function readStoredAnalysis() {
  return window.sessionStorage.getItem("clausewise-analysis");
}

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function CountCard({ label, count, tone }: { label: string; count: number; tone: "green" | "amber" | "red" }) {
  const styles = {
    green: "text-[#26784f] bg-[#eaf6f0]",
    amber: "text-[#a66a13] bg-[#fff5e7]",
    red: "text-[#b54d45] bg-[#fff0ef]",
  };
  return (
    <div className="rounded-xl border border-line bg-white/90 px-5 py-4 shadow-card backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
        <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-bold ${styles[tone]}`}>
          {count}
        </span>
      </div>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${active
        ? "bg-navy text-white shadow-sm"
        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-navy border border-line"
        }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
          }`}
      >
        {count}
      </span>
    </button>
  );
}

function ChangeCard({ change }: { change: RequirementChange }) {
  const [showQueryDraft, setShowQueryDraft] = useState(false);
  const [copied, setCopied] = useState(false);

  const queryText = `Subject: Pre-Bid Clarification Request for "${change.requirement}"

To: The Tendering Authority / Chief Engineer

Reference Clause: ${change.requirement}
Original Requirement: ${change.original_value ?? "Not Specified / New"}
Amended / Corrigendum Requirement: ${change.amended_value ?? "Deleted / Relaxed"}

Observation / Impact:
${change.explanation}
${change.compliance_impact}

Clarification / Relief Requested:
We respectfully request the tendering committee to consider relaxing or clarifying this condition to ensure competitive participation and provide reasonable accommodation for qualified bidders.

Respectfully submitted,
Prospective Bidder`;

  function copyQuery() {
    navigator.clipboard.writeText(queryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white/90 shadow-card backdrop-blur transition-shadow duration-200 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${categoryStyles[change.category]
              }`}
          >
            {change.category}
          </span>
          <h3 className="text-[13px] font-semibold text-navy">{change.requirement}</h3>
        </div>

        <div className="flex items-center gap-2">
          {change.needs_review && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              <AlertTriangle size={12} /> Review needed
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowQueryDraft(!showQueryDraft)}
            className="inline-flex items-center gap-1 rounded-md border border-line bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal hover:text-teal"
            title="Generate formal Pre-Bid clarification query letter"
          >
            <FileQuestion size={12} />
            Pre-Bid Query
            {showQueryDraft ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Visual Shift Highlight */}
      {change.original_value && change.amended_value && (
        <div className="flex items-center gap-2 border-b border-line/60 bg-gradient-to-r from-[#fffaf3] to-[#fbfdfc] px-5 py-2.5 text-[11px]">
          <span className="text-slate-400 font-medium">Shift:</span>
          <span className="rounded bg-red-50 border border-red-200/60 px-2 py-0.5 text-red-700 font-medium line-through">
            {change.original_value}
          </span>
          <ArrowRight size={13} className="text-teal shrink-0" />
          <span className="rounded bg-teal/10 border border-teal/20 px-2 py-0.5 text-teal font-semibold">
            {change.amended_value}
          </span>
        </div>
      )}

      {/* Pre-Bid Query Draft Box */}
      {showQueryDraft && (
        <div className="border-b border-teal/20 bg-gradient-to-br from-[#f4faf9] to-white p-4 text-[11px]">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-navy flex items-center gap-1.5">
              <FileQuestion size={13} className="text-teal" /> Formal Pre-Bid Clarification Query Draft
            </p>
            <button
              type="button"
              onClick={copyQuery}
              className="inline-flex items-center gap-1 rounded-lg border border-teal/30 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-teal shadow-sm backdrop-blur transition-all hover:bg-teal hover:text-white"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied to clipboard!" : "Copy query letter"}
            </button>
          </div>
          <pre className="mt-2.5 whitespace-pre-wrap rounded-lg border border-line bg-white p-3 font-mono text-[10px] leading-5 text-slate-700">
            {queryText}
          </pre>
        </div>
      )}

      <div className="grid gap-px border-t border-line bg-line/70 sm:grid-cols-2">
        <EvidenceColumn
          title="Original"
          value={change.original_value}
          evidence={change.evidence_original}
          isOriginal
          changeCategory={change.category}
        />
        <EvidenceColumn
          title="Amended"
          value={change.amended_value}
          evidence={change.evidence_amended}
          isAmended
          changeCategory={change.category}
        />
      </div>

      <div className="grid gap-4 border-t border-line px-5 py-4 md:grid-cols-2 bg-[#fcfdfe]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">What changed</p>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{change.explanation}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Compliance impact</p>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{change.compliance_impact}</p>
        </div>
      </div>

      {change.review_documents.length > 0 && (
        <div className="border-t border-line bg-[#fbfcfd] px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Reassess these company documents
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {change.review_documents.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-md border border-line bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-600 shadow-sm backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function EvidenceColumn({
  title,
  value,
  evidence,
  isOriginal,
  isAmended,
  changeCategory,
}: {
  title: string;
  value: string | null;
  evidence: RequirementChange["evidence_original"];
  isOriginal?: boolean;
  isAmended?: boolean;
  changeCategory?: ChangeCategory;
}) {
  // Contextual empty-evidence label (B8)
  let noEvidenceLabel = "No verified citation available";
  if (isOriginal && changeCategory === "added") noEvidenceLabel = "Not applicable — new requirement";
  if (isAmended && changeCategory === "removed") noEvidenceLabel = "Not present in amended document — needs review";
  return (
    <div className={`border-b border-line px-5 py-4 last:border-b-0 sm:border-b-0 sm:even:border-l sm:even:border-line ${isOriginal ? "bg-[#fffdf8]" : isAmended ? "bg-[#f5faf9]" : "bg-white"}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{title} value</p>
      <div className="mt-1.5">
        {value ? (
          <span
            className={`inline-block rounded-md px-2 py-0.5 text-[12px] font-semibold ${isAmended
              ? "bg-teal/10 text-teal border border-teal/20"
              : isOriginal
                ? "bg-slate-100 text-slate-700"
                : "text-navy"
              }`}
          >
            {value}
          </span>
        ) : (
          <span className="text-[12px] italic text-slate-400">Not stated / Not present</span>
        )}
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{title} evidence</p>
      {evidence.length ? (
        <div className="mt-2 space-y-2">
          {evidence.map((item, index) => (
            <blockquote
              key={`${item.page}-${index}`}
              className="border-l-2 border-teal/50 pl-2.5 text-[11px] leading-5 text-slate-600"
            >
              “{item.quote}”
              <span className="ml-1.5 inline-block rounded bg-[#edf6f5] px-1 py-0.5 text-[9px] font-semibold text-teal">
                Page {item.page}
              </span>
            </blockquote>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] italic text-slate-400">{noEvidenceLabel}</p>
      )}
    </div>
  );
}

function ActionItemsChecklist({ items, taskKey }: { items: string[]; taskKey: string }) {
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>(() => {
    if (typeof window === "undefined" || !taskKey || taskKey === "clausewise-tasks-none") return {};
    try {
      const saved = localStorage.getItem(taskKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  function toggleTask(index: number) {
    setCheckedTasks((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      try {
        localStorage.setItem(taskKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const totalTasks = items.length;
  const completedTasks = items.filter((_, i) => checkedTasks[i]).length;
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section className="rounded-2xl border border-[#dcece9] bg-gradient-to-br from-[#f0f8f7] to-white/90 p-5 shadow-card backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-[13px] font-semibold text-navy">
            <ShieldAlert size={16} className="text-teal" /> Action Items &amp; Bid Preparation Checklist
          </h2>
          <p className="text-[11px] text-slate-500">
            Check off items as your documentation team verifies and updates them.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-teal">
            {completedTasks} / {totalTasks} ({taskProgressPercent}%) completed
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-teal transition-all duration-300"
          style={{ width: `${taskProgressPercent}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => {
          const isChecked = !!checkedTasks[index];
          return (
            <label
              key={`${item}-${index}`}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors ${isChecked
                ? "border-teal/30 bg-teal/5 text-slate-400 line-through"
                : "border-line bg-white text-slate-700 hover:border-teal/50"
                }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleTask(index)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal accent-teal"
              />
              <span className="text-[12px] leading-5">{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
