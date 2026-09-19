import "server-only";

import { headers } from "next/headers";
import { parseStaffRole } from "@/lib/auth/staff-role";
import {
  buildAuthContext,
  UNAUTHENTICATED_AUTH_CONTEXT,
  UNAVAILABLE_AUTH_CONTEXT,
  type AuthContext,
} from "@/lib/security/auth-gate";
import { getAuth, isStaffAuthReady } from "@/server/auth";

function readStaffRole(
  user: Record<string, unknown>,
): ReturnType<typeof parseStaffRole> {
  return parseStaffRole(user.staffRole);
}

/**
 * Resolve the current request's staff AuthContext from Better Auth cookies.
 * Returns auth-unavailable when secrets/Mongo are missing (marketing builds).
 */
export async function resolveStaffAuthContext(
  requestHeaders?: Headers,
): Promise<AuthContext> {
  if (!isStaffAuthReady()) {
    return UNAVAILABLE_AUTH_CONTEXT;
  }

  try {
    const auth = await getAuth();
    const headerBag = requestHeaders ?? (await headers());
    const session = await auth.api.getSession({ headers: headerBag });

    if (!session?.user) {
      return UNAUTHENTICATED_AUTH_CONTEXT;
    }

    const user = session.user as Record<string, unknown>;
    const staffRole = readStaffRole(user);
    const mfaCompleted = user.twoFactorEnabled === true;

    return buildAuthContext({
      authAvailable: true,
      authenticated: true,
      mfaCompleted,
      staffRole,
      userId: typeof user.id === "string" ? user.id : null,
      email: typeof user.email === "string" ? user.email : null,
    });
  } catch {
    return UNAVAILABLE_AUTH_CONTEXT;
  }
}

export type StaffSessionSnapshot = Readonly<{
  context: AuthContext;
  /** Raw Better Auth session when present. */
  session: unknown;
}>;

export async function getStaffSessionSnapshot(
  requestHeaders?: Headers,
): Promise<StaffSessionSnapshot> {
  if (!isStaffAuthReady()) {
    return { context: UNAVAILABLE_AUTH_CONTEXT, session: null };
  }

  try {
    const auth = await getAuth();
    const headerBag = requestHeaders ?? (await headers());
    const session = await auth.api.getSession({ headers: headerBag });
    const context = await resolveStaffAuthContext(headerBag);
    return { context, session };
  } catch {
    return { context: UNAVAILABLE_AUTH_CONTEXT, session: null };
  }
}
