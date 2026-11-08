"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FileSearch,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { getSavedAnalyses } from "@/lib/saved-store";
import { endAuthTransition, startAuthTransition } from "@/components/auth-transition";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

function UserArea() {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
        <div className="h-7 w-7 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={28}
            height={28}
            className="rounded-full ring-1 ring-slate-200"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
            {(session.user.name ?? "U")[0].toUpperCase()}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-navy">
          {session.user.name ?? session.user.email}
        </span>
        <button
          type="button"
          title="Sign out"
          disabled={signingOut}
          onClick={() => {
            if (signingOut) return;
            setSigningOut(true);
            startAuthTransition("Signing out…");
            void signOut({ callbackUrl: "/login" }).catch(() => {
              endAuthTransition();
              setSigningOut(false);
            });
          }}
          className="text-slate-400 transition-colors hover:text-red-500 disabled:cursor-wait disabled:opacity-60"
        >
          {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} strokeWidth={1.8} />}
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-slate-500 hover:bg-slate-50 hover:text-navy"
    >
      <LogIn size={17} strokeWidth={1.8} />
      Sign in
    </Link>
  );
}

const links: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workspace", label: "Compare tenders", icon: FileSearch },
  { href: "/saved", label: "Saved analyses", icon: FolderOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return getSavedAnalyses().length;
  });

  useEffect(() => {
    const onUpdate = () => setSavedCount(getSavedAnalyses().length);
    window.addEventListener("clausewise_saved_updated", onUpdate);
    return () => window.removeEventListener("clausewise_saved_updated", onUpdate);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col border-r border-line/80 bg-white/85 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex h-[76px] items-center gap-3 border-b border-line/70 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-[#1d4f5f] text-white shadow-md shadow-navy/20">
          <ShieldCheck size={20} strokeWidth={2.2} />
        </span>
        <span className="text-[19px] font-bold tracking-[-0.04em] text-navy">ClauseWise</span>
      </Link>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            const isSaved = href === "/saved";
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${active
                  ? "bg-gradient-to-r from-[#e7f4f2] to-[#f4faf8] text-teal shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                  }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {label}
                {isSaved && savedCount > 0 && (
                  <span className="ml-auto rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-line/70 p-4">
        <UserArea />
        <div className="mt-3 rounded-xl border border-teal/10 bg-gradient-to-br from-[#f2faf8] to-[#eef5f7] p-3">
          <p className="text-[11px] font-semibold text-navy">Track Changes. Understand Impact.</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">Stay compliant through every tender update.</p>
        </div>
      </div>
    </aside>
  );
}
