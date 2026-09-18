export type RouteId =
  | "home"
  | "services"
  | "websitesEcommerce"
  | "webMobileApps"
  | "businessSystems"
  | "aiAutomation"
  | "customSoftware"
  | "uiUxDesign"
  | "work"
  | "about"
  | "process"
  | "contact"
  | "privacy"
  | "terms";

export type PublicRoute = {
  id: RouteId;
  path: string;
  /** True only when a real `page.tsx` exists for this path. */
  implemented: boolean;
};

/**
 * Canonical public paths. Flip `implemented` when the page file exists
 * and the content is ready for a shared header/footer link.
 */
export const publicRoutes: Record<RouteId, PublicRoute> = {
  home: { id: "home", path: "/", implemented: true },
  services: { id: "services", path: "/services", implemented: true },
  websitesEcommerce: {
    id: "websitesEcommerce",
    path: "/services/websites-ecommerce",
    implemented: false,
  },
  webMobileApps: {
    id: "webMobileApps",
    path: "/services/web-mobile-apps",
    implemented: false,
  },
  businessSystems: {
    id: "businessSystems",
    path: "/services/business-systems",
    implemented: false,
  },
  aiAutomation: {
    id: "aiAutomation",
    path: "/services/ai-automation",
    implemented: false,
  },
  customSoftware: {
    id: "customSoftware",
    path: "/services/custom-software",
    implemented: false,
  },
  uiUxDesign: {
    id: "uiUxDesign",
    path: "/services/ui-ux-design",
    implemented: false,
  },
  work: { id: "work", path: "/work", implemented: false },
  about: { id: "about", path: "/about", implemented: false },
  process: { id: "process", path: "/process", implemented: false },
  contact: { id: "contact", path: "/contact", implemented: false },
  privacy: { id: "privacy", path: "/privacy", implemented: false },
  terms: { id: "terms", path: "/terms", implemented: false },
};
