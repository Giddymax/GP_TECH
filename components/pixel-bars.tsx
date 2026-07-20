import { cn } from "@/lib/utils";

const HEIGHTS = [0.3, 0.55, 0.75, 1, 0.75, 0.55, 0.3];

/**
 * The logo's ascending pixel-bar glyph, reused as a recurring section marker
 * across the site — the one signature motif tying every page back to the
 * mark itself.
 */
export function PixelBars({
  className,
  tone = "accent",
}: {
  className?: string;
  tone?: "accent" | "light";
}) {
  return (
    <div className={cn("flex h-6 items-end gap-1", className)} aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-[2px]",
            tone === "accent" ? "bg-accent" : "bg-white/70",
            i % 3 === 0 && tone === "accent" && "bg-ink",
          )}
          style={{ height: `${h * 100}%`, opacity: 0.45 + h * 0.55 }}
        />
      ))}
    </div>
  );
}
