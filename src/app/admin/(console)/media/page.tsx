import type { Metadata } from "next";
import { AdminMediaLibrary } from "@/components/admin/admin-media-library";
import { AdminMediaUploadForm } from "@/components/admin/admin-media-upload-form";
import { isCloudinaryConfigured } from "@/lib/media/config";
import { listMediaLibrary } from "@/server/media/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media — Zatroz admin",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function AdminMediaPage({ searchParams }: PageProps) {
  const gate = await requirePermissionSession("admin.content.read");
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const rawQ = params.q;
  const search = Array.isArray(rawQ) ? (rawQ[0] ?? "") : (rawQ ?? "");

  const listed = await listMediaLibrary({ search });
  const canWrite = gate.context.permissions.includes("admin.content.write");

  return (
    <div className="flex flex-col gap-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Media
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Private Cloudinary uploads with MongoDB metadata. Folder names are not
          access control — drafts use authenticated delivery and signed
          previews. Replacing an asset creates a new immutable version.
        </p>
      </header>

      {canWrite ? (
        <section aria-labelledby="media-upload-heading">
          <h2
            id="media-upload-heading"
            className="text-lg font-semibold text-ink"
          >
            Upload
          </h2>
          <div className="mt-4">
            <AdminMediaUploadForm />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="media-library-heading">
        <h2
          id="media-library-heading"
          className="text-lg font-semibold text-ink"
        >
          Library
        </h2>
        <div className="mt-4">
          <AdminMediaLibrary
            items={listed.ok ? listed.items : null}
            total={listed.ok ? listed.total : 0}
            unavailableDetail={listed.ok ? null : listed.detail}
            search={search.trim()}
            providerReady={isCloudinaryConfigured()}
          />
        </div>
      </section>
    </div>
  );
}
