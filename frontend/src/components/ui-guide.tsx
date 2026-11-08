"use client";

import { useEffect, useState } from "react";
import { FileSearch, ListChecks, UploadCloud, X } from "lucide-react";

const DISMISS_KEY = "clausewise-guide-dismissed";

const tips = [
  { icon: UploadCloud, label: "Upload original + amendment" },
  { icon: FileSearch, label: "Review Added / Modified / Removed" },
  { icon: ListChecks, label: "Check evidence & reassess list" },
];

export function UiGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  }

  return (
    <div className="rounded-xl border border-line bg-white/90 p-3 shadow-card backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal">
          <ListChecks size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-semibold text-navy">Quick start</p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss quick start guide"
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <X size={14} />
            </button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {tips.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg bg-canvas/70 px-2.5 py-2">
                <Icon size={14} className="shrink-0 text-teal" />
                <span className="text-[11px] font-medium leading-4 text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
