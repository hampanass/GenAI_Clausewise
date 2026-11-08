import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileCheck2, FileSearch, Plus, ShieldAlert, Sparkles } from "lucide-react";

const steps = [
  { number: "01", title: "Upload both versions", detail: "Add the original tender and the latest amendment or corrigendum." },
  { number: "02", title: "Review every change", detail: "See what was added, modified, or removed with source evidence." },
  { number: "03", title: "Reassess compliance", detail: "Understand impact and identify documents that may need updating." },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-navy px-7 py-9 text-white sm:px-10 sm:py-11">
        <div className="relative z-10 max-w-[650px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[11px] font-medium text-slate-200">
            <Sparkles size={13} className="text-teal-300" /> Tender amendment intelligence
          </div>
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.04em] sm:text-[38px]">
            Stay ahead of every <span className="text-teal-300">tender change.</span>
          </h1>
          <p className="mt-4 max-w-[520px] text-[14px] leading-6 text-slate-300">
            Compare an original tender with its amendment. Understand what changed, why it matters, and what your team should review.
          </p>
          <Link href="/workspace" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-slate-100">
            Start a comparison <ArrowRight size={16} />
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-32 h-[440px] w-[440px] rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-2 -top-16 h-[300px] w-[300px] rounded-full border border-white/[0.07]" />
        <div className="pointer-events-none absolute bottom-[-100px] right-[8%] h-[220px] w-[220px] rounded-full bg-teal/10 blur-3xl" />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="rounded-xl border border-line bg-white p-5 shadow-card">
            <p className="text-[11px] font-bold tracking-[0.12em] text-teal">{step.number}</p>
            <h2 className="mt-3 text-[14px] font-semibold text-navy">{step.title}</h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-500">{step.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">Your workspace</p>
              <h2 className="mt-2 text-[19px] font-semibold tracking-[-0.03em] text-navy">Ready for your first comparison</h2>
              <p className="mt-2 max-w-md text-[13px] leading-5 text-slate-500">No analyses are saved yet. Upload two PDFs to get a structured, evidence-backed change assessment.</p>
            </div>
            <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#edf6f5] text-teal sm:flex"><FileSearch size={20} /></span>
          </div>
          <Link href="/workspace" className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-teal hover:text-[#116f69]">
            <Plus size={15} /> Create a comparison <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="rounded-xl border border-[#dcece9] bg-[#f0f8f7] p-6 shadow-card sm:p-7">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-teal"><FileCheck2 size={18} /></div>
          <h2 className="mt-4 text-[14px] font-semibold text-navy">Built for evidence-led review</h2>
          <p className="mt-2 text-[12px] leading-5 text-slate-600">Citations are checked against the source PDF and page before appearing in results. Unverified evidence is flagged.</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-teal"><ShieldAlert size={14} /> Human review remains essential</div>
        </div>
      </section>

      <p className="text-center text-[11px] text-slate-400">ClauseWise · Track Changes. Understand Impact. Stay Compliant.</p>
    </div>
  );
}
