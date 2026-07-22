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
import { upsertService } from "./actions";
import type { ServiceRow } from "@/lib/supabase/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServiceForm({ service }: { service?: ServiceRow }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [name, setName] = React.useState(service?.name ?? "");
  const [slug, setSlug] = React.useState(service?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(!!service);
  const [shortDescription, setShortDescription] = React.useState(service?.short_description ?? "");
  const [description, setDescription] = React.useState(service?.description ?? "");
  const [includes, setIncludes] = React.useState((service?.includes ?? []).join("\n"));
  const [icon, setIcon] = React.useState(service?.icon ?? "Sparkles");
  const [sortOrder, setSortOrder] = React.useState(service?.sort_order ?? 0);
  const [published, setPublished] = React.useState(service?.published ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const result = await upsertService(service?.id ?? null, {
      name,
      slug: slug || slugify(name),
      short_description: shortDescription,
      description,
      includes: includes
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      icon,
      sort_order: sortOrder,
      published,
    });
    setPending(false);
    if (result.error) {
      toast.error("Something went wrong", { description: result.error });
    } else {
      toast.success(service ? "Service updated" : "Service added");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {service ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{service ? "Edit service" : "Add service"}</DialogTitle>
        <DialogDescription>Shown on the Home services strip and the Services page.</DialogDescription>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="svc-name">Name</Label>
              <Input
                id="svc-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugEdited) setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="svc-slug">Slug</Label>
              <Input
                id="svc-slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="svc-short">Short description (used in cards)</Label>
            <Input
              id="svc-short"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="svc-desc">Full description</Label>
            <Textarea
              id="svc-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="svc-includes">What&apos;s included (one per line)</Label>
            <Textarea
              id="svc-includes"
              rows={4}
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label>Icon</Label>
              <IconSelect value={icon} onChange={setIcon} />
            </div>
            <div>
              <Label htmlFor="svc-order">Order</Label>
              <Input
                id="svc-order"
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
            {service ? "Save changes" : "Add service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
