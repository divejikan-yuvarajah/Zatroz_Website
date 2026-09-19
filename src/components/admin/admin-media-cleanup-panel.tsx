"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { InlineStatus } from "@/components/forms/inline-status";
import type { CleanupCandidate } from "@/server/media/usage";
import {
  permanentlyDeleteMediaAction,
  type MediaCleanupActionState,
} from "@/server/jobs/actions";

const initial: MediaCleanupActionState | null = null;

export type AdminMediaCleanupPanelProps = {
  items: readonly CleanupCandidate[] | null;
  unavailableDetail: string | null;
  canDelete: boolean;
};

function DeleteForm({
  mediaId,
  versionId,
}: {
  mediaId: string;
  versionId: string;
}) {
  const [state, action, pending] = useActionState(
    permanentlyDeleteMediaAction,
    initial,
  );
  const tone = pending
    ? "pending"
    : state?.ok
      ? "success"
      : state && !state.ok
        ? "error"
        : "idle";

  return (
    <form
      action={action}
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Permanently delete ${mediaId}? This cannot be undone.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="mediaId" value={mediaId} />
      <input type="hidden" name="versionId" value={versionId} />
      <Button type="submit" variant="quiet" size="compact" loading={pending}>
        Permanent delete
      </Button>
      {state ? <InlineStatus tone={tone}>{state.message}</InlineStatus> : null}
    </form>
  );
}

export function AdminMediaCleanupPanel({
  items,
  unavailableDetail,
  canDelete,
}: AdminMediaCleanupPanelProps) {
  return (
    <section aria-labelledby="media-cleanup-heading">
      <h2 id="media-cleanup-heading" className="text-lg font-semibold text-ink">
        Safe cleanup
      </h2>
      <p className="ds-support mt-2 max-w-prose">
        Failed uploads and archived unused media. Permanent delete is owner-only
        and blocked when any project revision still references the asset.
      </p>

      {unavailableDetail ? (
        <p className="mt-3 text-sm text-warning" role="status">
          {unavailableDetail}
        </p>
      ) : !items || items.length === 0 ? (
        <p className="ds-support mt-3">No cleanup candidates.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border-subtle border-t border-border-subtle">
          {items.map(({ item, kind, usageCount }) => (
            <li
              key={`${item.mediaId}:${item.versionId}`}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{item.mediaId}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {kind === "failed-orphan"
                    ? "Failed orphan"
                    : "Archived unused"}{" "}
                  · {item.processingState} · usage {usageCount}
                </p>
              </div>
              {canDelete ? (
                <DeleteForm mediaId={item.mediaId} versionId={item.versionId} />
              ) : (
                <p className="text-sm text-text-muted">Owner only</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
