import type { Metadata } from "next";
import { AdminMfaPanel } from "@/components/admin/admin-mfa-panel";

export const metadata: Metadata = {
  title: "Staff MFA — Zatroz",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMfaPage() {
  return (
    <main className="mx-auto w-full max-w-reading px-gutter py-section">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
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
  );
}
