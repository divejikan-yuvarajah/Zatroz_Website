import "server-only";

import { revalidatePath } from "next/cache";

/** Public + admin paths touched by portfolio publish / unpublish / archive. */
export function revalidatePublicPortfolioPaths(input?: {
  editorialId?: string;
  slug?: string | null;
}): void {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/settings/featured");
  revalidatePath("/admin/jobs");
  revalidatePath("/admin/media");

  if (input?.editorialId) {
    revalidatePath(`/admin/projects/${input.editorialId}`);
    revalidatePath(`/admin/projects/${input.editorialId}/preview`);
    revalidatePath(`/admin/projects/${input.editorialId}/story`);
  }

  const slug = input?.slug?.trim();
  if (slug) {
    revalidatePath(`/work/${slug}`);
  }
}
