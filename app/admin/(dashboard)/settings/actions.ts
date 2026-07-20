"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { SiteSettingsUpdate } from "@/lib/supabase/types";

export async function updateSiteSettings(values: SiteSettingsUpdate) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(values).eq("id", true);
  if (error) return { error: error.message };
  updateTag("site_settings");
  return {};
}
