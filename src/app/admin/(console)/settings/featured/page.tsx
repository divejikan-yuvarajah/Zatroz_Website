import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminFeaturedSettings } from "@/components/admin/admin-featured-settings";
import { ButtonLink } from "@/components/ui/button-link";
import { loadFeaturedSettings } from "@/server/projects/featured";
import { requirePermissionSession } from "@/server/security/auth-gate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Featured projects — Zatroz admin",
  robots: { index: false, follow: false },
};

export default async function AdminFeaturedSettingsPage() {
  const gate = await requirePermissionSession("admin.content.publish");
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const loaded = await loadFeaturedSettings();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Featured projects
          </h1>
          <p className="mt-2 max-w-prose text-text-body">
            Owner-only homepage selected-work order. Only public-ready
            (published summary) projects can be listed.
          </p>
        </div>
        <ButtonLink href="/admin/projects" variant="quiet" size="compact">
          Back to projects
        </ButtonLink>
      </header>

      {loaded.ok ? (
        <AdminFeaturedSettings
          candidates={loaded.candidates}
          featuredProjectIds={loaded.featuredProjectIds}
          concurrencyVersion={loaded.concurrencyVersion}
        />
      ) : (
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Featured settings unavailable</p>
          <p className="mt-1 text-sm">{loaded.detail}</p>
        </div>
      )}
    </div>
  );
}
