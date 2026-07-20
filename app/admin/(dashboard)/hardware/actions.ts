"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { HardwareItemInsert } from "@/lib/supabase/types";

export async function upsertHardwareItem(id: string | null, values: HardwareItemInsert) {
  await requireUser();
  const supabase = await createClient();

  const { error } = id
    ? await supabase.from("hardware_items").update(values).eq("id", id)
    : await supabase.from("hardware_items").insert(values);

  if (error) return { error: error.message };
  updateTag("hardware_items");
  return {};
}

export async function deleteHardwareItem(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("hardware_items").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag("hardware_items");
  return {};
}
