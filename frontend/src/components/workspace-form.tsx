"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Check, FileText, LoaderCircle, UploadCloud, X } from "lucide-react";
import { analyzeAmendment } from "@/lib/api";
import type { AnalysisResult } from "@/lib/types";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
type Slot = "original" | "amended";
type Selection = { original: File | null; amended: File | null };

export function WorkspaceForm() {
  const router = useRouter();
  const [files, setFiles] = useState<Selection>({ original: null, amended: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function chooseFile(slot: Slot, file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") || file.type && file.type !== "application/pdf") {
      setError("Please choose a PDF file for both document fields.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Each PDF must be 20 MB or smaller.");
      return;
    }
    setError("");
    setFiles((current) => ({ ...current, [slot]: file }));
  }

  function onInputChange(slot: Slot, event: ChangeEvent<HTMLInputElement>) {
    chooseFile(slot, event.target.files?.[0]);
    event.target.value = "";
  }

  function onDrop(slot: Slot, event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    chooseFile(slot, event.dataTransfer.files[0]);
  }

  async function submit() {
    if (!files.original || !files.amended || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await analyzeAmendment(files.original, files.amended);
      sessionStorage.setItem("clausewise-analysis", JSON.stringify(result satisfies AnalysisResult));
      router.push("/results");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <UploadCard
          slot="original"
          title="Original tender"
          description="The tender document before any amendments"
          file={files.original}
          onChange={onInputChange}
          onDrop={onDrop}
          onRemove={() => setFiles((current) => ({ ...current, original: null }))}
        />
        <UploadCard
          slot="amended"
          title="Amended tender / corrigendum"
          description="The latest amended tender or corrigendum"
          file={files.amended}
          onChange={onInputChange}
          onDrop={onDrop}
          onRemove={() => setFiles((current) => ({ ...current, amended: null }))}
        />
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-canvas px-4 py-3.5 text-[11px] leading-5 text-slate-500">
        <AlertCircle size={15} className="mt-0.5 shrink-0 text-teal" />
        PDF only · 20 MB maximum per file. Text-based PDFs are required; scanned files need OCR. Extracted text is sent to your configured Groq API for analysis and is not saved by ClauseWise.
      </div>

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse items-start justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
        <p className="text-[11px] text-slate-400">Documents are processed for this analysis and are not saved to an account.</p>
        <button
          type="button"
          onClick={submit}
          disabled={!files.original || !files.amended || loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#11766f] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {loading ? <><LoaderCircle size={15} className="animate-spin" /> Analyzing documents…</> : <>Analyze changes <ArrowRight size={15} /></>}
        </button>
      </div>
    </section>
  );
}

function UploadCard({
  slot,
  title,
  description,
  file,
  onChange,
  onDrop,
  onRemove,
}: {
  slot: Slot;
  title: string;
  description: string;
  file: File | null;
  onChange: (slot: Slot, event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (slot: Slot, event: DragEvent<HTMLLabelElement>) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <h2 className="text-[13px] font-semibold text-navy">{title}</h2>
      <p className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500">{description}</p>
      {file ? (
        <div className="mt-3 flex min-h-[142px] items-center gap-3 rounded-lg border border-[#cce5e1] bg-[#f5faf9] p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal"><FileText size={19} /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-navy">{file.name}</p>
            <p className="mt-1 text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready</p>
          </div>
          <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-red-600"><X size={15} /></button>
        </div>
      ) : (
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDrop(slot, event)}
          className="mt-3 flex min-h-[142px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd7dd] bg-[#fbfcfd] px-4 py-5 text-center transition-colors hover:border-teal hover:bg-[#f5faf9]"
        >
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="sr-only" onChange={(event) => onChange(slot, event)} />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf4f3] text-teal"><UploadCloud size={18} /></span>
          <span className="mt-3 text-[11px] font-semibold text-navy">Drop PDF here or <span className="text-teal">browse files</span></span>
          <span className="mt-1 text-[10px] text-slate-400">PDF up to 20 MB</span>
        </label>
      )}
      {file && <p className="mt-2 flex items-center gap-1 text-[10px] text-teal"><Check size={12} /> File selected</p>}
    </div>
  );
}
