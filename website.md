Business Website Builder

Build full business websites the way this developer's existing projects are built: one consistent, proven stack so every project is familiar, deployable the same way, and maintainable years later. Do not swap in other frameworks, databases, or CSS approaches — consistency across projects is the point.

Before building

Gather the business brief. If the user hasn't provided these, ask before scaffolding (one short round of questions, not an interrogation):

Business name, type, and location
Pages needed (e.g. Home, About, Services, Shop, Gallery, Contact, Admin)
Features (catalog, booking, POS/inventory, blog/news, admin CRUD, exports)
Branding: primary color, logo file, tone
Real contact info: phone, email, address, socials, hours

Never fill a site with lorem ipsum — write realistic copy from the business details. Placeholder text makes the deliverable unusable for a real business.

Tech stack (fixed)
Layer	Choice
Framework	Next.js 16, App Router, TypeScript, app/ directory, Turbopack (default)
UI	React 19, Tailwind CSS v4 (@tailwindcss/postcss, CSS-first @theme config — no tailwind.config.ts)
Components	Radix UI primitives, shadcn/ui-style, class-variance-authority + clsx + tailwind-merge
Icons	lucide-react
Database	Supabase Postgres via @supabase/supabase-js + @supabase/ssr
Auth	Supabase Auth, SSR cookies, route protection in proxy.ts
Mutations	Server Actions + React 19 useActionState / useOptimistic / form actions
Forms	react-hook-form + zod (v4) + @hookform/resolvers
Client state	zustand (only where server components can't do the job)
Email	Resend + react-email (when the site sends email)
Toasts / theme	sonner / next-themes
Tooling	TypeScript 5 strict, ESLint 9 + eslint-config-next
Hosting	Vercel + hosted Supabase
Modern Next.js 16 patterns (use these, not the old ways)
proxy.ts, not middleware.ts — middleware is deprecated in Next 16. Export proxy from proxy.ts at the project root for auth guards and redirects. When touching an older project that still has middleware.ts, migrate it.
Cache Components — enable cacheComponents and use the "use cache" directive on pages/components/functions that render shared, non-personal content (home, about, product listings). Wrap dynamic, per-user sections (cart, dashboard widgets) in <Suspense> so PPR serves a static shell instantly and streams the rest. Explicit caching beats guessing what Next cached for you.
Server Actions for mutations — forms submit to Server Actions with zod validation inside the action; pair with useActionState for pending/error UI and useOptimistic for instant feedback. No hand-rolled /api routes unless an external service needs a webhook/REST endpoint.
revalidatePath / revalidateTag after mutations so cached pages update without a redeploy.
Auth checks — use supabase.auth.getClaims() for verified identity in guards and server code; getUser() only when a fresh user record is needed. Never trust getSession() output for authorization.
Tailwind v4 CSS-first — define brand colors, fonts, and breakpoints as design tokens in @theme inside globals.css. One place for branding makes reskinning trivial.
Build order

Work iteratively — each step should leave the project in a working state:

Scaffold — Next.js app with TypeScript, Tailwind v4, ESLint.
Schema — write supabase/schema.sql: tables, indexes, Row Level Security policies, seed data. Make it idempotent (safe to run twice) because users re-run it during deployment. Follow references/database.md for RLS patterns that stay fast at scale.
Auth — Supabase SSR client helpers in lib/, proxy.ts route protection for admin areas.
Pages — public pages first, then admin. Server Components by default; add "use client" only where interactivity requires it.
Features — Server Actions, CRUD, exports, email.
Polish — loading/empty/error states, SEO, accessibility, performance. Work through references/optimization.md here — it is the difference between a demo and a production site.
Verify — npm run build must pass with zero TypeScript/ESLint errors. Run Lighthouse (or npx unlighthouse) if available; targets are in references/optimization.md.
Core standards

These are what make the sites feel professional — don't skip them:

Mobile-first responsive (360px → 1440px). Sticky header, hamburger menu on mobile. Most visitors to these businesses browse on phones.
Security: all data access through Supabase with RLS enabled on every table. Never expose the service-role key to the client (never in NEXT_PUBLIC_*). Env vars in .env.local, with a committed .env.example listing every variable. Full checklist: references/database.md.
Validation: zod-validate every form and API input on both client and server — the server action is the trust boundary.
SEO: per-page metadata, Open Graph tags (generate OG images with next/og), JSON-LD structured data (LocalBusiness/Organization), sitemap.ts, robots.ts, semantic HTML.
Accessibility: keyboard navigable, labeled inputs, sufficient contrast, alt text on images, visible focus rings.
States: every data-driven view needs loading, empty, and error states; add loading.tsx and error.tsx per route group.
Performance: next/image for all images, next/font for fonts, no layout shift. Full checklist: references/optimization.md.
No placeholders or TODOs left in shipped code.
Reference files
references/optimization.md — performance, caching, SEO, and Core Web Vitals checklist. Read during the Polish step, or whenever the user asks to "optimize" or "speed up" a site.
references/database.md — Supabase schema, RLS, and security patterns. Read during the Schema step.
Deliverables

Every project ships with:

Full working source
supabase/schema.sql (idempotent, RLS, seed data)
README.md — setup and run instructions
DEPLOYMENT.md — beginner-friendly walkthrough: create Supabase project → run schema in SQL Editor → copy API keys → import repo to Vercel → set env vars → deploy. Assume the reader has never used Supabase or Vercel (match the tone of the existing SEEKANT deployment guide).