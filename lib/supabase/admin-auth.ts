import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string | null;
};

/**
 * There's a single admin account for this site — no roles/profiles table.
 * proxy.ts already redirects unauthenticated visitors away from /admin, but
 * every admin page still calls this (rather than trusting the request)
 * since proxy.ts guards routes, not Server Actions invoked from them.
 */
export async function requireUser(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { id: user.id, email: user.email ?? null };
}
