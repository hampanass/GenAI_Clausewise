import { FileSearch, FileText, ListChecks, ShieldCheck, UploadCloud } from "lucide-react";
import { LoginDemo } from "@/components/login-demo";

const steps = [
  { title: "Upload both PDFs", body: "Add the original tender and the amendment.", icon: UploadCloud },
  { title: "AI reads both", body: "Text is extracted and requirements are compared.", icon: FileSearch },
  { title: "Changes classified", body: "Each difference is marked Added, Modified or Removed.", icon: ListChecks },
  { title: "Impact report", body: "Review evidence quotes, page numbers and what to reassess.", icon: FileText },
];

const reportLine =
  "Reports include an executive summary, Added/Modified/Removed counts, side-by-side values, evidence with page references, compliance impact and a reassess list.";

const disclaimer =
  "ClauseWise results are AI-generated and can be incomplete. Always verify against the official tender documents. Works with text-based PDFs.";

export function LoginStory() {
  return (
    <div id="clausewise-story" className="order-2 min-w-0 pb-10 pt-6 lg:order-1 lg:pb-14 lg:pt-8">
      <section aria-labelledby="login-story-title" className="max-w-[680px]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Tender amendment intelligence</p>
        <h1
          id="login-story-title"
          className="mt-3 max-w-[640px] text-3xl font-semibold tracking-[-0.04em] text-navy sm:text-4xl"
        >
          Know exactly what changed in your tender.
        </h1>
        <p className="mt-3 max-w-[620px] text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          ClauseWise compares the original tender with the amended version and explains what changed, why it matters for your bid, and what your team should reassess. Built for bid, compliance and documentation teams.
        </p>
        <span className="mt-4 inline-flex items-center rounded-full border border-teal/20 bg-teal-100/60 px-3 py-1.5 text-xs font-semibold text-teal">
          Corrigenda can quietly reset the bid  50 Lakh  1 Crore
        </span>
        <div className="mt-6">
          <LoginDemo />
        </div>
      </section>

      <section aria-labelledby="how-title" className="mt-6">
        <h2 id="how-title" className="text-base font-semibold tracking-[-0.02em] text-navy">
          How it works
        </h2>
        <ol className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="rounded-xl border border-line bg-white/85 p-3 shadow-card">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-[#0f766e] text-white shadow-sm">
                    <Icon size={15} />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{index + 1}</span>
                </div>
                <h3 className="mt-2.5 text-sm font-semibold text-navy">{step.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">{step.body}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 max-w-[680px] text-xs leading-5 text-slate-500">{reportLine}</p>
        <p className="mt-2 flex max-w-[680px] items-start gap-1.5 text-xs leading-5 text-slate-500">
          <ShieldCheck size={13} className="mt-0.5 shrink-0 text-teal" />
          <span>{disclaimer}</span>
        </p>
      </section>
    </div>
  );
}