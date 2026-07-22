"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Images,
  Wrench,
  Cpu,
  Info,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/login/actions";
import type { AdminUser } from "@/lib/supabase/admin-auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Images },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/hardware", label: "Hardware", icon: Cpu },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-off-white">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink text-off-white lg:flex">
        <div className="flex h-[72px] items-center px-6">
          <Image
            src="/brand/lockup-horizontal-white.png"
            alt="Grainy Palace Tech"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-white/10 text-accent-bright" : "text-off-white/70 hover:bg-white/5 hover:text-off-white",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-off-white/70 transition-colors hover:bg-white/5 hover:text-off-white"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
          <p className="truncate px-3 pt-2 text-xs text-off-white/40">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-off-white/70 transition-colors hover:bg-white/5 hover:text-off-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* min-w-0 overrides the flex item's default min-width:auto — without it,
          the horizontally-scrollable mobile pill nav below can force this
          whole column (and the page) wider than the viewport instead of
          scrolling within itself. */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3 lg:hidden">
          <Image
            src="/brand/lockup-horizontal.png"
            alt="Grainy Palace Tech"
            width={150}
            height={36}
            className="h-7 w-auto"
          />
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-1.5 text-sm font-medium text-muted">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 lg:hidden">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "bg-accent text-ink" : "text-muted hover:bg-blue-light",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
