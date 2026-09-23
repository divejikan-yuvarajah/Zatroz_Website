import type { PublicationState } from "@/types/content";

export type EvidenceKind =
  | "project-demo"
  | "case-story"
  | "founder-achievement"
  | "team-achievement"
  | "company-intro";

export type EvidenceSubjectType = "company" | "person" | "team" | "project";

export type EvidenceSubject = {
  type: EvidenceSubjectType;
  label: string;
};

/**
 * Internal homepage evidence record.
 * `sourceReference` is verification-only — never project it publicly.
 */
export type EvidenceRecord = {
  id: string;
  claim: string;
  kind: EvidenceKind;
  subject: EvidenceSubject;
  /** Private verification note; omit from public props and HTML. */
  sourceReference: string;
  supportingLabel: string;
  /** Public link label such as "View prototype". Null when there is no URL. */
  linkLabel: string | null;
  /** Exact approved https URL or internal path. Null when claim has no public destination. */
  href: string | null;
  publicationState: PublicationState;
};

export type HomeEvidenceIntroRecord = {
  id: "home-evidence-intro";
  publicationState: PublicationState;
  heading: string;
  text: string;
};

/**
 * Proposed company introduction for the evidence strip.
 * Stays draft until founders approve exact wording. Not a proof claim.
 */
export const homeEvidenceIntro: HomeEvidenceIntroRecord = {
  id: "home-evidence-intro",
  publicationState: "approved",
  heading: "Why continue reading",
  text: "Zatroz builds digital tools that help businesses sell, serve customers, and manage everyday work. Verified project stories appear here when they are published.",
};

/**
 * Empty on purpose. No verified public proof items are approved yet
 * (see content inventory C-HOME-02). Do not invent testimonials, logos,
 * client counts, or percentage improvements.
 */
export const evidenceRecords: readonly EvidenceRecord[] = [];
