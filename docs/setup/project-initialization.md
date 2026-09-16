# Project initialization record (Step 06)

**Date:** 2026-09-16  
**Branch:** `setup/06-nextjs`  
**Method:** `create-next-app@latest` in a temporary sibling folder `zatroz-scaffold-temp`, then controlled merge into this repository (planning docs, README, and Git history preserved).

---

## Environment used

| Tool | Version |
| --- | --- |
| Node.js | v24.10.0 (see `.nvmrc`) |
| npm | 11.6.1 |
| OS / shell | Windows 11 / PowerShell |

`.nvmrc` records `24.10.0` for nvm users. **On Windows, `.nvmrc` alone does not install Node** — use the official installer or nvm-windows if you manage versions that way.

`package.json` `engines.node` is set to `>=24 <25` to match the verified local LTS major.

---

## Installed package versions (resolved)

| Package | Version |
| --- | --- |
| next | 16.3.5 |
| react | 19.2.8 |
| react-dom | 19.2.8 |
| typescript | 5.9.3 |
| eslint | 9.39.5 |
| eslint-config-next | 16.3.5 |
| tailwindcss | 4.3.3 |
| @tailwindcss/postcss | (caret range in package.json; installed with Tailwind 4) |

Package name: **`zatroz-website`**.  
Lockfile: **`package-lock.json`** (npm).  
React Compiler: **off** (not enabled at scaffold).  
Output mode: default server-capable Next.js build (**no** `output: "export"`), so a later enquiry API route remains possible.

---

## Scaffold choices

- App Router
- TypeScript
- Tailwind CSS v4 (generated PostCSS config kept)
- ESLint
- `src/` directory
- Import alias `@/*` → `src/*`
- npm
- Git disabled in the temp scaffold; real repo history kept

Framework agent guidance from the scaffold (`AGENTS.md`, `CLAUDE.md`) was retained. Our project `README.md` was **not** overwritten.

---

## Starter UI

- Root layout: `<html lang="en">` and `<body>`
- Home page: semantic heading **Zatroz** plus a short development placeholder
- System font stack (no remote Google font requests)
- Demo marketing links and scaffold SVGs removed from `public/`

---

## Verification results (2026-09-16)

| Check | Result |
| --- | --- |
| `npm install` | Succeeded (0 vulnerabilities reported) |
| `npm run build` | Succeeded — route `/` static |
| `npm run dev` → `http://localhost:3000` | HTTP 200; page contains “Zatroz”; `lang="en"` present |
| Hot reload | Confirmed after a temporary page text change |
| Browser visual review | **Manual** — open `http://localhost:3000` yourself while `npm run dev` runs |
| `npm run start` (production server) | **Not run** in this step after build; optional local check: `npm run build` then `npm run start` |

---

## Temp scaffold cleanup

The sibling folder `Desktop/zatroz-scaffold-temp` was used only for generation. Delete it manually when you no longer need it:

```powershell
Remove-Item -Recurse -Force "C:\Users\ASUS\Desktop\zatroz-scaffold-temp"
```

Do not delete this repository’s `node_modules` when removing the temp folder.
