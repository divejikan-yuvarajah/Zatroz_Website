"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { TextArea } from "@/components/forms/text-area";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { InlineStatus } from "@/components/forms/inline-status";
import {
  uploadMediaAction,
  type MediaActionState,
} from "@/server/media/actions";

const initial: MediaActionState | null = null;

export function AdminMediaUploadForm() {
  const [state, action, pending] = useActionState(uploadMediaAction, initial);

  return (
    <form
      action={action}
      className="flex max-w-xl flex-col gap-5"
      encType="multipart/form-data"
    >
      <FormField
        id="media-file"
        label="Image file"
        hint="JPEG, PNG, or WebP · max 10 MiB · private until published later"
        required
      >
        {(control) => (
          <input
            {...control}
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="block w-full text-sm text-text-body file:mr-3 file:rounded-sm file:border-0 file:bg-brand file:px-3 file:py-2 file:font-medium file:text-ink"
          />
        )}
      </FormField>

      <CheckboxField
        id="media-decorative"
        name="decorative"
        label="Decorative (empty alt)"
        hint="Use only when the image adds no information."
      />

      <FormField id="media-alt" label="Alt text">
        {(control) => (
          <TextInput {...control} name="altText" autoComplete="off" />
        )}
      </FormField>

      <FormField id="media-caption" label="Caption" optional>
        {(control) => (
          <TextInput {...control} name="caption" autoComplete="off" />
        )}
      </FormField>

      <FormField
        id="media-provenance"
        label="Provenance"
        hint="Source, creator, or generation note."
        optional
      >
        {(control) => <TextArea {...control} name="provenance" rows={2} />}
      </FormField>

      <FormField id="media-licence" label="Licence" optional>
        {(control) => (
          <TextInput {...control} name="licence" autoComplete="off" />
        )}
      </FormField>

      <FormField id="media-brief" label="Generation brief" optional>
        {(control) => <TextArea {...control} name="generationBrief" rows={2} />}
      </FormField>

      {state ? (
        <InlineStatus tone={state.ok ? "success" : "error"}>
          {state.message}
          {state.ok && state.mediaId ? ` · ${state.mediaId}` : null}
        </InlineStatus>
      ) : null}

      <Button type="submit" loading={pending} loadingLabel="Uploading">
        Upload private media
      </Button>
    </form>
  );
}
