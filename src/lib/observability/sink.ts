import type { SanitizedPublicEvent } from "@/lib/observability/public-events";

export type AnalyticsMode = "disabled" | "local";

const MAX_EVENTS = 50;
const MAX_DEDUPE = 200;

let events: SanitizedPublicEvent[] = [];
const dedupeKeys: string[] = [];

export function resetObservabilitySink(): void {
  events = [];
  dedupeKeys.length = 0;
}

export function readObservabilitySink(): readonly SanitizedPublicEvent[] {
  return events;
}

/**
 * Local test sink only. Disabled mode stores nothing and does not queue.
 */
export function rememberPublicEvent(
  mode: AnalyticsMode,
  event: SanitizedPublicEvent,
  dedupeKey?: string,
): boolean {
  if (mode !== "local") return false;
  if (dedupeKey) {
    if (dedupeKeys.includes(dedupeKey)) return false;
    dedupeKeys.push(dedupeKey);
    if (dedupeKeys.length > MAX_DEDUPE) dedupeKeys.shift();
  }
  events = [...events, event].slice(-MAX_EVENTS);
  return true;
}

export function resolveAnalyticsMode(raw: string | undefined): AnalyticsMode {
  return raw?.trim() === "local" ? "local" : "disabled";
}
