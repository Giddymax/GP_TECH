import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { getHardwareItems } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Hardware",
  description: `POS terminals, printers, and networking equipment — installed, connected, and supported by ${siteConfig.name}.`,
};

export default async function HardwarePage() {
  const equipment = await getHardwareItems();

  return (
    <>
      <section className="bg-ink">
        <Container className="py-20 sm:py-24">
          <Eyebrow className="text-accent-bright">Business equipment</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-off-white sm:text-5xl">
            Hardware built for how you actually run.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-off-white/70">
            POS terminals, printers, and networking — chosen to work together,
            installed by us, and backed by real support. Pricing depends on your
            setup, so every assessment ends with a quote built for your business.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {equipment.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <div
                  key={item.id}
                  className="flex gap-5 rounded-2xl border border-line bg-white p-7 shadow-card"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light text-accent-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-blue py-16">
        <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-off-white sm:text-3xl">
              Not sure what equipment you need?
            </h2>
            <p className="mt-2 text-sm text-off-white/75">
              Tell us how your business runs — we&apos;ll recommend a setup and a
              price in your free assessment.
            </p>
          </div>
          <Button asChild size="lg">
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
