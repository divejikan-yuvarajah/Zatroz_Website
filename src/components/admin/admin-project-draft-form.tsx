"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { TextArea } from "@/components/forms/text-area";
import { SelectField } from "@/components/forms/select-field";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { InlineStatus } from "@/components/forms/inline-status";
import { WORK_STATUS_LABELS, WORK_STATUS_VALUES } from "@/content/projects";
import {
  serializeGallery,
  serializePublicLinks,
  slugifyTitle,
  type ProjectDraftFormValues,
} from "@/lib/admin/projects";
import {
  createProjectDraftAction,
  saveProjectDraftAction,
  type ProjectActionState,
} from "@/server/projects/actions";

export type MediaOption = Readonly<{
  mediaId: string;
  label: string;
}>;

export type ServiceOption = Readonly<{
  id: string;
  title: string;
}>;

export type AdminProjectDraftFormProps = {
  mode: "create" | "edit";
  editorialId?: string;
  concurrencyVersion?: number;
  initial: ProjectDraftFormValues;
  services: readonly ServiceOption[];
  mediaOptions: readonly MediaOption[];
  justSaved?: boolean;
};

const initialState: ProjectActionState | null = null;

export function AdminProjectDraftForm({
  mode,
  editorialId,
  concurrencyVersion = 0,
  initial,
  services,
  mediaOptions,
  justSaved = false,
}: AdminProjectDraftFormProps) {
  const router = useRouter();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = useState(false);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [featuredEligible, setFeaturedEligible] = useState(
    initial.featuredEligible,
  );
  const [acknowledgedVersion, setAcknowledgedVersion] =
    useState(concurrencyVersion);

  const action =
    mode === "create" ? createProjectDraftAction : saveProjectDraftAction;
  const [state, formAction, pending] = useActionState(action, initialState);

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

  function onTitleChange(value: string) {
    setTitle(value);
    markDirty();
    if (!slugTouched) {
      setSlug(slugifyTitle(value));
    }
  }

  const statusTone = pending
    ? "pending"
    : state?.ok || justSaved
      ? "success"
      : state && !state.ok
        ? "error"
        : "idle";
  const statusMessage = pending
    ? "Saving draft…"
    : state?.ok
      ? state.message
      : justSaved && !state
        ? "Draft saved."
        : state && !state.ok
          ? state.message
          : null;

  return (
    <form
      ref={formRef}
      id={formId}
      action={formAction}
      className="flex max-w-2xl flex-col gap-6"
      onInput={markDirty}
      onChange={markDirty}
    >
      {mode === "edit" ? (
        <>
          <input type="hidden" name="editorialId" value={editorialId ?? ""} />
          <input
            type="hidden"
            name="concurrencyVersion"
            value={String(effectiveConcurrency)}
          />
        </>
      ) : null}

      {dirty ? (
        <p
          className="rounded-md bg-warning-soft p-3 text-sm text-warning"
          role="status"
        >
          You have unsaved changes. Use Save draft before leaving.
        </p>
      ) : null}

      <InlineStatus tone={statusTone}>{statusMessage}</InlineStatus>

      <FormField id="project-title" label="Title" required>
        {(control) => (
          <TextInput
            {...control}
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            autoComplete="off"
            required
          />
        )}
      </FormField>

      <FormField
        id="project-slug"
        label="Slug"
        hint="Public path segment after publish."
        required
      >
        {(control) => (
          <TextInput
            {...control}
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase());
              markDirty();
            }}
            autoComplete="off"
            required
            spellCheck={false}
          />
        )}
      </FormField>

      {mode === "edit" && editorialId ? (
        <p className="ds-support">
          Editorial id: <code>{editorialId}</code> · concurrency v
          {effectiveConcurrency}
        </p>
      ) : null}

      <FormField
        id="project-summary"
        label="Summary"
        hint="Short card summary (max 400 characters)."
        required
      >
        {(control) => (
          <TextArea
            {...control}
            name="summary"
            rows={4}
            defaultValue={initial.summary}
            maxLength={400}
            required
          />
        )}
      </FormField>

      <FormField id="project-work-status" label="Work status" required>
        {(control) => (
          <SelectField
            {...control}
            name="workStatus"
            defaultValue={initial.workStatus}
            required
          >
            {WORK_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {WORK_STATUS_LABELS[value]}
              </option>
            ))}
          </SelectField>
        )}
      </FormField>

      <fieldset className="min-w-0">
        <legend className="font-medium text-ink">Services</legend>
        <p className="ds-support mt-1">
          Relate this project to catalog service ids (max 6).
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {services.map((service) => (
            <li key={service.id}>
              <CheckboxField
                id={`service-${service.id}`}
                name="serviceIds"
                value={service.id}
                label={service.title}
                defaultChecked={initial.serviceIds.includes(service.id)}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <FormField
        id="project-technologies"
        label="Technologies"
        hint="Comma-separated verified technologies only."
        optional
      >
        {(control) => (
          <TextInput
            {...control}
            name="technologies"
            defaultValue={initial.technologies.join(", ")}
            autoComplete="off"
          />
        )}
      </FormField>

      <FormField
        id="project-contributors"
        label="Contributors"
        hint="One name per line."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            name="contributors"
            rows={3}
            defaultValue={initial.contributors.join("\n")}
          />
        )}
      </FormField>

      <FormField
        id="project-links"
        label="Public links"
        hint="One per line: Label | https://example.com"
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            name="publicLinks"
            rows={3}
            defaultValue={serializePublicLinks(initial.publicLinks)}
            spellCheck={false}
          />
        )}
      </FormField>

      <FormField
        id="project-cover"
        label="Cover media"
        hint="Pick a media id from the library. Leave empty if none yet."
        optional
      >
        {(control) => (
          <SelectField
            {...control}
            name="coverMediaId"
            defaultValue={initial.coverMediaId ?? ""}
          >
            <option value="">No cover</option>
            {mediaOptions.map((opt) => (
              <option key={opt.mediaId} value={opt.mediaId}>
                {opt.label}
              </option>
            ))}
          </SelectField>
        )}
      </FormField>

      <FormField
        id="project-gallery"
        label="Gallery"
        hint="One per line: mediaId | caption. Reorder gallery in the case-study editor."
        optional
      >
        {(control) => (
          <TextArea
            {...control}
            name="gallery"
            rows={4}
            defaultValue={serializeGallery(initial.gallery)}
            spellCheck={false}
          />
        )}
      </FormField>

      <fieldset className="min-w-0">
        <legend className="font-medium text-ink">Featured eligibility</legend>
        <p className="ds-support mt-1">
          Marks draft ranking only. Live homepage featured order is set by an
          owner under Featured.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          <CheckboxField
            id="project-featured"
            name="featuredEligible"
            label="Eligible for featured consideration"
            checked={featuredEligible}
            onChange={(e) => {
              setFeaturedEligible(e.target.checked);
              markDirty();
            }}
          />
          {featuredEligible ? (
            <FormField
              id="project-editorial-order"
              label="Eligibility order"
              hint="Lower numbers rank earlier within eligible drafts."
              optional
            >
              {(control) => (
                <TextInput
                  {...control}
                  name="editorialOrder"
                  type="number"
                  min={0}
                  max={9999}
                  defaultValue={
                    initial.editorialOrder !== null
                      ? String(initial.editorialOrder)
                      : "0"
                  }
                  inputMode="numeric"
                />
              )}
            </FormField>
          ) : (
            <input type="hidden" name="editorialOrder" value="" />
          )}
        </div>
      </fieldset>

      {/* Preserve narrative snapshot fields without expanding A06 scope */}
      <input
        type="hidden"
        name="zatrozContribution"
        value={initial.zatrozContribution}
      />
      <input type="hidden" name="problem" value={initial.problem} />
      <input type="hidden" name="approach" value={initial.approach} />
      <input
        type="hidden"
        name="deliverables"
        value={initial.deliverables.join("\n")}
      />
      <input
        type="hidden"
        name="verifiedOutcomes"
        value={initial.verifiedOutcomes.join("\n")}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6">
        <Button type="submit" variant="primary" loading={pending}>
          Save draft
        </Button>
        <p className="ds-support">
          Explicit save only — no autosave. Concurrent edits conflict on version
          mismatch.
        </p>
      </div>
    </form>
  );
}
