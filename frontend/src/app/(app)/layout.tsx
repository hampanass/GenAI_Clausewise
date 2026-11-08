import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="min-h-screen lg:pl-[252px]">
        <header className="flex h-[64px] items-center justify-between border-b border-line bg-white px-5 sm:px-8">
          <span className="text-sm font-bold tracking-[-0.03em] text-navy lg:hidden">ClauseWise</span>
          <p className="hidden text-[12px] text-slate-500 lg:block">Tender amendment intelligence</p>
          <LinkAccount />
        </header>
        <main className="mx-auto w-full max-w-[1320px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function LinkAccount() {
  return (
    <a href="/login" className="flex items-center gap-2 text-[12px] font-medium text-slate-600 hover:text-navy">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf6f5] text-[11px] font-bold text-teal">CW</span>
      <span className="hidden sm:inline">Account access</span>
    </a>
  );
}
