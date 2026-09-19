/**
 * Shared redirect after a failed admin permission gate.
 */

import { redirect } from "next/navigation";
import {
  pathForAuthDenial,
  type AuthDenialReason,
} from "@/lib/security/auth-gate";

export function redirectForAuthDenial(reason: AuthDenialReason): never {
  redirect(pathForAuthDenial(reason));
}
