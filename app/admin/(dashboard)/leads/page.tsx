import { Phone, MessageCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeadStatusSelect } from "./lead-status-select";
import { whatsappLink } from "@/lib/constants";

export const metadata = { title: "Leads" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** wa.me needs a full international number — leads are stored in local "0…" or "+233…" format. */
function toWhatsappNumber(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
}

export default async function LeadsAdminPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Leads</h1>
      <p className="mt-1 text-sm text-muted">Everyone who&apos;s submitted the contact form, newest first.</p>

      <div className="mt-8 grid gap-4">
        {(leads ?? []).map((lead) => (
          <div key={lead.id} className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{lead.name}</p>
                <p className="text-xs text-muted">
                  {formatDate(lead.created_at)}
                  {lead.organisation_type ? ` · ${lead.organisation_type}` : ""}
                  {lead.service_interest ? ` · ${lead.service_interest}` : ""}
                </p>
              </div>
              <LeadStatusSelect id={lead.id} status={lead.status} />
            </div>
            {lead.message ? <p className="mt-3 text-sm leading-6 text-ink/85">{lead.message}</p> : null}
            <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-3 text-sm">
              <a
                href={whatsappLink(`Hi ${lead.name}, this is Grainy Palace Tech following up on your enquiry.`, toWhatsappNumber(lead.phone))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-medium text-accent-dark hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 font-medium text-accent-dark hover:underline">
                <Phone className="h-4 w-4" />
                {lead.phone}
              </a>
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 font-medium text-accent-dark hover:underline">
                  <Mail className="h-4 w-4" />
                  {lead.email}
                </a>
              ) : null}
            </div>
          </div>
        ))}
        {(leads ?? []).length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No leads yet — they&apos;ll show up here as visitors submit the contact form.</p>
        ) : null}
      </div>
    </div>
  );
}
