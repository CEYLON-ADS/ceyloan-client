/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { compactNumber, formatLkr } from "@/lib/format";
import { laravelFetch } from "@/lib/api";
import type { Advertisement, Category, City, Paginated } from "@/lib/types";

type SearchParams = {
  q?: string;
  category?: string;
  city?: string;
  cities?: string | string[];
  location?: string;
  days_back?: string;
  min_price?: string;
  max_price?: string;
  page?: string;
};

function normalizeCities(value?: string | string[]) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function createPageLink(
  searchParams: SearchParams,
  page: number
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }

    params.set(key, value);
  });

  params.set("page", String(page));
  return `/?${params.toString()}`;
}

function createApiQuery(params: SearchParams, cities: string[]) {
  const query = new URLSearchParams();

  query.set("q", params.q ?? "");
  query.set("category", params.category ?? "");
  query.set("city", params.city ?? "");
  query.set("location", params.location ?? "");
  query.set("days_back", params.days_back ?? "0");
  query.set("min_price", params.min_price ?? "0");
  query.set("max_price", params.max_price ?? "100000");
  query.set("page", params.page ?? "1");
  query.set("size", "12");

  cities.forEach((city) => query.append("cities[]", city));

  return query.toString();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const cities = normalizeCities(params.cities);

  const ads = await laravelFetch<Paginated<Advertisement>>(
    `/advertisements?${createApiQuery(params, cities)}`
  );

  const [categories, availableCities] = await Promise.all([
    laravelFetch<Category[]>("/categories"),
    laravelFetch<City[]>("/cities"),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(15,61,85,0.96)_0%,rgba(24,104,124,0.92)_48%,rgba(203,107,61,0.88)_100%)] p-8 text-white shadow-[0_30px_70px_rgba(11,30,39,0.18)]">
        <p className="text-sm uppercase tracking-[0.34em] text-white/70">Revamped marketplace</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h1 className="max-w-3xl font-serif text-5xl leading-tight">
              Discover fresh listings with smarter filters and a cleaner seller journey.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
              The old Blade listing experience is now rebuilt in Next.js and connected directly to the Laravel API.
            </p>
          </div>
          <form action="/" className="rounded-[1.8rem] bg-white/10 p-5 backdrop-blur">
            <label className="text-sm font-semibold text-white" htmlFor="q">
              Search ads
            </label>
            <input
              id="q"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search by title or description"
              className="mt-3 w-full rounded-full border border-white/20 bg-white px-5 py-3 text-slate-900 outline-none"
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#cb6b3d] px-5 py-3 font-semibold text-white transition hover:bg-[#b65a2d]">
                Search
              </button>
              <Link href="/publish" className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                Post new ad
              </Link>
            </div>
          </form>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-[#d9e3e6] bg-[linear-gradient(180deg,#f9fbfb_0%,#eef5f5_100%)] p-6 shadow-[0_24px_60px_rgba(20,37,45,0.08)] lg:sticky lg:top-6 lg:self-start">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#cb6b3d]">Filter ads</p>
            <h2 className="mt-2 font-serif text-3xl text-[#112f3d]">Tune the feed</h2>
          </div>
          <form action="/" className="space-y-5">
            <input type="hidden" name="q" value={params.q ?? ""} />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="category">
                Category
              </label>
              <select id="category" name="category" defaultValue={params.category ?? ""} className="field">
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="cities">
                Locations
              </label>
              <select id="cities" name="cities" multiple defaultValue={cities} className="field min-h-44">
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="location">
                Location text
              </label>
              <input id="location" name="location" defaultValue={params.location ?? ""} className="field" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="days_back">
                  Last N days
                </label>
                <input id="days_back" name="days_back" type="number" min="0" max="365" defaultValue={params.days_back ?? "0"} className="field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="min_price">
                  Min price
                </label>
                <input id="min_price" name="min_price" type="number" min="0" defaultValue={params.min_price ?? "0"} className="field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="max_price">
                  Max price
                </label>
                <input id="max_price" name="max_price" type="number" min="0" defaultValue={params.max_price ?? "100000"} className="field" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[#0f3d55] px-5 py-3 font-semibold text-white transition hover:bg-[#15536f]">
                Apply filters
              </button>
              <Link href="/" className="rounded-full border border-[#d8c6b4] px-5 py-3 font-semibold text-[#0f3d55] transition hover:border-[#cb6b3d] hover:text-[#cb6b3d]">
                Reset
              </Link>
            </div>
          </form>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#cb6b3d]">Browse</p>
              <h2 className="mt-2 font-serif text-4xl text-[#112f3d]">Find new ads</h2>
            </div>
            <p className="rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
              Showing {ads.data.length} of {ads.total} ads
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ads.data.length ? (
              ads.data.map((ad) => {
                const image = ad.image_urls?.[0] ?? ad.image_url;
                const price = ad.listing_price ?? ad.advertiseType?.price;

                return (
                  <article
                    key={ad.id}
                    className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 shadow-[0_24px_60px_rgba(20,37,45,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(20,37,45,0.12)]"
                  >
                    {image ? (
                      <img src={image} alt={ad.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-[#dbe8eb] text-lg font-semibold text-[#0f3d55]">
                        No image
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {ad.is_pinned ? <span className="badge badge-warm">Pinned</span> : null}
                        {ad.cashback ? <span className="badge badge-soft">CashBack</span> : null}
                        <span className="badge">{ad.category?.name ?? "General"}</span>
                      </div>
                      <h3 className="mt-4 font-serif text-2xl text-[#112f3d]">{ad.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{ad.description}</p>
                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">{ad.city?.name ?? "Not specified"}</p>
                          <p className="mt-1 text-lg font-semibold text-[#0f3d55]">{formatLkr(price)}</p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>{compactNumber(ad.views_count)} views</p>
                          <p>{compactNumber(ad.likes_count)} likes</p>
                        </div>
                      </div>
                      <Link
                        href={`/ads/${ad.id}`}
                        className="mt-6 inline-flex rounded-full bg-[#0f3d55] px-5 py-3 font-semibold text-white transition hover:bg-[#15536f]"
                      >
                        View details
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_24px_60px_rgba(20,37,45,0.08)]">
                <h3 className="font-serif text-3xl text-[#112f3d]">No ads found</h3>
                <p className="mt-4 max-w-xl text-slate-600">Try adjusting the filters or clearing the search.</p>
                <Link
                  href="/"
                  className="mt-6 inline-flex rounded-full border border-[#d8c6b4] px-5 py-3 font-semibold text-[#0f3d55] transition hover:border-[#cb6b3d] hover:text-[#cb6b3d]"
                >
                  Clear filters
                </Link>
              </div>
            )}
          </div>

          {ads.last_page > 1 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {Array.from({ length: ads.last_page }, (_, index) => index + 1).map((page) => (
                <Link
                  key={page}
                  href={createPageLink(params, page)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    page === ads.current_page
                      ? "bg-[#cb6b3d] text-white"
                      : "border border-[#d8c6b4] text-[#0f3d55] hover:border-[#cb6b3d] hover:text-[#cb6b3d]"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
