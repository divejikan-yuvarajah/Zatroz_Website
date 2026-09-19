import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { requireAdminSession } from "@/server/security/auth-gate";
import { resolveStaffAuthContext } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff sign-in — Zatroz",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const gate = await requireAdminSession();
  if (gate.ok) {
    redirect("/admin");
  }

  const context = await resolveStaffAuthContext();
  if (context.authenticated && !context.mfaCompleted) {
    redirect("/admin/mfa");
  }

  return (
    <div className="min-h-screen min-h-dvh bg-canvas">
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-reading px-gutter py-section focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:[outline-color:var(--ink)]"
      >
        <p className="text-xs font-medium tracking-wide text-text-muted uppercase">
          Zatroz staff
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Staff sign-in
        </h1>
        <p className="mt-3 max-w-prose text-text-body">
          Zatroz admin access for authorized staff only. There is no public
          registration.
        </p>
        <div className="mt-10">
          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
}
