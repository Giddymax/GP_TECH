import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import { HardwareForm } from "./hardware-form";
import { deleteHardwareItem } from "./actions";

export const metadata = { title: "Hardware" };

export default async function HardwareAdminPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("hardware_items").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Hardware</h1>
          <p className="mt-1 text-sm text-muted">Equipment categories shown on the Hardware page.</p>
        </div>
        <HardwareForm />
      </div>

      <div className="mt-8 grid gap-4">
        {(items ?? []).map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light text-accent-dark">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium text-ink">
                  {item.title}
                  {!item.published ? (
                    <span className="rounded-full bg-off-white px-2 py-0.5 text-[11px] text-muted">Unpublished</span>
                  ) : null}
                </p>
                <p className="truncate text-sm text-muted">{item.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <HardwareForm item={item} />
                <ConfirmActionDialog
                  trigger={
                    <Button variant="outline" size="sm" aria-label="Delete item">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title={`Delete "${item.title}"?`}
                  description="It will be removed from the Hardware page immediately."
                  confirmLabel="Delete"
                  onConfirm={() => deleteHardwareItem(item.id)}
                  successMessage="Item deleted"
                />
              </div>
            </div>
          );
        })}
        {(items ?? []).length === 0 ? <p className="py-10 text-center text-sm text-muted">No hardware items yet.</p> : null}
      </div>
    </div>
  );
}
