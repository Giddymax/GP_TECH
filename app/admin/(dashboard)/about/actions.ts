"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { ContentItemInsert, SiteSettingsUpdate } from "@/lib/supabase/types";

export async function upsertContentItem(id: string | null, values: ContentItemInsert) {
  await requireUser();
  const supabase = await createClient();

  const { error } = id
    ? await supabase.from("content_items").update(values).eq("id", id)
    : await supabase.from("content_items").insert(values);

  if (error) return { error: error.message };
  updateTag(`content_items:${values.section}`);
  return {};
}

export async function deleteContentItem(id: string, section: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag(`content_items:${section}`);
  return {};
}

export async function updateAboutSettings(values: SiteSettingsUpdate) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(values).eq("id", true);
  if (error) return { error: error.message };
  updateTag("site_settings");
  return {};
}
