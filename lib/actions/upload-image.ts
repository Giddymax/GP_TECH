"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { HeroMediaType } from "@/lib/supabase/types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

export async function uploadImage(
  formData: FormData,
): Promise<{ url?: string; mediaType?: HeroMediaType; error?: string }> {
  const user = await requireUser();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isImage && !isVideo) {
    return { error: "Only image or video files are allowed." };
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return {
      error: isVideo ? "Videos must be smaller than 20MB — keep clips short." : "Images must be smaller than 5MB.",
    };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl, mediaType: isVideo ? "video" : "image" };
}
