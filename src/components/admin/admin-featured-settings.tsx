"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  orderCandidatesByFeatured,
  type FeaturedCandidate,
} from "@/lib/admin/featured";
import { Button } from "@/components/ui/button";
import { InlineStatus } from "@/components/forms/inline-status";
import {
  saveFeaturedSettingsAction,
  type FeaturedActionState,
} from "@/server/projects/featured-actions";

export type AdminFeaturedSettingsProps = {
  candidates: readonly FeaturedCandidate[];
  featuredProjectIds: readonly string[];
  concurrencyVersion: number;
};

const initial: FeaturedActionState | null = null;

export function AdminFeaturedSettings({
  candidates,
  featuredProjectIds,
  concurrencyVersion,
}: AdminFeaturedSettingsProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveFeaturedSettingsAction,
    initial,
  );
  const [order, setOrder] = useState<string[]>([...featuredProjectIds]);
  const [acknowledged, setAcknowledged] = useState(concurrencyVersion);

  const fromState =
    state?.ok && typeof state.concurrencyVersion === "number"
      ? state.concurrencyVersion
      : null;
  const effectiveConcurrency = Math.max(concurrencyVersion, fromState ?? 0);

  // Adjust local ack when the server action returns a newer concurrency token.
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

  const { featured, available } = orderCandidatesByFeatured(candidates, order);

  function move(id: string, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.indexOf(id);
      if (index < 0) return current;
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const tmp = next[index]!;
      next[index] = next[target]!;
      next[target] = tmp;
      return next;
    });
  }

  function add(id: string) {
    setOrder((current) => (current.includes(id) ? current : [...current, id]));
  }

  function remove(id: string) {
    setOrder((current) => current.filter((row) => row !== id));
  }

  const tone = pending
    ? "pending"
    : state?.ok
      ? "success"
      : state && !state.ok
        ? "error"
        : "idle";

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input
        type="hidden"
        name="concurrencyVersion"
        value={String(effectiveConcurrency)}
      />
      {order.map((id) => (
        <input key={id} type="hidden" name="featuredProjectIds" value={id} />
      ))}

      <section aria-labelledby="featured-order-heading">
        <h2
          id="featured-order-heading"
          className="text-lg font-semibold tracking-tight text-ink"
        >
          Homepage order
        </h2>
        <p className="ds-support mt-2">
          Only published summaries can be featured. Empty list hides the
          selected-work section. Public pages read the saved Mongo order.
        </p>

        {featured.length === 0 ? (
          <p className="mt-4 text-sm text-text-body" role="status">
            No featured projects yet.
          </p>
        ) : (
          <ol className="mt-4 flex flex-col gap-3">
            {featured.map((item, index) => (
              <li
                key={item.editorialId}
                className="flex flex-col gap-2 border-b border-border-subtle pb-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">
                    {index + 1}. {item.title}
                  </p>
                  <p className="ds-support">
                    {item.editorialId} · /work/{item.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="quiet"
                    size="compact"
                    disabled={index === 0}
                    onClick={() => move(item.editorialId, -1)}
                  >
                    Up
                  </Button>
                  <Button
                    type="button"
                    variant="quiet"
                    size="compact"
                    disabled={index === featured.length - 1}
                    onClick={() => move(item.editorialId, 1)}
                  >
                    Down
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="compact"
                    onClick={() => remove(item.editorialId)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="featured-available-heading">
        <h2
          id="featured-available-heading"
          className="text-lg font-semibold tracking-tight text-ink"
        >
          Published projects
        </h2>
        {available.length === 0 ? (
          <p className="mt-4 text-sm text-text-body" role="status">
            {candidates.length === 0
              ? "No published summaries yet. Publish a project summary first."
              : "All published projects are already featured."}
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {available.map((item) => (
              <li
                key={item.editorialId}
                className="flex flex-col gap-2 border-b border-border-subtle pb-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="ds-support">
                    {item.editorialId} · /work/{item.slug}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="compact"
                  onClick={() => add(item.editorialId)}
                >
                  Add to featured
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="primary" loading={pending}>
          Save featured order
        </Button>
        <InlineStatus tone={tone}>
          {pending
            ? "Saving…"
            : state?.ok
              ? state.message
              : state && !state.ok
                ? state.message
                : null}
        </InlineStatus>
      </div>
    </form>
  );
}
