# Quality Step 61 — Application security

**Branch:** `feature/61-security` (from `feature/60-performance`)  
**Status:** Header baseline **Done**. Penetration test **Not claimed**. Remote Atlas/Vercel settings **Not run**.

## What changed

| Area         | Detail                                                                    |
| ------------ | ------------------------------------------------------------------------- |
| Threat model | `docs/security/threat-model.md`                                           |
| CSP notes    | `docs/security/csp.md`                                                    |
| Headers      | Enforced limited CSP, nosniff, referrer, frame denial, permissions policy |
| Fingerprint  | `poweredByHeader: false`                                                  |
| Tests        | `npm run test:security-headers`                                           |

Auth, MFA, publish permissions, enquiry origin checks, media type checks, and webhook signatures were left in place.

## Checks

| Check                           | Result                                                                                                                                                                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test:security-headers` | **Passed**                                                                                                                                                                                                                                               |
| `npm run check`                 | **Passed** (format, lint, typecheck, content validation, and the existing test scripts including `test:security-headers`)                                                                                                                                |
| `npm run build`                 | **Passed** (`next build`; `/services` stayed static)                                                                                                                                                                                                     |
| Production response headers     | **Passed** on `http://127.0.0.1:3011/services` (200). Present: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, permissions policy, enforced CSP, report-only CSP. `X-Powered-By` absent. |
| `npm audit`                     | **Passed** (0 vulnerabilities, 2026-09-24). No lockfile change.                                                                                                                                                                                          |
| Remote Atlas privilege review   | **Not run**                                                                                                                                                                                                                                              |

## Next

Step 62 — analytics and monitoring. Do not start automatically.
