import { FileSearch } from "lucide-react";
import { WorkspaceForm } from "@/components/workspace-form";

export default function WorkspacePage() {
  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-7">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f2] text-teal"><FileSearch size={20} /></div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">New comparison</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-navy">Compare tender documents</h1>
        <p className="mt-2 max-w-xl text-[13px] leading-5 text-slate-500">Upload the original tender and its amended version. ClauseWise will identify requirement changes and assess their compliance impact.</p>
      </div>
      <WorkspaceForm />
    </div>
  );
}
