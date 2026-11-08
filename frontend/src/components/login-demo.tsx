"use client";

import { useEffect, useState, type ReactNode } from "react";
import { FileSearch, FileText, ListChecks, UploadCloud } from "lucide-react";

function UploadCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-line bg-white/85 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal">
          <UploadCloud size={18} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{title}</p>
          <p className="text-xs text-slate-500">{meta}</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <span className="block h-full w-full rounded-full bg-teal" />
      </div>
    </div>
  );
}

function MiniDoc({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-line bg-white/90 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{title}</p>
      <div className="mt-2.5 flex-1 space-y-2">{children}</div>
    </article>
  );
}

function Bar({ className = "w-4/5" }: { className?: string }) {
  return <span className={`login-bar ${className}`} />;
}

function Badge({ tone, children }: { tone: "added" | "modified" | "removed"; children: ReactNode }) {
  const styles = {
    added: "bg-[#eaf6f0] text-[#26784f]",
    modified: "bg-[#fff5e7] text-[#a66a13]",
    removed: "bg-[#fff0ef] text-[#b54d45]",
  }[tone];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${styles}`}>
      {children}
    </span>
  );
}

const DEMO_SLIDES: { id: string; title: string; body: string; visual: ReactNode }[] = [
  {
    id: "upload",
    title: "Upload both PDFs",
    body: "Add the original tender and the amendment or corrigendum.",
    visual: (
      <div className="grid h-full gap-3 sm:grid-cols-2">
        <UploadCard title="Original_Tender.pdf" meta="PDF · 42 pages" />
        <UploadCard title="Corrigendum_1.pdf" meta="PDF · 6 pages" />
      </div>
    ),
  },
  {
    id: "compare",
    title: "AI compares the clauses",
    body: "ClauseWise extracts text and matches requirements across both documents.",
    visual: (
      <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-white/90 p-3">
        <div className="login-scan" />
        <div className="grid h-full gap-3 sm:grid-cols-2">
          <MiniDoc title="Original">
            <Bar className="w-11/12" />
            <div>
              <Bar className="w-3/5" />
              <p className="login-strike mt-1 text-[10px] font-semibold text-slate-500">₹50 Lakh minimum turnover</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Bar className="w-2/5" />
                <Badge tone="removed">Removed</Badge>
              </div>
              <p className="login-strike mt-1 text-[10px] font-semibold text-slate-500">Mandatory site visit</p>
            </div>
            <Bar className="w-3/5" />
          </MiniDoc>
          <MiniDoc title="Amended">
            <Bar className="w-10/12" />
            <div>
              <Bar className="w-3/5" />
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-semibold text-slate-600">
                <span className="text-[#b54d45] line-through">₹50 Lakh</span>
                <span className="text-slate-300">→</span>
                <span className="text-[#26784f]">₹1 Crore</span>
              </p>
              <Badge tone="modified">Modified</Badge>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Bar className="w-2/5" />
                <Badge tone="added">Added</Badge>
              </div>
              <p className="mt-1 text-[10px] font-semibold text-slate-600">ISO 9001:2015 certification</p>
            </div>
            <Bar className="w-3/5" />
          </MiniDoc>
        </div>
      </div>
    ),
  },
  {
    id: "classify",
    title: "Every change is classified",
    body: "Differences are marked Added, Modified or Removed.",
    visual: (
      <div className="flex h-full flex-col justify-center gap-2.5 rounded-2xl border border-line bg-white/90 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#f7fafc] px-3 py-2.5">
          <Badge tone="added">Added</Badge>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy">ISO 9001:2015 certification</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[#f7fafc] px-3 py-2.5">
          <Badge tone="modified">Modified</Badge>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy">Turnover ₹50 Lakh → ₹1 Crore</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[#f7fafc] px-3 py-2.5">
          <Badge tone="removed">Removed</Badge>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy">Mandatory site visit</p>
        </div>
      </div>
    ),
  },
  {
    id: "report",
    title: "You get an impact report",
    body: "Review evidence, page references and what your team should reassess.",
    visual: (
      <div className="flex h-full flex-col justify-center gap-3 rounded-2xl border border-line bg-white/90 p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-[#eaf6f0] px-3 py-2 text-center">
            <p className="text-lg font-bold text-[#26784f]">1</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#26784f]">Added</p>
          </div>
          <div className="rounded-xl bg-[#fff5e7] px-3 py-2 text-center">
            <p className="text-lg font-bold text-[#a66a13]">2</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a66a13]">Modified</p>
          </div>
          <div className="rounded-xl bg-[#fff0ef] px-3 py-2 text-center">
            <p className="text-lg font-bold text-[#b54d45]">1</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#b54d45]">Removed</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-[#f7fafc] px-3 py-2.5">
          <FileText size={15} className="mt-0.5 shrink-0 text-teal" />
          <p className="text-xs leading-5 text-slate-600">
            “Minimum average annual turnover is revised to Rs. 1 Crore…” <span className="font-semibold text-navy">· page 4</span>
          </p>
        </div>
      </div>
    ),
  },
];

export function LoginDemo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = DEMO_SLIDES[active];

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % DEMO_SLIDES.length);
    }, 5600);

    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="mx-auto w-full max-w-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="login-demo-frame relative min-h-[200px] overflow-hidden rounded-3xl border border-line/80 bg-white/70 p-3 shadow-card backdrop-blur sm:min-h-[220px] sm:p-4">
        <div className="grid min-h-[184px] sm:min-h-[204px]">
          {DEMO_SLIDES.map((item, index) => (
            <div
              key={item.id}
              aria-hidden={index !== active}
              className={`login-demo-slide col-start-1 row-start-1 ${index === active ? "is-active" : ""}`}
            >
              {item.visual}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0" aria-live="polite">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy">
            {slide.id === "upload" && <UploadCloud size={15} className="text-teal" />}
            {slide.id === "compare" && <FileSearch size={15} className="text-teal" />}
            {slide.id === "classify" && <ListChecks size={15} className="text-teal" />}
            {slide.id === "report" && <FileText size={15} className="text-teal" />}
            {slide.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{slide.body}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5" role="tablist" aria-label="Project demo slides">
          {DEMO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show slide ${index + 1}: ${item.title}`}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${index === active ? "w-6 bg-teal" : "w-2 bg-line hover:bg-teal/50"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
