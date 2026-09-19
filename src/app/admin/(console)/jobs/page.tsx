import type { Metadata } from "next";
import { AdminContentJobsPanel } from "@/components/admin/admin-content-jobs-panel";
import { listContentJobs } from "@/server/jobs/content-jobs";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { redirectForAuthDenial } from "@/server/security/admin-redirect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content jobs — Zatroz admin",
  robots: { index: false, follow: false },
};

export default async function AdminJobsPage() {
  const gate = await requirePermissionSession("admin.content.read");
  if (!gate.ok) {
    redirectForAuthDenial(gate.reason);
  }

  const listed = await listContentJobs({ limit: 50 });
  const canManage = gate.context.permissions.includes("admin.content.publish");

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Content jobs
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Publish and media refresh queue. Failed jobs stay recoverable; retries
          reuse the same dedupe key so duplicates are not created.
        </p>
      </header>

      <AdminContentJobsPanel
        items={listed.ok ? listed.items : null}
        unavailableDetail={listed.ok ? null : listed.detail}
        canManage={canManage}
      />
    </div>
  );
}
