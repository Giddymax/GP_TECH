import { Resend } from "resend";

let client: Resend | null = null;

/** Lazily instantiated so builds without RESEND_API_KEY (e.g. CI) don't crash on import. */
export function getResend() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Grainy Palace Tech <admin@grainypalacetech.com>";
export const EMAIL_NOTIFY_TO = process.env.EMAIL_NOTIFY_TO ?? "admin@grainypalacetech.com";
