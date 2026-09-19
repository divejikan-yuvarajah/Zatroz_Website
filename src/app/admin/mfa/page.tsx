import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminMfaPanel } from "@/components/admin/admin-mfa-panel";
import { requireAdminSession } from "@/server/security/auth-gate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff MFA — Zatroz",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMfaPage() {
  const gate = await requireAdminSession();
  if (gate.ok) {
    redirect("/admin");
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
          Multi-factor authentication
        </h1>
        <p className="mt-3 max-w-prose text-text-body">
          Complete MFA before content administration. Use your authenticator app
          or a one-time backup code.
        </p>
        <div className="mt-10">
          <AdminMfaPanel />
        </div>
      </main>
    </div>
  );
}
