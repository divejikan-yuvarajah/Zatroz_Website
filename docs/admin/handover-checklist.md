# Admin handover checklist (A12)

**Purpose:** Short isolated exercise for an owner or editor.  
**Teammate acceptance:** Pending until a real person completes the rows below.

Do not invent signatures. Do not use production customer data.

---

## Self-check (documentation + automated)

| Item                       | How                                                | Result                    |
| -------------------------- | -------------------------------------------------- | ------------------------- |
| AuthZ matrix tests         | `npm run test:admin-authz`                         | Record pass/fail when run |
| Full quality gate          | `npm run check`                                    | Record pass/fail when run |
| Production build           | `npm run build`                                    | Record pass/fail when run |
| Recovery docs readable     | `docs/admin/auth-recovery.md`, `backup-restore.md` | Done when reviewed        |
| Env example has no secrets | `.env.example` blanks only                         | Done when reviewed        |

---

## Isolated exercise (when an authorized teammate is available)

| #   | Task                                                        | Owner | Editor | Done? |
| --- | ----------------------------------------------------------- | ----- | ------ | ----- |
| 1   | Open the correct local or preview URL                       | Yes   | Yes    |       |
| 2   | Sign in with the assigned role + MFA                        | Yes   | Yes    |       |
| 3   | Create or open a draft project and save                     | Yes   | Yes    |       |
| 4   | Open authenticated preview; confirm private media           | Yes   | Yes    |       |
| 5   | Confirm editor cannot publish / open Featured / Staff       | —     | Yes    |       |
| 6   | Owner publishes summary; notes refresh-pending if jobs open | Yes   | —      |       |
| 7   | Run Jobs worker or CLI refresh                              | Yes   | —      |       |
| 8   | Locate auth recovery + backup docs                          | Yes   | Yes    |       |
| 9   | Identify next secret/domain renewal owner                   | Yes   | —      |       |

---

## Evidence log

| Name | Role | Date | Notes / questions               |
| ---- | ---- | ---- | ------------------------------- |
| —    | —    | —    | Teammate validation **Pending** |

Agent self-check of docs + unit suite does **not** replace teammate acceptance.
