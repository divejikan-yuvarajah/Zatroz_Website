# Form components

**Step:** 13  
**Tokens and Button:** Reuse Step 11–12. Do not add a second palette or a form library.

This step is **not** the Contact enquiry. There is no API route, storage, email, analytics, or `fetch`.

Presentational fields stay Server Components. The local demo and `ErrorSummary` (focus + click) are Client Components.

---

## Imports

```ts
import { FormField } from "@/components/forms/form-field";
import { TextInput } from "@/components/forms/text-input";
import { TextArea } from "@/components/forms/text-area";
import { SelectField } from "@/components/forms/select-field";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { ErrorSummary } from "@/components/forms/error-summary";
import { InlineStatus } from "@/components/forms/inline-status";
```

`mergeDescribedBy` lives in `src/lib/described-by.ts`. Shared input look is in `src/components/forms/form-control-styles.ts`.

---

## How FormField shares ids (the one pattern)

FormField takes an explicit `id` (the control id). It does **not** cloneElement.

It calls `children` as a function and passes:

| Key                | When                                                                          |
| ------------------ | ----------------------------------------------------------------------------- |
| `id`               | Always the same as FormField                                                  |
| `aria-describedby` | Hint and/or error ids, plus any extra `describedBy` you passed, de-duplicated |
| `aria-invalid`     | Only when an `error` string is present                                        |
| `aria-required`    | When `required` is true                                                       |

```tsx
<FormField id="demo-name" label="Name" required error={nameError}>
  {(control) => (
    <TextInput {...control} name="name" value={name} onChange={...} />
  )}
</FormField>
```

Hint id is `{id}-hint`. Error id is `{id}-error`. Those elements are rendered only when the text exists.

Use a **different** `id` for every field on the page (including two demos). Do not generate random ids per render.

**Misuse:** Do not use placeholder as a label. Do not wrap FormField around CheckboxField if that would create two labels — CheckboxField already has a clickable label.

---

## TextInput

**File:** `src/components/forms/text-input.tsx`  
Native `<input>`. Default `type="text"`. Supports `type="email"` / `tel`, `name`, `id`, `required`, `disabled`, `readOnly`, `autoComplete`, `inputMode`, `value` / `defaultValue`, `onChange`, and `ref`.

Do not pass both `value` and `defaultValue` on the same instance.

Text is at least 16px. Invalid uses the error border **and** the FormField error text (not colour alone). Disabled uses reduced opacity. Read-only uses a muted surface and stays readable/focusable.

---

## TextArea

**File:** `src/components/forms/text-area.tsx`  
Native `<textarea>`. Vertical resize, minimum height, `min-w-0` so long text does not break the page. Supports `readOnly` like TextInput.

---

## SelectField

**File:** `src/components/forms/select-field.tsx`  
Native `<select>` only (no custom listbox). Include an empty prompt option with `value=""`. Keyboard behaviour is the browser’s. **Do not** pass `readOnly`.

---

## CheckboxField

**File:** `src/components/forms/checkbox-field.tsx`  
Native checkbox plus a visible label (`htmlFor` + generous hit area). Optional hint and error on this component. **Do not** pass `readOnly`. Not a custom `role="checkbox"`.

Use `fieldset` / `legend` for a group. Do not turn the optional demo checkbox into marketing consent.

---

## ErrorSummary

**File:** `src/components/forms/error-summary.tsx` (`"use client"`)

Renders **nothing** when `errors` is empty. Otherwise a heading, a list of links, `tabIndex={-1}`, and a `ref` so the parent can `focus()` it after submit.

Each link uses `href="#control-id"` and, on click, focuses that control.

**Announcement strategy:** After an invalid submit, focus the summary **once**. Inline field errors are text + `aria-describedby` / `aria-invalid`, not live regions. Do not also set InlineStatus for the same validation errors. Do not move focus while the person is typing or when the page first loads.

---

## InlineStatus

**File:** `src/components/forms/inline-status.tsx`

Keep it mounted. `tone`:

| Tone      | Live region            | Typical copy                                                    |
| --------- | ---------------------- | --------------------------------------------------------------- |
| `idle`    | polite `status`, empty | —                                                               |
| `pending` | polite `status`        | Progress; not “saved”                                           |
| `success` | polite `status`        | Demo: “Demo validation passed. Nothing was sent or saved.”      |
| `error`   | `alert` (assertive)    | Failure after a **valid** form, when the summary is not focused |

This component **must not** decide that an enquiry was saved. A future Contact form will wait for the server.

---

## Local demo

`src/components/dev/form-demo.tsx` on `/dev/ui` only.

- Heading: **Local component demo — nothing is sent or saved**
- Fields: name, email (`type="email"`, `autoComplete="email"`), service select including **Not sure**, message, optional checkbox
- `noValidate` so the custom summary runs; native `required` / `type` remain for `validity`
- Invalid submit: show errors, keep values, focus the summary once
- After a field was reported invalid, correcting it clears that error; untouched fields do not gain new errors until the next submit
- Email check uses the browser `typeMismatch` rule, not a custom tight regex, and not an alphabet-only name rule
- Explicit buttons: pending, failure, clear status — no `fetch`. Failure keeps the typed values
- Submit uses Button `loading` while pending so it cannot be sent again
- No `localStorage`, cookies, console logging of values, or network submit

This demo validation is **not** future server-side validation.

---

## Checks (Step 13)

- `npm run check`: passed (2026-09-17).
- `npm run build`: passed (Next.js 16.3.5).
- Production `next start` on **http://localhost:3013**: `/` HTTP 200; `/dev/ui` HTTP **404**.
- Keyboard-only completion, 320px / enlarged text, on-screen keyboard, and NVDA/VoiceOver: **not run** by the agent. Please use `/dev/ui` in `npm run dev` and the manual list in the Step 13 prompt.
