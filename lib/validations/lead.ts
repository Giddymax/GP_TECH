import { z } from "zod";

/** Accepts Ghana numbers like +233201234567, 0201234567, or 233 20 123 4567. */
export const ghanaPhoneRegex = /^(?:\+233|0)[2-5]\d{8}$/;

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(ghanaPhoneRegex, "Enter a valid Ghana number, e.g. 024 123 4567 or +233241234567"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  organisationType: z.string().trim().min(1, "Select your organisation type"),
  serviceInterest: z.string().trim().min(1, "Select what you need help with"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
