import "server-only";

/**
 * Server-only Better Auth accessors for Route Handlers / Server Components.
 * Scripts should import `@/lib/auth/create-auth` instead of this module.
 */

export {
  createBootstrapAuth,
  createStaffAuth,
  getAuth,
  isStaffAuthReady,
  resetStaffAuthStateForTests,
  type CreateStaffAuthOptions,
  type StaffAuth,
} from "@/lib/auth/create-auth";
