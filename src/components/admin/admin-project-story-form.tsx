"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { TextArea } from "@/components/forms/text-area";
import { SelectField } from "@/components/forms/select-field";
import { InlineStatus } from "@/components/forms/inline-status";
import type {
  ProjectStoryGalleryItem,
  StoryContentBlock,
} from "@/content/projects";
import {
  emptyListBlock,
  emptyParagraphBlock,
  moveItem,
  STORY_BLOCK_SECTION_KEYS,
  STORY_BLOCK_SECTION_LABELS,
  type StoryDraftFormValues,
  type StorySectionKey,
} from "@/lib/admin/story";
import {
  saveProjectStoryDraftAction,
  type ProjectActionState,
} from "@/server/projects/actions";

export type MediaOption = Readonly<{
  mediaId: string;
  label: string;
}>;

export type AdminProjectStoryFormProps = {
  editorialId: string;
  concurrencyVersion: number;
  initial: StoryDraftFormValues;
  mediaOptions: readonly MediaOption[];
};

const initialState: ProjectActionState | null = null;

function linesToList(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminProjectStoryForm({
  editorialId,
  concurrencyVersion,
  initial,
  mediaOptions,
}: AdminProjectStoryFormProps) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [acknowledgedVersion, setAcknowledgedVersion] =
    useState(concurrencyVersion);
  const [title, setTitle] = useState(initial.title);
  const [intro, setIntro] = useState(initial.intro);
  const [sections, setSections] = useState<
    Record<StorySectionKey, StoryContentBlock[]>
  >({
    context: [...initial.context],
    contribution: [...initial.contribution],
    solution: [...initial.solution],
    processNotes: [...initial.processNotes],
    lessons: [...initial.lessons],
  });
  const [featuresText, setFeaturesText] = useState(initial.features.join("\n"));
  const [technologiesText, setTechnologiesText] = useState(
    initial.technologies.join("\n"),
  );
  const [outcomesText, setOutcomesText] = useState(initial.outcomes.join("\n"));
  const [gallery, setGallery] = useState<ProjectStoryGalleryItem[]>(
    initial.gallery.map((g) => ({ ...g })),
  );
  const [testimonialQuote, setTestimonialQuote] = useState(
    initial.testimonial?.quote ?? "",
  );
  const [testimonialAttribution, setTestimonialAttribution] = useState(
    initial.testimonial?.attribution ?? "",
  );
  const [testimonialState, setTestimonialState] = useState(
    initial.testimonial?.publicationState ?? "draft",
  );
  const [reviewNotes, setReviewNotes] = useState(initial.reviewNotes);

  const [state, formAction, pending] = useActionState(
    saveProjectStoryDraftAction,
    initialState,
  );

  const effectiveConcurrency =
    state?.ok && typeof state.concurrencyVersion === "number"
      ? state.concurrencyVersion
      : concurrencyVersion;

  if (
    state?.ok &&
    typeof state.concurrencyVersion === "number" &&
    state.concurrencyVersion !== acknowledgedVersion
  ) {
    setAcknowledgedVersion(state.concurrencyVersion);
    setDirty(false);
  }

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function markDirty() {
    setDirty(true);
  }

  const storyPayload = useMemo(() => {
    const testimonial =
      testimonialQuote.trim() || testimonialAttribution.trim()
        ? {
            quote: testimonialQuote,
            attribution: testimonialAttribution,
            publicationState: testimonialState,
          }
        : null;
    return JSON.stringify({
      title,
      intro,
      context: sections.context,
      contribution: sections.contribution,
      solution: sections.solution,
      processNotes: sections.processNotes,
      lessons: sections.lessons,
      features: linesToList(featuresText),
      technologies: linesToList(technologiesText),
      outcomes: linesToList(outcomesText),
      gallery,
      testimonial,
      reviewNotes,
    });
  }, [
    title,
    intro,
    sections,
    featuresText,
    technologiesText,
    outcomesText,
    gallery,
    testimonialQuote,
    testimonialAttribution,
    testimonialState,
    reviewNotes,
  ]);

  const statusTone = pending
    ? "pending"
    : state?.ok
      ? "success"
      : state && !state.ok
        ? "error"
        : "idle";
  const statusMessage = pending
    ? "Saving case-study draft…"
    : state?.ok
      ? state.message
      : state && !state.ok
        ? state.message
        : null;

  function updateSection(key: StorySectionKey, next: StoryContentBlock[]) {
    setSections((prev) => ({ ...prev, [key]: next }));
    markDirty();
  }

  function updateBlock(
    key: StorySectionKey,
    index: number,
    block: StoryContentBlock,
  ) {
    const next = [...sections[key]];
    next[index] = block;
    updateSection(key, next);
  }

  return (
    <form
      action={formAction}
      className="flex max-w-3xl flex-col gap-8"
      onInput={markDirty}
      onChange={markDirty}
    >
      <input type="hidden" name="editorialId" value={editorialId} />
      <input
        type="hidden"
        name="concurrencyVersion"
        value={String(effectiveConcurrency)}
      />
      <input type="hidden" name="storyPayload" value={storyPayload} />

      {dirty ? (
        <p
          className="rounded-md bg-warning-soft p-3 text-sm text-warning"
          role="status"
        >
          You have unsaved changes. Use Save draft before leaving.
        </p>
      ) : null}

      <InlineStatus tone={statusTone}>{statusMessage}</InlineStatus>

      <p className="ds-support">
        Editorial id: <code>{editorialId}</code> · concurrency v
        {effectiveConcurrency}. Blocks are paragraph or list only — no HTML.
      </p>

      <FormField id="story-title" label="Story title" required>
        {(control) => (
          <TextInput
            {...control}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            autoComplete="off"
            required
          />
        )}
      </FormField>

      <FormField
        id="story-intro"
        label="Intro"
        hint="Short lead under the title (max 400 characters)."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            value={intro}
            onChange={(e) => {
              setIntro(e.target.value);
              markDirty();
            }}
            rows={3}
            maxLength={400}
          />
        )}
      </FormField>

      {STORY_BLOCK_SECTION_KEYS.map((key) => (
        <section
          key={key}
          aria-labelledby={`story-section-${key}`}
          className="border-t border-border-subtle pt-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id={`story-section-${key}`}
              className="text-lg font-semibold text-ink"
            >
              {STORY_BLOCK_SECTION_LABELS[key]}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="compact"
                onClick={() =>
                  updateSection(key, [...sections[key], emptyParagraphBlock()])
                }
              >
                Add paragraph
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="compact"
                onClick={() =>
                  updateSection(key, [...sections[key], emptyListBlock()])
                }
              >
                Add list
              </Button>
            </div>
          </div>

          {sections[key].length === 0 ? (
            <p className="ds-support mt-3">No blocks yet.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {sections[key].map((block, index) => (
                <li
                  key={`${key}-${index}`}
                  className="border-t border-border-subtle pt-4"
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="quiet"
                      size="compact"
                      disabled={index === 0}
                      aria-label={`Move ${key} block ${index + 1} up`}
                      onClick={() =>
                        updateSection(key, moveItem(sections[key], index, "up"))
                      }
                    >
                      Move up
                    </Button>
                    <Button
                      type="button"
                      variant="quiet"
                      size="compact"
                      disabled={index === sections[key].length - 1}
                      aria-label={`Move ${key} block ${index + 1} down`}
                      onClick={() =>
                        updateSection(
                          key,
                          moveItem(sections[key], index, "down"),
                        )
                      }
                    >
                      Move down
                    </Button>
                    <Button
                      type="button"
                      variant="quiet"
                      size="compact"
                      aria-label={`Remove ${key} block ${index + 1}`}
                      onClick={() =>
                        updateSection(
                          key,
                          sections[key].filter((_, i) => i !== index),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>

                  {block.type === "paragraph" ? (
                    <FormField
                      id={`${key}-p-${index}`}
                      label={`Paragraph ${index + 1}`}
                    >
                      {(control) => (
                        <TextArea
                          {...control}
                          value={block.text}
                          onChange={(e) =>
                            updateBlock(key, index, {
                              type: "paragraph",
                              text: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      )}
                    </FormField>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <FormField
                        id={`${key}-list-style-${index}`}
                        label={`List ${index + 1} style`}
                      >
                        {(control) => (
                          <SelectField
                            {...control}
                            value={block.style}
                            onChange={(e) =>
                              updateBlock(key, index, {
                                type: "list",
                                style:
                                  e.target.value === "numbered"
                                    ? "numbered"
                                    : "bulleted",
                                items: [...block.items],
                              })
                            }
                          >
                            <option value="bulleted">Bulleted</option>
                            <option value="numbered">Numbered</option>
                          </SelectField>
                        )}
                      </FormField>
                      <FormField
                        id={`${key}-list-items-${index}`}
                        label="List items"
                        hint="One item per line."
                      >
                        {(control) => (
                          <TextArea
                            {...control}
                            value={block.items.join("\n")}
                            onChange={(e) =>
                              updateBlock(key, index, {
                                type: "list",
                                style: block.style,
                                items: e.target.value.split(/\r?\n/),
                              })
                            }
                            rows={4}
                          />
                        )}
                      </FormField>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <FormField
        id="story-features"
        label="Features"
        hint="One feature per line (shown with solution)."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            value={featuresText}
            onChange={(e) => {
              setFeaturesText(e.target.value);
              markDirty();
            }}
            rows={4}
          />
        )}
      </FormField>

      <FormField
        id="story-technologies"
        label="Technologies"
        hint="Verified technologies only — one per line."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            value={technologiesText}
            onChange={(e) => {
              setTechnologiesText(e.target.value);
              markDirty();
            }}
            rows={3}
          />
        )}
      </FormField>

      <FormField
        id="story-outcomes"
        label="Outcomes"
        hint="Qualitative observations only — do not invent metrics."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            value={outcomesText}
            onChange={(e) => {
              setOutcomesText(e.target.value);
              markDirty();
            }}
            rows={4}
          />
        )}
      </FormField>

      <section
        aria-labelledby="story-gallery-heading"
        className="border-t border-border-subtle pt-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="story-gallery-heading"
            className="text-lg font-semibold text-ink"
          >
            Gallery order
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => {
              setGallery((prev) => [
                ...prev,
                { mediaId: "", caption: "", conceptLabel: null },
              ]);
              markDirty();
            }}
          >
            Add image
          </Button>
        </div>
        <p className="ds-support mt-2">
          Order here is the case-study gallery order. Use media ids from the
          library.
        </p>

        {gallery.length === 0 ? (
          <p className="ds-support mt-3">No gallery items yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {gallery.map((item, index) => (
              <li
                key={`gallery-${index}`}
                className="border-t border-border-subtle pt-4"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="quiet"
                    size="compact"
                    disabled={index === 0}
                    aria-label={`Move gallery item ${index + 1} up`}
                    onClick={() => {
                      setGallery((prev) => moveItem(prev, index, "up"));
                      markDirty();
                    }}
                  >
                    Move up
                  </Button>
                  <Button
                    type="button"
                    variant="quiet"
                    size="compact"
                    disabled={index === gallery.length - 1}
                    aria-label={`Move gallery item ${index + 1} down`}
                    onClick={() => {
                      setGallery((prev) => moveItem(prev, index, "down"));
                      markDirty();
                    }}
                  >
                    Move down
                  </Button>
                  <Button
                    type="button"
                    variant="quiet"
                    size="compact"
                    aria-label={`Remove gallery item ${index + 1}`}
                    onClick={() => {
                      setGallery((prev) => prev.filter((_, i) => i !== index));
                      markDirty();
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    id={`gallery-media-${index}`}
                    label={`Media ${index + 1}`}
                    required
                  >
                    {(control) => (
                      <SelectField
                        {...control}
                        value={item.mediaId}
                        onChange={(e) => {
                          setGallery((prev) => {
                            const next = [...prev];
                            next[index] = {
                              ...item,
                              mediaId: e.target.value,
                            };
                            return next;
                          });
                          markDirty();
                        }}
                      >
                        <option value="">Select media…</option>
                        {mediaOptions.map((opt) => (
                          <option key={opt.mediaId} value={opt.mediaId}>
                            {opt.label}
                          </option>
                        ))}
                      </SelectField>
                    )}
                  </FormField>
                  <FormField
                    id={`gallery-caption-${index}`}
                    label="Caption"
                    required
                  >
                    {(control) => (
                      <TextInput
                        {...control}
                        value={item.caption}
                        onChange={(e) => {
                          setGallery((prev) => {
                            const next = [...prev];
                            next[index] = {
                              ...item,
                              caption: e.target.value,
                            };
                            return next;
                          });
                          markDirty();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </FormField>
                  <FormField
                    id={`gallery-concept-${index}`}
                    label="Concept label"
                    hint='Optional — e.g. "Prototype screen".'
                    optional
                  >
                    {(control) => (
                      <TextInput
                        {...control}
                        value={item.conceptLabel ?? ""}
                        onChange={(e) => {
                          setGallery((prev) => {
                            const next = [...prev];
                            next[index] = {
                              ...item,
                              conceptLabel: e.target.value || null,
                            };
                            return next;
                          });
                          markDirty();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </FormField>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="story-testimonial-heading"
        className="border-t border-border-subtle pt-6"
      >
        <h2
          id="story-testimonial-heading"
          className="text-lg font-semibold text-ink"
        >
          Testimonial (optional)
        </h2>
        <p className="ds-support mt-2">
          Leave both fields empty to omit. Public display still requires
          approved state at publish time.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <FormField id="story-testimonial-quote" label="Quote" optional>
            {(control) => (
              <TextArea
                {...control}
                value={testimonialQuote}
                onChange={(e) => {
                  setTestimonialQuote(e.target.value);
                  markDirty();
                }}
                rows={3}
              />
            )}
          </FormField>
          <FormField
            id="story-testimonial-attribution"
            label="Attribution"
            optional
          >
            {(control) => (
              <TextInput
                {...control}
                value={testimonialAttribution}
                onChange={(e) => {
                  setTestimonialAttribution(e.target.value);
                  markDirty();
                }}
                autoComplete="off"
              />
            )}
          </FormField>
          <FormField
            id="story-testimonial-state"
            label="Testimonial state"
            optional
          >
            {(control) => (
              <SelectField
                {...control}
                value={testimonialState}
                onChange={(e) => {
                  const value = e.target.value;
                  setTestimonialState(
                    value === "approved" || value === "archived"
                      ? value
                      : "draft",
                  );
                  markDirty();
                }}
              >
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
              </SelectField>
            )}
          </FormField>
        </div>
      </section>

      <FormField
        id="story-review-notes"
        label="Internal review notes"
        hint="Never shown on the public site."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            value={reviewNotes}
            onChange={(e) => {
              setReviewNotes(e.target.value);
              markDirty();
            }}
            rows={3}
          />
        )}
      </FormField>

      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6">
        <Button type="submit" variant="primary" loading={pending}>
          Save draft
        </Button>
        <p className="ds-support">
          Explicit save only. Summary fields stay unchanged; owners publish from
          the project Publication panel.
        </p>
      </div>
    </form>
  );
}
