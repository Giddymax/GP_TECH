"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { ServiceInsert } from "@/lib/supabase/types";

export async function upsertService(id: string | null, values: ServiceInsert) {
  await requireUser();
  const supabase = await createClient();

  const { error } = id
    ? await supabase.from("services").update(values).eq("id", id)
    : await supabase.from("services").insert(values);

  if (error) return { error: error.message };
  updateTag("services");
  return {};
}

export async function deleteService(id: string) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  updateTag("services");
  return {};
}
