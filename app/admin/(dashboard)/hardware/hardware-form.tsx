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
import { upsertHardwareItem } from "./actions";
import type { HardwareItemRow } from "@/lib/supabase/types";

export function HardwareForm({ item }: { item?: HardwareItemRow }) {
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
    const result = await upsertHardwareItem(item?.id ?? null, {
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
      toast.success(item ? "Item updated" : "Item added");
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
          <Button>
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{item ? "Edit hardware item" : "Add hardware item"}</DialogTitle>
        <DialogDescription>Shown on the Hardware page.</DialogDescription>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
          <div>
            <Label htmlFor="hw-title">Title</Label>
            <Input id="hw-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="hw-desc">Description</Label>
            <Textarea
              id="hw-desc"
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
              <Label htmlFor="hw-order">Order</Label>
              <Input
                id="hw-order"
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
            {item ? "Save changes" : "Add item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
