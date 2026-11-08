import type { Metadata } from "next";
import "./globals.css";
import { AmbientBackground } from "@/components/ambient-background";
import { Providers } from "@/components/providers";
import { AuthTransition } from "@/components/auth-transition";

export const metadata: Metadata = {
  title: "ClauseWise | Tender Amendment Analysis",
  description: "Track Changes. Understand Impact. Stay Compliant.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AmbientBackground />
        <div className="relative z-10 min-h-screen">
          <Providers>{children}</Providers>
          <AuthTransition />
        </div>
      </body>
    </html>
  );
}
