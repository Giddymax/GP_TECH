"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlideRow } from "@/lib/supabase/types";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlideRow[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return;

    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, paused, reducedMotion]);

  if (slides.length === 0) return null;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            i === active ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== active}
        >
          {slide.media_type === "video" ? (
            <video
              src={slide.image_url}
              aria-label={slide.alt_text}
              className="h-full w-full object-cover mix-blend-luminosity"
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "none"}
            />
          ) : (
            <Image
              src={slide.image_url}
              alt={slide.alt_text}
              fill
              priority={i === 0}
              sizes="100vw"
              unoptimized
              className="object-cover mix-blend-luminosity"
            />
          )}
        </div>
      ))}

      {/* Brand-tinted + darkening overlay so hero text stays legible over any photo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(19,36,46,0.75) 0%, rgba(19,36,46,0.88) 60%, rgba(19,36,46,0.96) 100%)",
        }}
      />

      {slides.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-8">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300",
                i === active ? "w-6 bg-accent-bright" : "w-1.5 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
