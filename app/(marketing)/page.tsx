import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { PixelBars } from "@/components/pixel-bars";
import { HeroSlider } from "@/components/hero-slider";
import { Button } from "@/components/ui/button";
import { whatsappLink, whatsappMessages } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { getHeroSlides, getServices, getContentItems, getSiteSettings } from "@/lib/data/public";

const trustPoints = [
  { big: "Accra", label: "Where we're based" },
  { big: "In person", label: "How we set up" },
  { big: "Same week", label: "Typical turnaround" },
];

export default async function HomePage() {
  const [slides, services, howItWorks, settings] = await Promise.all([
    getHeroSlides(),
    getServices(),
    getContentItems("how_it_works"),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <HeroSlider slides={slides} />
        {slides.length === 0 ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(43,179,185,0.25), transparent 45%), radial-gradient(circle at 85% 0%, rgba(0,86,114,0.5), transparent 50%)",
            }}
          />
        ) : null}
        <Container className="relative flex flex-col items-center py-28 text-center sm:py-36">
          <Eyebrow className="text-accent-bright">
            Accra — for shops, farms, schools, clinics, churches &amp; offices
          </Eyebrow>
          <h1 className="mt-6 max-w-4xl text-5xl font-light leading-[1.05] text-off-white sm:text-7xl lg:text-[5.5rem]">
            {settings.hero_line}
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-off-white/70 sm:text-lg">
            Websites, records &amp; receipts, business equipment, and IT support —
            set up in person by a team that comes to you.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                Get a free assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="whatsapp">
              <a
                href={whatsappLink(whatsappMessages.assessment, settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-off-white/50">No jargon. No trip to an office.</p>
          <PixelBars className="mt-16" tone="light" />
        </Container>
      </section>

      {/* Trust band */}
      <section className="bg-off-white py-14">
        <Container className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex flex-col items-center gap-1 py-6 text-center sm:py-0">
              <p className="font-display text-2xl font-light text-ink sm:text-3xl">{point.big}</p>
              <p className="eyebrow text-muted">{point.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Services strip */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr] sm:items-end">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="mt-4 max-w-md text-4xl font-light leading-[1.08] text-ink sm:text-5xl">
                Five ways we help you go digital
              </h2>
            </div>
            <p className="text-base leading-7 text-muted sm:justify-self-end sm:text-right">
              Pick one, or let us set up all five together — most clients start with a
              website or a go-digital setup, then add ongoing support.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.slug}
                  href="/services"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink p-7 shadow-card transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-card-hover min-h-[220px]"
                >
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-bright transition-colors group-hover:bg-accent group-hover:text-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-normal text-off-white">{service.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-off-white/60">{service.short_description}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-bright">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="bg-ink py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="text-accent-bright">Who we serve</Eyebrow>
            <h2 className="mt-4 text-4xl font-light leading-[1.08] text-off-white sm:text-5xl">
              If it keeps records or serves customers, we digitize it
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {settings.serves.map((sector) => (
              <span
                key={sector}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-off-white/85"
              >
                {sector}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr] sm:items-end">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 max-w-md text-4xl font-light leading-[1.08] text-ink sm:text-5xl">
                Three visits. No headaches.
              </h2>
            </div>
          </div>
          <ol className="mt-14 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <li key={step.id} className="border-t border-line pt-6">
                <span className="eyebrow text-accent-dark">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-normal text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA band */}
      <section className="bg-blue py-20">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-xl text-3xl font-light leading-tight text-off-white sm:text-4xl">
            Free digital assessment — we come to you
          </h2>
          <p className="mt-3 text-sm text-off-white/70">No obligation. No jargon. Same-week visits.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">
              Get my free assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
