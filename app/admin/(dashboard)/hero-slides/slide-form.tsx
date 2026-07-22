"use client";

import * as React from "react";
import { Loader2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { upsertHeroSlide } from "./actions";
import type { HeroSlideRow, HeroMediaType } from "@/lib/supabase/types";

export function SlideForm({ slide }: { slide?: HeroSlideRow }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(slide?.image_url ?? "");
  const [mediaType, setMediaType] = React.useState<HeroMediaType>(slide?.media_type ?? "image");
  const [carouselImageUrl, setCarouselImageUrl] = React.useState(slide?.carousel_image_url ?? "");
  const [altText, setAltText] = React.useState(slide?.alt_text ?? "Grainy Palace Tech");
  const [sortOrder, setSortOrder] = React.useState(slide?.sort_order ?? 0);
  const [published, setPublished] = React.useState(slide?.published ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Upload a photo or video first");
      return;
    }
    setPending(true);
    const result = await upsertHeroSlide(slide?.id ?? null, {
      image_url: imageUrl,
      media_type: mediaType,
      carousel_image_url: carouselImageUrl || null,
      alt_text: altText,
      sort_order: sortOrder,
      published,
    });
    setPending(false);
    if (result.error) {
      toast.error("Something went wrong", { description: result.error });
    } else {
      toast.success(slide ? "Slide updated" : "Slide added");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {slide ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            Add slide
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{slide ? "Edit slide" : "Add slide"}</DialogTitle>
        <DialogDescription>Photos or short video clips rotate on the homepage hero in sort order.</DialogDescription>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
          <ImageUploadField
            value={imageUrl}
            mediaType={mediaType}
            onChange={(url, type) => {
              setImageUrl(url);
              setMediaType(type);
            }}
            accept="image/*,video/*"
            label="Photo or video"
          />
          <ImageUploadField
            value={carouselImageUrl}
            onChange={(url) => setCarouselImageUrl(url)}
            accept="image/*"
            label="Carousel image (optional)"
          />
          <p className="-mt-3 text-xs text-muted">
            Shown in the small preview row instead of the photo/video above — handy for videos, since
            otherwise the preview just freezes on the first frame. Leave blank to reuse the photo/video above.
          </p>
          <div>
            <Label htmlFor="alt-text">Alt text (describes the photo or video)</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Staff setting up a POS terminal"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sort-order">Order</Label>
              <Input
                id="sort-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-line accent-accent"
                />
                Published
              </label>
            </div>
          </div>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {slide ? "Save changes" : "Add slide"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
