import { FaqDisclosure } from "@/components/ui/faq-disclosure";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type {
  PublicFeedback,
  PublicHomeQuestions,
} from "@/content/home-questions";
import { cn } from "@/lib/cn";

export type HomeFeedbackFaqProps = {
  questions: PublicHomeQuestions;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

function FeedbackBlock({
  feedback,
  quoteId,
}: {
  feedback: PublicFeedback;
  quoteId: string;
}) {
  if (feedback.kind === "project-lesson") {
    return (
      <figure className="m-0 max-w-reading border-l-2 border-ink pl-5">
        <p className="m-0 text-sm font-medium text-text-muted">Zatroz lesson</p>
        <blockquote id={quoteId} className="mt-2 m-0">
          <p className="m-0 text-lg text-ink text-wrap">{feedback.quote}</p>
        </blockquote>
      </figure>
    );
  }

  return (
    <figure className="m-0 max-w-reading border-l-2 border-ink pl-5">
      <blockquote id={quoteId} className="m-0">
        <p className="m-0 text-lg text-ink text-wrap">“{feedback.quote}”</p>
      </blockquote>
      <figcaption className="mt-3 text-sm text-text-muted">
        {feedback.attribution ? (
          <span className="font-medium text-ink">{feedback.attribution}</span>
        ) : null}
        {feedback.roleOrCompany ? (
          <>
            {feedback.attribution ? <span aria-hidden="true"> · </span> : null}
            <span>{feedback.roleOrCompany}</span>
          </>
        ) : null}
        {feedback.relationship ? (
          <span className="mt-1 block">{feedback.relationship}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * Homepage feedback and FAQs. Native disclosures — usable without JavaScript.
 * Omits quote chrome when no feedback is provided.
 */
export function HomeFeedbackFaq({
  questions,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeFeedbackFaqProps) {
  const headingId = `${idPrefix}${questions.id}-heading`;
  const sectionId = `${idPrefix}${questions.id}`;
  const quoteId = `${idPrefix}${questions.id}-quote`;

  return (
    <Section
      as="section"
      surface="light"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={2}
              id={headingId}
              description={questions.supporting}
            >
              {questions.heading}
            </SectionHeading>

            {questions.feedback ? (
              <div className="mt-8">
                <FeedbackBlock
                  feedback={questions.feedback}
                  quoteId={quoteId}
                />
              </div>
            ) : null}

            {questions.action ? (
              <p className="mt-8 m-0">
                <ButtonLink href={questions.action.href} variant="secondary">
                  {questions.action.label}
                </ButtonLink>
              </p>
            ) : null}
          </div>

          {questions.faqs.length > 0 ? (
            <div className="min-w-0">
              {questions.faqs.map((faq) => (
                <FaqDisclosure
                  key={faq.id}
                  id={`${idPrefix}${faq.id}`}
                  question={faq.question}
                >
                  <p className="m-0 text-wrap">{faq.answer}</p>
                </FaqDisclosure>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
