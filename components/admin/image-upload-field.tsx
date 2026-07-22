"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Loader2, ImageOff, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import type { HeroMediaType } from "@/lib/supabase/types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
// Hero videos autoplay immediately on page load for every visitor — a large
// clip isn't just a slow upload, it's dead weight on every phone that loads
// the homepage afterward. Keep this tight enough that a short, well-compressed
// loop is the only thing that fits.
const MAX_VIDEO_BYTES = 8 * 1024 * 1024;

export function ImageUploadField({
  value,
  mediaType = "image",
  onChange,
  label = "Image",
  accept = "image/*",
}: {
  value: string;
  mediaType?: HeroMediaType;
  onChange: (url: string, mediaType: HeroMediaType) => void;
  label?: string;
  accept?: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uploadLabel = accept.includes("video") ? "Upload photo or video" : "Upload image";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !isVideo) {
      toast.error("Upload failed", { description: "Only image or video files are allowed." });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      toast.error("Upload failed", {
        description: isVideo
          ? "Videos must be smaller than 8MB — keep clips to a few seconds and compress before uploading, since this autoplays for every visitor on the homepage."
          : "Images must be smaller than 5MB.",
      });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      // Uploads straight from the browser to Supabase Storage — skipping our
      // server entirely, since routing a video through a Server Action was
      // slow enough to look hung and could hit serverless time limits.
      const supabase = createClient();
      const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl, isVideo ? "video" : "image");
      toast.success(isVideo ? "Video uploaded" : "Image uploaded");
    } catch (err) {
      toast.error("Upload failed", { description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-off-white">
          {value && mediaType === "video" ? (
            <video src={value} className="h-full w-full object-cover" muted loop autoPlay playsInline />
          ) : value ? (
            <Image src={value} alt="" fill sizes="128px" unoptimized className="object-cover" />
          ) : (
            <ImageOff className="h-5 w-5 text-muted" />
          )}
          {value && !uploading ? (
            // The visible badge stays small to suit the thumbnail, but the
            // button itself keeps a 44px hit area (extending past the badge)
            // so it's still a comfortable touch target.
            <button
              type="button"
              onClick={() => onChange("", mediaType)}
              aria-label="Remove"
              className="absolute -right-2 -top-2 flex h-11 w-11 items-center justify-center [touch-action:manipulation]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-off-white transition-colors hover:bg-ink">
                <X className="h-3 w-3" />
              </span>
            </button>
          ) : null}
        </div>
        <label>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
          <Button asChild variant="outline" size="sm" disabled={uploading}>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : uploadLabel}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
