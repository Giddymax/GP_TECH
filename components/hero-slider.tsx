"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";
import { whatsappLink, whatsappMessages } from "@/lib/constants";
import type { HeroSlideRow } from "@/lib/supabase/types";

const AUTOPLAY_MS = 6000;

function SlideBackground({ slide, priority }: { slide: HeroSlideRow; priority: boolean }) {
  if (slide.media_type === "video") {
    return (
      <video
        src={slide.image_url}
        aria-label={slide.alt_text}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "none"}
      />
    );
  }
  return (
    <Image
      src={slide.image_url}
      alt={slide.alt_text}
      fill
      priority={priority}
      sizes="100vw"
      unoptimized
      className="object-cover"
    />
  );
}

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

export function HeroSlider({
  slides,
  heroLine,
  whatsappNumber,
}: {
  slides: HeroSlideRow[];
  heroLine: string;
  whatsappNumber: string;
}) {
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

  const prevIndex = (active - 1 + slides.length) % slides.length;
  const nextIndex = (active + 1) % slides.length;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.length > 0 ? (
        <div className="absolute inset-0">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                i === active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={i !== active}
            >
              <SlideBackground slide={slide} priority={i === 0} />
            </div>
          ))}

          {/* Flat, moderate scrim so the text column stays readable everywhere it might
              land without a gradient "bright spot" that could sit right behind it */}
          <div className="pointer-events-none absolute inset-0 bg-ink/45" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(43,179,185,0.25), transparent 45%), radial-gradient(circle at 85% 0%, rgba(0,86,114,0.5), transparent 50%)",
          }}
        />
      )}

      <Container className="relative flex flex-col items-center py-28 text-center sm:py-36">
        <Eyebrow className="text-accent-bright [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
          Accra — for shops, farms, schools, clinics, churches &amp; offices
        </Eyebrow>
        <h1 className="mt-6 max-w-4xl text-5xl font-light leading-[1.05] text-off-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:text-7xl lg:text-[5.5rem]">
          {heroLine}
        </h1>
        <p className="mt-7 max-w-lg text-base leading-7 text-off-white/70 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-lg">
          Websites, records &amp; receipts, business equipment, and IT support —
          set up in person by a team that comes to you.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">
              Get a free assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a
              href={whatsappLink(whatsappMessages.assessment, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-off-white/50 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          No jargon. No trip to an office.
        </p>

        {slides.length > 0 ? (
          <div className="mt-10 flex items-center justify-center sm:mt-12">
            {slides.length > 1 ? (
              <button
                type="button"
                onClick={() => setActive(prevIndex)}
                aria-label="Show previous slide"
                className="relative h-20 w-14 shrink-0 overflow-hidden rounded-l-2xl opacity-50 shadow-card transition-opacity duration-300 hover:opacity-80 sm:h-28 sm:w-20"
              >
                <div className="absolute inset-y-0 right-0 w-32 sm:w-44">
                  <SlideThumb slide={slides[prevIndex]} />
                </div>
              </button>
            ) : null}

            <div className="relative z-10 h-20 w-32 shrink-0 overflow-hidden rounded-2xl shadow-card-hover ring-1 ring-white/20 sm:h-28 sm:w-44">
              <SlideThumb slide={slides[active]} />
            </div>

            {slides.length > 1 ? (
              <button
                type="button"
                onClick={() => setActive(nextIndex)}
                aria-label="Show next slide"
                className="relative h-20 w-14 shrink-0 overflow-hidden rounded-r-2xl opacity-50 shadow-card transition-opacity duration-300 hover:opacity-80 sm:h-28 sm:w-20"
              >
                <div className="absolute inset-y-0 left-0 w-32 sm:w-44">
                  <SlideThumb slide={slides[nextIndex]} />
                </div>
              </button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </div>
  );
}
