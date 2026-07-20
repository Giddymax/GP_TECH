import Link from "next/link";
import { Inbox, Images, Wrench, Cpu } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

async function getLeadCounts() {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("status");
  const counts = { new: 0, contacted: 0, closed: 0, total: 0 };
  for (const row of data ?? []) {
    counts.total += 1;
    counts[row.status as keyof typeof counts] += 1;
  }
  return counts;
}

export default async function AdminDashboardPage() {
  const counts = await getLeadCounts();

  const quickLinks = [
    { href: "/admin/leads", label: "Leads", icon: Inbox, description: `${counts.new} new` },
    { href: "/admin/hero-slides", label: "Hero Slides", icon: Images, description: "Manage homepage photos" },
    { href: "/admin/services", label: "Services", icon: Wrench, description: "Edit the services catalogue" },
    { href: "/admin/hardware", label: "Hardware", icon: Cpu, description: "Edit business equipment" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">A quick look at what&apos;s new.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <p className="eyebrow text-accent-dark">New</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{counts.new}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <p className="eyebrow text-muted">Contacted</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{counts.contacted}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <p className="eyebrow text-muted">Closed</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{counts.closed}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-light text-accent-dark">
              <link.icon className="h-5 w-5" />
            </span>
            <span className="mt-4 font-semibold text-ink">{link.label}</span>
            <span className="mt-1 text-sm text-muted">{link.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
