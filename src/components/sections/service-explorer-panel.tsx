"use client";

import { useState, useSyncExternalStore } from "react";
import type { PublicBusinessNeed } from "@/content/business-needs";
import { ButtonLink } from "@/components/ui/button-link";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function NeedDetail({
  need,
  headingId,
}: {
  need: PublicBusinessNeed;
  headingId: string;
}) {
  return (
    <div className="min-w-0">
      <h3 id={headingId} className="ds-h3 m-0">
        {need.title}
      </h3>
      <p className="mt-3 m-0 text-text-body">{need.explanation}</p>
      <p className="mt-4 m-0 text-text-body">
        <span className="font-medium text-ink">Typical deliverable. </span>
        {need.deliverable}
      </p>

      {need.services.length > 0 ? (
        <div className="mt-6">
          <p className="m-0 text-sm font-semibold text-ink">Related services</p>
          <ul className="mt-3 list-none space-y-3 p-0">
            {need.services.map((service) => (
              <li key={service.id} className="min-w-0">
                {service.href ? (
                  <TextLink href={service.href}>{service.title}</TextLink>
                ) : (
                  <p className="m-0 font-medium text-ink">{service.title}</p>
                )}
                <p className="mt-1 m-0 text-sm text-text-body">
                  {service.summary}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {need.relatedWork.length > 0 ? (
        <div className="mt-6">
          <p className="m-0 text-sm font-semibold text-ink">Related work</p>
          <ul className="mt-3 list-none space-y-2 p-0">
            {need.relatedWork.map((work) => (
              <li key={work.id} className="text-sm text-text-body">
                {work.href ? (
                  <TextLink href={work.href}>{work.title}</TextLink>
                ) : (
                  <span className="font-medium text-ink">{work.title}</span>
                )}
                <span className="text-text-muted">
                  {" "}
                  · {work.workStatusLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {need.action ? (
        <p className="mt-6 m-0">
          <ButtonLink href={need.action.href} className="w-full sm:w-auto">
            {need.action.label}
          </ButtonLink>
        </p>
      ) : null}
    </div>
  );
}

export type ServiceExplorerPanelProps = {
  needs: readonly PublicBusinessNeed[];
  defaultNeedId: string;
  idPrefix?: string;
};

/**
 * Disclosure-based business-need explorer.
 * One open panel at a time; mobile keeps detail under the trigger;
 * desktop places the open panel in a side column without a second widget.
 */
export function ServiceExplorerPanel({
  needs,
  defaultNeedId,
  idPrefix = "",
}: ServiceExplorerPanelProps) {
  const ready = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [openId, setOpenId] = useState<string | null>(defaultNeedId);

  const defaultNeed =
    needs.find((need) => need.id === defaultNeedId) ?? needs[0]!;

  function toggleNeed(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  if (!ready) {
    return (
      <div className="min-w-0">
        <ol className="m-0 list-none space-y-3 p-0">
          {needs.map((need) => (
            <li
              key={need.id}
              className="border-b border-border-subtle pb-3 text-base font-semibold text-ink last:border-b-0"
            >
              <span className="text-text-muted">{need.number}. </span>
              {need.title}
            </li>
          ))}
        </ol>
        <div className="mt-8 border-t border-border-subtle pt-8">
          <NeedDetail
            need={defaultNeed}
            headingId={`${idPrefix}${defaultNeed.id}-static-heading`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-w-0",
        "lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 lg:gap-y-0",
      )}
    >
      {needs.map((need) => {
        const expanded = openId === need.id;
        const panelId = `${idPrefix}${need.id}-panel`;
        const headingId = `${idPrefix}${need.id}-heading`;

        return (
          <div key={need.id} className="contents">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggleNeed(need.id)}
              className={cn(
                "flex min-h-14 w-full items-center gap-4 border-b border-border-subtle px-1 py-4 text-left",
                "lg:col-start-1",
                expanded
                  ? "border-l-4 border-l-ink bg-surface-muted pl-3 font-semibold text-ink"
                  : "border-l-4 border-l-transparent text-ink hover:bg-surface-muted/60",
              )}
            >
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-surface text-sm font-semibold text-ink ring-1 ring-inset ring-border-control"
                aria-hidden="true"
              >
                {need.number}
              </span>
              <span className="min-w-0 flex-1 text-base">{need.title}</span>
              <span className="shrink-0 text-sm font-medium text-text-muted">
                {expanded ? "Open" : "View"}
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!expanded}
              className={cn(
                "min-w-0 border-b border-border-subtle py-6 lg:border-b-0 lg:py-0",
                expanded
                  ? "lg:col-start-2 lg:row-start-1 lg:row-end-[-1] lg:self-start lg:sticky lg:top-28"
                  : null,
              )}
            >
              {expanded ? (
                <NeedDetail need={need} headingId={headingId} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
