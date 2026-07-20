export type LeadActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialLeadActionState: LeadActionState = { status: "idle", message: "" };
