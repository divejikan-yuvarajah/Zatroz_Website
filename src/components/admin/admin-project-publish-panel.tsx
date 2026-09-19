"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InlineStatus } from "@/components/forms/inline-status";
import type { ProjectPublicationStatus } from "@/lib/admin/publish";
import {
  archiveProjectAction,
  publishStoryAction,
  publishSummaryAction,
  restoreProjectAction,
  unpublishStoryAction,
  unpublishSummaryAction,
  type PublishActionState,
} from "@/server/projects/publish-actions";

export type AdminProjectPublishPanelProps = {
  editorialId: string;
  concurrencyVersion: number;
  status: ProjectPublicationStatus;
  summaryReady: boolean;
  storyReady: boolean;
  archived: boolean;
  canPublish: boolean;
  canArchive: boolean;
  summaryReadyMessage?: string | null;
  storyReadyMessage?: string | null;
  /** When summary is live but a refresh job is still open. */
  refreshPendingLabel?: string | null;
};

const initial: PublishActionState | null = null;

function ActionForm({
  action,
  editorialId,
  concurrencyVersion,
  label,
  confirm,
  variant = "secondary",
}: {
  action: (
    prev: PublishActionState | null,
    formData: FormData,
  ) => Promise<PublishActionState>;
  editorialId: string;
  concurrencyVersion: number;
  label: string;
  confirm?: string;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initial);
  const [acknowledged, setAcknowledged] = useState(concurrencyVersion);

  const fromState =
    state?.ok && typeof state.concurrencyVersion === "number"
      ? state.concurrencyVersion
      : null;
  const effectiveConcurrency = Math.max(concurrencyVersion, fromState ?? 0);

  if (
    state?.ok &&
    typeof state.concurrencyVersion === "number" &&
    state.concurrencyVersion !== acknowledged
  ) {
    setAcknowledged(state.concurrencyVersion);
  }

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const tone = pending
    ? "pending"
    : state?.ok
      ? "success"
      : state && !state.ok
        ? "error"
        : "idle";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="editorialId" value={editorialId} />
      <input
        type="hidden"
        name="concurrencyVersion"
        value={String(effectiveConcurrency)}
      />
      <Button type="submit" variant={variant} size="compact" loading={pending}>
        {label}
      </Button>
      <InlineStatus tone={tone}>
        {pending
          ? "Working…"
          : state?.ok
            ? state.message
            : state && !state.ok
              ? state.message
              : null}
      </InlineStatus>
    </form>
  );
}

export function AdminProjectPublishPanel({
  editorialId,
  concurrencyVersion,
  status,
  summaryReady,
  storyReady,
  archived,
  canPublish,
  canArchive,
  summaryReadyMessage,
  storyReadyMessage,
  refreshPendingLabel,
}: AdminProjectPublishPanelProps) {
  return (
    <section
      aria-labelledby="publish-panel-heading"
      className="rounded-md border border-border-subtle p-5"
    >
      <h2
        id="publish-panel-heading"
        className="text-lg font-semibold tracking-tight text-ink"
      >
        Publication
      </h2>
      <p className="ds-support mt-2">
        Summary and story publish independently. Pointers update immediately;
        public cache refresh runs via content jobs (see Admin → Jobs).
      </p>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Summary</dt>
          <dd className="font-medium text-ink">
            {status.summaryPublished
              ? refreshPendingLabel || "Published"
              : "Draft"}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Story</dt>
          <dd className="font-medium text-ink">
            {status.storyPublished ? "Published" : "Not published"}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Canonical slug</dt>
          <dd className="font-medium text-ink">
            {status.canonicalPublishedSlug ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Draft slug</dt>
          <dd className="font-medium text-ink">{status.draftSlug}</dd>
        </div>
      </dl>

      {archived ? (
        <p className="mt-4 rounded-md bg-warning-soft p-3 text-sm text-warning">
          This project is archived.
        </p>
      ) : null}

      {status.slugWillRedirectOnPublish && !archived ? (
        <p className="mt-4 rounded-md bg-warning-soft p-3 text-sm text-warning">
          Publishing the summary will record a redirect from{" "}
          <code>/work/{status.canonicalPublishedSlug}</code> to{" "}
          <code>/work/{status.draftSlug}</code>.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {canPublish && !archived ? (
          <>
            {!status.summaryPublished ? (
              <div>
                {!summaryReady && summaryReadyMessage ? (
                  <p className="ds-support mb-2">{summaryReadyMessage}</p>
                ) : null}
                <ActionForm
                  action={publishSummaryAction}
                  editorialId={editorialId}
                  concurrencyVersion={concurrencyVersion}
                  label="Publish summary"
                  variant="primary"
                  confirm="Publish the summary draft to the live Mongo pointer?"
                />
              </div>
            ) : (
              <ActionForm
                action={unpublishSummaryAction}
                editorialId={editorialId}
                concurrencyVersion={concurrencyVersion}
                label="Unpublish summary"
                confirm="Unpublish summary and story? The slug stays reserved."
              />
            )}

            {status.summaryPublished && !status.storyPublished ? (
              <div>
                {!storyReady && storyReadyMessage ? (
                  <p className="ds-support mb-2">{storyReadyMessage}</p>
                ) : null}
                <ActionForm
                  action={publishStoryAction}
                  editorialId={editorialId}
                  concurrencyVersion={concurrencyVersion}
                  label="Publish story"
                  variant="primary"
                  confirm="Publish the case-study story?"
                />
              </div>
            ) : null}

            {status.storyPublished ? (
              <ActionForm
                action={unpublishStoryAction}
                editorialId={editorialId}
                concurrencyVersion={concurrencyVersion}
                label="Unpublish story"
                confirm="Unpublish the case-study story only?"
              />
            ) : null}
          </>
        ) : null}

        {canArchive && !archived ? (
          <ActionForm
            action={archiveProjectAction}
            editorialId={editorialId}
            concurrencyVersion={concurrencyVersion}
            label="Archive project"
            confirm="Archive this project? It leaves the active list and unpublishes if live."
          />
        ) : null}

        {canArchive && archived ? (
          <ActionForm
            action={restoreProjectAction}
            editorialId={editorialId}
            concurrencyVersion={concurrencyVersion}
            label="Restore from archive"
            variant="primary"
          />
        ) : null}

        {!canPublish && !canArchive ? (
          <p className="ds-support">
            You can review publication status but need owner permission to
            publish, or write permission to archive.
          </p>
        ) : null}
      </div>
    </section>
  );
}
