"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, FileSearch, FolderOpen, LayoutDashboard, Settings2, ShieldCheck } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workspace", label: "Compare tenders", icon: FileSearch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col border-r border-line bg-white lg:flex">
      <Link href="/" className="flex h-[76px] items-center gap-3 border-b border-line px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white">
          <ShieldCheck size={20} strokeWidth={2.2} />
        </span>
        <span className="text-[19px] font-bold tracking-[-0.04em] text-navy">ClauseWise</span>
      </Link>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active ? "bg-[#edf6f5] text-teal" : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
          <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-400" title="Not configured in this starter">
            <FolderOpen size={17} strokeWidth={1.8} />
            Saved analyses
            <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">Soon</span>
          </span>
        </nav>
      </div>

      <div className="mt-auto border-t border-line p-4">
        <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-slate-500 hover:bg-slate-50 hover:text-navy">
          <Settings2 size={17} strokeWidth={1.8} />
          Account access
          <ArrowUpRight className="ml-auto" size={14} />
        </Link>
        <div className="mt-4 rounded-lg bg-canvas p-3">
          <p className="text-[11px] font-semibold text-navy">Track Changes. Understand Impact.</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">Stay compliant through every tender update.</p>
        </div>
      </div>
    </aside>
  );
}
