"use client";

import * as React from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateLeadStatus } from "./actions";
import type { LeadStatus } from "@/lib/supabase/types";

const statuses: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [value, setValue] = React.useState(status);
  const [pending, startTransition] = React.useTransition();

  const handleChange = (next: string) => {
    const nextStatus = next as LeadStatus;
    setValue(nextStatus);
    startTransition(async () => {
      const result = await updateLeadStatus(id, nextStatus);
      if (result.error) {
        toast.error("Couldn't update status", { description: result.error });
        setValue(status);
      }
    });
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="h-9 w-[130px] text-[13px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
