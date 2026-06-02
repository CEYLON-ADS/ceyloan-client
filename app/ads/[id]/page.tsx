/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";

import { LikeButton } from "@/components/like-button";
import { compactNumber, formatLkr, trimPhone } from "@/lib/format";
import { laravelFetch } from "@/lib/api";
import type { Advertisement } from "@/lib/types";

async function getAdvertisement(id: string) {
  try {
    return await laravelFetch<Advertisement>(`/advertisements/${id}`);
  } catch {
    return null;
  }
}

export default async function AdvertisementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const advertisement = await getAdvertisement(id);

  if (!advertisement) {
    notFound();
  }

  const images = advertisement.image_urls?.length
    ? advertisement.image_urls
    : advertisement.image_url
      ? [advertisement.image_url]
      : [];

  const whatsappNumber = trimPhone(advertisement.contact_whatsapp_number ?? advertisement.contact_phone);
  const telegramNumber = trimPhone(advertisement.telegram_number ?? advertisement.contact_phone);
  const imoNumber = trimPhone(advertisement.imo_number ?? advertisement.contact_phone);
  const viberNumber = trimPhone(advertisement.viber_number ?? advertisement.contact_phone);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.35fr_.85fr] lg:px-8">
      <section className="rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_28px_70px_rgba(11,30,39,0.09)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#cb6b3d]">Featured listing</p>
            <h1 className="mt-3 font-serif text-4xl text-[#112f3d]">{advertisement.title}</h1>
            <p className="mt-3 text-sm text-slate-500">
              {advertisement.category?.name ?? "General"} · {advertisement.city?.name ?? "Not specified"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {advertisement.is_pinned ? <span className="badge badge-warm">Pinned</span> : null}
            {advertisement.cashback ? <span className="badge badge-soft">CashBack</span> : null}
            {advertisement.status ? <span className="badge">{advertisement.status.toUpperCase()}</span> : null}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {images[0] ? (
            <img src={images[0]} alt={advertisement.title} className="h-[22rem] w-full rounded-[1.6rem] object-cover" />
          ) : (
            <div className="flex h-[22rem] items-center justify-center rounded-[1.6rem] bg-[#dbe8eb] text-lg font-semibold text-[#0f3d55]">
              No image available
            </div>
          )}
          {images.length > 1 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {images.slice(1).map((image) => (
                <img key={image} src={image} alt={advertisement.title} className="h-28 w-full rounded-[1.2rem] object-cover" />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 rounded-[1.6rem] bg-[#f6efe8] p-6">
          <h2 className="font-serif text-2xl text-[#112f3d]">About this ad</h2>
          <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{advertisement.description}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <LikeButton advertisementId={advertisement.id} initialLikes={advertisement.likes_count ?? 0} />
          <Link
            href="/"
            className="rounded-full border border-[#d7c3ae] px-5 py-3 font-semibold text-[#0f3d55] transition hover:border-[#cb6b3d] hover:text-[#cb6b3d]"
          >
            Back to listings
          </Link>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-[#d7e4e8] bg-[linear-gradient(180deg,#0f3d55_0%,#15536f_100%)] p-6 text-white shadow-[0_28px_70px_rgba(9,28,38,0.22)]">
          <p className="text-sm uppercase tracking-[0.24em] text-white/70">Price</p>
          <div className="mt-3 font-serif text-4xl">{formatLkr(advertisement.listing_price ?? advertisement.advertiseType?.price)}</div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-[1.4rem] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Views</p>
              <p className="mt-2 text-2xl font-semibold">{compactNumber(advertisement.views_count)}</p>
            </div>
            <div className="rounded-[1.4rem] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Likes</p>
              <p className="mt-2 text-2xl font-semibold">{compactNumber(advertisement.likes_count)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_28px_70px_rgba(11,30,39,0.09)]">
          <h2 className="font-serif text-2xl text-[#112f3d]">Seller contact</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-[#112f3d]">Phone:</span> {advertisement.contact_phone}
            </p>
            <p>
              <span className="font-semibold text-[#112f3d]">Posted by:</span>{" "}
              {advertisement.user?.mobile_number ?? "Marketplace member"}
            </p>
            <p>
              <span className="font-semibold text-[#112f3d]">Locations:</span>{" "}
              {advertisement.cities?.length
                ? advertisement.cities.map((city) => city.name).join(", ")
                : advertisement.city?.name ?? "Not specified"}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {advertisement.contact_whatsapp ? (
              <a className="contact-pill" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : null}
            {advertisement.telegram ? (
              <a className="contact-pill" href={`https://t.me/${telegramNumber}`} target="_blank" rel="noreferrer">
                Telegram
              </a>
            ) : null}
            {advertisement.imo ? (
              <a className="contact-pill" href={`imo://chat?phone=${imoNumber}`}>
                IMO
              </a>
            ) : null}
            {advertisement.viber ? (
              <a className="contact-pill" href={`viber://chat?number=${viberNumber}`}>
                Viber
              </a>
            ) : null}
          </div>
        </section>
      </aside>
    </div>
  );
}
