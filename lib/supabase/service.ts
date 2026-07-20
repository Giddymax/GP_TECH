import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client for the one server-only write this site makes
 * (inserting a lead from the contact Server Action). Bypasses RLS, so it
 * must never be imported from client code — the `leads` table has no anon
 * insert/select policy at all, by design.
 */
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
