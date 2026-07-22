import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Settings } from "lucide-react";
import { navLinks, siteConfig, whatsappLink } from "@/lib/constants";
import { PixelBars } from "@/components/pixel-bars";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export function Footer({ settings }: { settings: SiteSettingsRow }) {
  return (
    <footer className="bg-ink text-off-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src="/brand/lockup-horizontal-white.png"
              alt="Grainy Palace Tech"
              width={198}
              height={48}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-7 text-off-white/70">{settings.meta_description}</p>
            <PixelBars className="mt-6" tone="light" />
          </div>

          <div>
            <h3 className="eyebrow text-accent-bright">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-off-white/75 transition-colors hover:text-accent-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-accent-bright">Get in touch</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={whatsappLink(undefined, settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-off-white/75 transition-colors hover:text-accent-bright"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  {settings.whatsapp_display}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone_href}`}
                  className="flex items-center gap-2 text-sm text-off-white/75 transition-colors hover:text-accent-bright"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {settings.phone_display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-sm text-off-white/75 transition-colors hover:text-accent-bright"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-off-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.name}. {siteConfig.contact.city}, {siteConfig.contact.region}.
          </p>
          <div className="flex items-center gap-4">
            <p>{settings.site_tagline}.</p>
            <Link
              href="/admin"
              prefetch={false}
              aria-label="Staff login"
              className="flex h-7 w-7 items-center justify-center rounded-full text-off-white/30 transition-colors hover:text-accent-bright focus-visible:text-accent-bright"
            >
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
