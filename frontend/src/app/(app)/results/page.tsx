"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, FileText, Plus, ShieldAlert } from "lucide-react";
import type { AnalysisResult, ChangeCategory, RequirementChange } from "@/lib/types";

const categoryStyles: Record<ChangeCategory, string> = {
  added: "bg-[#eaf6f0] text-[#26784f]",
  modified: "bg-[#fff5e7] text-[#a66a13]",
  removed: "bg-[#fff0ef] text-[#b54d45]",
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

  if (!result) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf6f5] text-teal"><FileText size={22} /></div>
        <h1 className="mt-5 text-xl font-semibold text-navy">No analysis to display</h1>
        <p className="mt-2 text-[13px] leading-5 text-slate-500">Run a tender comparison first. Results are held in this browser session and are not saved to an account.</p>
        <Link href="/workspace" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#11766f]">Start a comparison <ArrowRight size={15} /></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/workspace" className="mb-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-teal"><ArrowLeft size={13} /> New comparison</Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">Analysis complete</p>
            <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-navy">Amendment impact report</h1>
          </div>
          <Link href="/workspace" className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-[11px] font-semibold text-navy hover:border-teal hover:text-teal"><Plus size={14} /> Compare another</Link>
        </div>
      </div>

      <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf6f5] text-teal"><CheckCircle2 size={17} /></span>
          <div>
            <h2 className="text-[13px] font-semibold text-navy">Overall summary</h2>
            <p className="mt-2 text-[13px] leading-6 text-slate-600">{result.summary}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CountCard label="Added requirements" count={result.counts.added} tone="green" />
        <CountCard label="Modified requirements" count={result.counts.modified} tone="amber" />
        <CountCard label="Removed requirements" count={result.counts.removed} tone="red" />
      </section>

      {result.warnings.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="flex items-center gap-2 text-[12px] font-semibold text-amber-900"><AlertTriangle size={15} /> Warnings and uncertainty</h2>
          <ul className="mt-3 space-y-2">{result.warnings.map((warning, index) => <li key={`${warning}-${index}`} className="text-[12px] leading-5 text-amber-900/80">• {warning}</li>)}</ul>
        </section>
      )}

      {result.items_to_review.length > 0 && (
        <section className="rounded-xl border border-[#dcece9] bg-[#f0f8f7] p-5">
          <h2 className="flex items-center gap-2 text-[12px] font-semibold text-navy"><ShieldAlert size={15} className="text-teal" /> Items requiring review</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">{result.items_to_review.map((item, index) => <li key={`${item}-${index}`} className="text-[12px] leading-5 text-slate-600">• {item}</li>)}</ul>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-navy">Detailed comparison</h2>
            <p className="mt-1 text-[11px] text-slate-500">{result.changes.length} requirement {result.changes.length === 1 ? "change" : "changes"} identified</p>
          </div>
        </div>
        {result.changes.length === 0 ? (
          <div className="rounded-xl border border-line bg-white px-5 py-10 text-center text-[12px] text-slate-500">No requirement changes were identified in the provided text.</div>
        ) : (
          <div className="space-y-4">{result.changes.map((change, index) => <ChangeCard key={`${change.requirement}-${index}`} change={change} />)}</div>
        )}
      </section>
      <p className="text-center text-[10px] leading-5 text-slate-400">AI-generated analysis may be incomplete. Verify all requirements against the official tender documents before taking action.</p>
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
  const styles = { green: "text-[#26784f] bg-[#eaf6f0]", amber: "text-[#a66a13] bg-[#fff5e7]", red: "text-[#b54d45] bg-[#fff0ef]" };
  return (
    <div className="rounded-xl border border-line bg-white px-5 py-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
        <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-bold ${styles[tone]}`}>{count}</span>
      </div>
    </div>
  );
}

function ChangeCard({ change }: { change: RequirementChange }) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${categoryStyles[change.category]}`}>{change.category}</span>
          <h3 className="text-[13px] font-semibold text-navy">{change.requirement}</h3>
        </div>
        {change.needs_review && <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700"><AlertTriangle size={12} /> Review needed</span>}
      </div>
      <div className="grid sm:grid-cols-2">
        <EvidenceColumn title="Original" value={change.original_value} evidence={change.evidence_original} />
        <EvidenceColumn title="Amended" value={change.amended_value} evidence={change.evidence_amended} />
      </div>
      <div className="grid gap-4 border-t border-line px-5 py-4 md:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">What changed</p>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{change.explanation}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Compliance impact</p>
          <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{change.compliance_impact}</p>
        </div>
      </div>
      {change.review_documents.length > 0 && <div className="border-t border-line bg-[#fbfcfd] px-5 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Reassess these items</p><div className="mt-2 flex flex-wrap gap-1.5">{change.review_documents.map((item, index) => <span key={`${item}-${index}`} className="rounded-md border border-line bg-white px-2 py-1 text-[10px] text-slate-600">{item}</span>)}</div></div>}
    </article>
  );
}

function EvidenceColumn({ title, value, evidence }: { title: string; value: string | null; evidence: RequirementChange["evidence_original"] }) {
  return (
    <div className="border-b border-line px-5 py-4 last:border-b-0 sm:border-b-0 sm:even:border-l sm:even:border-line">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{title} value</p>
      <p className="mt-1.5 text-[12px] font-medium text-navy">{value ?? "Not stated"}</p>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{title} evidence</p>
      {evidence.length ? (
        <div className="mt-2 space-y-2">{evidence.map((item, index) => <blockquote key={`${item.page}-${index}`} className="border-l-2 border-teal/50 pl-2.5 text-[11px] leading-5 text-slate-600">“{item.quote}”<span className="ml-1.5 whitespace-nowrap text-[10px] text-slate-400">p. {item.page}</span></blockquote>)}</div>
      ) : <p className="mt-2 text-[11px] italic text-slate-400">No verified citation available</p>}
    </div>
  );
}
