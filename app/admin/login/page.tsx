import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Staff login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/brand/lockup-horizontal-white.png"
            alt="Grainy Palace Tech"
            width={198}
            height={48}
            className="h-9 w-auto"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-card">
          <h1 className="text-lg font-semibold text-off-white">Staff login</h1>
          <p className="mt-1 text-sm text-off-white/60">Sign in to edit the site.</p>
          <div className="mt-6">
            <LoginForm next={next ?? "/admin"} />
          </div>
        </div>
      </div>
    </div>
  );
}
