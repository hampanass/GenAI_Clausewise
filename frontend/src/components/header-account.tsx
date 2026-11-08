"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  Cpu,
  FolderOpen,
  Loader2,
  LogIn,
  LogOut,
  Moon,
  RefreshCw,
  Sun,
  Zap,
} from "lucide-react";
import type { GroqUsage } from "@/lib/types";
import { endAuthTransition, startAuthTransition } from "@/components/auth-transition";

function readStoredTokens(): GroqUsage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("clausewise-analysis");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.usage ?? null;
  } catch {
    return null;
  }
}

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("clausewise-theme") === "dark" ? "dark" : "light";
}

export function HeaderAccount() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => getInitialTheme());
  const [usage, setUsage] = useState<GroqUsage | null>(() => readStoredTokens());
  const [signingOut, setSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync theme class to documentElement whenever theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Listen for analysis completion to refresh token usage live
  useEffect(() => {
    function onAnalysisUpdate() {
      setUsage(readStoredTokens());
    }
    window.addEventListener("clausewise_analysis_updated", onAnalysisUpdate);
    window.addEventListener("storage", onAnalysisUpdate);
    return () => {
      window.removeEventListener("clausewise_analysis_updated", onAnalysisUpdate);
      window.removeEventListener("storage", onAnalysisUpdate);
    };
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function switchTheme(newTheme: "light" | "dark") {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("clausewise-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("clausewise-theme", "light");
    }
  }

  function clearActiveAnalysis() {
    sessionStorage.removeItem("clausewise-analysis");
    setUsage(null);
    window.dispatchEvent(new Event("clausewise_analysis_updated"));
    setOpen(false);
    router.push("/workspace");
  }

  const user = session?.user;
  const totalTokens = usage?.total_tokens ?? 0;

  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account / Settings Trigger Pill */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-all ${open
            ? "border-teal/50 bg-teal/5 text-teal shadow-sm ring-2 ring-teal/15"
            : "border-line bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={26}
            height={26}
            className="rounded-full ring-1 ring-teal/30"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#edf6f5] text-[10px] font-bold text-teal">
            {(user?.name ?? "G")[0].toUpperCase()}
          </span>
        )}

        <span className="hidden max-w-[130px] truncate text-[12px] font-medium sm:inline">
          {user?.name ?? "Guest User"}
        </span>

        {/* Small Token Pill Indicator */}
        {totalTokens > 0 ? (
          <span className="hidden items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold text-teal md:inline-flex">
            <Zap size={11} className="text-teal" />
            {(totalTokens / 1000).toFixed(1)}k
          </span>
        ) : (
          <span className="hidden rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 md:inline">
            Telemetry
          </span>
        )}

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-teal" : ""}`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[340px] origin-top-right rounded-2xl border border-line bg-white p-4 shadow-2xl isolate animate-in fade-in zoom-in-95 duration-150">
          {/* 1. Account Profile Header */}
          <div className="flex items-center gap-3 border-b border-line pb-3.5">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={38}
                height={38}
                className="rounded-full ring-2 ring-teal/30"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#edf6f5] to-teal/20 text-teal font-bold text-[13px]">
                {(user?.name ?? "G")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[13px] font-semibold text-navy">
                  {user?.name ?? "Guest Workspace"}
                </p>
                <span className="rounded bg-teal/10 px-1.5 py-0.2 text-[9px] font-bold text-teal">
                  {user ? "Google" : "Guest"}
                </span>
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {user?.email ?? "Full access without login"}
              </p>
            </div>
          </div>

          {/* 2. Groq LLM Token Telemetry */}
          <div className="mt-3.5 rounded-xl border border-teal/20 bg-gradient-to-br from-[#f3faf8] via-white to-[#edf7f5] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-navy">
                <Cpu size={13} className="text-teal" />
                <span>Tokens Utilised</span>
              </div>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[9px] font-bold text-teal">
                openai/gpt-oss-120b
              </span>
            </div>

            {usage ? (
              <div className="mt-2.5 space-y-2">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-lg bg-white/90 p-1.5 shadow-sm border border-line/60">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Prompt</p>
                    <p className="text-[12px] font-bold text-navy">
                      {(usage.prompt_tokens ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/90 p-1.5 shadow-sm border border-line/60">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Output</p>
                    <p className="text-[12px] font-bold text-navy">
                      {(usage.completion_tokens ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-teal/10 p-1.5 shadow-sm border border-teal/20">
                    <p className="text-[9px] uppercase tracking-wider text-teal font-medium">Total</p>
                    <p className="text-[12px] font-bold text-teal">
                      {(usage.total_tokens ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 text-[#26784f]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#26784f] animate-pulse" />
                    Groq LPU Active
                  </span>
                  <span>Free Tier (TPM Tracked)</span>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-center py-2">
                <p className="text-[11px] text-slate-500">No analysis run in this session yet.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Run a tender comparison or demo scenario to view live token metrics.
                </p>
              </div>
            )}
          </div>

          {/* 3. Theme & Preferences Section */}
          <div className="mt-3.5 space-y-3 border-t border-line pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Appearance &amp; Theme
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => switchTheme("light")}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-1.5 text-[11px] font-semibold transition-all ${theme === "light"
                      ? "border-teal/40 bg-teal/10 text-teal shadow-xs"
                      : "border-line bg-white/80 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Sun size={13} /> Light Theme
                </button>
                <button
                  type="button"
                  onClick={() => switchTheme("dark")}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-1.5 text-[11px] font-semibold transition-all ${theme === "dark"
                      ? "border-teal/40 bg-teal/10 text-teal shadow-xs"
                      : "border-line bg-white/80 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Moon size={13} /> Dark Theme
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Workspace Shortcuts
              </p>
              <div className="space-y-1">
                <Link
                  href="/saved"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors"
                >
                  <FolderOpen size={14} className="text-teal" />
                  <span>Saved Analyses Library</span>
                </Link>
                <button
                  type="button"
                  onClick={clearActiveAnalysis}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors"
                >
                  <RefreshCw size={14} className="text-teal" />
                  <span>Clear Active Comparison / Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Footer: Sign in or Sign out */}
          <div className="mt-3.5 border-t border-line pt-3">
            {user ? (
              <button
                type="button"
                disabled={signingOut}
                onClick={() => {
                  if (signingOut) return;
                  setSigningOut(true);
                  setOpen(false);
                  startAuthTransition("Signing out…");
                  void signOut({ callbackUrl: "/login" }).catch(() => {
                    endAuthTransition();
                    setSigningOut(false);
                  });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200/80 bg-red-50/50 py-2 text-[11px] font-semibold text-red-700 transition-colors hover:bg-red-50 hover:border-red-300 disabled:cursor-wait disabled:opacity-70"
              >
                {signingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                {signingOut ? "Signing out…" : "Sign out of ClauseWise"}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal to-[#0f766e] py-2 text-[11px] font-semibold text-white shadow-sm transition-all hover:brightness-105"
              >
                <LogIn size={13} /> Sign in with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
