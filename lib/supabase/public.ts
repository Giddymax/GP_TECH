import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Stateless anon-key client for public content reads (lib/data/public.ts).
 * Deliberately doesn't touch cookies() like lib/supabase/server.ts does, so
 * pages that only read published content can stay cacheable instead of being
 * forced dynamic on every request.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
