import Image from "next/image";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { HeroSlidesPreview } from "@/components/admin/hero-slides-preview";
import { Button } from "@/components/ui/button";
import { SlideForm } from "./slide-form";
import { deleteHeroSlide } from "./actions";

export const metadata = { title: "Hero Slides" };

export default async function HeroSlidesPage() {
  const supabase = await createClient();
  const { data: slides } = await supabase.from("hero_slides").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Hero Slides</h1>
          <p className="mt-1 text-sm text-muted">Photos or short videos that rotate on the homepage hero.</p>
        </div>
        <SlideForm />
      </div>

      <div className="mt-8">
        <HeroSlidesPreview slides={slides ?? []} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(slides ?? []).map((slide) => (
          <div key={slide.id} className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="relative aspect-video bg-off-white">
              {slide.media_type === "video" ? (
                <video
                  src={slide.image_url}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <Image src={slide.image_url} alt={slide.alt_text} fill sizes="400px" unoptimized className="object-cover" />
              )}
              {!slide.published ? (
                <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-off-white">
                  Unpublished
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{slide.alt_text}</p>
                <p className="text-xs text-muted">Order {slide.sort_order}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <SlideForm slide={slide} />
                <ConfirmActionDialog
                  trigger={
                    <Button variant="outline" size="sm" aria-label="Delete slide">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title="Delete this slide?"
                  description="It will stop appearing in the homepage rotation immediately."
                  confirmLabel="Delete"
                  onConfirm={deleteHeroSlide.bind(null, slide.id)}
                  successMessage="Slide deleted"
                />
              </div>
            </div>
          </div>
        ))}
        {(slides ?? []).length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-muted">
            No slides yet — the homepage hero shows a plain background until you add one.
          </p>
        ) : null}
      </div>
    </div>
  );
}
