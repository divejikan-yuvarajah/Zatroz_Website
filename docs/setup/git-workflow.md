# Git and GitHub workflow (Zatroz)

**Remote (intended):** `https://github.com/divejikan-yuvarajah/Zatroz_Website.git`  
**Default branch:** `main`  
**Rule:** No force-push to `main`. Do not put tokens in remote URLs.

---

## Local versus remote

| Concept | Meaning |
| --- | --- |
| Local repository | The `.git` folder on your computer |
| Remote `origin` | The GitHub copy of this project |
| Commit | A saved checkpoint of staged files |
| Push | Upload local commits to GitHub |
| Pull / PR | Review and merge changes through GitHub |

---

## First checkpoint (Steps 01–05 docs)

After reviewing staged files:

1. Stage only safe paths (example below).  
2. Commit on `main`.  
3. Push once to the empty GitHub repository.  
4. From Step 06 onward, use a **per-step branch** and open a pull request.

Suggested initial commit message:

```text
docs: initialize Zatroz planning and setup
```

Example commands (PowerShell), after you have reviewed the diff:

```powershell
git status
git add README.md .gitignore docs/
git diff --cached --stat
git diff --cached
git commit -m "docs: initialize Zatroz planning and setup"
git push -u origin main
```

If `origin` is missing:

```powershell
git remote add origin https://github.com/divejikan-yuvarajah/Zatroz_Website.git
git remote -v
```

If Git asks for identity inside this repository only (do **not** paste secrets into chat):

```powershell
git config --local user.name "YOUR_COMMIT_NAME"
git config --local user.email "YOUR_COMMIT_EMAIL"
```

Prefer your GitHub-ready name and commit email. This project already has a usable **global** Git identity on this machine; set `--local` only if you want different values for this repo.

---

## Per-step branch workflow (from Step 06)

Before a new step (after the previous PR is merged):

```powershell
git status
git switch main
git pull --ff-only origin main
git switch -c setup/06-nextjs
```

Use the branch name from the prompt pack for that step (for example `setup/07-quality`).

After the step, stage **only reviewed files**:

```powershell
git status
git diff --stat
git diff
git add YOUR_REVIEWED_FILE_PATHS
git diff --cached
git commit -m "YOUR_STEP_COMMIT_MESSAGE"
git push -u origin HEAD
```

Then open a pull request on GitHub, review the diff, merge, and return to `main`:

```powershell
git switch main
git pull --ff-only origin main
```

### Reviewing diffs

- `git status` — what changed  
- `git diff` — unstaged changes  
- `git diff --cached` — staged changes about to commit  

Do not use blanket `git add .` if private or unrelated files might be present.

---

## Safety checklist

- [ ] No `.env` / `.env.local` in the commit (`.env.example` is OK later)  
- [ ] No raw private assets under `private/` or `raw-assets/`  
- [ ] No API keys or tokens in files or remote URL  
- [ ] No `git push --force` to `main`  
- [ ] Branch protection on GitHub is optional and **not claimed** until you configure it  

---

## What this step does not do

- Does not deploy the website  
- Does not change GitHub visibility or collaborators  
- Does not add a licence without a business decision  
- Does not claim branch protection is enabled  
