# Cursor workflow (Zatroz)

**Step:** 09  
**Purpose:** How to use Cursor safely on this repo with project rules and the prompt pack.

**Important:** Rules **guide** the agent. They are **not** a secret vault and **not** an enforcement mechanism. Never put API keys, passwords, or `.env` values in rules, chats, or commits.

Keep framework `AGENTS.md` guidance. Do **not** add a legacy `.cursorrules` file.

---

## Select one step

1. Open `docs/prompts/Zatroz_Cursor_Prompts_Steps_01_to_10.md` (or the next pack when available).
2. In a new Agent chat, paste the session instruction if needed, then say clearly: **Execute Step NN only**.
3. Attach or `@`-mention the files that step lists (for example scope, sitemap, `folder-structure.md`).
4. Review the diff before commit/push. Do not ask the agent to start the next step in the same turn unless you intend that.

---

## Fresh session using project docs

1. Open the repository folder in Cursor.
2. Start a **new** Agent chat when switching steps (keeps context clean).
3. Point the agent at `docs/progress.md` so it knows what is already done.
4. Rely on `.cursor/rules/` for standing guidance; rely on planning docs for decisions and content status.

---

## Inspect which rules are in context

In Cursor:

1. Open **Customize** (sidebar) → **Rules**, or use the rules / context indicators available in your Agent chat UI.
2. Confirm project rules under `.cursor/rules/` appear (especially `00-project-core` as Always Apply).
3. For intelligent rules, ensure each has a clear **description** (already set for `10-`, `20-`, `30-`).
4. You can `@`-mention a rule file manually if it did not attach.

**Activation verification for this step:** Agent cannot reliably see your Cursor UI. After pull, open Customize → Rules and confirm the four Zatroz `.mdc` files show as expected — label that check **manual / not verified by the agent**.

---

## Review a diff and ask for a focused correction

1. Use Source Control or `git diff` / `git diff --stat`.
2. Ask for a **small** fix (name the file and the problem). Avoid “redo the whole step” unless necessary.
3. Re-run the affected checks (`npm run check`, `npm run build`) after the fix.

---

## Explain unfamiliar React / TypeScript code

Ask in plain language, for example: “Explain `src/app/layout.tsx` like I am learning React. What is server vs client here?”  
Prefer explanations tied to **this** repo’s files, not generic tutorials alone.

---

## Track blocked checks honestly

If a command cannot run (no network, no browser, missing tool):

- Record it in the step report / `docs/progress.md` as **not run**.
- Give the exact manual command.
- Do **not** treat an unrun check as passed.

---

## Check, commit, push, and PR (from Step 06 onward)

```powershell
npm run check
npm run build
git status
git diff
git add YOUR_REVIEWED_PATHS
git commit -m "YOUR_STEP_MESSAGE"
git push -u origin HEAD
```

Then open a pull request into `main`, review on GitHub, merge, and start the next branch from updated `main` (`docs/setup/git-workflow.md`).

---

## Rule files in this repo

| File                                      | Type                              |
| ----------------------------------------- | --------------------------------- |
| `.cursor/rules/00-project-core.mdc`       | Always apply                      |
| `.cursor/rules/10-frontend.mdc`           | Apply intelligently (description) |
| `.cursor/rules/20-content-and-design.mdc` | Apply intelligently (description) |
| `.cursor/rules/30-server-and-data.mdc`    | Apply intelligently (description) |

Related docs: `docs/architecture/folder-structure.md`, `docs/setup/quality-checks.md`, `docs/planning/decision-register.md`.
