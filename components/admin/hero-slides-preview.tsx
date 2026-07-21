"use client";

import { useState } from "react";
import { HeroPeekCarousel } from "@/components/hero-peek-carousel";
import type { HeroSlideRow } from "@/lib/supabase/types";

export function HeroSlidesPreview({ slides }: { slides: HeroSlideRow[] }) {
  const [active, setActive] = useState(0);
  const published = slides.filter((s) => s.published);

  if (published.length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-ink px-6 py-10 sm:py-12">
      <p className="eyebrow text-center text-accent-bright">Live preview</p>
      <p className="mt-1.5 text-center text-sm text-off-white/60">
        How this rotation looks on the homepage right now — click a side thumbnail to preview it.
      </p>
      <HeroPeekCarousel
        slides={published}
        active={Math.min(active, published.length - 1)}
        onSelect={setActive}
        className="mt-8"
      />
    </div>
  );
}
