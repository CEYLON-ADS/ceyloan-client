export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_70px_rgba(11,30,39,0.09)]">
        <p className="text-sm uppercase tracking-[0.28em] text-[#cb6b3d]">About</p>
        <h1 className="mt-4 font-serif text-4xl text-[#112f3d]">A cleaner front door for local ads</h1>
        <p className="mt-6 max-w-3xl leading-8 text-slate-600">
          Ceylon Ads helps people across Sri Lanka browse listings faster, contact sellers directly, and publish new
          advertisements with less friction. This Next.js frontend now sits on top of the Laravel API so the experience
          feels lighter, quicker, and easier to evolve.
        </p>
      </div>
    </section>
  );
}
