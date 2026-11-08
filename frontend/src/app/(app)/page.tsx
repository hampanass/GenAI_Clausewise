import Link from "next/link";
import { ArrowRight, FileCheck2, FileText, ShieldAlert, Sparkles } from "lucide-react";
import { DashboardRecent } from "@/components/dashboard-recent";
import { UiGuide } from "@/components/ui-guide";

const steps = [
  { number: "01", title: "Upload both versions", detail: "Add the original tender and the latest amendment or corrigendum." },
  { number: "02", title: "Review every change", detail: "See what was added, modified, or removed with source evidence." },
  { number: "03", title: "Reassess compliance", detail: "Understand impact and identify documents that may need updating." },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#0d2135_0%,#12283f_52%,#174b52_100%)] px-7 py-9 text-white shadow-2xl shadow-navy/20 sm:px-10 sm:py-11">
        <div className="ambient-grid absolute inset-0 opacity-20" />
        <div className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-16 h-[280px] w-[280px] rounded-full border border-white/10" />
        <div className="absolute bottom-[-120px] right-[10%] h-[240px] w-[240px] rounded-full bg-teal/20 blur-3xl" />
        <div className="absolute left-[46%] top-8 h-24 w-24 rounded-full bg-[#7dd3c8]/10 blur-2xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-[650px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
              <Sparkles size={13} className="text-teal-300" /> Tender amendment intelligence
            </div>
            <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.04em] sm:text-[38px]">
              Stay ahead of every <span className="bg-gradient-to-r from-teal-300 to-[#9be0d7] bg-clip-text text-transparent">tender change.</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-[14px] leading-6 text-slate-300">
              Compare an original tender with its amendment. Understand what changed, why it matters, and what your team should review.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/workspace" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-navy shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-slate-100">
                Start a comparison <ArrowRight size={16} />
              </Link>
              <Link href="/workspace" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20">
                <Sparkles size={14} className="text-teal-300" /> Explore Demo Scenarios
              </Link>
            </div>
          </div>

          <div className="relative hidden h-[190px] lg:block" aria-hidden="true">
            <div className="animate-float absolute left-4 top-2 w-[220px] rounded-xl border border-white/15 bg-white/[0.08] p-4 shadow-xl shadow-black/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                <FileText size={14} className="text-teal-300" /> Original tender
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-4/5 rounded-full bg-white/15" />
                <div className="h-2 w-3/5 rounded-full bg-white/10" />
                <div className="h-2 w-2/3 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="animate-float-delayed absolute bottom-0 right-2 w-[230px] rounded-xl border border-teal-300/20 bg-[#0f766e]/25 p-4 shadow-xl shadow-black/10 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-teal-100">
                <Sparkles size={14} /> Amendment detected
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-semibold text-white">Eligibility</span>
                <ArrowRight size={13} className="text-teal-300" />
                <span className="rounded-md bg-teal-300/20 px-2 py-1 text-[10px] font-semibold text-teal-100">Review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UiGuide />

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="rounded-xl border border-line bg-white/90 p-5 shadow-card backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg">
            <p className="text-[11px] font-bold tracking-[0.12em] text-teal">{step.number}</p>
            <h2 className="mt-3 text-[14px] font-semibold text-navy">{step.title}</h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-500">{step.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <DashboardRecent />
        <div className="rounded-xl border border-[#dcece9] bg-gradient-to-br from-[#f0f8f7] to-white p-6 shadow-card backdrop-blur sm:p-7">
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
