"use client";

import * as React from "react";
import { Loader2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconSelect } from "@/components/admin/icon-select";
import { upsertContentItem } from "./actions";
import type { ContentItemRow, ContentItemSection } from "@/lib/supabase/types";

export function ContentItemForm({
  section,
  item,
  addLabel = "Add",
}: {
  section: ContentItemSection;
  item?: ContentItemRow;
  addLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [title, setTitle] = React.useState(item?.title ?? "");
  const [description, setDescription] = React.useState(item?.description ?? "");
  const [icon, setIcon] = React.useState(item?.icon ?? "Sparkles");
  const [sortOrder, setSortOrder] = React.useState(item?.sort_order ?? 0);
  const [published, setPublished] = React.useState(item?.published ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const result = await upsertContentItem(item?.id ?? null, {
      section,
      title,
      description,
      icon,
      sort_order: sortOrder,
      published,
    });
    setPending(false);
    if (result.error) {
      toast.error("Something went wrong", { description: result.error });
    } else {
      toast.success(item ? "Updated" : "Added");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            {addLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{item ? "Edit" : addLabel}</DialogTitle>
        <DialogDescription>
          {section === "about_values" ? "One of the three cards under Why us." : "One step in How it works on Home."}
        </DialogDescription>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
          <div>
            <Label htmlFor={`ci-title-${section}`}>Title</Label>
            <Input id={`ci-title-${section}`} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor={`ci-desc-${section}`}>Description</Label>
            <Textarea
              id={`ci-desc-${section}`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label>Icon</Label>
              <IconSelect value={icon} onChange={setIcon} />
            </div>
            <div>
              <Label htmlFor={`ci-order-${section}`}>Order</Label>
              <Input
                id={`ci-order-${section}`}
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-accent"
            />
            Published
          </label>
          <Button type="submit" disabled={pending} className="mt-1">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
