# Content Security Policy (Step 61)

## Enforced now

On every route, via `next.config.ts` → `securityHeaderList()`:

| Header                    | Value                                                                            |
| ------------------------- | -------------------------------------------------------------------------------- |
| `Content-Security-Policy` | `base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'` |
| `X-Content-Type-Options`  | `nosniff`                                                                        |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`                                                |
| `X-Frame-Options`         | `DENY`                                                                           |
| `Permissions-Policy`      | camera, microphone, geolocation, and payment disabled                            |
| `X-Powered-By`            | removed                                                                          |

These directives do not block Next.js hydration or Turnstile. They do block object embeds, framing, and form posts to other origins.

## Report-only (not enforcement)

`Content-Security-Policy-Report-Only` lists:

- `script-src 'self' https://challenges.cloudflare.com`
- `style-src 'self'`
- `img-src 'self' data: blob: https://res.cloudinary.com`
- `font-src 'self'`
- `connect-src 'self' https://challenges.cloudflare.com`
- `frame-src https://challenges.cloudflare.com`

No `unsafe-eval`, no `unsafe-inline`, no host wildcard. Browsers will report violations from Next.js inline scripts and from any style attributes. There is no report collector in this step (nothing to rate-limit yet).

## Why script-src is not enforced

A per-response nonce is the Next.js-compatible way to drop inline script allowances. Nonces make HTML uncacheable and would change the Step 60 static routes. That rollout is remaining work, not done here.

## HSTS

Do not send `Strict-Transport-Security` with `preload` or `includeSubDomains` until the production HTTPS host and every subdomain are confirmed. Not enabled in this step.

## Trusted origins (existing)

Enquiry and auth origins come from `APP_ORIGIN` / `SITE_URL`, not from `Host` or `X-Forwarded-Host`. CORS is not opened to a reflected origin.

## Operational checklist (not verified remotely)

- Atlas user is not a cluster admin; app user cannot drop the database
- Production, preview, and test use different database names
- Network access is not `0.0.0.0/0` unless the host has no IP allowlist option
- TLS stays on for `mongodb+srv`
- `BETTER_AUTH_SECRET`, `CRON_SECRET`, and provider secrets stay server-only and are rotated if they ever land in git
