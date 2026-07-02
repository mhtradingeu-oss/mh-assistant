# T64 — Setup Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing actions in:

- `public/control-center/pages/setup.js`

This follows T63, which found that Setup includes expected setup persistence, local draft storage, AI guidance helpers, navigation, and a business template apply action.

## Action Classification

### 1. Save local draft
Observed behavior:
- Uses local setup draft storage.
- Writes to browser localStorage.
- Does not call backend.
- Does not publish, approve, send, execute, connect, upload, or mutate operational records.

Classification:
- Draft/local-only state.
- Safe.

Required action:
- No runtime patch required.

---

### 2. Auto draft persistence on form input/change
Observed behavior:
- `form.oninput = refreshAndPersistDraft`
- `form.onchange = refreshAndPersistDraft`
- Uses delayed local draft save.
- Also patches transient frontend state for setup preview/context.

Classification:
- Draft/local-only state plus transient UI state.
- Safe if it remains local/transient.

Required action:
- No runtime patch required.

---

### 3. Save Setup to Backend
Observed behavior:
- Explicit button: `Save Setup to Backend`
- Calls the provided `saveProjectSetup(projectName, payload)` path.
- Clears local draft after successful save.
- Reloads project data after save.
- UI copy clearly says this persists backend project foundation data.

Classification:
- Explicit normal setup save.
- Backend mutation, but expected and clearly user-initiated.

Risk:
- No `confirm()` exists.
- This may be acceptable because the action is explicit, named as backend save, non-destructive, and part of Setup’s core purpose.

Required action:
- No blocking patch required unless we decide to standardize confirmations for all backend writes.
- Optional copy/wording patch only.

---

### 4. Save Setup and refresh
Observed behavior:
- `setupValidateNowBtn` clicks the same primary save button.
- Copy says diagnostics use the same backend Save Setup path.

Classification:
- Explicit normal setup save via secondary control.
- Backend mutation through existing save path.

Risk:
- User may read “Validate now” as read-only, but current label says “Save Setup and refresh,” which is clearer.

Required action:
- No required patch if label remains “Save Setup and refresh.”
- Optional copy improvement only.

---

### 5. Bottom Save Setup to Backend
Observed behavior:
- Bottom save button clicks top save button.
- Same backend save path.

Classification:
- Explicit normal setup save.
- Safe, because it is named “Save Setup to Backend.”

Required action:
- No patch required.

---

### 6. Smart Action: Focus next field or Save Setup
Observed behavior:
- If missing fields exist, focuses next field.
- If save button exists and is not disabled, triggers `saveBackendBtn.click()`.

Classification:
- Mixed action:
  - Focus UX action
  - Potential backend save action

Risk:
- The label discloses “or Save Setup,” but it is a combined action and may be less explicit than pressing Save Setup directly.

Required action:
- Candidate for narrow T65 wording/confirmation patch.
- Preferred safe patch: change label/copy to make the save branch explicit, or avoid auto-save branch and route user to the save button.

---

### 7. Apply business template
Observed behavior:
- Calls `applyProjectBusinessTemplate(projectName, selectedType)`.
- Reloads project data after applying.
- This is a backend mutation or backend-controlled project update.

Classification:
- Backend mutation.
- User-initiated, but it changes project setup defaults/template data.

Risk:
- No `confirm()` exists.
- Applying a template can overwrite or alter foundation data depending on backend behavior.
- This is higher risk than normal Save Setup.

Required action:
- Candidate for narrow T65 confirmation gate.
- Confirmation should explain that template guidance/defaults may update project setup data and then reload project context.

---

### 8. AI suggestion buttons
Observed behavior:
- Apply local form guidance.
- Prepare AI Command prompt.
- Copy states that AI suggestions do not save backend data, approve work, publish, send, connect, or upload.

Classification:
- Local form guidance / AI context handoff.
- Safe.

Required action:
- No runtime patch required.

---

### 9. Navigation buttons
Observed behavior:
- Continue to Library
- Continue to Integrations
- Continue to Campaign Studio
- Review readiness on Home
- Open AI Command

Classification:
- Navigation only.
- Safe.

Required action:
- No runtime patch required.

---

## Decision

Setup should not be closed yet.

A narrow T65 patch is recommended for:

1. `Apply business template` confirmation gate.
2. `Smart Action` wording/behavior clarification.

Normal `Save Setup to Backend` can remain without confirmation because it is explicit, direct, expected, and non-destructive setup persistence.

## Recommended T65 Patch Scope

Allowed:
- Add `window.confirm()` only before applying a business template.
- Clarify Smart Action copy/label so the user understands it may save setup if no missing field is available.
- Keep all backend calls unchanged.
- Keep IDs and data attributes unchanged.
- No CSS.
- No redesign.
- No unrelated text changes.

Not allowed:
- Do not change setup persistence payload.
- Do not remove local draft behavior.
- Do not change saveProjectSetup semantics.
- Do not modify backend.
- Do not touch data/projects.
