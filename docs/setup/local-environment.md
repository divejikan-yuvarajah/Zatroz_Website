# Local development environment

**Status:** Verified on this machine (2026-09-16)  
**Step:** 04  

Personal machine names and unrelated environment dumps are omitted. Paths below are only the tool executables needed to reproduce checks.

---

## OS and shell

| Item | Value |
| --- | --- |
| OS | Windows 11 (NT 10.0.26100) |
| Chosen shell | PowerShell 7.6.0 |
| Notes | Prefer this Windows setup; do not switch to WSL automatically. Keep one checkout per OS — do not reuse the same `node_modules` between Windows and Linux. |

---

## Verified tool versions

Checked in Cursor’s terminal with read-only commands:

| Tool | Version | Executable location |
| --- | --- | --- |
| Node.js | **v24.10.0** | `D:\node.exe` |
| npm | **11.6.1** | `D:\npm.ps1` (also `npm.cmd` works) |
| Git | **2.47.1.windows.2** | `C:\Program Files\Git\cmd\git.exe` |

### Baseline decision

- Prompt pack baseline: **Node 24 LTS**.
- Official Node release schedule (as of this check): Node **24** is **Active LTS** (codename Krypton), with security support currently listed through **30 April 2028**. Maintenance LTS transition is scheduled around **20 October 2026**.
- Installed patch **24.10.0** is on the supported 24.x line. A newer 24.x patch may exist; upgrading Node is optional and not required for this documentation step.
- Next.js official install docs currently require **Node.js ≥ 20.9**. **v24.10.0 meets that minimum**, so we **keep this existing toolchain** for Step 06 initialization.
- Do not use an end-of-life Node major just because it satisfies an old minimum.

---

## Intended project folder

Portable description: the **Zatroz website repository root** (local folder currently used for this project; GitHub name planned as `zatroz-website` in Step 05).

Open this root in Cursor so the integrated terminal starts in the same folder as `docs/`.

---

## Install or recheck instructions (Windows)

Only needed if a tool is missing after a machine change:

1. **Cursor** — install from [https://cursor.com/downloads](https://cursor.com/downloads), then reopen the project folder.  
2. **Git** — install from [https://git-scm.com/downloads](https://git-scm.com/downloads).  
3. **Node.js 24 LTS** — install from [https://nodejs.org/en/download](https://nodejs.org/en/download) (npm is included).  
4. Restart Cursor after installs so PATH updates apply.  
5. Recheck:

```powershell
node --version
npm --version
git --version
```

If PowerShell blocks `npm.ps1`, try `npm.cmd --version` before changing execution policy. On this machine, both worked.

**Do not:** run unreviewed download scripts, use `sudo npm`, or silently change global Git identity.

---

## Open the project in Cursor

1. Cursor → **File → Open Folder…**  
2. Select the Zatroz repository root.  
3. Confirm `docs/progress.md` is visible in the file tree.

---

## Open the integrated terminal in the project root

1. **Terminal → New Terminal** (or `` Ctrl+` ``).  
2. Confirm the prompt path is the repository root.  
3. If not: `cd` to that root before running npm/git commands.

---

## Localhost and stopping a future dev server

- After Step 06, `npm run dev` usually serves the app at **http://localhost:3000**.  
- **localhost** means “this computer only” — not the public internet.  
- Stop the server with **Ctrl+C** in the terminal that is running it.

---

## Common problems

| Problem | What to try |
| --- | --- |
| `node` / `npm` / `git` not recognized | Reinstall via official installer; restart Cursor; confirm PATH |
| Wrong directory | `cd` to the repository root before `npm` commands |
| Windows vs Linux checkout | Do not copy `node_modules` across OS; reinstall deps per environment |
| Permission errors writing `node_modules` | Close locking programs; avoid installing into protected system folders |
| `npm.ps1` blocked in PowerShell | Use `npm.cmd` for the same command |
| Port 3000 in use (later) | Stop the other process or start Next on another port when documented |

---

## Optional editor extensions (not installed by this step)

- ESLint  
- Prettier  
- Tailwind CSS IntelliSense  

Install only if you want editor help; they are optional for Step 04.

---

## Step 04 verification result

| Check | Result |
| --- | --- |
| `node --version` | `v24.10.0` — pass |
| `npm --version` | `11.6.1` — pass |
| `git --version` | `git version 2.47.1.windows.2` — pass |
| Next.js Node minimum (≥ 20.9) | Satisfied by current Node — pass |
| Next.js scaffold / remotes / cloud services | **Not run** (out of scope for Step 04) |

**Step status:** Verified — ready for Step 05 Git workflow documentation.
