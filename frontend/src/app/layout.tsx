import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClauseWise | Tender Amendment Analysis",
  description: "Track Changes. Understand Impact. Stay Compliant.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
