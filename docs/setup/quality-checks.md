# Quality checks

**Step:** 07  
**Purpose:** Make formatting, lint, and type errors visible with a small set of npm commands.

Optional editor extensions (install yourself if you want them): **Prettier**, **ESLint**, **Tailwind CSS IntelliSense**. Project settings in `.vscode/settings.json` enable Prettier as the default formatter and format-on-save; they do not install the extensions for you.

---

## New dependencies (Step 07)

| Package                  | Role                                                     |
| ------------------------ | -------------------------------------------------------- |
| `prettier`               | Formats code and docs consistently                       |
| `eslint-config-prettier` | Turns off ESLint style rules that conflict with Prettier |

ESLint stays on the Next.js **Core Web Vitals** + **TypeScript** configs already installed. We run the **ESLint CLI** (`eslint .`), not `next lint`.

---

## Commands

| Script                  | What it does                       | Success looks like                 |
| ----------------------- | ---------------------------------- | ---------------------------------- |
| `npm run format`        | Writes Prettier formatting         | Files updated; exit 0              |
| `npm run format:check`  | Checks formatting only             | All matched files “unchanged” / OK |
| `npm run lint`          | ESLint with `--max-warnings=0`     | No errors or warnings              |
| `npm run lint:fix`      | Auto-fix safe ESLint issues        | Exit 0; review the diff            |
| `npm run typecheck`     | `next typegen` then `tsc --noEmit` | No TypeScript errors               |
| `npm run check`         | format:check → lint → typecheck    | All three pass                     |
| `npm run build`         | Production Next.js build           | Compiles successfully              |
| `npm run dev` / `start` | Dev / production server            | App serves locally                 |

### `typecheck` behaviour

This project uses Next.js **16.3.5**, which provides `next typegen` to generate route/layout TypeScript helpers without a full build. The script is:

```text
next typegen && tsc --noEmit
```

TypeScript `strict` remains enabled in `tsconfig.json`.

---

## What each layer covers

| Layer                 | Catches                          | Does **not** replace                    |
| --------------------- | -------------------------------- | --------------------------------------- |
| Formatting (Prettier) | Style inconsistency              | Logic bugs, a11y, design quality        |
| Lint (ESLint)         | Many React/Next/TS pitfalls      | Full type correctness alone; real UX    |
| Typecheck (`tsc`)     | Type errors after route typegen  | Runtime failures, network/API issues    |
| Build (`next build`)  | Compile/bundle production issues | Accessibility review, content accuracy  |
| Browser testing       | Real layout, keyboard, forms     | Must still be done manually / later e2e |

A green **build** does not mean lint, types, or accessibility are fine. Prefer `npm run check` before opening a PR, then `npm run build` as a separate production compile check.

---

## Prettier ignores

`.prettierignore` excludes dependencies, generated output, lockfiles, private env files, binary assets, the Word plan, and `docs/reference/` text export. Never format or print secrets from `.env` files.

---

## Common failures

| Symptom                        | Likely cause          | What to try                                            |
| ------------------------------ | --------------------- | ------------------------------------------------------ |
| `format:check` fails           | Unformatted files     | `npm run format`, review diff, re-check                |
| ESLint warnings fail the run   | `--max-warnings=0`    | Fix the warning; do not raise the limit casually       |
| `typecheck` fails on routes    | Stale generated types | Re-run `npm run typecheck` (runs `next typegen` first) |
| Build fails after types pass   | Build-only issue      | Read the Next build error; fix source                  |
| Editor does not format on save | Extension missing     | Install Prettier extension; reload window              |

---

## Suggested local sequence before a PR

```powershell
npm run format
npm run check
npm run build
```

Then review `git diff` so formatting did not change business meaning.
