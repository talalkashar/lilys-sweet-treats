import Image from "next/image";
import { OrderForm } from "@/components/OrderForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { products } from "@/data/products";
import { site } from "@/data/site";

const marqueeItems = [
  "Cake Pop Bouquets",
  "Alfajores",
  "Pecan Sticky Buns",
  "Classic Sticky Buns",
  "Handmade with love",
  "Porch pickup only",
  "Pre-order online",
];

const trust = [
  { title: "Small-batch", copy: "Baked fresh for your order — never mass-produced." },
  { title: "Porch pickup", copy: "No delivery stress. Local, simple, personal." },
  { title: "Gift-ready", copy: "Bouquets and boxes made to impress." },
  { title: "Easy pre-order", copy: "Pick a window, we bake to your time." },
];

export default function Home() {
  const featured = products[0];

  return (
    <>
      {/* HERO — photo-led, editorial */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage: `url(${site.pattern})`,
            backgroundSize: "480px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[var(--lavender)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[var(--blush)]/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--blush)] bg-white/80 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--rose)] shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--rose)]" />
              Home bakery · Pre-order
            </p>

            <h1 className="anim-fade-up anim-delay-1 mt-6 font-display text-[clamp(2.75rem,6vw,4.25rem)] leading-[1.02] text-[var(--cocoa)]">
              The sweetest porch{" "}
              <em className="not-italic text-[var(--rose)]">pickup</em> in town
            </h1>

            <p className="anim-fade-up anim-delay-2 prose-soft mt-6">
              {site.tagline}. From cake pop bouquets to gooey sticky buns and
              dulce de leche alfajores — order online, pick up in person.{" "}
              <strong className="font-semibold text-[var(--cocoa)]">
                No delivery. Just better baking.
              </strong>
            </p>

            <div className="anim-fade-up anim-delay-3 mt-9 flex flex-wrap gap-3">
              <a href="#order" className="btn-primary">
                Pre-order treats
              </a>
              <a href="#menu" className="btn-secondary">
                Browse the menu
              </a>
            </div>

            <dl className="anim-fade-up anim-delay-4 mt-10 grid grid-cols-3 gap-4 border-t border-[var(--blush)]/70 pt-8 max-w-md">
              <div>
                <dt className="font-display text-3xl text-[var(--cocoa)]">
                  {products.length}+
                </dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                  Treats
                </dd>
              </div>
              <div>
                <dt className="font-display text-3xl text-[var(--cocoa)]">24h</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                  Lead time
                </dd>
              </div>
              <div>
                <dt className="font-display text-3xl text-[var(--cocoa)]">100%</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--ink-muted)]">
                  Handmade
                </dd>
              </div>
            </dl>
          </div>

          {/* Feature collage */}
          <div className="anim-fade-up anim-delay-2 relative lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)] sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]">
                <Image
                  src={featured.image!}
                  alt={featured.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--cocoa)]/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                    Featured
                  </p>
                  <p className="mt-1 font-display text-2xl">{featured.name}</p>
                </div>
              </div>
              {products.slice(1, 3).map((p, i) => (
                <div
                  key={p.id}
                  className={`relative aspect-square overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-soft)] ${i === 1 ? "sm:translate-y-6" : ""}`}
                >
                  <Image
                    src={p.image!}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              ))}
            </div>

            {/* Floating logo badge */}
            <div className="absolute -bottom-4 left-1/2 z-10 w-[min(100%,220px)] -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-0 sm:translate-x-0">
              <div className="float-soft rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur">
                <div className="relative mx-auto h-28 w-full">
                  <Image
                    src={site.logo}
                    alt={site.name}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-[var(--blush)]/50 bg-gradient-to-r from-[var(--lavender-soft)] via-white to-[var(--mint-soft)] py-3.5">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--cocoa-soft)]"
            >
              <span className="text-[var(--rose)]">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <section className="border-b border-[var(--blush)]/40 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-[var(--blush)]/30 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div
              key={t.title}
              className="bg-white px-6 py-8 text-center sm:text-left"
            >
              <p className="font-display text-xl text-[var(--cocoa)]">{t.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--cocoa-soft)]">
                {t.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MENU — large photography grid */}
      <section id="menu" className="section-pad mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">The menu</p>
              <h2 className="section-title mt-2">Treats worth the drive</h2>
              <p className="prose-soft mt-3">
                Every item is made to order for porch pickup. Scroll, fall in
                love, pre-order.
              </p>
            </div>
            <a href="#order" className="btn-secondary shrink-0 self-start sm:self-auto">
              Order from menu
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.id} delayMs={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY — brand block */}
      <section
        id="story"
        className="relative overflow-hidden border-y border-[var(--blush)]/50 bg-[var(--lavender-soft)]/50"
      >
        <div className="section-pad relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={products[1].image!}
                alt="Fresh alfajores from Lily's kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div>
              <p className="section-label">Our story</p>
              <h2 className="section-title mt-2">
                Baked with heart,{" "}
                <span className="text-[var(--rose)]">finished with joy</span>
              </h2>
              <p className="prose-soft mt-5">
                {site.name} is a home bakery for people who want something
                special — pretty enough to gift, delicious enough to keep.
                We focus on a short menu done beautifully, so every order feels
                personal.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Pastel cake pop bouquets for celebrations",
                  "Classic alfajores with dulce de leche",
                  "Sticky buns — pecan or classic caramel",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[var(--cocoa-soft)]"
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--rose)]"
                      aria-hidden
                    />
                    {line}
                  </li>
                ))}
              </ul>
              <a href="#order" className="btn-primary mt-9">
                Pre-order your favorites
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-pad bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">Simple flow</p>
              <h2 className="section-title mt-2">Three easy steps</h2>
              <p className="prose-soft mx-auto mt-3 text-center">
                No complicated checkout maze. Tell us what you want, when
                you&apos;re coming, and we handle the rest.
              </p>
            </div>
          </Reveal>

          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Choose your treats",
                d: "Browse the menu and pick cake pops, alfajores, sticky buns, and more.",
                tone: "bg-[var(--blush)]/50",
              },
              {
                n: "02",
                t: "Pick a pickup window",
                d: "Select a time that works. We bake with your slot in mind.",
                tone: "bg-[var(--lavender-soft)]",
              },
              {
                n: "03",
                t: "Pay & porch pickup",
                d: "Stripe payment coming soon. Then grab your order from the porch — no delivery.",
                tone: "bg-[var(--mint-soft)]",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delayMs={i * 90}>
                <li
                  className={`relative h-full rounded-[1.75rem] ${step.tone} p-7 sm:p-8`}
                >
                  <span className="font-display text-5xl text-[var(--cocoa)]/15">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-2xl text-[var(--cocoa)]">
                    {step.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--cocoa-soft)]">
                    {step.d}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ORDER */}
      <section
        id="order"
        className="section-pad relative overflow-hidden border-t border-[var(--blush)]/40"
        style={{
          background:
            "linear-gradient(180deg, var(--cream) 0%, var(--lavender-soft) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="section-label">Pre-order</p>
              <h2 className="section-title mt-2">Reserve your pickup</h2>
              <p className="prose-soft mx-auto mt-3 text-center">
                {site.pickupNote} Share a few details and we&apos;ll confirm your
                order.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="mx-auto mt-12 max-w-2xl">
              <OrderForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-pad bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-[var(--blush)] bg-gradient-to-br from-white via-[var(--blush)]/20 to-[var(--mint-soft)] p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-lg">
                <p className="section-label">Contact</p>
                <h2 className="section-title mt-2">Let&apos;s make it sweet</h2>
                <p className="prose-soft mt-4">
                  Custom flavors, larger orders, or questions about pickup?
                  We&apos;re a text or email away.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
                <a href={`mailto:${site.email}`} className="btn-secondary">
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phone.replace(/\D/g, "")}`}
                  className="btn-primary"
                >
                  {site.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
