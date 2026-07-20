"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSettings } from "./actions";
import type { SiteSettingsRow } from "@/lib/supabase/types";

function hoursToText(hours: SiteSettingsRow["hours"]) {
  return hours.map((h) => `${h.day} | ${h.time}`).join("\n");
}

function parseHours(text: string): SiteSettingsRow["hours"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, time] = line.split("|").map((s) => s.trim());
      return { day: day || "", time: time || "" };
    });
}

export function SettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [pending, setPending] = React.useState(false);
  const [phoneDisplay, setPhoneDisplay] = React.useState(settings.phone_display);
  const [phoneHref, setPhoneHref] = React.useState(settings.phone_href);
  const [whatsappDisplay, setWhatsappDisplay] = React.useState(settings.whatsapp_display);
  const [whatsappNumber, setWhatsappNumber] = React.useState(settings.whatsapp_number);
  const [email, setEmail] = React.useState(settings.email);
  const [hoursText, setHoursText] = React.useState(hoursToText(settings.hours));
  const [serves, setServes] = React.useState(settings.serves.join(", "));
  const [siteTagline, setSiteTagline] = React.useState(settings.site_tagline);
  const [heroLine, setHeroLine] = React.useState(settings.hero_line);
  const [metaDescription, setMetaDescription] = React.useState(settings.meta_description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const result = await updateSiteSettings({
      phone_display: phoneDisplay,
      phone_href: phoneHref,
      whatsapp_display: whatsappDisplay,
      whatsapp_number: whatsappNumber,
      email,
      hours: parseHours(hoursText),
      serves: serves
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      site_tagline: siteTagline,
      hero_line: heroLine,
      meta_description: metaDescription,
    });
    setPending(false);
    if (result.error) {
      toast.error("Something went wrong", { description: result.error });
    } else {
      toast.success("Settings saved");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="grid gap-5 rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-semibold text-ink">Contact details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone-display">Phone (display)</Label>
            <Input id="phone-display" value={phoneDisplay} onChange={(e) => setPhoneDisplay(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone-href">Phone (dial format, e.g. +233...)</Label>
            <Input id="phone-href" value={phoneHref} onChange={(e) => setPhoneHref(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="wa-display">WhatsApp (display)</Label>
            <Input id="wa-display" value={whatsappDisplay} onChange={(e) => setWhatsappDisplay(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="wa-number">WhatsApp number (e.g. 233201668641)</Label>
            <Input id="wa-number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="hours">Business hours (one per line, &quot;Days | Time&quot;)</Label>
          <Textarea id="hours" rows={3} value={hoursText} onChange={(e) => setHoursText(e.target.value)} />
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-semibold text-ink">Site copy</h2>
        <div>
          <Label htmlFor="hero-line">Hero headline (Home page)</Label>
          <Input id="hero-line" value={heroLine} onChange={(e) => setHeroLine(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="serves">Who we serve (comma separated)</Label>
          <Input id="serves" value={serves} onChange={(e) => setServes(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="meta-description">Site description (used for SEO and the footer)</Label>
          <Textarea id="meta-description" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
        </div>
      </section>

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save changes
      </Button>
    </form>
  );
}
