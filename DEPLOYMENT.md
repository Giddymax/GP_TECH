# Deployment Guide — Grainy Palace Tech

This guide assumes you've never used Supabase or Vercel before. Follow it
top to bottom and you'll have the site live.

Supabase powers two things here: the leads people submit through the contact
form, and the admin panel at `/admin` where staff edit everything else on the
site (hero photos, services, hardware, about copy, contact details). If you
skip the Supabase steps, the public pages still work — they fall back to the
copy built into the site — but the contact form won't save and `/admin` won't
be reachable.

---

## Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is
   enough for this site).
2. Click **New project**.
3. Choose an organisation, name the project (e.g. `grainy-palace-tech`), set
   a strong database password, and pick a region close to Ghana (Europe
   West is usually the best latency).
4. Wait a minute or two for the project to finish provisioning.

## Step 2 — Run the schema

1. In your new project, open **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase/schema.sql` from this repo, copy the whole file, and paste
   it into the editor.
4. Click **Run**. You should see "Success. No rows returned."

That's it — all the site's tables now exist (leads, hero slides, services,
hardware, about content, site settings), each pre-loaded with the real copy
the site launched with, so `/admin` opens to real content instead of empty
lists.

## Step 3 — Create the admin account and lock down sign-ups

There's a single staff/admin login for this site — no separate roles.

1. In Supabase, go to **Authentication → Users → Add user**.
2. Enter the email and password staff will log in with, and create the user
   directly (no email confirmation needed).
3. **Important:** go to **Authentication → Sign In / Providers** (or
   **Settings**, depending on your Supabase version) and turn **off** "Allow
   new users to sign up". Every table's security rule simply checks "is
   someone logged in", not a role — so leaving public sign-up on would let
   anyone with the site's public API key create an account and edit the
   site. This step is required, not optional.
4. Staff log in at `yourdomain.com/admin` (or via the small gear icon in the
   site footer) with the email/password from step 2.

## Step 4 — Copy your API keys

1. In Supabase, go to **Project Settings → API**.
2. You'll need three values for the next step:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is powerful — it bypasses all security rules. Never
put it in a file that starts with `NEXT_PUBLIC_`, never commit it to a
public repo, and only ever set it as a server-side environment variable
(which is exactly what the steps below do).

## Step 5 — (Optional) Set up Resend for email notifications

Skip this if you're happy checking the Supabase Table Editor for new leads
now and then. If you'd rather get an email the moment someone submits the
form:

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify a sending domain, or use Resend's shared test domain to
   start.
3. Go to **API Keys** and create one — this is your `RESEND_API_KEY`.

## Step 6 — Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New… → Project** → import
   the repo.
3. Vercel auto-detects Next.js — you don't need to change any build
   settings.
4. Under **Environment Variables**, add the variables from the table below.
5. Click **Deploy**. Your site will be live at `your-project.vercel.app`
   within a couple of minutes.

### Environment variables reference

| Variable | Required? | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For the contact form and `/admin` to work | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For the contact form and `/admin` to work | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | For the contact form to save leads | Supabase → Project Settings → API (**keep secret**) |
| `RESEND_API_KEY` | Optional — email notifications | Resend → API Keys |
| `EMAIL_FROM` | Optional, defaults to a sensible value | Any address on your verified Resend domain |
| `EMAIL_NOTIFY_TO` | Optional, defaults to `admin@grainypalacetech.com` | Wherever you want lead emails to land |
| `NEXT_PUBLIC_SITE_URL` | Recommended, for correct SEO metadata | Your final domain, e.g. `https://www.grainypalacetech.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recommended | Your WhatsApp number in international format, no `+` or spaces (e.g. `233201668641`) |

## Step 7 — Add your custom domain

1. In Vercel, open your project → **Domains** → add `grainypalacetech.com`
   (or whichever domain you own).
2. Vercel shows you DNS records to add at your domain registrar — usually a
   CNAME for `www` and an A record for the root domain.
3. Once DNS propagates (can take a few minutes to a few hours), update
   `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables to match, then
   redeploy.

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values from Step 3 (and Step 4 if using Resend)
npm run dev
```

Visit `http://localhost:3000`.

## Post-deployment checklist

- [ ] Home, About, Services, Hardware, and Contact pages all load
- [ ] The contact form submits successfully and a new row appears in
      Supabase → Table Editor → `leads`
- [ ] If Resend is configured, a notification email arrives
- [ ] The WhatsApp button and all "Chat on WhatsApp" links open with the
      correct number
- [ ] The gear icon in the footer leads to `/admin`, and logging in with the
      admin account works
- [ ] Public sign-up is turned off in Supabase (Step 3)
- [ ] Editing a service, hardware item, or hero slide in `/admin` shows up on
      the public site
- [ ] `<title>` and Open Graph preview look right when you share the link
      (test with a tool like [opengraph.xyz](https://www.opengraph.xyz))
- [ ] `npm run build` completes with zero errors before every deploy
