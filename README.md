# Grainy Palace Tech

Marketing site for Grainy Palace Tech — an Accra-based team helping Ghanaian
businesses go digital: shops, farms, schools, clinics, churches, and offices.
Websites, go-digital record-keeping, business equipment, monthly IT support,
and GRA e-VAT setup.

Five public pages, a lead-capture contact form, and an admin panel at
`/admin` (reached via the gear icon in the footer) where staff edit
everything else — hero photos, services, hardware, about copy, and contact
details — without touching code.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Radix UI + shadcn/ui
pattern · Supabase (Postgres + Auth, single admin account, no roles) · React
Hook Form + Zod · Resend + React Email (optional) · Sonner · Lucide icons.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project API keys — needed for public content, the contact form, and `/admin` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by the contact Server Action to write leads (never exposed to the browser) |
| `RESEND_API_KEY` | Optional. Resend API key for the lead-notification email — leads still save to Supabase without it |
| `EMAIL_FROM` / `EMAIL_NOTIFY_TO` | Sender address and inbox for lead notifications |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for metadata, sitemap, and JSON-LD |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback WhatsApp number (overridden by Settings once `/admin` is used) |

Without Supabase configured, public pages still render — every getter in
`lib/data/public.ts` falls back to the static copy in `lib/constants.ts` — but
the contact form won't save and `/admin` won't be reachable.

### Database setup

Run **`supabase/schema.sql`** once in the Supabase SQL editor. It creates
every table (leads, hero slides, services, hardware, about content, site
settings), enables RLS, and seeds real starter content matching what the site
launched with. Then create the one admin account and turn off public sign-up
— see `DEPLOYMENT.md` for the full, beginner-friendly walkthrough.

## Project structure

```
app/
  layout.tsx                 Root layout: fonts, JSON-LD, Toaster (shared by marketing + admin)
  (marketing)/                Public site — its own layout adds Header/Footer/WhatsApp button
    page.tsx                   Home
    about/ services/ hardware/ contact/
    contact/actions.ts          Server Action: validates, saves to Supabase, emails via Resend
    opengraph-image.tsx
  admin/
    login/                      Public within /admin — no sidebar shell
    (dashboard)/                 Auth-gated — dashboard, leads, hero-slides, services,
                                  hardware, about, settings
  sitemap.ts / robots.ts
  loading.tsx / error.tsx / not-found.tsx
components/
  admin/                      Admin-only UI (shell, confirm dialog, image upload, icon picker)
  layout/                      Header, Footer, WhatsApp button (marketing only)
  forms/lead-form.tsx           React Hook Form + Zod, wired to the Server Action via useActionState
  hero-slider.tsx                Autoplaying, accessible hero image rotator
  ui/                           shadcn-style primitives (button, input, select, dialog, ...)
  pixel-bars.tsx                 The logo's ascending bar-chart glyph, reused as a section motif
lib/
  constants.ts                 Fallback copy — used when Supabase is unset or a query fails
  data/public.ts                 Cached ("use cache" + cacheTag) public content getters, with fallback
  supabase/
    server.ts                    Cookie-aware SSR client (Server Components, Server Actions)
    public.ts                    Stateless anon client for cached public reads
    service.ts                    Service-role client (contact form insert only)
    middleware.ts + admin-auth.ts  Auth guard used by proxy.ts and admin pages
  actions/upload-image.ts       Shared Server Action: uploads to the `media` Storage bucket
  validations/lead.ts            Zod schema shared by the client form and the Server Action
  email/                        Resend client + the lead-notification React Email template
proxy.ts                       Auth guard for /admin (Next 16 middleware)
supabase/schema.sql             Every table, RLS, storage bucket, seed data — idempotent
```

## Notable implementation details

- **Single admin account, no roles.** Every content table's RLS just checks
  `auth.uid() is not null` — there's no `profiles`/role table like a
  multi-staff setup would need. That means public sign-up **must** stay off
  in Supabase once the one account exists (see `DEPLOYMENT.md`).
- **Content is Supabase-backed with a static fallback.** Every public page
  calls through `lib/data/public.ts`, which reads published rows (cached via
  `"use cache"` + `cacheTag`) and falls back to `lib/constants.ts` if Supabase
  isn't configured or a query fails — so editing content in `/admin` goes
  live without a redeploy, and the site never 500s on a missing env var.
  Admin Server Actions call `updateTag(...)` after every mutation so the
  change is visible immediately (Next's read-your-own-writes API).
- **Route groups, not one layout**: `app/(marketing)` carries the public
  Header/Footer/WhatsApp button; `app/admin/(dashboard)` carries its own
  sidebar shell. The root `app/layout.tsx` only holds what both need (fonts,
  JSON-LD, the toaster) — this was a real bug in an earlier pass (the public
  header/footer were leaking into `/admin`) fixed by splitting the layouts.
- **Icons are stored as strings** (`services.icon`, `hardware_items.icon`,
  `content_items.icon`) and resolved through `lib/icon-map.tsx`'s
  `getIcon()`, which falls back to a default icon for any unrecognized name
  — so a bad value from `/admin` never crashes a page.
- **Form validation** happens twice with the same Zod schema
  (`lib/validations/lead.ts`): client-side via React Hook Form for inline
  errors, and again inside the Server Action as the trust boundary.
- **Email is best-effort.** A failed Resend send is logged but never blocks
  the lead from being saved or shown as an error to the visitor.
- **Ghana phone numbers** are validated with a single shared regex accepting
  `+233…` or local `0…` formats.
- **Design signature**: the logo's ascending pixel-bar glyph
  (`components/pixel-bars.tsx`) recurs as a section motif, paired with tracked
  monospace "eyebrow" labels — both lifted directly from the brand's print
  materials (flyer, business card).
- **SEO**: per-page `metadata`, a `LocalBusiness` JSON-LD block, a generated
  `app/(marketing)/opengraph-image.tsx`, and `sitemap.ts` / `robots.ts`.

## Admin panel (`/admin`)

Reached via the small gear icon in the site footer, or directly at
`/admin` (redirects to `/admin/login` if signed out).

- **Dashboard** — lead counts by status, quick links.
- **Leads** — every contact-form submission, status pipeline (new →
  contacted → closed), one-tap WhatsApp/call links.
- **Hero Slides** — upload photos that rotate on the Home hero; falls back to
  a plain gradient hero with no photo if none are published.
- **Services / Hardware** — full CRUD on the cards shown on Home, Services,
  and Hardware.
- **About** — the About page's story and founder, plus the repeating cards
  used on About ("Why us") and Home ("How it works").
- **Settings** — contact details, business hours, who-we-serve list,
  tagline, and hero headline.

## Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run start         # run the production build
npm run lint            # ESLint
npm run typecheck        # tsc --noEmit
```
