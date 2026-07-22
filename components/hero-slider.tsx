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
import { HeroPeekCarousel } from "@/components/hero-peek-carousel";
import type { HeroSlideRow } from "@/lib/supabase/types";

const AUTOPLAY_MS = 6000;

function SlideBackground({ slide, priority, allowVideo }: { slide: HeroSlideRow; priority: boolean; allowVideo: boolean }) {
  // Hero videos can be several MB and autoplay immediately — on a slow/metered
  // connection (or when the visitor has Data Saver on) that alone can make the
  // whole page feel frozen while it downloads. Fall back to a still image
  // there instead of forcing the video. If there's no separate poster to fall
  // back to, though, show the video anyway — `image_url` on a video slide is
  // the video file itself, not a real image, so it can't be used as one.
  const isVideo = slide.media_type === "video";
  const stillSrc = isVideo ? slide.carousel_image_url : slide.image_url;
  const showVideo = isVideo && (allowVideo || !stillSrc);

  if (showVideo) {
    return (
      <video
        src={slide.image_url}
        poster={slide.carousel_image_url ?? undefined}
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
      src={stillSrc!}
      alt={slide.alt_text}
      fill
      priority={priority}
      sizes="100vw"
      unoptimized
      className="object-cover"
    />
  );
}

export function HeroSlider({
  slides,
  heroLine,
  heroEyebrow,
  heroSubheading,
  heroMicrocopy,
  ctaPrimaryLabel,
  ctaWhatsappLabel,
  whatsappNumber,
}: {
  slides: HeroSlideRow[];
  heroLine: string;
  heroEyebrow: string;
  heroSubheading: string;
  heroMicrocopy: string;
  ctaPrimaryLabel: string;
  ctaWhatsappLabel: string;
  whatsappNumber: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Starts false so the server-rendered HTML never contains a `<video
  // preload="auto" autoPlay>` tag — browsers start fetching that the instant
  // they parse it, before React/hydration ever runs, so checking the
  // connection in an effect can't stop an already-started multi-MB fetch.
  // Starting conservative and upgrading to video after the check runs (or
  // finds no signal, e.g. Safari/iOS) closes that gap.
  const [allowVideo, setAllowVideo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // Network Information API — Chrome/Android only, undefined on Safari/iOS,
    // so it alone can't see iOS's Low Data Mode. Safari does send a
    // `Save-Data` request header when that's on, though, which middleware
    // relays into this cookie — checking both covers both browsers.
    type NetworkInformation = { saveData?: boolean; effectiveType?: string };
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const saveDataCookie = document.cookie.split("; ").some((c) => c === "save-data=1");
    const constrained =
      saveDataCookie || connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    if (!constrained) setAllowVideo(true);
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

  return (
    <div
      className="relative"
      // Touch devices synthesize a `mouseenter` on tap but never fire the
      // matching `mouseleave` (no real pointer to leave with) — pausing here
      // on tap would freeze autoplay forever. `can-hover` gates hover-driven
      // pausing to devices that can actually sustain a hover state.
      onMouseEnter={() => window.matchMedia("(hover: hover) and (pointer: fine)").matches && setPaused(true)}
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
              <SlideBackground slide={slide} priority={i === 0} allowVideo={allowVideo} />
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

      <Container
        className={cn(
          "relative flex flex-col items-center pt-28 text-center sm:pt-36",
          // Extra bottom padding reserves room for the absolutely-positioned
          // peek carousel below, scaled to its height at each breakpoint so
          // it can never overlap the text above it, however tall the text
          // itself ends up being (e.g. buttons stack taller on mobile).
          slides.length > 0 ? "pb-[210px] sm:pb-[340px] lg:pb-[400px]" : "pb-8 sm:pb-12",
        )}
      >
        <Eyebrow className="text-off-white [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
          {heroEyebrow}
        </Eyebrow>
        <h1 className="mt-6 max-w-4xl text-5xl font-light leading-[1.05] text-off-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:text-7xl lg:text-[5.5rem]">
          {heroLine}
        </h1>
        <p className="mt-7 max-w-lg text-base leading-7 text-off-white/70 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-lg">
          {heroSubheading}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">
              {ctaPrimaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a
              href={whatsappLink(whatsappMessages.assessment, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaWhatsappLabel}
            </a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-off-white/50 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          {heroMicrocopy}
        </p>
      </Container>

      <HeroPeekCarousel
        slides={slides}
        active={active}
        onSelect={setActive}
        variant="bleed"
        className="absolute inset-x-0 bottom-0"
      />
    </div>
  );
}
