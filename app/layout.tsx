import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ceylon Ads",
  description: "Next.js marketplace frontend connected to the Laravel API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f5efe6] text-slate-900">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(203,107,61,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(24,104,124,0.18),transparent_24%),linear-gradient(180deg,#f5efe6_0%,#eff4f3_45%,#f8f6f0_100%)]">
          <SiteHeader />
          <main>{children}</main>
          <footer className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
            ALL RIGHT RESERVED queenslanka
          </footer>
        </div>
      </body>
    </html>
  );
}
