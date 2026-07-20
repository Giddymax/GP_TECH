"use server";

import { render } from "@react-email/components";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
import { createServiceClient } from "@/lib/supabase/service";
import { getResend, EMAIL_FROM, EMAIL_NOTIFY_TO } from "@/lib/email/resend";
import { LeadNotificationEmail } from "@/lib/email/templates/lead-notification";
import { organisationTypes, serviceInterestOptions } from "@/lib/constants";
import type { LeadActionState } from "@/lib/lead-action-state";

function labelFor(value: string, options: readonly { value: string; label: string }[]) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export async function submitLead(
  _prevState: LeadActionState,
  values: LeadFormValues,
): Promise<LeadActionState> {
  const parsed = leadFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the form for errors and try again.",
    };
  }

  const { name, phone, email, organisationType, serviceInterest, message } = parsed.data;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      email: email || null,
      organisation_type: organisationType,
      service_interest: serviceInterest,
      message: message || null,
    });
    if (error) throw error;
  } catch (dbError) {
    // Covers both a Supabase query error and a misconfigured/missing
    // client (e.g. env vars not set yet) — either way, the visitor should
    // see a friendly fallback rather than an unhandled error boundary.
    console.error("Failed to save lead:", dbError);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again, or reach us directly on WhatsApp.",
    };
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const html = await render(
        LeadNotificationEmail({
          name,
          phone,
          email: email || undefined,
          organisationType: labelFor(organisationType, organisationTypes.map((t) => ({ value: t, label: t }))),
          serviceInterest: labelFor(serviceInterest, serviceInterestOptions),
          message: message || undefined,
        }),
      );
      await getResend().emails.send({
        from: EMAIL_FROM,
        to: EMAIL_NOTIFY_TO,
        subject: `New lead: ${name}`,
        html,
      });
    } catch (emailError) {
      // The lead is already saved — a failed notification email should never
      // surface as a failure to the person who just submitted the form.
      console.error("Failed to send lead notification email:", emailError);
    }
  }

  return {
    status: "success",
    message: "Thanks! We'll call or WhatsApp you within one working day.",
  };
}
