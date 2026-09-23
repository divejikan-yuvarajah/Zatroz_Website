import { SERVICE_SLUGS } from "@/types/content";
import { capturePublicEvent } from "@/lib/observability/capture";
import { resolveAnalyticsMode } from "@/lib/observability/sink";

const SERVICE_KEYS = new Set<string>(SERVICE_SLUGS);

function serviceKey(value: string): string {
  return SERVICE_KEYS.has(value) ? value : "not-sure";
}

/**
 * Best-effort note after a new durable enquiry insert.
 * Replays are ignored so retries do not inflate this sink.
 * Failure here must not change the enquiry response.
 */
export function noteEnquiryAccepted(input: {
  duplicated: boolean;
  service: string;
  correlationId: string;
  elapsedMs: number;
  analyticsSink?: string;
}): void {
  if (input.duplicated) return;
  try {
    const correlation = /^z-[a-f0-9]{16}$/.test(input.correlationId)
      ? input.correlationId
      : "redacted";
    const elapsed = Number.isFinite(input.elapsedMs)
      ? Math.max(0, Math.round(input.elapsedMs))
      : 0;
    console.info(
      `[ops] code=enquiry.accepted route=/contact correlationId=${correlation} elapsedMs=${elapsed} service=${serviceKey(input.service)}`,
    );
    capturePublicEvent(
      resolveAnalyticsMode(input.analyticsSink),
      {
        name: "contact_accepted",
        routePath: "/contact",
        properties: {
          serviceKey: serviceKey(input.service),
          routeTemplate: "/contact",
          placement: "contact",
          outcome: "accepted",
        },
      },
      `enquiry.accepted:${correlation}`,
    );
  } catch {
    // Telemetry must not affect acceptance.
  }
}
