-- Grainy Palace Tech (GP_TECH) — Supabase schema
-- Run in the Supabase SQL editor on a fresh project. Safe to run more than once.
--
-- Auth model: a single admin account, no roles/profiles table. RLS on every
-- content table below just checks `auth.uid() is not null` — whoever can log
-- in can edit everything. Because of that, IMPORTANT: after creating the one
-- admin account (Supabase Dashboard → Authentication → Users → Add user),
-- turn OFF public sign-ups in Authentication → Settings. Without that step,
-- anyone with the anon key could self-register and get write access. See
-- DEPLOYMENT.md.
--
-- The `leads` table stays locked down beyond that: no anon select/insert at
-- all. The contact form writes server-side via the service-role key (see
-- lib/supabase/service.ts), and the admin dashboard reads/updates leads
-- through the logged-in user's own session.

create extension if not exists "pgcrypto";

-- =========================================================================
-- Leads (contact form submissions)
-- =========================================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  organisation_type text,
  service_interest text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

alter table public.leads enable row level security;

drop policy if exists "leads: authenticated read" on public.leads;
create policy "leads: authenticated read" on public.leads
  for select using (auth.uid() is not null);
drop policy if exists "leads: authenticated update" on public.leads;
create policy "leads: authenticated update" on public.leads
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- =========================================================================
-- Shared updated_at trigger
-- =========================================================================

create or replace function public.set_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- Hero slides — rotating photos or short videos on the Home hero
-- =========================================================================

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  alt_text text not null default 'Grainy Palace Tech',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run against a database where hero_slides already existed
-- before video support was added.
alter table public.hero_slides
  add column if not exists media_type text not null default 'image';
alter table public.hero_slides
  drop constraint if exists hero_slides_media_type_check;
alter table public.hero_slides
  add constraint hero_slides_media_type_check check (media_type in ('image', 'video'));

drop trigger if exists hero_slides_set_updated_at on public.hero_slides;
create trigger hero_slides_set_updated_at before update on public.hero_slides
  for each row execute procedure public.set_updated_at();

alter table public.hero_slides enable row level security;
drop policy if exists "hero_slides: public read published" on public.hero_slides;
create policy "hero_slides: public read published" on public.hero_slides
  for select using (published);
drop policy if exists "hero_slides: authenticated manage" on public.hero_slides;
create policy "hero_slides: authenticated manage" on public.hero_slides
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create index if not exists hero_slides_sort_idx on public.hero_slides (sort_order);

-- =========================================================================
-- Services — IT services catalogue
-- =========================================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  description text not null,
  includes text[] not null default '{}',
  icon text not null default 'Sparkles',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at before update on public.services
  for each row execute procedure public.set_updated_at();

alter table public.services enable row level security;
drop policy if exists "services: public read published" on public.services;
create policy "services: public read published" on public.services
  for select using (published);
drop policy if exists "services: authenticated manage" on public.services;
create policy "services: authenticated manage" on public.services
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create index if not exists services_sort_idx on public.services (sort_order);

-- =========================================================================
-- Hardware items — Business Equipment page
-- =========================================================================

create table if not exists public.hardware_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null default 'Sparkles',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists hardware_items_set_updated_at on public.hardware_items;
create trigger hardware_items_set_updated_at before update on public.hardware_items
  for each row execute procedure public.set_updated_at();

alter table public.hardware_items enable row level security;
drop policy if exists "hardware_items: public read published" on public.hardware_items;
create policy "hardware_items: public read published" on public.hardware_items
  for select using (published);
drop policy if exists "hardware_items: authenticated manage" on public.hardware_items;
create policy "hardware_items: authenticated manage" on public.hardware_items
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create index if not exists hardware_items_sort_idx on public.hardware_items (sort_order);

-- =========================================================================
-- Content items — generic repeating cards, grouped by `section`
-- ('about_values', 'how_it_works'). One table backs every repeating card
-- list instead of a table per section, since they're all the same shape.
-- =========================================================================

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('about_values', 'how_it_works')),
  icon text not null default 'Sparkles',
  title text not null,
  description text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create index if not exists content_items_section_idx on public.content_items (section, sort_order);

alter table public.content_items enable row level security;
drop policy if exists "content_items: public read published" on public.content_items;
create policy "content_items: public read published" on public.content_items
  for select using (published);
drop policy if exists "content_items: authenticated manage" on public.content_items;
create policy "content_items: authenticated manage" on public.content_items
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- =========================================================================
-- Site settings — singleton row, authenticated-only writes
-- =========================================================================

