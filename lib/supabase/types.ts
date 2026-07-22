export type LeadStatus = "new" | "contacted" | "closed";

export type LeadInsert = {
  name: string;
  phone: string;
  email: string | null;
  organisation_type: string | null;
  service_interest: string | null;
  message: string | null;
};

export type LeadRow = LeadInsert & {
  id: string;
  created_at: string;
  status: LeadStatus;
};

export type HeroMediaType = "image" | "video";

export type HeroSlideRow = {
  id: string;
  image_url: string;
  media_type: HeroMediaType;
  carousel_image_url: string | null;
  alt_text: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type HeroSlideInsert = Omit<HeroSlideRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  includes: string[];
  icon: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type ServiceInsert = Omit<ServiceRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type HardwareItemRow = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type HardwareItemInsert = Omit<HardwareItemRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type ContentItemSection = "about_values" | "how_it_works";
export type ContentItemRow = {
  id: string;
  section: ContentItemSection;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
};
export type ContentItemInsert = Omit<ContentItemRow, "id"> & { id?: string };

export type SiteSettingsHours = { day: string; time: string }[];

export type SiteSettingsRow = {
  id: boolean;
  phone_display: string;
  phone_href: string;
  whatsapp_display: string;
  whatsapp_number: string;
  email: string;
  hours: SiteSettingsHours;
  serves: string[];
  site_tagline: string;
  hero_line: string;
  hero_eyebrow: string;
  hero_subheading: string;
  hero_microcopy: string;
  hero_cta_primary_label: string;
  hero_cta_whatsapp_label: string;
  about_hero_image_url: string | null;
  services_hero_image_url: string | null;
  hardware_hero_image_url: string | null;
  contact_hero_image_url: string | null;
  about_heading: string;
  about_story: string[];
  founder_name: string;
  founder_role: string;
  founder_blurb: string;
  meta_description: string;
  updated_at: string;
};
export type SiteSettingsUpdate = Partial<Omit<SiteSettingsRow, "id" | "updated_at">>;

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert & { status: LeadStatus }>;
        Relationships: [];
      };
      hero_slides: {
        Row: HeroSlideRow;
        Insert: HeroSlideInsert;
        Update: Partial<HeroSlideInsert>;
        Relationships: [];
      };
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: Partial<ServiceInsert>;
        Relationships: [];
      };
      hardware_items: {
        Row: HardwareItemRow;
        Insert: HardwareItemInsert;
        Update: Partial<HardwareItemInsert>;
        Relationships: [];
      };
      content_items: {
        Row: ContentItemRow;
        Insert: ContentItemInsert;
        Update: Partial<ContentItemInsert>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: SiteSettingsRow;
        Update: SiteSettingsUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
