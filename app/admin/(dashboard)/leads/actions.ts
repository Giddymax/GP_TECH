"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/admin-auth";
import type { LeadStatus } from "@/lib/supabase/types";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return {};
}
