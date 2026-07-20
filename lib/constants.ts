// Fallback content used when Supabase isn't configured or a query fails, so
// the site never renders empty. Once /admin is used, the database is the
// source of truth — see lib/data/public.ts.

export const siteConfig = {
  name: "Grainy Palace Tech",
  tagline: "Helping businesses to go digital",
  heroLine: "Whatever you run, run it digital.",
  description:
    "Grainy Palace Tech helps Ghanaian businesses — shops, farms, schools, clinics, churches, and offices — go digital. Websites, records systems, business equipment, IT support, and GRA e-VAT setup, with a free assessment delivered in person.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.grainypalacetech.com",
  locale: "en-GH",
  founder: {
    name: "Giddy",
    role: "Founder & CEO",
    blurb:
      "Leads every assessment personally in the early days of a client relationship, so the plan we recommend actually fits how you run.",
  },
  contact: {
    phoneDisplay: "055 231 5639",
    phoneHref: "+233552315639",
    whatsappDisplay: "020 166 8641",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233201668641",
    email: "admin@grainypalacetech.com",
    city: "Accra",
    region: "Greater Accra",
    country: "GH",
  },
  hours: [
    { day: "Monday – Saturday", time: "8:00 AM – 6:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  serves: ["Shops", "Farms", "Schools", "Clinics", "Churches", "Offices"],
  aboutHeading: "Every business deserves to run digital.",
  aboutStory: [
    "Too many good businesses in Ghana are sold software by companies with no office here — so when something breaks, support means an email into the void. Grainy Palace Tech exists to be the opposite: a local team that sets up your website, your records, and your equipment in person, and stays reachable long after the invoice is paid.",
    "Today we work with shops, farms, schools, clinics, and churches across Accra — helping each one go digital in whatever way actually fits how it runs, from a simple website to a full point-of-sale and records setup with GRA e-VAT compliance built in.",
  ],
} as const;

export const whatsappMessages = {
  general: "Hi Grainy Palace Tech, I'd like to ask about your services.",
  assessment: "Hi Grainy Palace Tech, I'd like a free digital assessment.",
} as const;

export function whatsappLink(message: string = whatsappMessages.general, number: string = siteConfig.contact.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Hardware", href: "/hardware" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type FallbackService = {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  includes: string[];
  icon: string;
};

export const services: FallbackService[] = [
  {
    slug: "websites",
    name: "Websites",
    short_description: "Be found on Google; customers reach you on WhatsApp in one tap.",
    description:
      "A website built for how Ghanaian customers actually search and buy — fast to load on a mobile connection, easy to find on Google, and one tap away from a WhatsApp chat. We write the copy, take care of the photos, and keep it updated after launch.",
    includes: [
      "Mobile-first design, built for the phones your customers already use",
      "Google Business Profile set up alongside it, so you show up in local search",
      "A WhatsApp button on every page — no contact form standing between you and a sale",
      "Hosting and basic maintenance handled for you",
    ],
    icon: "Globe",
  },
  {
    slug: "go-digital-setup",
    name: "Go-Digital Setup",
    short_description: "Sales, stock & customer records on your phone — backed up forever.",
    description:
      "We move your sales, stock, and customer records off paper and memory and onto your phone — set up in person, in one visit, so nothing is ever lost to a spilled notebook or a crashed laptop again.",
    includes: [
      "Daily sales and expenses tracked from your phone",
      "Stock counts that update as you sell",
      "Customer and credit records you can search in seconds",
      "Automatic backups — a lost or stolen phone never means lost records",
    ],
    icon: "DatabaseBackup",
  },
  {
    slug: "business-equipment",
    name: "Business Equipment",
    short_description: "POS, printers & networks — installed, connected, supported.",
    description:
      "POS terminals, receipt printers, and networking gear chosen to work together — not just dropped off, but installed, connected, and tested before we leave, with support on call after.",
    includes: [
      "POS terminals set up and linked to your records",
      "Receipt and label printers installed and tested",
      "Wi-Fi and networking sorted for multi-till or multi-room setups",
      "Staff shown how to use everything before we go",
    ],
    icon: "Cpu",
  },
  {
    slug: "monthly-it-support",
    name: "Monthly IT Support",
    short_description: "Your own IT department, without hiring one.",
    description:
      "A phone call or WhatsApp message away whenever something breaks, slows down, or stops making sense — so your organisation always has IT cover without carrying a full-time salary.",
    includes: [
      "Phone and WhatsApp support during business hours",
      "Regular check-ins on your equipment and systems",
      "Priority callout for anything urgent",
      "Plain-language help — no jargon, no talking down to you",
    ],
    icon: "LifeBuoy",
  },
  {
    slug: "gra-e-vat-ready",
    name: "GRA E-VAT Ready",
    short_description: "Compliant e-invoicing set up and taught, penalty-free.",
    description:
      "GRA e-VAT compliance set up correctly the first time, with your staff taught how to issue e-invoices day to day — so you avoid penalties without needing to become a tax expert yourself.",
    includes: [
      "E-invoicing set up to match GRA requirements",
      "Staff trained to issue e-VAT receipts confidently",
      "Records kept organised for filing season",
      "Ongoing support as GRA requirements change",
    ],
    icon: "ReceiptText",
  },
];

export type FallbackHardwareItem = { title: string; description: string; icon: string };

export const hardwareItems: FallbackHardwareItem[] = [
  {
    title: "POS terminals",
    description:
      "Card and mobile money-ready POS terminals, set up and linked to your sales records so every transaction is captured automatically.",
    icon: "CreditCard",
  },
  {
    title: "Receipt & label printers",
    description:
      "Fast, reliable printers for receipts and product labels, installed and tested with your till before we leave.",
    icon: "Printer",
  },
  {
    title: "Wi-Fi & networking",
    description:
      "Dependable Wi-Fi and wired networking for multi-till, multi-room, or multi-branch setups — configured for how your space actually works.",
    icon: "Wifi",
  },
  {
    title: "Backup power & UPS",
    description: "Battery backup for your POS and networking gear, so a power cut doesn't mean a lost sale or a corrupted record.",
    icon: "BatteryCharging",
  },
];

export const serviceInterestOptions = [
  { value: "websites", label: "Websites" },
  { value: "go-digital-setup", label: "Go-Digital Setup" },
  { value: "business-equipment", label: "Business Equipment" },
  { value: "monthly-it-support", label: "Monthly IT Support" },
  { value: "gra-e-vat-ready", label: "GRA E-VAT Ready" },
  { value: "not-sure", label: "Not sure yet — send me the free assessment" },
] as const;

export const organisationTypes = [
  "Shop / retail",
  "Farm",
  "School",
  "Clinic / pharmacy",
  "Church",
  "Office",
  "Other",
] as const;

export type FallbackContentItem = { icon: string; title: string; description: string };

export const aboutValues: FallbackContentItem[] = [
  {
    icon: "MapPin",
    title: "Local, in person",
    description:
      "We're based in Accra and show up to set things up ourselves — no remote install, no guesswork over the phone.",
  },
  {
    icon: "MessagesSquare",
    title: "Plain language",
    description: "We explain what we're doing and why, in terms that make sense — not technical jargon meant to impress.",
  },
  {
    icon: "ShieldCheck",
    title: "Support that sticks around",
    description: "The relationship doesn't end at installation. We're a call or WhatsApp message away after we leave.",
  },
];

export const howItWorks: FallbackContentItem[] = [
  {
    icon: "Sparkles",
    title: "Free assessment",
    description: "We come to you — in person — and look at how your organisation actually runs today.",
  },
  {
    icon: "Sparkles",
    title: "A plan built for you",
    description: "We recommend only what fits your organisation and budget, explained in plain language.",
  },
  {
    icon: "Sparkles",
    title: "Installed and taught",
    description: "We set everything up on-site and make sure your team is comfortable using it before we leave.",
  },
];
