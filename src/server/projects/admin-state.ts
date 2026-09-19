import "server-only";

import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";

/** Soft archive flags without altering the strict projects validator. */
export const PROJECT_ADMIN_STATE_COLLECTION = "project_admin_state";

export async function isProjectArchived(editorialId: string): Promise<boolean> {
  if (!isMongoRuntimeConfigured()) return false;
  try {
    const db = await getDb();
    const row = await db
      .collection(PROJECT_ADMIN_STATE_COLLECTION)
      .findOne({ editorialId });
    return Boolean(row && row.archived === true);
  } catch {
    return false;
  }
}

export async function listArchivedEditorialIds(): Promise<readonly string[]> {
  if (!isMongoRuntimeConfigured()) return [];
  try {
    const db = await getDb();
    const rows = await db
      .collection(PROJECT_ADMIN_STATE_COLLECTION)
      .find({ archived: true }, { projection: { editorialId: 1 } })
      .toArray();
    return rows
      .map((row) =>
        typeof row.editorialId === "string" ? row.editorialId : null,
      )
      .filter((id): id is string => Boolean(id));
  } catch {
    return [];
  }
}
