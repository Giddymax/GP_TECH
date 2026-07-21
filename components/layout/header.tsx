"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export function Header({ settings }: { settings: SiteSettingsRow }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-md transition-[opacity,transform] duration-300 ease-out",
        // Hidden until hovered — only on devices with a real mouse. Touch
        // devices (no reliable hover) keep it always visible; the mobile
        // menu being open also forces it visible so it can't vanish out
        // from under an open dropdown.
        !open && "can-hover:-translate-y-3 can-hover:opacity-0 can-hover:hover:translate-y-0 can-hover:hover:opacity-100",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/lockup-horizontal-white.png"
            alt="Grainy Palace Tech"
            width={198}
            height={48}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-off-white/75 transition-colors hover:text-accent-bright",
                pathname === link.href && "text-accent-bright",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${settings.phone_href}`}
            className="flex items-center gap-1.5 text-sm font-medium text-off-white/75 transition-colors hover:text-accent-bright"
          >
            <Phone className="h-4 w-4" />
            {settings.phone_display}
          </a>
          <Button asChild size="sm">
            <Link href="/contact">Get a free assessment</Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-off-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-ink px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium text-off-white/80 transition-colors hover:bg-white/5",
                  pathname === link.href && "bg-white/10 text-accent-bright",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={`tel:${settings.phone_href}`}
              className="flex items-center gap-2 text-sm font-medium text-off-white/75"
            >
              <Phone className="h-4 w-4" />
              {settings.phone_display}
            </a>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/contact">Get a free assessment</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
