import { Sidebar } from "@/components/sidebar";
import { HeaderAccount } from "@/components/header-account";
import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-h-screen lg:pl-[252px]">
        <header className="sticky top-0 z-40 flex h-[64px] items-center justify-between border-b border-line/80 bg-white/80 px-5 backdrop-blur-xl sm:px-8">
          <span className="text-sm font-bold tracking-[-0.03em] text-navy lg:hidden">ClauseWise</span>
          <p className="hidden text-[12px] text-slate-500 lg:block">Tender amendment intelligence</p>
          <HeaderAccount />
        </header>
        <main className="mx-auto w-full max-w-[1320px] px-5 pb-24 pt-8 sm:px-8 lg:px-10 lg:pb-10 lg:pt-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
