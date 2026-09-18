import "server-only";

import { contentCatalog } from "@/content/catalog";
import type { PublicCta } from "@/content/home";
import type {
  ProcessChecklistItem,
  ProcessPageFaqRecord,
  ProcessPageRecord,
  ProcessPageStageRecord,
} from "@/content/process-page";
import { publicRoutes } from "@/config/routes";
import { resolveServicesEnquiryCta } from "@/server/services";

export type PublicProcessStage = Readonly<{
  id: string;
  number: number;
  title: string;
  whatWeDo: string;
  whatWeNeed: string;
  whatYouReceive: string;
}>;

export type PublicProcessFaq = Readonly<{
  id: string;
  question: string;
  answer: string;
}>;

export type PublicProcessPage = Readonly<{
  id: "process-page";
  heroTitle: string;
  introduction: string;
  stagesHeading: string;
  stagesSupporting: string;
  stages: readonly PublicProcessStage[];
  collaborationHeading: string;
  collaborationBody: readonly string[];
  dependenciesHeading: string;
  dependenciesBody: string;
  acceptanceHeading: string;
  acceptanceBody: string;
  prepareHeading: string;
  prepareSupporting: string;
  prepareItems: readonly ProcessChecklistItem[];
  prepareSensitiveNote: string;
  faqHeading: string;
  faqs: readonly PublicProcessFaq[];
  enquiryAction: PublicCta | null;
  workAction: PublicCta | null;
  pageTitle: string;
  pageDescription: string;
}>;

function projectStages(
  stages: ProcessPageRecord["stages"],
): PublicProcessStage[] {
  return stages.map((stage: ProcessPageStageRecord, index) => ({
    id: stage.id,
    number: index + 1,
    title: stage.title,
    whatWeDo: stage.whatWeDo,
    whatWeNeed: stage.whatWeNeed,
    whatYouReceive: stage.whatYouReceive,
  }));
}

function projectFaqs(
  faqs: readonly ProcessPageFaqRecord[],
): PublicProcessFaq[] {
  return faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}

function buildProcessPage(record: ProcessPageRecord): PublicProcessPage {
  return {
    id: "process-page",
    heroTitle: record.heroTitle,
    introduction: record.introduction,
    stagesHeading: record.stagesHeading,
    stagesSupporting: record.stagesSupporting,
    stages: projectStages(record.stages),
    collaborationHeading: record.collaborationHeading,
    collaborationBody: [...record.collaborationBody],
    dependenciesHeading: record.dependenciesHeading,
    dependenciesBody: record.dependenciesBody,
    acceptanceHeading: record.acceptanceHeading,
    acceptanceBody: record.acceptanceBody,
    prepareHeading: record.prepareHeading,
    prepareSupporting: record.prepareSupporting,
    prepareItems: [...record.prepareItems],
    prepareSensitiveNote: record.prepareSensitiveNote,
    faqHeading: record.faqHeading,
    faqs: projectFaqs(record.faqs),
    enquiryAction: resolveServicesEnquiryCta({
      label: record.primaryCtaLabel,
    }),
    workAction: publicRoutes.work.implemented
      ? {
          label: "Explore our work",
          href: publicRoutes.work.path,
        }
      : null,
    pageTitle: record.pageTitle,
    pageDescription: record.pageDescription,
  };
}

/**
 * Public Process page. Returns null while the page body stays draft so
 * `/process` can show an honest sparse placeholder.
 */
export function getPublicProcessPage(): PublicProcessPage | null {
  const record = contentCatalog.processPage;
  if (record.publicationState !== "approved") {
    return null;
  }
  return buildProcessPage(record);
}

/** Gallery-only draft projection for layout review. */
export function getProcessGalleryPreview(): PublicProcessPage {
  return buildProcessPage(contentCatalog.processPage);
}
