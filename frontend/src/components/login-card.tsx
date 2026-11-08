import Link from "next/link";
import { ArrowDown, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export function LoginCard({
  isSigningIn,
  onGoogleSignIn,
}: {
  isSigningIn: boolean;
  onGoogleSignIn: () => void;
}) {
  return (
    <aside className="order-1 w-full lg:order-2 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:justify-center lg:self-start">
      <div className="login-card w-full max-w-[420px]">
        <section className="relative overflow-hidden rounded-2xl border border-line bg-white/90 p-7 shadow-2xl shadow-navy/10 backdrop-blur-xl sm:p-9">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-teal-300 to-navy" />

          <div className="relative">
            <Link
              href="/"
              className="login-fade-up group flex items-center gap-2.5"
              style={{ animationDelay: "0.02s" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-navy to-[#1d4f5f] text-white shadow-lg shadow-navy/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <ShieldCheck size={20} />
              </span>
              <span className="text-lg font-bold tracking-[-0.03em] text-navy">ClauseWise</span>
            </Link>

            <p
              className="login-fade-up mt-8 text-[24px] font-semibold tracking-[-0.03em] text-navy"
              style={{ animationDelay: "0.08s" }}
            >
              Welcome back
            </p>
            <p
              className="login-fade-up mt-2 text-sm leading-6 text-slate-500"
              style={{ animationDelay: "0.14s" }}
            >
              Use Google to continue, or explore the core flow as a guest.
            </p>

            <button
              type="button"
              disabled={isSigningIn}
              onClick={onGoogleSignIn}
              className="login-fade-up mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 active:translate-y-0 active:shadow-sm disabled:cursor-wait disabled:opacity-70"
              style={{ animationDelay: "0.2s" }}
            >
              {isSigningIn ? <Loader2 size={18} className="animate-spin text-teal" /> : <GoogleIcon />}
              {isSigningIn ? "Redirecting…" : "Continue with Google"}
            </button>

            <div aria-hidden="true" className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-medium text-slate-400">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <Link
              href="/"
              className="login-fade-up group flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white/80 px-4 py-3 text-sm font-semibold text-navy shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/50 hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              style={{ animationDelay: "0.26s" }}
            >
              Continue as guest
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p
              className="login-fade-up mt-4 text-center text-sm leading-6 text-slate-500"
              style={{ animationDelay: "0.32s" }}
            >
              Core features are available without signing in.
            </p>

            <p
              className="login-fade-up mt-6 border-t border-line pt-5 text-center text-sm leading-6 text-slate-500"
              style={{ animationDelay: "0.38s" }}
            >
              Track changes. Understand impact. Stay compliant.
            </p>
          </div>
        </section>

        <a
          href="#clausewise-story"
          className="login-fade-up group mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-teal lg:hidden"
          style={{ animationDelay: "0.44s" }}
        >
          What is ClauseWise?
          <ArrowDown size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
      </div>
    </aside>
  );
}
