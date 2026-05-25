# PHASE 3O.4 — AI Command Context / Source Visibility Audit

## 1. Executive Summary
This audit documents how the AI Command interface currently manages and displays project context, source/asset context, handoff context, and prompt context. It identifies current UI visibility, risks, and recommends the next safe patch for improved clarity and safety. No production code or backend changes are made.

## 2. Current Project Context Map
- Project context is accessed via `selectCurrentProject`, `selectProjectPayload`, and `setCurrentProject` (see ai-command.js, app.js, state.js).
- Project context is used to scope AI actions and source handoff.
- Project context is not always visually surfaced in the AI Command UI header.

## 3. Source / Library Context Map
- Source/asset context is managed via `getSharedAiSource`, `setSharedAiSource`, `clearSharedAiSource`, and `getSourceTypeMapping` (see tool-dock.js, shared-context.js, library.js).
- Library assets are normalized and handed off as source payloads to AI Command.
- Source context is attached to the current project and can be cleared.

## 4. Handoff Context Map
- Handoff context is managed via `getSharedHandoff`, `setSharedHandoff`, and `getSharedLibrarySourceBridge`.
- Library → AI Command handoff uses a bridge and drawer return context (see tool-dock.js, library.js).
- Handoff context is not always visible to the user after transfer.

## 5. Prompt/API Context Inclusion Map
- AI Command calls `executeProjectAiChat` and `executeProjectAiGuidance` (see ai-command.js, api.js).
- Project and source context are included in API payloads, but not always shown in the UI before sending.
- Context is normalized in the frontend before API calls.

## 6. Current UI Visibility Assessment
- Project name is not always persistently visible in the AI Command UI.
- Attached source/asset is not always clearly shown or labeled as current/stale.
- Handoff/bridge context is not surfaced after initial transfer.
- There is no explicit UI for clearing/changing source context except via drawer actions.

## 7. Clear/Remove Source Behavior
- `clearSharedAiSource` and `clearSharedLibrarySourceBridge` are available (see tool-dock.js, library.js).
- No prominent UI affordance for clearing source context from the main AI Command panel.
- Clearing is possible via drawer or Library, but not always obvious.

## 8. Stale/Mismatch Context Risks
- Source context can become stale if the project or asset changes after handoff.
- No explicit UI warning for stale or mismatched context.
- Risk of sending outdated or incorrect source context to the AI backend.

## 9. Action Inventory
- Select project (via project selector/state).
- Attach source/asset from Library.
- Handoff context via bridge/drawer.
- Clear source context (drawer/Library only).
- Send prompt to AI (includes context).

## 10. Protected Behavior List
- No backend/api.js changes in this audit.
- No CSS or UI code changed.
- No changes to executeProjectAiChat or executeProjectAiGuidance.
- No changes to Library source handoff logic.
- No destructive actions exposed in team rail or context UI.

## 11. P0/P1/P2/P3 Risk Register
- **P0:** Sending stale/mismatched source context to backend (no warning).
- **P1:** User cannot see which project/source is active before sending prompt.
- **P2:** No clear UI to remove/clear source context.
- **P3:** Handoff context not visible after transfer; user confusion possible.

## 12. Recommended First Safe Patch
- Add a persistent UI element in the AI Command panel showing:
  - Current project name
  - Attached source/asset name and type
  - Status indicator (current/stale)
  - Clear/change source button
- No backend or CSS changes required for first patch.

## 13. Validation Results
- `git status --short`: Working tree is clean; no production files changed.
- `node --check public/control-center/pages/ai-command.js`: No errors.
- `node --check public/control-center/pages/library.js`: No errors.
- `node --check public/control-center/app.js`: No errors.
- `node --check public/control-center/router.js`: No errors.
- `node --check public/control-center/api.js`: No errors.
- `node --check public/control-center/shared-context.js`: No errors.

---

**Recommended next step:**
Implement the recommended UI patch to surface project/source context and add a clear/change control in the AI Command panel. No commit performed in this audit mode.
