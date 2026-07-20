import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import { ServiceForm } from "./service-form";
import { deleteService } from "./actions";

export const metadata = { title: "Services" };

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Services</h1>
          <p className="mt-1 text-sm text-muted">The five (or however many) offerings on Home and Services.</p>
        </div>
        <ServiceForm />
      </div>

      <div className="mt-8 grid gap-4">
        {(services ?? []).map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <div
              key={service.id}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light text-accent-dark">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium text-ink">
                  {service.name}
                  {!service.published ? (
                    <span className="rounded-full bg-off-white px-2 py-0.5 text-[11px] text-muted">Unpublished</span>
                  ) : null}
                </p>
                <p className="truncate text-sm text-muted">{service.short_description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <ServiceForm service={service} />
                <ConfirmActionDialog
                  trigger={
                    <Button variant="outline" size="sm" aria-label="Delete service">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title={`Delete "${service.name}"?`}
                  description="It will be removed from Home and the Services page immediately."
                  confirmLabel="Delete"
                  onConfirm={deleteService.bind(null, service.id)}
                  successMessage="Service deleted"
                />
              </div>
            </div>
          );
        })}
        {(services ?? []).length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No services yet.</p>
        ) : null}
      </div>
    </div>
  );
}
