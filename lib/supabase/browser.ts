import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Client-side Supabase client, sharing the same session cookies the SSR
 * server client sets on login. Used for direct browser-to-Storage uploads
 * (large files, e.g. hero videos) so they skip our server entirely instead
 * of round-tripping through a Server Action, which is slow and can hit
 * serverless execution-time limits for anything video-sized.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
