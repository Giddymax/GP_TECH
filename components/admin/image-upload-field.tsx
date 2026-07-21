"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Loader2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/actions/upload-image";
import type { HeroMediaType } from "@/lib/supabase/types";

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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    setUploading(false);
    if (result.error) {
      toast.error("Upload failed", { description: result.error });
    } else if (result.url && result.mediaType) {
      onChange(result.url, result.mediaType);
      toast.success(result.mediaType === "video" ? "Video uploaded" : "Image uploaded");
    }
    if (inputRef.current) inputRef.current.value = "";
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
              {uploading ? "Uploading…" : "Upload photo or video"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
