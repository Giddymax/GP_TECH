import { requireUser } from "@/lib/supabase/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
