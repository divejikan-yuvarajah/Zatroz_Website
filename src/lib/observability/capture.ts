import {
  sanitizePublicEvent,
  type PublicEventDraft,
} from "@/lib/observability/public-events";
import {
  rememberPublicEvent,
  type AnalyticsMode,
} from "@/lib/observability/sink";

export type CaptureResult = Readonly<{
  stored: boolean;
  reason: "stored" | "disabled" | "rejected" | "duplicate" | "browser-disabled";
}>;

export function capturePublicEvent(
  mode: AnalyticsMode,
  draft: PublicEventDraft,
  dedupeKey?: string,
): CaptureResult {
  if (mode !== "local") {
    return { stored: false, reason: "disabled" };
  }
  const event = sanitizePublicEvent(draft);
  if (!event) return { stored: false, reason: "rejected" };
  const stored = rememberPublicEvent(mode, event, dedupeKey);
  return stored
    ? { stored: true, reason: "stored" }
    : { stored: false, reason: "duplicate" };
}

/**
 * Browser product analytics. Always disabled: the privacy notice has no
 * consent decision for optional tracking, and no vendor SDK is loaded.
 * Calls must not throw or block navigation.
 */
export function captureBrowserEvent(
  draft: PublicEventDraft,
  dedupeKey?: string,
): CaptureResult {
  void draft;
  void dedupeKey;
  return { stored: false, reason: "browser-disabled" };
}
