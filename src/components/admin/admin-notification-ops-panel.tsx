"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { InlineStatus } from "@/components/forms/inline-status";
import type { NotificationOpsRow } from "@/server/repositories/enquiries";
import {
  notificationRecoveryAction,
  type NotificationRecoveryActionState,
} from "@/server/jobs/notification-recovery-actions";

const initial: NotificationRecoveryActionState | null = null;

function RecoveryForm(props: {
  publicReference: string;
  expectedRecoveryVersion: number;
  action:
    "pause" | "resume" | "retry-now" | "mark-reviewed" | "authorize-resend";
  label: string;
}) {
  const [state, formAction, pending] = useActionState(
    notificationRecoveryAction,
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
    <form action={formAction} className="flex flex-col gap-2">
      <input
        type="hidden"
        name="publicReference"
        value={props.publicReference}
      />
      <input
        type="hidden"
        name="expectedRecoveryVersion"
        value={String(props.expectedRecoveryVersion)}
      />
      <input type="hidden" name="action" value={props.action} />
      <label
        className="sr-only"
        htmlFor={`reason-${props.publicReference}-${props.action}`}
      >
        Reason
      </label>
      <input
        id={`reason-${props.publicReference}-${props.action}`}
        name="reason"
        required
        minLength={3}
        maxLength={200}
        placeholder="Reason"
        className="rounded border border-border bg-surface px-2 py-1 text-sm text-ink"
      />
      <Button type="submit" variant="quiet" size="compact" loading={pending}>
        {props.label}
      </Button>
      {state ? <InlineStatus tone={tone}>{state.message}</InlineStatus> : null}
    </form>
  );
}

export function AdminNotificationOpsPanel(props: {
  rows: readonly NotificationOpsRow[] | null;
  unavailableDetail: string | null;
  canManage: boolean;
  summary: {
    pending: number;
    retryScheduled: number;
    uncertain: number;
    needsReview: number;
    permanentlyFailed: number;
    paused: number;
    oldestPendingAgeMs: number | null;
  } | null;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="notification-summary-heading">
        <h2
          id="notification-summary-heading"
          className="text-lg font-semibold text-ink"
        >
          Queue health
        </h2>
        {props.summary ? (
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm text-text-muted">Pending</dt>
              <dd className="text-xl font-semibold text-ink">
                {props.summary.pending}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">Retry scheduled</dt>
              <dd className="text-xl font-semibold text-ink">
                {props.summary.retryScheduled}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">Uncertain</dt>
              <dd className="text-xl font-semibold text-ink">
                {props.summary.uncertain}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">Needs review</dt>
              <dd className="text-xl font-semibold text-ink">
                {props.summary.needsReview}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">Permanently failed</dt>
              <dd className="text-xl font-semibold text-ink">
                {props.summary.permanentlyFailed}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">Oldest pending age</dt>
              <dd className="text-xl font-semibold text-ink">
                {props.summary.oldestPendingAgeMs == null
                  ? "—"
                  : `${Math.round(props.summary.oldestPendingAgeMs / 60000)} min`}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-text-body">Summary unavailable.</p>
        )}
      </section>

      <section aria-labelledby="notification-list-heading">
        <h2
          id="notification-list-heading"
          className="text-lg font-semibold text-ink"
        >
          Recovery queue
        </h2>
        {props.unavailableDetail ? (
          <p className="mt-2 text-text-body">{props.unavailableDetail}</p>
        ) : null}
        {!props.rows || props.rows.length === 0 ? (
          <p className="mt-3 text-text-body">
            No notification intents need attention.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-6">
            {props.rows.map((row) => (
              <li
                key={row.publicReference}
                className="border-t border-border pt-4"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-ink">
                    Reference {row.publicReference}
                  </p>
                  <p className="text-sm text-text-body">
                    State: {row.state} · Attempts: {row.attempts}
                    {row.lastErrorCategory
                      ? ` · Error: ${row.lastErrorCategory}`
                      : ""}
                    {row.deliveryFact ? ` · Delivery: ${row.deliveryFact}` : ""}
                    {row.providerMessageId
                      ? ` · Provider id: ${row.providerMessageId}`
                      : ""}
                  </p>
                  {props.canManage ? (
                    <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <RecoveryForm
                        publicReference={row.publicReference}
                        expectedRecoveryVersion={row.recoveryVersion}
                        action="retry-now"
                        label="Retry now"
                      />
                      <RecoveryForm
                        publicReference={row.publicReference}
                        expectedRecoveryVersion={row.recoveryVersion}
                        action="pause"
                        label="Pause"
                      />
                      <RecoveryForm
                        publicReference={row.publicReference}
                        expectedRecoveryVersion={row.recoveryVersion}
                        action="resume"
                        label="Resume"
                      />
                      <RecoveryForm
                        publicReference={row.publicReference}
                        expectedRecoveryVersion={row.recoveryVersion}
                        action="mark-reviewed"
                        label="Mark reviewed"
                      />
                      <RecoveryForm
                        publicReference={row.publicReference}
                        expectedRecoveryVersion={row.recoveryVersion}
                        action="authorize-resend"
                        label="Authorize new resend"
                      />
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
