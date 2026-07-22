import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { PixelBars } from "@/components/pixel-bars";
import { PageHeroBackground } from "@/components/page-hero-background";
import { siteConfig } from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { getContentItems, getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${siteConfig.name} — an Accra-based team helping Ghanaian businesses go digital, in person.`,
};

export default async function AboutPage() {
  const [values, settings] = await Promise.all([getContentItems("about_values"), getSiteSettings()]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <PageHeroBackground imageUrl={settings.about_hero_image_url} />
        <Container className="relative z-10 flex flex-col items-center py-28 text-center sm:py-36">
          <Eyebrow className="text-accent-bright">About us</Eyebrow>
          <h1 className="mt-6 max-w-2xl text-5xl font-light leading-[1.08] text-off-white sm:text-6xl">
            {settings.about_heading}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-off-white/70">
            {settings.founder_name} started {siteConfig.name} to help Ghanaian
            businesses — shops, farms, schools, clinics, and churches — get the same
            digital tools bigger organisations take for granted, backed by people who
            will actually show up when something goes wrong.
          </p>
          <PixelBars className="mt-12" tone="light" />
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>Our story</Eyebrow>
              <h2 className="mt-4 text-4xl font-light leading-[1.08] text-ink">
                Why {siteConfig.name} exists
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-muted">
              {settings.about_story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="text-accent-bright">Why us</Eyebrow>
            <h2 className="mt-4 text-4xl font-light leading-[1.08] text-off-white sm:text-5xl">
              Local hands beat a foreign help desk
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = getIcon(value.icon);
              return (
                <div key={value.id} className="rounded-2xl border border-white/10 p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-bright">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-normal text-off-white">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-off-white/60">{value.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-24 text-center sm:py-32">
        <Container>
          <p className="eyebrow text-accent-dark">{settings.founder_role}</p>
          <h2 className="mt-4 text-3xl font-light text-ink sm:text-4xl">{settings.founder_name}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{settings.founder_blurb}</p>
        </Container>
      </section>
    </>
  );
}
