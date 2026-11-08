"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

const START_EVENT = "clausewise-auth:start";
const END_EVENT = "clausewise-auth:end";

export function startAuthTransition(label = "Please wait…") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(START_EVENT, { detail: { label } }));
}

export function endAuthTransition() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(END_EVENT));
}

export function AuthTransition() {
  const pathname = usePathname();
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setLabel(null));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    function onStart(event: Event) {
      const detail = (event as CustomEvent<{ label?: string }>).detail;
      setLabel(detail?.label ?? "Please wait…");
    }
    function onEnd() {
      setLabel(null);
    }

    window.addEventListener(START_EVENT, onStart);
    window.addEventListener(END_EVENT, onEnd);
    return () => {
      window.removeEventListener(START_EVENT, onStart);
      window.removeEventListener(END_EVENT, onEnd);
    };
  }, []);

  if (!label) return null;

  return (
    <div
      className="auth-overlay fixed inset-0 z-[100] flex items-center justify-center bg-canvas/80 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="auth-overlay-card w-full max-w-[280px] rounded-2xl border border-line bg-white p-6 text-center shadow-2xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-teal text-white shadow-lg">
          <ShieldCheck size={22} />
        </span>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-navy">
          <Loader2 size={16} className="animate-spin text-teal" />
          {label}
        </div>
        <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-line">
          <span className="auth-progress absolute inset-y-0 left-0 w-1/3 bg-teal/60" />
        </div>
      </div>
    </div>
  );
}
