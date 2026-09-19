import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Staff sign-in — Zatroz",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto w-full max-w-reading px-gutter py-section">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
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
  );
}
