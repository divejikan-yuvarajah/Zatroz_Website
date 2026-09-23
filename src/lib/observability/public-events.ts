import { SERVICE_SLUGS, type ServiceSlug } from "@/types/content";

/**
 * Public product events. Browser delivery stays disabled until a consent
 * decision exists. These names are not enquiry totals.
 */
export const PUBLIC_EVENT_NAMES = [
  "service_cta_clicked",
  "work_detail_viewed",
  "contact_started",
  "contact_submit_attempted",
  "contact_accepted",
  "contact_alternative_clicked",
] as const;

export type PublicEventName = (typeof PUBLIC_EVENT_NAMES)[number];

export const PUBLIC_ROUTE_TEMPLATES = [
  "/",
  "/services",
  "/services/[slug]",
  "/work",
  "/work/[slug]",
  "/about",
  "/process",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export type PublicRouteTemplate = (typeof PUBLIC_ROUTE_TEMPLATES)[number];

export const PUBLIC_PLACEMENTS = [
  "hero",
  "service-detail",
  "services-overview",
  "contact",
  "work-detail",
  "footer",
] as const;

export type PublicPlacement = (typeof PUBLIC_PLACEMENTS)[number];

export const PUBLIC_OUTCOMES = [
  "click",
  "view",
  "started",
  "attempted",
  "accepted",
  "alternative",
] as const;

export type PublicOutcome = (typeof PUBLIC_OUTCOMES)[number];

export const PUBLIC_CHANNELS = ["email", "whatsapp", "phone"] as const;

export type PublicChannel = (typeof PUBLIC_CHANNELS)[number];

export type PublicEventProperties = Readonly<{
  serviceKey?: ServiceSlug | "not-sure";
  routeTemplate?: PublicRouteTemplate;
  placement?: PublicPlacement;
  outcome?: PublicOutcome;
  channel?: PublicChannel;
}>;

export type PublicEventDraft = Readonly<{
  name: string;
  properties?: Readonly<Record<string, unknown>>;
  routePath?: string;
}>;

export type SanitizedPublicEvent = Readonly<{
  name: PublicEventName;
  properties: PublicEventProperties;
}>;

const SERVICE_KEYS = new Set<string>([...SERVICE_SLUGS, "not-sure"]);
const NAMES = new Set<string>(PUBLIC_EVENT_NAMES);
const ROUTES = new Set<string>(PUBLIC_ROUTE_TEMPLATES);
const PLACEMENTS = new Set<string>(PUBLIC_PLACEMENTS);
const OUTCOMES = new Set<string>(PUBLIC_OUTCOMES);
const CHANNELS = new Set<string>(PUBLIC_CHANNELS);

const CANARY = /canary|password|secret|token|bearer/i;

function cleanToken(
  value: unknown,
  allow: Set<string>,
  options?: { allowSlash?: boolean },
): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 80) return undefined;
  if (trimmed.includes("?") || trimmed.includes("@")) return undefined;
  if (!options?.allowSlash && trimmed.includes("/")) return undefined;
  if (trimmed.includes("://")) return undefined;
  if (CANARY.test(trimmed)) return undefined;
  if (!allow.has(trimmed)) return undefined;
  return trimmed;
}

/**
 * Drop unknown fields, raw URLs, query strings, and anything that looks like
 * a message, address, or secret. Returns null when the event must not be stored.
 */
export function sanitizePublicEvent(
  draft: PublicEventDraft,
): SanitizedPublicEvent | null {
  const routePath = draft.routePath?.trim() ?? "";
  if (routePath.startsWith("/admin") || routePath.startsWith("/api/admin")) {
    return null;
  }

  if (!NAMES.has(draft.name)) return null;

  const raw = draft.properties ?? {};
  const properties: {
    serviceKey?: ServiceSlug | "not-sure";
    routeTemplate?: PublicRouteTemplate;
    placement?: PublicPlacement;
    outcome?: PublicOutcome;
    channel?: PublicChannel;
  } = {};

  const serviceKey = cleanToken(raw.serviceKey, SERVICE_KEYS);
  if (serviceKey)
    properties.serviceKey = serviceKey as ServiceSlug | "not-sure";

  const routeTemplate = cleanToken(raw.routeTemplate, ROUTES, {
    allowSlash: true,
  });
  if (routeTemplate) {
    properties.routeTemplate = routeTemplate as PublicRouteTemplate;
  }

  const placement = cleanToken(raw.placement, PLACEMENTS);
  if (placement) properties.placement = placement as PublicPlacement;

  const outcome = cleanToken(raw.outcome, OUTCOMES);
  if (outcome) properties.outcome = outcome as PublicOutcome;

  const channel = cleanToken(raw.channel, CHANNELS);
  if (channel) properties.channel = channel as PublicChannel;

  return { name: draft.name as PublicEventName, properties };
}
