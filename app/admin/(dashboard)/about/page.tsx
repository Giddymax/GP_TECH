import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import { AboutSettingsForm } from "./about-settings-form";
import { ContentItemForm } from "./content-item-form";
import { deleteContentItem } from "./actions";
import type { ContentItemRow, ContentItemSection, SiteSettingsRow } from "@/lib/supabase/types";

export const metadata = { title: "About" };

function ItemsList({ items, section }: { items: ContentItemRow[]; section: ContentItemSection }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <div key={item.id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-light text-accent-dark">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <p className="truncate text-xs text-muted">{item.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <ContentItemForm section={section} item={item} />
              <ConfirmActionDialog
                trigger={
                  <Button variant="outline" size="sm" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
                title={`Delete "${item.title}"?`}
                description="It will be removed from the site immediately."
                confirmLabel="Delete"
                onConfirm={() => deleteContentItem(item.id, section)}
                successMessage="Deleted"
              />
            </div>
          </div>
        );
      })}
      {items.length === 0 ? <p className="py-4 text-center text-sm text-muted">Nothing here yet.</p> : null}
    </div>
  );
}

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const [{ data: values }, { data: steps }, { data: settingsData }] = await Promise.all([
    supabase.from("content_items").select("*").eq("section", "about_values").order("sort_order", { ascending: true }),
    supabase.from("content_items").select("*").eq("section", "how_it_works").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">About</h1>
        <p className="mt-1 text-sm text-muted">The About page&apos;s story and founder, plus repeating cards used on About and Home.</p>
      </div>

      <AboutSettingsForm settings={settingsData as SiteSettingsRow} />

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Why us (About page)</h2>
          <ContentItemForm section="about_values" addLabel="Add value" />
        </div>
        <div className="mt-4">
          <ItemsList items={values ?? []} section="about_values" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">How it works (Home page)</h2>
          <ContentItemForm section="how_it_works" addLabel="Add step" />
        </div>
        <div className="mt-4">
          <ItemsList items={steps ?? []} section="how_it_works" />
        </div>
      </div>
    </div>
  );
}
