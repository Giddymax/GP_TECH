import { cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  HeroSlideRow,
  ServiceRow,
  HardwareItemRow,
  ContentItemRow,
  ContentItemSection,
  SiteSettingsRow,
} from "@/lib/supabase/types";
import {
  services as fallbackServices,
  hardwareItems as fallbackHardwareItems,
  aboutValues as fallbackAboutValues,
  howItWorks as fallbackHowItWorks,
  siteConfig,
} from "@/lib/constants";

const now = () => new Date().toISOString();

function fallbackServiceRows(): ServiceRow[] {
  return fallbackServices.map((s, i) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    short_description: s.short_description,
    description: s.description,
    includes: s.includes,
    icon: s.icon,
    sort_order: i,
    published: true,
    created_at: now(),
    updated_at: now(),
  }));
}

function fallbackHardwareRows(): HardwareItemRow[] {
  return fallbackHardwareItems.map((h, i) => ({
    id: `fallback-${i}`,
    title: h.title,
    description: h.description,
    icon: h.icon,
    sort_order: i,
    published: true,
    created_at: now(),
    updated_at: now(),
  }));
}

function fallbackContentRows(section: ContentItemSection): ContentItemRow[] {
  const source = section === "about_values" ? fallbackAboutValues : fallbackHowItWorks;
  return source.map((c, i) => ({
    id: `fallback-${section}-${i}`,
    section,
    icon: c.icon,
    title: c.title,
    description: c.description,
    sort_order: i,
    published: true,
  }));
}

function fallbackSiteSettings(): SiteSettingsRow {
  return {
    id: true,
    phone_display: siteConfig.contact.phoneDisplay,
    phone_href: siteConfig.contact.phoneHref,
    whatsapp_display: siteConfig.contact.whatsappDisplay,
    whatsapp_number: siteConfig.contact.whatsappNumber,
    email: siteConfig.contact.email,
    hours: [...siteConfig.hours],
    serves: [...siteConfig.serves],
    site_tagline: siteConfig.tagline,
    hero_line: siteConfig.heroLine,
    about_heading: siteConfig.aboutHeading,
    about_story: [...siteConfig.aboutStory],
    founder_name: siteConfig.founder.name,
    founder_role: siteConfig.founder.role,
    founder_blurb: siteConfig.founder.blurb,
    meta_description: siteConfig.description,
    updated_at: now(),
  };
}

export async function getHeroSlides(): Promise<HeroSlideRow[]> {
  "use cache";
  cacheTag("hero_slides");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    // No slides configured yet (or Supabase unavailable) — the hero
    // component falls back to a plain gradient hero with no photo.
    return [];
  }
}

export async function getServices(): Promise<ServiceRow[]> {
  "use cache";
  cacheTag("services");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : fallbackServiceRows();
  } catch {
    return fallbackServiceRows();
  }
}

export async function getHardwareItems(): Promise<HardwareItemRow[]> {
  "use cache";
  cacheTag("hardware_items");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("hardware_items")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : fallbackHardwareRows();
  } catch {
    return fallbackHardwareRows();
  }
}

export async function getContentItems(section: ContentItemSection): Promise<ContentItemRow[]> {
  "use cache";
  cacheTag(`content_items:${section}`);
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("published", true)
      .eq("section", section)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : fallbackContentRows(section);
  } catch {
    return fallbackContentRows(section);
  }
}

export async function getSiteSettings(): Promise<SiteSettingsRow> {
  "use cache";
  cacheTag("site_settings");
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
    if (error) throw error;
    return data ?? fallbackSiteSettings();
  } catch {
    return fallbackSiteSettings();
  }
}
