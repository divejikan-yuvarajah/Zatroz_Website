import type { HomeAutomationExampleRecord } from "@/content/automation-example";
import { homeAutomationExampleRecord } from "@/content/automation-example";
import type {
  BusinessNeedRecord,
  HomeServiceExplorerRecord,
} from "@/content/business-needs";
import {
  businessNeedRecords,
  homeServiceExplorerRecord,
} from "@/content/business-needs";
import type {
  EvidenceRecord,
  HomeEvidenceIntroRecord,
} from "@/content/evidence";
import { evidenceRecords, homeEvidenceIntro } from "@/content/evidence";
import type { FaqRecord } from "@/content/faqs";
import { faqRecords } from "@/content/faqs";
import type { FounderRecord } from "@/content/founders";
import { founderRecords } from "@/content/founders";
import { homeSelectedWorkRecord } from "@/content/home";
import type { MediaRecord } from "@/content/media";
import { mediaRecords } from "@/content/media";
import type { ProjectRecord } from "@/content/projects";
import { projectRecords } from "@/content/projects";
import type { ServiceRecord } from "@/content/services";
import { serviceRecords } from "@/content/services";
import type { ContactRecord, SiteRecord } from "@/content/site";
import { contactRecord, siteRecord } from "@/content/site";

export type ContentCatalog = {
  site: SiteRecord;
  contact: ContactRecord;
  services: readonly ServiceRecord[];
  projects: readonly ProjectRecord[];
  founders: readonly FounderRecord[];
  faqs: readonly FaqRecord[];
  media: readonly MediaRecord[];
  evidence: readonly EvidenceRecord[];
  evidenceIntro: HomeEvidenceIntroRecord;
  /** Ordered homepage feature IDs — must reference approved projects only. */
  featuredProjectIds: readonly string[];
  businessNeeds: readonly BusinessNeedRecord[];
  serviceExplorer: HomeServiceExplorerRecord;
  automationExample: HomeAutomationExampleRecord;
};

/** Full editorial catalog for validation and server selectors. */
export const contentCatalog: ContentCatalog = {
  site: siteRecord,
  contact: contactRecord,
  services: serviceRecords,
  projects: projectRecords,
  founders: founderRecords,
  faqs: faqRecords,
  media: mediaRecords,
  evidence: evidenceRecords,
  evidenceIntro: homeEvidenceIntro,
  featuredProjectIds: homeSelectedWorkRecord.featuredProjectIds,
  businessNeeds: businessNeedRecords,
  serviceExplorer: homeServiceExplorerRecord,
  automationExample: homeAutomationExampleRecord,
};
