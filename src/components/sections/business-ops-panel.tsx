"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type OpsViewId = "sales" | "inventory" | "reporting";

const VIEWS: readonly {
  id: OpsViewId;
  label: string;
  title: string;
  body: readonly string[];
  note: string;
}[] = [
  {
    id: "sales",
    label: "Sales",
    title: "Sample sale recorded",
    body: [
      "Item: Blue Notebook (sample)",
      "Quantity: 2",
      "Next step: team reviews or corrects if needed",
    ],
    note: "Sample only — no payment taken, no receipt printed.",
  },
  {
    id: "inventory",
    label: "Inventory",
    title: "Sample stock after that sale",
    body: [
      "Blue Notebook on hand: 10 → 8 (sample)",
      "Movement reason: sample sale line",
      "Correction stays a named role’s responsibility",
    ],
    note: "Sample quantities only — not live stock and not stored anywhere.",
  },
  {
    id: "reporting",
    label: "Reporting",
    title: "Sample operational line",
    body: [
      "Today’s sample sales lines: 1",
      "Blue Notebook sold (sample): 2",
      "Export or deeper reports only when scoped",
    ],
    note: "Illustrative figures — not a financial statement or live total.",
  },
];

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * Local Sales / Inventory / Reporting selector for the business-systems example.
 * Consistent fictional quantities; no database, payment, print, or hardware access.
 */
export function BusinessOpsPanel() {
  const groupLabelId = useId();
  const ready = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [selectedId, setSelectedId] = useState<OpsViewId>("sales");
  const [status, setStatus] = useState("");

  const selected = VIEWS.find((view) => view.id === selectedId) ?? VIEWS[0]!;

  return (
    <div className="mt-8">
      <p className="m-0 text-sm text-text-muted">
        Illustrative operations panel — sample products and quantities only.
        Recording a view here does not change stock, take payment, or write
        files.
      </p>

      {ready ? (
        <div
          role="group"
          aria-labelledby={groupLabelId}
          className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
        >
          <p id={groupLabelId} className="sr-only">
            Sample operations views
          </p>
          {VIEWS.map((view) => {
            const pressed = view.id === selected.id;
            return (
              <button
                key={view.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => {
                  setSelectedId(view.id);
                  setStatus(`Showing ${view.label} sample view`);
                }}
                className={cn(
                  "inline-flex min-h-11 w-full items-center justify-center rounded-sm px-3 py-2 text-base font-medium sm:w-auto",
                  pressed
                    ? "bg-surface text-ink ring-2 ring-inset ring-ink"
                    : "bg-transparent text-ink ring-1 ring-inset ring-border-control hover:bg-surface-muted",
                )}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <div className="mt-4 overflow-hidden rounded-md border border-border-subtle bg-canvas">
        <div className="border-b border-border-subtle bg-surface-muted px-4 py-2">
          <p className="m-0 text-xs font-medium text-text-muted">
            Sample · {selected.label}
          </p>
        </div>
        <div className="p-4">
          <p className="m-0 font-semibold text-ink">{selected.title}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-text-body">
            {selected.body.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-3 m-0 text-xs text-text-muted">{selected.note}</p>
        </div>
      </div>

      {!ready ? (
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-text-body">
          {VIEWS.map((view) => (
            <li key={view.id}>
              <span className="font-medium text-ink">{view.label}: </span>
              {view.body.join(" · ")}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
