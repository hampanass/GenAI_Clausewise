"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  LoaderCircle,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { analyzeAmendment, fetchDemoScenario } from "@/lib/api";
import { DEMO_SCENARIOS } from "@/lib/demo-data";
import type { AnalysisResult, CompanyProfile } from "@/lib/types";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
type Slot = "original" | "amended";
type Selection = { original: File | null; amended: File | null };

const LOADING_STAGES = [
  "Extracting document text and page numbers with PyMuPDF…",
  "Sending tender clauses to Groq LLM for requirement comparison…",
  "Verifying cited quotes against source PDF page numbers…",
  "Computing company compliance and Bid / No-Bid impact…",
];

export function WorkspaceForm() {
  const router = useRouter();
  const [files, setFiles] = useState<Selection>({ original: null, amended: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  // Company Profile State (Optional)
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    turnover: "₹75 Lakh",
    experience_years: "4",
    certifications: ["ISO 9001:2015"],
    notes: "",
  });

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  function chooseFile(slot: Slot, file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
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

  async function loadPresetScenario(scenarioId: string) {
    setLoadingStage(0);
    setLoading(true);
    setError("");
    try {
      const activeProfile = showProfile ? profile : undefined;
      const result = await fetchDemoScenario(scenarioId, activeProfile);
      sessionStorage.setItem("clausewise-analysis", JSON.stringify(result satisfies AnalysisResult));
      window.dispatchEvent(new Event("clausewise_analysis_updated"));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scenario.");
      setLoading(false);
    }
  }

  async function submit() {
    if (!files.original || !files.amended || loading) return;
    setLoadingStage(0);
    setLoading(true);
    setError("");
    try {
      const activeProfile = showProfile ? profile : undefined;
      const result = await analyzeAmendment(files.original, files.amended, activeProfile);
      sessionStorage.setItem("clausewise-analysis", JSON.stringify(result satisfies AnalysisResult));
      window.dispatchEvent(new Event("clausewise_analysis_updated"));
      router.push("/results");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Demo Scenarios Banner */}
      <section className="rounded-2xl border border-teal/20 bg-gradient-to-br from-[#f2fbf9] via-white to-[#eef7f5] p-5 shadow-card backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-teal" />
            <div>
              <h2 className="text-[13px] font-semibold text-navy">Quick Demo Scenarios</h2>
              <p className="text-[11px] text-slate-500">
                Test ClauseWise instantly without hunting for matching government PDFs:
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {DEMO_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => loadPresetScenario(scenario.id)}
              disabled={loading}
              title={scenario.description}
              className="group flex flex-col items-start rounded-xl border border-line bg-white/90 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-teal/60 hover:shadow-md disabled:opacity-50"
            >
              <span className="rounded bg-[#edf6f5] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal">
                {scenario.badge}
              </span>
              <span className="ml-auto rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                Sample result
              </span>
              <span className="mt-1.5 text-[11px] font-semibold text-navy group-hover:text-teal">
                {scenario.title}
              </span>
              <span className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                {scenario.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Upload Form */}
      <section className="rounded-2xl border border-line/80 bg-white/90 p-5 shadow-card backdrop-blur sm:p-7">
        {/* Sample Download Bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-teal/20 bg-gradient-to-r from-[#f2fbf9] to-white px-4 py-2.5 text-[11px]">
          <span className="font-medium text-slate-600">
            Need sample PDFs covering Added, Modified &amp; Removed requirements?
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/samples/Original_Tender_NIT_2026_PWD.pdf"
              download
              className="inline-flex items-center gap-1 font-semibold text-teal hover:underline"
            >
              <Download size={12} /> Original Tender PDF
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="/samples/Corrigendum_01_Amendments.pdf"
              download
              className="inline-flex items-center gap-1 font-semibold text-teal hover:underline"
            >
              <Download size={12} /> Corrigendum PDF
            </a>
          </div>
        </div>

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

        {/* Company Profile Accordion */}
        <div className="mt-5 rounded-xl border border-line bg-gradient-to-br from-[#fbfcfd] to-white p-4 transition-all">
          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#eaf4f3] text-teal">
                <Building2 size={15} />
              </span>
              <div>
                <span className="text-[12px] font-semibold text-navy">
                  Company Profile & Bid / No-Bid Evaluation{" "}
                  <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                </span>
                <p className="text-[10px] text-slate-500">
                  Input your firm&apos;s capabilities to check eligibility barriers against amended requirements.
                </p>
              </div>
            </div>
            {showProfile ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {showProfile && (
            <div className="mt-4 grid gap-3 border-t border-line pt-3.5 sm:grid-cols-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Annual Turnover
                </label>
                <input
                  type="text"
                  value={profile.turnover ?? ""}
                  onChange={(e) => setProfile({ ...profile, turnover: e.target.value })}
                  placeholder="e.g. ₹75 Lakh or ₹1.5 Cr"
                  className="mt-1 w-full rounded-md border border-line bg-white px-3 py-1.5 text-[12px] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Relevant Experience (Years)
                </label>
                <input
                  type="text"
                  value={profile.experience_years ?? ""}
                  onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                  placeholder="e.g. 4"
                  className="mt-1 w-full rounded-md border border-line bg-white px-3 py-1.5 text-[12px] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={(profile.certifications ?? []).join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      certifications: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. ISO 9001:2015, MSME"
                  className="mt-1 w-full rounded-md border border-line bg-white px-3 py-1.5 text-[12px] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-teal/10 bg-gradient-to-r from-[#f4faf9] to-white px-4 py-3 text-[11px] leading-5 text-slate-500">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-teal" />
          PDF only · 20 MB maximum per file. Text-based PDFs are required. Extracted text is checked with Groq LLM and verbatim page citations are verified.
        </div>

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[12px] leading-5 text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {/* Loading Stepper */}
        {loading && (
          <div className="mt-5 rounded-xl border border-teal/20 bg-gradient-to-r from-[#f4faf9] to-white p-4">
            <div className="flex items-center gap-3">
              <LoaderCircle size={18} className="animate-spin text-teal" />
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-navy">
                  Analyzing tender documents…
                </p>
                <p className="mt-0.5 text-[11px] text-teal">
                  {LOADING_STAGES[loadingStage]}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-1">
              {LOADING_STAGES.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${idx <= loadingStage ? "bg-teal" : "bg-slate-200/80"
                    }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse items-start justify-between gap-3 border-t border-line pt-5 sm:flex-row sm:items-center">
          <p className="text-[11px] text-slate-400">
            Documents are processed for this analysis session. Extracted text is sent to Groq for analysis and is not saved by ClauseWise.
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={!files.original || !files.amended || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-[#0f766e] px-5 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:-translate-y-0.5 hover:from-[#11766f] hover:to-[#0b5f59] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:bg-none disabled:shadow-none disabled:hover:translate-y-0 sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle size={15} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                Analyze changes <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
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
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div>
      <h2 className="text-[13px] font-semibold text-navy">{title}</h2>
      <p className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500">{description}</p>
      {file ? (
        <div className="mt-3 flex min-h-[142px] items-center gap-3 rounded-xl border border-[#cce5e1] bg-gradient-to-br from-[#f5faf9] to-white p-4 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal shadow-sm">
            <FileText size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-navy">{file.name}</p>
            <p className="mt-1 text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${title}`}
            className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-red-600"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            setIsDragging(false);
            onDrop(slot, event);
          }}
          className={`group mt-3 flex min-h-[142px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-all ${isDragging
            ? "border-teal bg-[#eef8f6] shadow-inner"
            : "border-[#cbd7dd] bg-[#fbfcfd] hover:-translate-y-0.5 hover:border-teal/70 hover:bg-[#f5faf9]"
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(event) => onChange(slot, event)}
          />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf4f3] text-teal transition-transform group-hover:scale-105">
            <UploadCloud size={18} />
          </span>
          <span className="mt-3 text-[11px] font-semibold text-navy">
            Drop PDF here or <span className="text-teal">browse files</span>
          </span>
          <span className="mt-1 text-[10px] text-slate-400">PDF up to 20 MB</span>
        </label>
      )}
      {file && (
        <p className="mt-2 flex items-center gap-1 text-[10px] text-teal">
          <Check size={12} /> File selected
        </p>
      )}
    </div>
  );
}
