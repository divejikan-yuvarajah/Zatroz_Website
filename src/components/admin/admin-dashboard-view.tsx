import type { AdminDashboardData } from "@/server/admin/dashboard";
import type { AdminShortcut } from "@/lib/admin/nav";
import { ButtonLink } from "@/components/ui/button-link";

export type AdminDashboardViewProps = {
  data: AdminDashboardData;
  shortcuts: readonly AdminShortcut[];
};

function CountCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="min-w-0 border-b border-border-subtle py-4 sm:border-b-0 sm:border-r sm:px-6 sm:py-2 sm:last:border-r-0 sm:first:pl-0">
      <p className="text-sm text-text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-ink tabular-nums">
        {value}
      </p>
      <p className="ds-support mt-2">{hint}</p>
    </div>
  );
}

export function AdminDashboardView({
  data,
  shortcuts,
}: AdminDashboardViewProps) {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Portfolio content status from MongoDB. Counts are real collection
          queries — empty collections show zero, not sample data.
        </p>
      </header>

      {!data.ok ? (
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Dashboard counts unavailable</p>
          <p className="mt-1 text-sm">{data.detail}</p>
        </div>
      ) : (
        <>
          <section aria-labelledby="admin-counts-heading">
            <h2 id="admin-counts-heading" className="sr-only">
              Content counts
            </h2>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-0">
              <CountCard
                label="Drafts"
                value={data.counts.drafts}
                hint="No published summary yet"
              />
              <CountCard
                label="Published"
                value={data.counts.published}
                hint="Published summary revision set"
              />
              <CountCard
                label="Needs attention"
                value={data.counts.needingReview}
                hint="Content jobs queued, leased, or failed"
              />
            </div>
            <p className="ds-support mt-4">
              Open{" "}
              <a
                href="/admin/jobs"
                className="font-medium text-ink underline underline-offset-4"
              >
                Content jobs
              </a>{" "}
              to run the refresh worker or re-queue failed work.
            </p>
          </section>

          <section aria-labelledby="admin-recent-heading">
            <h2
              id="admin-recent-heading"
              className="text-lg font-semibold text-ink"
            >
              Recent edits
            </h2>
            {data.recentEdits.length === 0 ? (
              <p className="ds-support mt-3">
                No audit events yet. Activity appears here after editors save
                drafts and owners publish.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border-subtle border-t border-border-subtle">
                {data.recentEdits.map((edit) => (
                  <li
                    key={edit.id}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        {edit.action}{" "}
                        <span className="font-normal text-text-muted">
                          · {edit.targetType}
                        </span>
                      </p>
                      <p className="truncate text-sm text-text-muted">
                        {edit.targetId || "—"} · {edit.outcome}
                      </p>
                    </div>
                    <time
                      className="shrink-0 text-sm text-text-muted tabular-nums"
                      dateTime={edit.createdAtIso}
                    >
                      {edit.createdAtIso
                        .replace("T", " ")
                        .replace(/\.\d+Z$/, " UTC")}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <section aria-labelledby="admin-shortcuts-heading">
        <h2
          id="admin-shortcuts-heading"
          className="text-lg font-semibold text-ink"
        >
          Shortcuts
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut.id}
              className="min-w-0 border-t border-border-subtle pt-4"
            >
              <p className="font-medium text-ink">{shortcut.label}</p>
              <p className="ds-support mt-1">{shortcut.description}</p>
              <div className="mt-3">
                {shortcut.available ? (
                  <ButtonLink
                    href={shortcut.href}
                    variant="secondary"
                    size="compact"
                  >
                    Open
                  </ButtonLink>
                ) : (
                  <p className="text-sm text-text-muted">
                    Not available yet
                    <span className="text-text-muted">
                      {" "}
                      · planned path{" "}
                      <code className="text-xs">{shortcut.href}</code>
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
