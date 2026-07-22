"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlideRow } from "@/lib/supabase/types";

/**
 * Static preview used in the thumbnail strip. Prefers a dedicated carousel
 * image if one's set (staff upload it separately, since a video's first
 * frame often isn't a great thumbnail); otherwise falls back to the slide's
 * own media — a video's first frame, or the image itself.
 */
function SlideThumb({ slide }: { slide: HeroSlideRow }) {
  if (slide.carousel_image_url) {
    return <Image src={slide.carousel_image_url} alt={slide.alt_text} fill unoptimized className="object-cover" />;
  }
  if (slide.media_type === "video") {
    return (
      <video
        src={slide.image_url}
        aria-label={slide.alt_text}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
      />
    );
  }
  return <Image src={slide.image_url} alt={slide.alt_text} fill unoptimized className="object-cover" />;
}

const SIZES = {
  /** Compact, fully-contained row — used in the admin preview panel. */
  inline: {
    wrap: "flex items-center justify-center",
    side: "relative h-28 w-24 shrink-0 overflow-hidden rounded-l-2xl opacity-50 shadow-card transition-opacity duration-300 hover:opacity-80 sm:h-44 sm:w-36",
    sideRight: "rounded-l-none rounded-r-2xl",
    sideInner: "absolute inset-y-0 w-48 sm:w-72",
    center: "relative z-10 h-28 w-48 shrink-0 overflow-hidden rounded-2xl shadow-card-hover ring-1 ring-white/20 sm:h-44 sm:w-72",
  },
  /** Large, bottom-anchored row that bleeds past the hero's edge — the public homepage look. */
  bleed: {
    // Sized to fit inside the narrowest phone viewports (the hero section
    // clips overflow, so anything wider than the screen isn't just
    // cropped visually — it's un-tappable too). Widens back out from `sm:` up.
    wrap: "flex items-end justify-center gap-2 sm:gap-4",
    // z-[45] sits above the fixed WhatsApp bubble (z-40, so it can't steal
    // taps meant for the right-hand thumbnail) but below the header (z-50) —
    // it must never be able to cover the nav/menu once the page is scrolled
    // enough that the two happen to overlap on screen.
    side: "relative z-[45] h-32 w-11 shrink-0 translate-y-5 overflow-hidden rounded-t-2xl opacity-55 shadow-card transition-opacity duration-300 hover:opacity-85 sm:h-56 sm:w-48 sm:translate-y-10 lg:h-64 lg:w-56",
    sideRight: "",
    sideInner: "absolute inset-y-0 w-48 sm:w-96 lg:w-[26rem]",
    center: "relative z-10 h-40 w-48 shrink-0 overflow-hidden rounded-t-2xl shadow-card-hover ring-1 ring-white/20 sm:h-72 sm:w-96 lg:h-80 lg:w-[26rem]",
  },
} as const;

/**
 * Center thumbnail for the active slide, with the previous/next slides
 * cropped to exactly their inner half peeking on either side. Shared between
 * the public Home hero and the admin Hero Slides preview so the two can
 * never drift out of sync.
 */
export function HeroPeekCarousel({
  slides,
  active,
  onSelect,
  className,
  variant = "inline",
}: {
  slides: HeroSlideRow[];
  active: number;
  onSelect: (index: number) => void;
  className?: string;
  variant?: "inline" | "bleed";
}) {
  if (slides.length === 0) return null;

  const s = SIZES[variant];
  const prevIndex = (active - 1 + slides.length) % slides.length;
  const nextIndex = (active + 1) % slides.length;

  return (
    <div className={cn(s.wrap, className)}>
      {slides.length > 1 ? (
        <button
          type="button"
          onClick={() => onSelect(prevIndex)}
          aria-label="Show previous slide"
          className={s.side}
        >
          <div className={cn(s.sideInner, "right-0")}>
            <SlideThumb slide={slides[prevIndex]} />
          </div>
        </button>
      ) : null}

      <div className={s.center}>
        <SlideThumb slide={slides[active]} />
      </div>

      {slides.length > 1 ? (
        <button
          type="button"
          onClick={() => onSelect(nextIndex)}
          aria-label="Show next slide"
          className={cn(s.side, s.sideRight)}
        >
          <div className={cn(s.sideInner, "left-0")}>
            <SlideThumb slide={slides[nextIndex]} />
          </div>
        </button>
      ) : null}
    </div>
  );
}
