"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSearch, FolderOpen, LayoutDashboard, type LucideIcon } from "lucide-react";
import { getSavedAnalyses } from "@/lib/saved-store";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workspace", label: "Compare", icon: FileSearch },
  { href: "/saved", label: "Saved", icon: FolderOpen },
];

export function MobileNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setSavedCount(getSavedAnalyses().length);
    updateCount();
    window.addEventListener("clausewise_saved_updated", updateCount);
    return () => window.removeEventListener("clausewise_saved_updated", updateCount);
  }, []);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-white/85 px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl print:hidden lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isSaved = href === "/saved";

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-colors ${active ? "bg-[#e9f5f3] text-teal" : "text-slate-500 hover:bg-slate-50 hover:text-navy"
                }`}
            >
              <span className="relative">
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {isSaved && savedCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 text-[8px] font-bold text-white">
                    {savedCount}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
