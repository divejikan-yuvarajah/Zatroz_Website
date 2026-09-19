"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { InlineStatus } from "@/components/forms/inline-status";
import type { ContentJobListItem } from "@/server/jobs/content-jobs";
import {
  retryContentJobAction,
  runContentJobsAction,
  type JobsActionState,
} from "@/server/jobs/actions";

const initial: JobsActionState | null = null;

export type AdminContentJobsPanelProps = {
  items: readonly ContentJobListItem[] | null;
  unavailableDetail: string | null;
  canManage: boolean;
};

function JobRetryForm({ jobId }: { jobId: string }) {
  const [state, action, pending] = useActionState(
    retryContentJobAction,
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
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="jobId" value={jobId} />
      <Button type="submit" variant="quiet" size="compact" loading={pending}>
        Re-queue
      </Button>
      {state ? <InlineStatus tone={tone}>{state.message}</InlineStatus> : null}
    </form>
  );
}

export function AdminContentJobsPanel({
  items,
  unavailableDetail,
  canManage,
}: AdminContentJobsPanelProps) {
  const [runState, runAction, runPending] = useActionState(
    runContentJobsAction,
    initial,
  );
  const runTone = runPending
    ? "pending"
    : runState?.ok
      ? "success"
      : runState && !runState.ok
        ? "error"
        : "idle";

  return (
    <div className="flex flex-col gap-8">
      {canManage ? (
        <section aria-labelledby="jobs-run-heading">
          <h2 id="jobs-run-heading" className="text-lg font-semibold text-ink">
            Run worker
          </h2>
          <p className="ds-support mt-2 max-w-prose">
            Processes queued publish-refresh jobs: prepares public media
            derivatives when needed, then revalidates public paths. Retries use
            backoff and never create duplicate rows for the same dedupe key.
          </p>
          <form action={runAction} className="mt-4 flex flex-col gap-2">
            <Button
              type="submit"
              variant="secondary"
              size="compact"
              loading={runPending}
            >
              Process due jobs
            </Button>
            {runState ? (
              <InlineStatus tone={runTone}>{runState.message}</InlineStatus>
            ) : null}
          </form>
        </section>
      ) : null}

      <section aria-labelledby="jobs-list-heading">
        <h2 id="jobs-list-heading" className="text-lg font-semibold text-ink">
          Recent jobs
        </h2>
        {unavailableDetail ? (
          <p className="mt-3 text-sm text-warning" role="status">
            {unavailableDetail}
          </p>
        ) : !items || items.length === 0 ? (
          <p className="ds-support mt-3">No content jobs yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border-subtle border-t border-border-subtle">
            {items.map((job) => (
              <li
                key={job.jobId}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {job.state}{" "}
                    <span className="font-normal text-text-muted">
                      · {job.attempts} attempt
                      {job.attempts === 1 ? "" : "s"}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-sm text-text-muted">
                    {job.dedupeKey}
                  </p>
                  <p className="mt-1 text-sm text-text-muted tabular-nums">
                    {job.updatedAtIso
                      .replace("T", " ")
                      .replace(/\.\d+Z$/, " UTC")}
                    {job.nextRunAtIso
                      ? ` · next ${job.nextRunAtIso
                          .replace("T", " ")
                          .replace(/\.\d+Z$/, " UTC")}`
                      : null}
                  </p>
                </div>
                {canManage && job.state === "failed" ? (
                  <JobRetryForm jobId={job.jobId} />
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
