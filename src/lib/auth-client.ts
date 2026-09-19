"use client";

import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";

/**
 * Browser Better Auth client for staff login / MFA.
 * Does not expose secrets. Public sign-up remains disabled server-side.
 */
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        staffRole: {
          type: "string",
        },
      },
    }),
    twoFactorClient({
      twoFactorPage: "/admin/mfa",
    }),
  ],
});
