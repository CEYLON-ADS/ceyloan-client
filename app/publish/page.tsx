import Link from "next/link";

import { PublishForm } from "@/components/publish-form";
import { getCurrentUser, laravelFetch } from "@/lib/api";
import type { Category, District } from "@/lib/types";

export default async function PublishPage() {
  const [user, categories, districts] = await Promise.all([
    getCurrentUser(),
    laravelFetch<Category[]>("/categories"),
    laravelFetch<District[]>("/districts"),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#cb6b3d]">Publish</p>
        <h1 className="mt-3 font-serif text-4xl text-[#112f3d]">Create a fresh listing</h1>
        <p className="mt-4 max-w-2xl leading-8 text-slate-600">
          This replaces the old Blade publish flow with a dedicated Next.js form backed by the Laravel API.
        </p>
      </div>

      {user ? (
        <PublishForm categories={categories} districts={districts} user={user} />
      ) : (
        <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_70px_rgba(11,30,39,0.09)]">
          <h2 className="font-serif text-3xl text-[#112f3d]">Login required</h2>
          <p className="mt-4 max-w-xl leading-8 text-slate-600">
            You need a user session before publishing an ad. The login flow is now handled by the Next frontend and
            Laravel API.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-[#0f3d55] px-6 py-3 font-semibold text-white transition hover:bg-[#15536f]"
          >
            Go to login
          </Link>
        </div>
      )}
    </section>
  );
}
