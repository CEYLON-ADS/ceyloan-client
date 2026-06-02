import Link from "next/link";

import { getCurrentUser } from "@/lib/api";

import { LogoutButton } from "./logout-button";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-white/10 bg-[linear-gradient(135deg,#0f3d55_0%,#18687c_38%,#cb6b3d_100%)] text-white shadow-[0_22px_60px_rgba(9,28,38,0.28)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/" className="font-serif text-3xl tracking-[0.18em] text-white uppercase">
              Ceylon Ads
            </Link>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              A brighter marketplace for island-wide listings, trusted contacts, and fast discovery.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10" href="/">
              Browse
            </Link>
            <Link className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10" href="/publish">
              Publish
            </Link>
            <Link className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10" href="/about">
              About
            </Link>
            <Link className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10" href="/privacy-policy">
              Privacy
            </Link>
            <Link className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10" href="/terms-and-conditions">
              Terms
            </Link>
            {user ? (
              <>
                <span className="rounded-full bg-white/12 px-4 py-2 text-white/90">
                  {user.email ?? user.mobileNumber ?? "Signed in"}
                </span>
                <LogoutButton />
              </>
            ) : (
              <Link className="rounded-full bg-white px-4 py-2 font-semibold text-[#0f3d55] transition hover:bg-[#f5e6d4]" href="/login">
                User Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
