"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";

const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const user = await requireUser();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Images must be smaller than 5MB." };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}
