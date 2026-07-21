"use client";

import Image from "next/image";
import type { HeroSlideRow } from "@/lib/supabase/types";

/** Static preview used in the thumbnail strip — video slides show their first frame, not a playing loop. */
function SlideThumb({ slide }: { slide: HeroSlideRow }) {
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
}: {
  slides: HeroSlideRow[];
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  if (slides.length === 0) return null;

  const prevIndex = (active - 1 + slides.length) % slides.length;
  const nextIndex = (active + 1) % slides.length;

  return (
    <div className={className ? `flex items-center justify-center ${className}` : "flex items-center justify-center"}>
      {slides.length > 1 ? (
        <button
          type="button"
          onClick={() => onSelect(prevIndex)}
          aria-label="Show previous slide"
          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-l-2xl opacity-50 shadow-card transition-opacity duration-300 hover:opacity-80 sm:h-44 sm:w-36"
        >
          <div className="absolute inset-y-0 right-0 w-48 sm:w-72">
            <SlideThumb slide={slides[prevIndex]} />
          </div>
        </button>
      ) : null}

      <div className="relative z-10 h-28 w-48 shrink-0 overflow-hidden rounded-2xl shadow-card-hover ring-1 ring-white/20 sm:h-44 sm:w-72">
        <SlideThumb slide={slides[active]} />
      </div>

      {slides.length > 1 ? (
        <button
          type="button"
          onClick={() => onSelect(nextIndex)}
          aria-label="Show next slide"
          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-r-2xl opacity-50 shadow-card transition-opacity duration-300 hover:opacity-80 sm:h-44 sm:w-36"
        >
          <div className="absolute inset-y-0 left-0 w-48 sm:w-72">
            <SlideThumb slide={slides[nextIndex]} />
          </div>
        </button>
      ) : null}
    </div>
  );
}
