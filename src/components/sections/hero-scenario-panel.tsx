"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { BusinessWorkflowVisual } from "@/components/sections/business-workflow-visual";
import { ButtonLink } from "@/components/ui/button-link";
import type { HeroScenario, PublicCta } from "@/content/home";
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

export type HeroScenarioPanelProps = {
  scenarios: readonly HeroScenario[];
  defaultScenarioId: string;
  workflowCaption: string;
  scenarioServiceLinks: Readonly<Record<string, PublicCta | null>>;
  idPrefix?: string;
};

/**
 * Scenario selector + workflow visual only.
 * Headline and main CTAs stay outside this client boundary.
 */
export function HeroScenarioPanel({
  scenarios,
  defaultScenarioId,
  workflowCaption,
  scenarioServiceLinks,
  idPrefix = "",
}: HeroScenarioPanelProps) {
  const groupLabelId = useId();
  const ready = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [selectedId, setSelectedId] = useState(defaultScenarioId);
  const [status, setStatus] = useState("");

  const selected =
    scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0]!;
  const serviceLink = scenarioServiceLinks[selected.id] ?? null;

  function selectScenario(scenario: HeroScenario) {
    setSelectedId(scenario.id);
    setStatus(`Showing ${scenario.title} example`);
  }

  return (
    <div className="min-w-0">
      {ready ? (
        <div
          role="group"
          aria-labelledby={groupLabelId}
          className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
        >
          <p id={groupLabelId} className="sr-only">
            Example workflows
          </p>
          {scenarios.map((scenario) => {
            const pressed = scenario.id === selected.id;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => selectScenario(scenario)}
                className={cn(
                  "inline-flex min-h-11 w-full items-center justify-center rounded-sm px-3 py-2 text-base font-medium sm:w-auto",
                  pressed
                    ? "bg-surface text-ink ring-2 ring-inset ring-ink"
                    : "bg-transparent text-ink ring-1 ring-inset ring-border-control hover:bg-surface-muted",
                )}
              >
                {scenario.title}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <BusinessWorkflowVisual
        scenario={selected}
        caption={workflowCaption}
        idPrefix={idPrefix}
        className="min-w-0"
      />

      {serviceLink ? (
        <p className="mt-4">
          <ButtonLink
            href={serviceLink.href}
            variant="secondary"
            size="compact"
          >
            {serviceLink.label}
          </ButtonLink>
        </p>
      ) : null}
    </div>
  );
}
