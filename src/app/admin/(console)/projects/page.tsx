import type { Metadata } from "next";
import { AdminProjectList } from "@/components/admin/admin-project-list";
import { parseProjectListQuery } from "@/lib/admin/projects";
import { listAdminProjects } from "@/server/projects/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { redirectForAuthDenial } from "@/server/security/admin-redirect";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — Zatroz admin",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    workStatus?: string | string[];
    publication?: string | string[];
    page?: string | string[];
    archived?: string | string[];
  }>;
};

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const gate = await requirePermissionSession("admin.content.read");
  if (!gate.ok) {
    redirectForAuthDenial(gate.reason);
  }

  const params = await searchParams;
  const query = parseProjectListQuery(params);
  const listed = await listAdminProjects(query);
  const canWrite = gate.context.permissions.includes("admin.content.write");

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Projects
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Create and edit portfolio drafts in MongoDB. Owner publish updates
          live Work pages after content-job refresh.
        </p>
      </header>

      <AdminProjectList
        items={listed.ok ? listed.items : null}
        total={listed.ok ? listed.total : 0}
        page={listed.ok ? listed.page : query.page}
        pageSize={listed.ok ? listed.pageSize : 10}
        search={query.search}
        workStatus={query.workStatus}
        publication={query.publication}
        archived={Boolean(query.archived)}
        unavailableDetail={listed.ok ? null : listed.detail}
        canWrite={canWrite}
      />
    </div>
  );
}
