"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, Loader2, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/actions/upload-image";

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
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
    } else if (result.url) {
      onChange(result.url);
      toast.success("Image uploaded");
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-off-white">
          {value ? (
            <Image src={value} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <ImageOff className="h-5 w-5 text-muted" />
          )}
        </div>
        <label>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
          <Button asChild variant="outline" size="sm" disabled={uploading}>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : "Upload image"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
