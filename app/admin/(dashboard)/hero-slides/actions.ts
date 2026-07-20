"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { HeroSlideInsert } from "@/lib/supabase/types";

export async function upsertHeroSlide(id: string | null, values: HeroSlideInsert) {
  await requireUser();
  const supabase = await createClient();

  const { error } = id
    ? await supabase.from("hero_slides").update(values).eq("id", id)
    : await supabase.from("hero_slides").insert(values);

  if (error) return { error: error.message };
  updateTag("hero_slides");
  return {};
}

export async function deleteHeroSlide(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag("hero_slides");
  return {};
}
