import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { getServices } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Services",
  description: `Websites, go-digital setup, business equipment, IT support, and GRA e-VAT readiness from ${siteConfig.name}.`,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="bg-ink">
        <Container className="flex flex-col items-center py-28 text-center sm:py-36">
          <Eyebrow className="text-accent-bright">IT services</Eyebrow>
          <h1 className="mt-6 max-w-2xl text-5xl font-light leading-[1.08] text-off-white sm:text-6xl">
            Everything your business needs to run online.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-off-white/70">
            Pick one service or bundle a few together — every free assessment ends
            with a plan built around your business, not a generic package.
          </p>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="space-y-16">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            const reversed = index % 2 === 1;
            return (
              <div
                key={service.slug}
                id={service.slug}
                className="grid items-start gap-8 border-t border-line pt-12 first:border-t-0 first:pt-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
              >
                <div className={reversed ? "lg:order-2" : ""}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light text-accent-dark">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-3xl font-light leading-tight text-ink sm:text-4xl">
                    {service.name}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-muted">{service.description}</p>
                  <Button asChild className="mt-6">
                    <Link href={`/contact?service=${service.slug}`}>
                      Ask about {service.name}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <ul className={`space-y-3 rounded-2xl border border-line bg-white p-7 shadow-card ${reversed ? "lg:order-1" : ""}`}>
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-ink/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}