create table if not exists public.site_settings (
  id boolean primary key default true constraint site_settings_singleton check (id),
  phone_display text not null default '055 231 5639',
  phone_href text not null default '+233552315639',
  whatsapp_display text not null default '020 166 8641',
  whatsapp_number text not null default '233201668641',
  email text not null default 'admin@grainypalacetech.com',
  hours jsonb not null default '[{"day":"Monday – Saturday","time":"8:00 AM – 6:00 PM"},{"day":"Sunday","time":"Closed"}]',
  serves text[] not null default '{Shops,Farms,Schools,Clinics,Churches,Offices}',
  site_tagline text not null default 'Helping businesses to go digital',
  hero_line text not null default 'Whatever you run, run it digital.',
  about_heading text not null default 'Every business deserves to run digital.',
  about_story text[] not null default '{"Too many good businesses in Ghana are sold software by companies with no office here — so when something breaks, support means an email into the void. Grainy Palace Tech exists to be the opposite: a local team that sets up your website, your records, and your equipment in person, and stays reachable long after the invoice is paid.","Today we work with shops, farms, schools, clinics, and churches across Accra — helping each one go digital in whatever way actually fits how it runs, from a simple website to a full point-of-sale and records setup with GRA e-VAT compliance built in."}',
  founder_name text not null default 'Giddy',
  founder_role text not null default 'Founder & CEO',
  founder_blurb text not null default 'Leads every assessment personally in the early days of a client relationship, so the plan we recommend actually fits how you run.',
  meta_description text not null default 'Grainy Palace Tech helps Ghanaian businesses — shops, farms, schools, clinics, churches, and offices — go digital. Websites, records systems, business equipment, IT support, and GRA e-VAT setup, with a free assessment delivered in person.',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute procedure public.set_updated_at();

alter table public.site_settings enable row level security;
drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read" on public.site_settings
  for select using (true);
drop policy if exists "site_settings: authenticated update" on public.site_settings;
create policy "site_settings: authenticated update" on public.site_settings
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

-- =========================================================================
-- Storage — `media` bucket for hero-slide photo uploads
-- =========================================================================

insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

drop policy if exists "media bucket: public read" on storage.objects;
create policy "media bucket: public read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media bucket: authenticated write" on storage.objects;
create policy "media bucket: authenticated write" on storage.objects
  for insert with check (bucket_id = 'media' and auth.uid() is not null);
drop policy if exists "media bucket: authenticated update" on storage.objects;
create policy "media bucket: authenticated update" on storage.objects
  for update using (bucket_id = 'media' and auth.uid() is not null);
drop policy if exists "media bucket: authenticated delete" on storage.objects;
create policy "media bucket: authenticated delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.uid() is not null);

-- =========================================================================
-- Seed data — matches the real business copy the site shipped with, so the
-- admin panel opens to real, editable content rather than empty tables.
-- =========================================================================

insert into public.hero_slides (id, image_url, alt_text, sort_order) values
  ('00000000-0000-0000-0000-000000000201', 'https://placehold.co/1600x1000/13242e/66d4d8?text=Grainy+Palace+Tech', 'Grainy Palace Tech', 1),
  ('00000000-0000-0000-0000-000000000202', 'https://placehold.co/1600x1000/005672/f6f9fa?text=Websites+%26+Records', 'Websites and digital records', 2),
  ('00000000-0000-0000-0000-000000000203', 'https://placehold.co/1600x1000/0a3f52/2bb3b9?text=Business+Equipment', 'Business equipment setup', 3)
on conflict (id) do nothing;

insert into public.services (id, slug, name, short_description, description, includes, icon, sort_order) values
  ('00000000-0000-0000-0000-000000000301', 'websites', 'Websites',
   'Be found on Google; customers reach you on WhatsApp in one tap.',
   'A website built for how Ghanaian customers actually search and buy — fast to load on a mobile connection, easy to find on Google, and one tap away from a WhatsApp chat. We write the copy, take care of the photos, and keep it updated after launch.',
   '{"Mobile-first design, built for the phones your customers already use","Google Business Profile set up alongside it, so you show up in local search","A WhatsApp button on every page — no contact form standing between you and a sale","Hosting and basic maintenance handled for you"}',
   'Globe', 1),
  ('00000000-0000-0000-0000-000000000302', 'go-digital-setup', 'Go-Digital Setup',
   'Sales, stock & customer records on your phone — backed up forever.',
   'We move your sales, stock, and customer records off paper and memory and onto your phone — set up in person, in one visit, so nothing is ever lost to a spilled notebook or a crashed laptop again.',
   '{"Daily sales and expenses tracked from your phone","Stock counts that update as you sell","Customer and credit records you can search in seconds","Automatic backups — a lost or stolen phone never means lost records"}',
   'DatabaseBackup', 2),
  ('00000000-0000-0000-0000-000000000303', 'business-equipment', 'Business Equipment',
   'POS, printers & networks — installed, connected, supported.',
   'POS terminals, receipt printers, and networking gear chosen to work together — not just dropped off, but installed, connected, and tested before we leave, with support on call after.',
   '{"POS terminals set up and linked to your records","Receipt and label printers installed and tested","Wi-Fi and networking sorted for multi-till or multi-room setups","Staff shown how to use everything before we go"}',
   'Cpu', 3),
  ('00000000-0000-0000-0000-000000000304', 'monthly-it-support', 'Monthly IT Support',
   'Your own IT department, without hiring one.',
   'A phone call or WhatsApp message away whenever something breaks, slows down, or stops making sense — so your organisation always has IT cover without carrying a full-time salary.',
   '{"Phone and WhatsApp support during business hours","Regular check-ins on your equipment and systems","Priority callout for anything urgent","Plain-language help — no jargon, no talking down to you"}',
   'LifeBuoy', 4),
  ('00000000-0000-0000-0000-000000000305', 'gra-e-vat-ready', 'GRA E-VAT Ready',
   'Compliant e-invoicing set up and taught, penalty-free.',
   'GRA e-VAT compliance set up correctly the first time, with your staff taught how to issue e-invoices day to day — so you avoid penalties without needing to become a tax expert yourself.',
   '{"E-invoicing set up to match GRA requirements","Staff trained to issue e-VAT receipts confidently","Records kept organised for filing season","Ongoing support as GRA requirements change"}',
   'ReceiptText', 5)
on conflict (id) do nothing;

insert into public.hardware_items (id, title, description, icon, sort_order) values
  ('00000000-0000-0000-0000-000000000401', 'POS terminals',
   'Card and mobile money-ready POS terminals, set up and linked to your sales records so every transaction is captured automatically.',
   'CreditCard', 1),
  ('00000000-0000-0000-0000-000000000402', 'Receipt & label printers',
   'Fast, reliable printers for receipts and product labels, installed and tested with your till before we leave.',
   'Printer', 2),
  ('00000000-0000-0000-0000-000000000403', 'Wi-Fi & networking',
   'Dependable Wi-Fi and wired networking for multi-till, multi-room, or multi-branch setups — configured for how your space actually works.',
   'Wifi', 3),
  ('00000000-0000-0000-0000-000000000404', 'Backup power & UPS',
   'Battery backup for your POS and networking gear, so a power cut doesn''t mean a lost sale or a corrupted record.',
   'BatteryCharging', 4)
on conflict (id) do nothing;

insert into public.content_items (id, section, icon, title, description, sort_order) values
  ('00000000-0000-0000-0000-000000000501', 'about_values', 'MapPin', 'Local, in person',
   'We''re based in Accra and show up to set things up ourselves — no remote install, no guesswork over the phone.', 1),
  ('00000000-0000-0000-0000-000000000502', 'about_values', 'MessagesSquare', 'Plain language',
   'We explain what we''re doing and why, in terms that make sense — not technical jargon meant to impress.', 2),
  ('00000000-0000-0000-0000-000000000503', 'about_values', 'ShieldCheck', 'Support that sticks around',
   'The relationship doesn''t end at installation. We''re a call or WhatsApp message away after we leave.', 3),
  ('00000000-0000-0000-0000-000000000511', 'how_it_works', 'Sparkles', 'Free assessment',
   'We come to you — in person — and look at how your organisation actually runs today.', 1),
  ('00000000-0000-0000-0000-000000000512', 'how_it_works', 'Sparkles', 'A plan built for you',
   'We recommend only what fits your organisation and budget, explained in plain language.', 2),
  ('00000000-0000-0000-0000-000000000513', 'how_it_works', 'Sparkles', 'Installed and taught',
   'We set everything up on-site and make sure your team is comfortable using it before we leave.', 3)
on conflict (id) do nothing;

-- =========================================================================
-- Indexes
-- =========================================================================

create index if not exists leads_status_idx on public.leads (status);
