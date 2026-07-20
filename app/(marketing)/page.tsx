import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { PixelBars } from "@/components/pixel-bars";
import { HeroSlider } from "@/components/hero-slider";
import { Button } from "@/components/ui/button";
import { whatsappLink, whatsappMessages } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { getHeroSlides, getServices, getContentItems, getSiteSettings } from "@/lib/data/public";

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
        <Container className="relative py-20 sm:py-28">
          <Eyebrow className="text-accent-bright">
            Accra — for shops, farms, schools, clinics, churches &amp; offices
          </Eyebrow>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] text-off-white sm:text-6xl">
            {settings.hero_line}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-off-white/70 sm:text-lg">
            Websites, records &amp; receipts, business equipment, and IT support —
            set up in person by a team that comes to you. No jargon, no trip to an
            office.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
          <PixelBars className="mt-14" tone="light" />
        </Container>
      </section>

      {/* Services strip */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              Five ways we help you go digital
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Pick one, or let us set up all five together — most clients start with a
              website or a go-digital setup, then add ongoing support.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.slug}
                  href="/services"
                  className="group relative flex flex-col rounded-2xl border border-line bg-white p-7 shadow-card transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-light text-accent-dark transition-colors group-hover:bg-accent group-hover:text-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{service.short_description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent-dark">
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
      <section className="bg-blue-light py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Who we serve</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              If it keeps records or serves customers, we digitize it
            </h2>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {settings.serves.map((sector) => (
              <span
                key={sector}
                className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-card"
              >
                {sector}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              Three visits. No headaches.
            </h2>
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <li key={step.id} className="relative pl-14">
                <span className="eyebrow absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-off-white">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CTA band */}
      <section className="bg-blue py-16">
        <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-off-white sm:text-3xl">
              Free digital assessment — we come to you
            </h2>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-off-white/75 sm:justify-start">
              <Check className="h-4 w-4 text-accent-bright" /> No obligation
              <Check className="h-4 w-4 text-accent-bright" /> No jargon
              <Check className="h-4 w-4 text-accent-bright" /> Same-week visits
            </p>
          </div>
          <Button asChild size="lg">
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
