import type { AboutPageRecord } from "@/content/about";
import { aboutPageRecord } from "@/content/about";
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
import type { ContactPageRecord } from "@/content/contact-page";
import { contactPageRecord } from "@/content/contact-page";
import type {
  EvidenceRecord,
  HomeEvidenceIntroRecord,
} from "@/content/evidence";
import { evidenceRecords, homeEvidenceIntro } from "@/content/evidence";
import type { FeedbackRecord } from "@/content/feedback";
import { feedbackRecords } from "@/content/feedback";
import type { FaqRecord } from "@/content/faqs";
import { faqRecords } from "@/content/faqs";
import type { FounderRecord } from "@/content/founders";
import { founderRecords } from "@/content/founders";
import { homeSelectedWorkRecord } from "@/content/home";
import type { HomeFinalCtaRecord } from "@/content/home-final-cta";
import { homeFinalCtaRecord } from "@/content/home-final-cta";
import type { HomeQuestionsRecord } from "@/content/home-questions";
import { homeQuestionsRecord } from "@/content/home-questions";
import type { ServicesOverviewRecord } from "@/content/services-overview";
import { servicesOverviewRecord } from "@/content/services-overview";
import type { MediaRecord } from "@/content/media";
import { mediaRecords } from "@/content/media";
import type { HomePeopleRecord } from "@/content/people";
import { homePeopleRecord } from "@/content/people";
import type { HomeProcessRecord } from "@/content/process";
import { homeProcessRecord } from "@/content/process";
import type { ProcessPageRecord } from "@/content/process-page";
import { processPageRecord } from "@/content/process-page";
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
  feedback: readonly FeedbackRecord[];
  media: readonly MediaRecord[];
  evidence: readonly EvidenceRecord[];
  evidenceIntro: HomeEvidenceIntroRecord;
  /** Ordered homepage feature IDs — must reference approved projects only. */
  featuredProjectIds: readonly string[];
  businessNeeds: readonly BusinessNeedRecord[];
  serviceExplorer: HomeServiceExplorerRecord;
  automationExample: HomeAutomationExampleRecord;
  process: HomeProcessRecord;
  processPage: ProcessPageRecord;
  people: HomePeopleRecord;
  questions: HomeQuestionsRecord;
  finalCta: HomeFinalCtaRecord;
  servicesOverview: ServicesOverviewRecord;
  about: AboutPageRecord;
  contactPage: ContactPageRecord;
};

/** Full editorial catalog for validation and server selectors. */
export const contentCatalog: ContentCatalog = {
  site: siteRecord,
  contact: contactRecord,
  services: serviceRecords,
  projects: projectRecords,
  founders: founderRecords,
  faqs: faqRecords,
  feedback: feedbackRecords,
  media: mediaRecords,
  evidence: evidenceRecords,
  evidenceIntro: homeEvidenceIntro,
  featuredProjectIds: homeSelectedWorkRecord.featuredProjectIds,
  businessNeeds: businessNeedRecords,
  serviceExplorer: homeServiceExplorerRecord,
  automationExample: homeAutomationExampleRecord,
  process: homeProcessRecord,
  processPage: processPageRecord,
  people: homePeopleRecord,
  questions: homeQuestionsRecord,
  finalCta: homeFinalCtaRecord,
  servicesOverview: servicesOverviewRecord,
  about: aboutPageRecord,
  contactPage: contactPageRecord,
};
