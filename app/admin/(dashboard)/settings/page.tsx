import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export const metadata = { title: "Settings" };

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted">Contact details, hours, and site-wide copy.</p>
      <div className="mt-8 max-w-2xl">
        <SettingsForm settings={settings as SiteSettingsRow} />
      </div>
    </div>
  );
}
