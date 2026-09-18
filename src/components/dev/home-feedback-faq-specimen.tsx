import { HomeFeedbackFaq } from "@/components/sections/home-feedback-faq";
import { getHomeQuestionsSpecimen } from "@/server/home";

/**
 * Gallery specimens for feedback / FAQ layouts.
 * Fixtures are labelled examples — never public customer evidence.
 */
export function HomeFeedbackFaqSpecimen() {
  const faqsOnly = getHomeQuestionsSpecimen("faqs-only");
  const withQuote = getHomeQuestionsSpecimen("with-testimonial");
  const withLesson = getHomeQuestionsSpecimen("with-lesson");
  const longCopy = getHomeQuestionsSpecimen("long-copy");
  const oneFaq = getHomeQuestionsSpecimen("one-faq");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>FAQs only (no feedback)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Public `/` uses this shape when approved questions exist and no
          approved testimonial or lesson is ready. Quote chrome stays omitted.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeedbackFaq
            questions={faqsOnly}
            headingLevel={2}
            idPrefix="gallery-questions-faqs-"
          />
        </div>
      </div>

      <div>
        <h3>One FAQ</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeedbackFaq
            questions={oneFaq}
            headingLevel={2}
            idPrefix="gallery-questions-one-"
          />
        </div>
      </div>

      <div>
        <h3>Specimen testimonial (labelled)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Gallery fixture only — not a real Zatroz customer quote.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeedbackFaq
            questions={withQuote}
            headingLevel={2}
            idPrefix="gallery-questions-quote-"
          />
        </div>
      </div>

      <div>
        <h3>Zatroz lesson (not customer endorsement)</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeedbackFaq
            questions={withLesson}
            headingLevel={2}
            idPrefix="gallery-questions-lesson-"
          />
        </div>
      </div>

      <div>
        <h3>Long question and answer wrapping</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeedbackFaq
            questions={longCopy}
            headingLevel={2}
            idPrefix="gallery-questions-long-"
          />
        </div>
      </div>
    </div>
  );
}
