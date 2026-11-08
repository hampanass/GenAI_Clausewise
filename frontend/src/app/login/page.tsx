"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [register, setRegister] = useState(false);
  const [notice, setNotice] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Authentication is not connected in this version. Set up an identity provider before enabling account access.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[12px] font-medium text-slate-500 hover:text-teal"><ArrowLeft size={14} /> Back to ClauseWise</Link>
        <section className="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-9">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white"><ShieldCheck size={19} /></span>
            <span className="text-[18px] font-bold tracking-[-0.04em] text-navy">ClauseWise</span>
          </Link>
          <h1 className="mt-8 text-[23px] font-semibold tracking-[-0.04em] text-navy">{register ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-[12px] leading-5 text-slate-500">{register ? "Set up your ClauseWise workspace." : "Sign in to your ClauseWise workspace."}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {register && <label className="block"><span className="mb-1.5 block text-[11px] font-medium text-slate-600">Full name</span><input required autoComplete="name" className="w-full rounded-lg border border-line px-3 py-2.5 text-[12px] outline-none focus:border-teal" placeholder="Your name" /></label>}
            <label className="block"><span className="mb-1.5 block text-[11px] font-medium text-slate-600">Work email</span><input required type="email" autoComplete="email" className="w-full rounded-lg border border-line px-3 py-2.5 text-[12px] outline-none focus:border-teal" placeholder="you@company.com" /></label>
            <label className="block"><span className="mb-1.5 block text-[11px] font-medium text-slate-600">Password</span><input required type="password" autoComplete={register ? "new-password" : "current-password"} className="w-full rounded-lg border border-line px-3 py-2.5 text-[12px] outline-none focus:border-teal" placeholder="Enter your password" /></label>
            {notice && <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-5 text-amber-900">{notice}</p>}
            <button type="submit" className="w-full rounded-lg bg-teal px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#11766f]">{register ? "Create account" : "Sign in"}</button>
          </form>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            {register ? "Already have an account?" : "New to ClauseWise?"}{" "}
            <button type="button" onClick={() => { setRegister(!register); setNotice(""); }} className="font-semibold text-teal hover:text-[#116f69]">{register ? "Sign in" : "Create account"}</button>
          </p>
          <p className="mt-6 border-t border-line pt-5 text-center text-[10px] leading-4 text-slate-400">Track Changes. Understand Impact. Stay Compliant.</p>
        </section>
      </div>
    </main>
  );
}
