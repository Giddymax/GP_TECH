"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateAboutSettings } from "./actions";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export function AboutSettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [pending, setPending] = React.useState(false);
  const [aboutHeading, setAboutHeading] = React.useState(settings.about_heading);
  const [aboutStory, setAboutStory] = React.useState(settings.about_story.join("\n\n"));
  const [founderName, setFounderName] = React.useState(settings.founder_name);
  const [founderRole, setFounderRole] = React.useState(settings.founder_role);
  const [founderBlurb, setFounderBlurb] = React.useState(settings.founder_blurb);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const result = await updateAboutSettings({
      about_heading: aboutHeading,
      about_story: aboutStory
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      founder_name: founderName,
      founder_role: founderRole,
      founder_blurb: founderBlurb,
    });
    setPending(false);
    if (result.error) {
      toast.error("Something went wrong", { description: result.error });
    } else {
      toast.success("About page updated");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-line bg-white p-6 shadow-card">
      <div>
        <Label htmlFor="about-heading">Hero heading</Label>
        <Input id="about-heading" value={aboutHeading} onChange={(e) => setAboutHeading(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="about-story">
          Story (separate paragraphs with a blank line)
        </Label>
        <Textarea id="about-story" rows={6} value={aboutStory} onChange={(e) => setAboutStory(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="founder-name">Founder name</Label>
          <Input id="founder-name" value={founderName} onChange={(e) => setFounderName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="founder-role">Founder role</Label>
          <Input id="founder-role" value={founderRole} onChange={(e) => setFounderRole(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="founder-blurb">Founder blurb</Label>
        <Textarea id="founder-blurb" rows={3} value={founderBlurb} onChange={(e) => setFounderBlurb(e.target.value)} />
      </div>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save changes
      </Button>
    </form>
  );
}
