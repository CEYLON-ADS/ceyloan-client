"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";

import type { Category, District, User } from "@/lib/types";

type PublishFormProps = {
  categories: Category[];
  districts: District[];
  user: User;
};

function collectImageUrls(rawValue: string) {
  return rawValue
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function PublishForm({ categories, districts, user }: PublishFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [pending, startTransition] = useTransition();

  const visibleCities = useMemo(() => {
    if (selectedDistrict === "all") {
      return districts.flatMap((district) => district.cities);
    }

    return districts.find((district) => district.id === selectedDistrict)?.cities ?? [];
  }, [districts, selectedDistrict]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const cityIds = formData.getAll("cityIds").map(String);
    const imageUrls = collectImageUrls(String(formData.get("imageUrls") ?? ""));

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      imageUrl: imageUrls[0] ?? null,
      imageUrls,
      listingPrice: Number(formData.get("listingPrice") || 0) || null,
      contactPhone: String(formData.get("contactPhone") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      cityId: cityIds[0] ?? null,
      cityIds,
      adTier: String(formData.get("adTier") ?? "normal"),
      cashback: formData.get("cashback") === "on",
      contactWhatsapp: formData.get("contactWhatsapp") === "on",
      contactWhatsappNumber: String(formData.get("contactWhatsappNumber") ?? "") || null,
      telegram: formData.get("telegram") === "on",
      telegramNumber: String(formData.get("telegramNumber") ?? "") || null,
      imo: formData.get("imo") === "on",
      imoNumber: String(formData.get("imoNumber") ?? "") || null,
      viber: formData.get("viber") === "on",
      viberNumber: String(formData.get("viberNumber") ?? "") || null,
    };

    startTransition(async () => {
      const response = await fetch("/api/advertisements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = (await response.json().catch(() => null)) as
        | { message?: string; data?: { id?: string } }
        | null;

      if (!response.ok || !json?.data?.id) {
        setError(json?.message ?? "Unable to publish this advertisement.");
        return;
      }

      router.push(`/ads/${json.data.id}`);
      router.refresh();
    });
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="rounded-[2rem] border border-[#ecd9c8] bg-[#fffaf4] p-5 text-sm text-slate-700">
        Signed in as <span className="font-semibold text-[#0f3d55]">{user.email ?? user.mobileNumber ?? "Marketplace user"}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="space-y-5 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_rgba(20,37,45,0.08)]">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="title">
              Ad title
            </label>
            <input id="title" name="title" required className="field" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="description">
              Description
            </label>
            <textarea id="description" name="description" rows={6} required className="field resize-y" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="listingPrice">
                Listing price
              </label>
              <input id="listingPrice" name="listingPrice" type="number" min="0" step="0.01" className="field" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="contactPhone">
                Contact phone
              </label>
              <input id="contactPhone" name="contactPhone" required className="field" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="imageUrls">
              Image URLs
            </label>
            <textarea
              id="imageUrls"
              name="imageUrls"
              rows={4}
              placeholder="Paste one image URL per line"
              className="field resize-y"
            />
            <p className="text-xs text-slate-500">The first URL becomes the cover image. Up to 5 images.</p>
          </div>
        </section>

        <section className="space-y-5 rounded-[2rem] border border-[#d8e5e8] bg-[linear-gradient(180deg,#0f3d55_0%,#15536f_100%)] p-6 text-white shadow-[0_24px_60px_rgba(9,28,38,0.22)]">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="categoryId">
              Category
            </label>
            <select id="categoryId" name="categoryId" required className="field-dark">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="adTier">
              Ad type
            </label>
            <select id="adTier" name="adTier" defaultValue="normal" className="field-dark">
              <option value="normal">Normal (2 days)</option>
              <option value="super">Super (1 day top)</option>
              <option value="vip">VIP (1 day top)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="districtFilter">
              District filter
            </label>
            <select
              id="districtFilter"
              value={selectedDistrict}
              onChange={(event) => setSelectedDistrict(event.target.value)}
              className="field-dark"
            >
              <option value="all">All island</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.district}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Cities</p>
            <div className="grid max-h-60 gap-3 overflow-y-auto rounded-3xl border border-white/15 bg-white/8 p-4">
              {visibleCities.map((city) => (
                <label key={city.id} className="flex items-center gap-3 text-sm text-white/90">
                  <input type="checkbox" name="cityIds" value={city.id} className="size-4 accent-[#cb6b3d]" />
                  <span>{city.name}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-5 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_rgba(20,37,45,0.08)]">
        <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="cashback" className="size-4 accent-[#cb6b3d]" />
            CashBack
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="contactWhatsapp" className="size-4 accent-[#cb6b3d]" />
            WhatsApp
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="telegram" className="size-4 accent-[#cb6b3d]" />
            Telegram
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="imo" className="size-4 accent-[#cb6b3d]" />
            IMO
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="viber" className="size-4 accent-[#cb6b3d]" />
            Viber
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <input name="contactWhatsappNumber" placeholder="WhatsApp number" className="field" />
          <input name="telegramNumber" placeholder="Telegram number" className="field" />
          <input name="imoNumber" placeholder="IMO number" className="field" />
          <input name="viberNumber" placeholder="Viber number" className="field" />
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#cb6b3d] px-6 py-3 font-semibold text-white transition hover:bg-[#b65a2d] disabled:opacity-60"
        >
          {pending ? "Publishing..." : "Submit Ad"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full border border-[#d8c6b4] px-6 py-3 font-semibold text-[#0f3d55] transition hover:border-[#cb6b3d] hover:text-[#cb6b3d]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
