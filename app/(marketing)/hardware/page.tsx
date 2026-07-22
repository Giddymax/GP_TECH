import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";
import { PageHeroBackground } from "@/components/page-hero-background";
import { siteConfig } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { getHardwareItems, getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Hardware",
  description: `POS terminals, printers, and networking equipment — installed, connected, and supported by ${siteConfig.name}.`,
};

export default async function HardwarePage() {
  const [equipment, settings] = await Promise.all([getHardwareItems(), getSiteSettings()]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <PageHeroBackground imageUrl={settings.hardware_hero_image_url} />
        <Container className="relative z-10 flex flex-col items-center py-28 text-center sm:py-36">
          <Eyebrow className="text-accent-bright">Business equipment</Eyebrow>
          <h1 className="mt-6 max-w-2xl text-5xl font-light leading-[1.08] text-off-white sm:text-6xl">
            Hardware built for how you actually run.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-off-white/70">
            POS terminals, printers, and networking — chosen to work together,
            installed by us, and backed by real support. Pricing depends on your
            setup, so every assessment ends with a quote built for your business.
          </p>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {equipment.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <div key={item.id} className="flex gap-5 rounded-2xl border border-line bg-white p-7 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light text-accent-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-normal text-ink">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-navy py-20">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-md text-3xl font-light leading-tight text-off-white sm:text-4xl">
            Not sure what equipment you need?
          </h2>
          <p className="mt-3 max-w-sm text-sm text-off-white/70">
            Tell us how your business runs — we&apos;ll recommend a setup and a price
            in your free assessment.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact?service=business-equipment">
              Get an equipment quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
