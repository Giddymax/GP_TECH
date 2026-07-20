import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { LeadForm } from "@/components/forms/lead-form";
import { siteConfig, whatsappLink, whatsappMessages, serviceInterestOptions } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get a free digital assessment from ${siteConfig.name}. Call, WhatsApp, or send us a message and we'll respond within one working day.`,
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [{ service }, settings] = await Promise.all([searchParams, getSiteSettings()]);
  const defaultService = serviceInterestOptions.some((o) => o.value === service)
    ? service
    : undefined;

  const contactChannels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsapp_display,
      href: whatsappLink(whatsappMessages.assessment, settings.whatsapp_number),
      caption: "Usually replies within minutes",
    },
    {
      icon: Phone,
      label: "Call",
      value: settings.phone_display,
      href: `tel:${settings.phone_href}`,
      caption: "Call or SMS",
    },
    {
      icon: Mail,
      label: "Mail",
      value: settings.email,
      href: `mailto:${settings.email}`,
      caption: "Email us anytime",
    },
  ];

  return (
    <>
      <section className="bg-ink">
        <Container className="py-20 sm:py-24">
          <Eyebrow className="text-accent-bright">Contact</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-off-white sm:text-5xl">
            Let&apos;s talk about your business.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-off-white/70">
            WhatsApp is usually the fastest way to reach us. For anything else, use
            the form below and we&apos;ll respond within one working day.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="space-y-8">
            <div className="grid gap-4">
              {contactChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light text-accent-dark transition-colors group-hover:bg-accent group-hover:text-ink">
                    <channel.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="eyebrow text-muted">{channel.label}</p>
                    <p className="text-base font-semibold text-ink">{channel.value}</p>
                    <p className="text-xs text-muted">{channel.caption}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent-dark" />
                <p className="eyebrow text-muted">Business hours</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/80">
                {settings.hours.map((h, i) => (
                  <span key={i}>
                    {h.day}, {h.time}
                    {i < settings.hours.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-7 shadow-card sm:p-9">
            <h2 className="text-xl font-semibold text-ink">Send us a message</h2>
            <p className="mt-1.5 text-sm text-muted">
              Tell us a little about your business and we&apos;ll get back to you
              within one working day.
            </p>
            <div className="mt-7">
              <LeadForm defaultService={defaultService} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
