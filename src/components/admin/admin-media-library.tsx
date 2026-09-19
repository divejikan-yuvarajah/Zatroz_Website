"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { TextArea } from "@/components/forms/text-area";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { InlineStatus } from "@/components/forms/inline-status";
import type { MediaLibraryItem } from "@/server/media/repository";
import {
  archiveMediaAction,
  replaceMediaAction,
  updateMediaMetaAction,
  type MediaActionState,
} from "@/server/media/actions";

const initial: MediaActionState | null = null;

function altLabel(item: MediaLibraryItem): string {
  return item.alt.decorative ? "(decorative)" : item.alt.alt;
}

function MediaItemCard({ item }: { item: MediaLibraryItem }) {
  const [metaState, metaAction, metaPending] = useActionState(
    updateMediaMetaAction,
    initial,
  );
  const [replaceState, replaceAction, replacePending] = useActionState(
    replaceMediaAction,
    initial,
  );
  const [archiveState, archiveAction, archivePending] = useActionState(
    archiveMediaAction,
    initial,
  );

  const previewHref = `/api/admin/media/${encodeURIComponent(item.mediaId)}/preview`;

  return (
    <li className="border-t border-border-subtle py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-ink">{item.mediaId}</p>
          <p className="mt-1 text-sm text-text-muted">
            v {item.versionId} · {item.mimeType} · {item.byteSize} bytes
            {item.width && item.height
              ? ` · ${item.width}×${item.height}`
              : null}
          </p>
          <p className="mt-1 text-sm text-text-body">Alt: {altLabel(item)}</p>
          {item.caption ? (
            <p className="mt-1 text-sm text-text-muted">{item.caption}</p>
          ) : null}
          <p className="mt-1 text-sm text-text-muted">
            {item.visibility} · {item.processingState}
          </p>
          <p className="mt-3">
            <a
              href={previewHref}
              className="text-sm font-medium text-ink underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open signed preview
              <span className="font-normal text-text-muted">
                {" "}
                (opens in a new tab)
              </span>
            </a>
          </p>
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          Edit details
        </summary>
        <form action={metaAction} className="mt-4 flex max-w-xl flex-col gap-4">
          <input type="hidden" name="mediaId" value={item.mediaId} />
          <input type="hidden" name="versionId" value={item.versionId} />
          <CheckboxField
            id={`dec-${item.versionId}`}
            name="decorative"
            label="Decorative"
            defaultChecked={item.alt.decorative}
          />
          <FormField id={`alt-${item.versionId}`} label="Alt text">
            {(control) => (
              <TextInput
                {...control}
                name="altText"
                defaultValue={item.alt.decorative ? "" : item.alt.alt}
              />
            )}
          </FormField>
          <FormField id={`cap-${item.versionId}`} label="Caption" optional>
            {(control) => (
              <TextInput
                {...control}
                name="caption"
                defaultValue={item.caption ?? ""}
              />
            )}
          </FormField>
          <FormField id={`prov-${item.versionId}`} label="Provenance" optional>
            {(control) => (
              <TextArea
                {...control}
                name="provenance"
                rows={2}
                defaultValue={item.provenance ?? ""}
              />
            )}
          </FormField>
          <FormField id={`lic-${item.versionId}`} label="Licence" optional>
            {(control) => (
              <TextInput
                {...control}
                name="licence"
                defaultValue={item.licence ?? ""}
              />
            )}
          </FormField>
          <FormField
            id={`brief-${item.versionId}`}
            label="Generation brief"
            optional
          >
            {(control) => (
              <TextArea
                {...control}
                name="generationBrief"
                rows={2}
                defaultValue={item.generationBrief ?? ""}
              />
            )}
          </FormField>
          {metaState ? (
            <InlineStatus tone={metaState.ok ? "success" : "error"}>
              {metaState.message}
            </InlineStatus>
          ) : null}
          <Button
            type="submit"
            variant="secondary"
            size="compact"
            loading={metaPending}
          >
            Save details
          </Button>
        </form>
      </details>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          Replace with new version
        </summary>
        <form
          action={replaceAction}
          className="mt-4 flex max-w-xl flex-col gap-4"
          encType="multipart/form-data"
        >
          <input type="hidden" name="mediaId" value={item.mediaId} />
          <p className="ds-support">
            Creates a new immutable version and archives the previous head.
            Previous Cloudinary objects are not deleted automatically.
          </p>
          <FormField id={`rep-${item.versionId}`} label="New file" required>
            {(control) => (
              <input
                {...control}
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className="block w-full text-sm"
              />
            )}
          </FormField>
          {replaceState ? (
            <InlineStatus tone={replaceState.ok ? "success" : "error"}>
              {replaceState.message}
            </InlineStatus>
          ) : null}
          <Button
            type="submit"
            variant="secondary"
            size="compact"
            loading={replacePending}
          >
            Upload replacement
          </Button>
        </form>
      </details>

      <form action={archiveAction} className="mt-4">
        <input type="hidden" name="mediaId" value={item.mediaId} />
        <input type="hidden" name="versionId" value={item.versionId} />
        {archiveState ? (
          <InlineStatus tone={archiveState.ok ? "success" : "error"}>
            {archiveState.message}
          </InlineStatus>
        ) : null}
        <Button
          type="submit"
          variant="quiet"
          size="compact"
          loading={archivePending}
        >
          Archive this version
        </Button>
      </form>
    </li>
  );
}

export type AdminMediaLibraryProps = {
  items: readonly MediaLibraryItem[] | null;
  total: number;
  unavailableDetail: string | null;
  search: string;
  providerReady: boolean;
};

export function AdminMediaLibrary({
  items,
  total,
  unavailableDetail,
  search,
  providerReady,
}: AdminMediaLibraryProps) {
  if (unavailableDetail) {
    return (
      <div
        className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
        role="status"
      >
        <p className="font-medium">Media library unavailable</p>
        <p className="mt-1 text-sm">{unavailableDetail}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {!providerReady ? (
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Cloudinary not configured</p>
          <p className="mt-1 text-sm">
            Listing may work from MongoDB, but uploads and signed previews need
            CLOUDINARY_* secrets. See docs/admin/step-a04.md.
          </p>
        </div>
      ) : null}

      <form method="get" className="flex flex-wrap items-end gap-3">
        <FormField id="media-search" label="Search">
          {(control) => (
            <TextInput
              {...control}
              name="q"
              defaultValue={search}
              placeholder="media id, caption, provenance"
            />
          )}
        </FormField>
        <Button type="submit" variant="secondary" size="compact">
          Search
        </Button>
      </form>

      <p className="ds-support">
        {total === 0
          ? "No media records yet."
          : `Showing ${items?.length ?? 0} of ${total} media identities.`}
      </p>

      {items && items.length > 0 ? (
        <ul className="m-0 list-none p-0">
          {items.map((item) => (
            <MediaItemCard
              key={`${item.mediaId}:${item.versionId}`}
              item={item}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
