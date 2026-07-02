# PHASE 3O.1 — AI Command Data Contract / Source + Handoff Verification

## 1. Executive Verification Summary
- **Confirmed:**
  - AI Command does not perform backend execution or mutation; all actions are routed or projected.
  - Specialist/team definitions are static and frontend-only (MODE_DEFS, SPECIALIST_DEFS).
  - Library → AI Command source handoff uses setSharedLibrarySourceBridge/getSharedLibrarySourceBridge and setSharedAiSource/getSharedAiSource.
  - Project context is read from selectors (selectCurrentProject, selectProjectPayload).
  - Output tabs (draft/task/workflow/handoff/export) are local state, not persisted backend objects.
- **Qualified:**
  - "Full Team" mode exists as a state variable (teamMode), but is not a true multi-specialist execution; it only changes prompt context.
  - Handoff actions are navigation/context only, not backend workflow triggers.
  - Source context is visible in the drawer, but can be subtle and is not always persistent after navigation.
- **Not Proven:**
  - No evidence of backend-driven team membership or dynamic specialist status.
  - No explicit stale/mismatched context warnings.
  - No backend authority for team/role logic.

## 2. Exact AI Command API Contract Map
| Import/Function Name         | Source         | Endpoint/Path      | Type         | Backend Authority | Confirmation Needed | Risk |
|-----------------------------|----------------|--------------------|--------------|-------------------|---------------------|------|
| executeProjectAiChat        | api.js         | /ai/chat           | Read         | No                | No                  | P2   |
| executeProjectAiGuidance    | api.js         | /ai/guidance       | Read         | No                | No                  | P2   |
| getCategoryReadinessList    | asset-library  | /assets/readiness  | Read         | No                | No                  | P3   |
| setSharedAiDraft            | shared-context | N/A (local cache)  | Local        | No                | No                  | P3   |
| setSharedHandoff            | shared-context | N/A (local cache)  | Local        | No                | No                  | P3   |
| getSharedHandoff            | shared-context | N/A (local cache)  | Local        | No                | No                  | P3   |

## 3. AI Team / Specialist Definitions Verification
- **MODE_DEFS, SPECIALIST_DEFS, AGENT_CARDS:** All defined in ai-command.js (frontend static arrays).
- **No backend projection or dynamic team membership.**
- **"Full Team" is a state variable (teamMode), not a backend-driven mode.**
- **Visible specialists:** All in MODE_DEFS/SPECIALIST_DEFS.
- **Implied specialists:** Planned only (AI_ROOM_PLANNED_SPECIALISTS).

## 4. Full Team vs Ask Specialist Verification
- **Full Team mode:** Exists as teamMode = "full"; only affects prompt context, not true multi-specialist execution.
- **Single specialist mode:** teamMode = "solo"; default.
- **State variable:** session.teamMode.
- **Labels/toggles:** UI exposes mode, but toggle is subtle; not always clear to user.
- **User journey:** Not explicit; user must know to toggle.
- **Missing:** Real multi-specialist workflow, explicit toggle, and clear journey.

## 5. Library Source Context Verification
- **Selection:** Library asset selection triggers setSharedLibrarySourceBridge and setSharedAiSource.
- **Payload:** Asset object with id, asset_id, name, filename, file_path, asset_type, source_label, source_of_truth, text_preview, selected_at.
- **Read:** AI Command reads via getSharedAiSource.
- **Display:** Source context shown in drawer (tool-dock.js), but can be subtle.
- **Stale/mismatch risk:** Exists if user switches assets or navigates; no explicit warning.
- **Clear/remove:** Remove button exists in drawer.

## 6. Project Context Verification
- **Active project:** Read via selectCurrentProject/selectProjectPayload (state.js).
- **Prompt/API inclusion:** Project name and context included in prompt templates and API payloads.
- **Stale risk:** If project is switched, context may lag until session reload; no explicit warning.

## 7. Handoff Map Verification
- **Destinations:** Workflows, Library, Publishing, Governance, Media Studio, Campaign Studio, Content Studio.
- **Selector/action:** Buttons in tool dock and drawer (tool-dock.js).
- **Handler:** openAiToolDrawerFromMetadata, setSharedHandoff, setSharedAiDrawerReturn.
- **Payload:** Context only; no backend execution.
- **Type:** Navigation/context handoff only.
- **No backend execution.**

## 8. Action Inventory and Safety Classification
| Action                | Selector/Data Attr           | Handler Location         | API Call         | Mutation/Exec | Confirmation | Risk |
|-----------------------|-----------------------------|-------------------------|------------------|--------------|--------------|------|
| Guidance/Chat         | Composer, [data-aicmd-composer-input] | ai-command.js           | executeProjectAiChat | No           | No           | P2   |
| Draft/Preview         | Output tabs                 | ai-command.js           | executeProjectAiGuidance | No           | No           | P2   |
| Task/Workflow Proposal| Output tabs                 | ai-command.js           | None             | No           | No           | P2   |
| Handoff (route)       | [data-aicmd-tool-dock]      | tool-dock.js            | None             | No           | Yes (target) | P2   |
| Remove Source         | [data-aicmd-tool-drawer-remove-source] | tool-dock.js | None             | No           | No           | P3   |

## 9. Listener / Timer / Runtime Verification
- **No global/document/window listeners in AI Command.**
- **No setTimeout/setInterval/requestAnimationFrame in core logic.**
- **Handlers are render-bound and context-local.**
- **No repeated-binding or heavy runtime risks detected.**
- **No auto execution.**

## 10. Output / Proposal Model Verification
- **Outputs:** draft, task, workflow, handoff, export (tabs).
- **Persistence:** Local state only; not persisted to backend.
- **No backend task/workflow creation.**
- **Safe to claim:** Only guidance, draft, and proposal; not execution or mutation.

## 11. UX Power Gap Assessment
- **Power exists:** Specialist/team model, context handoff, output tabs.
- **Hidden:** Full Team toggle, source context, handoff chain.
- **Confusing:** Mode toggle, context persistence, handoff clarity.
- **Should be surfaced:** Full Team toggle, current context, next best actions.
- **Minimum safe first patch:** Make Full Team vs Specialist toggle explicit and visible.

## 12. Corrected Risk Register
- **P0:** None detected (no backend execution, mutation, or fake authority).
- **P1:** Team mode clarity, context handoff, stale context risk.
- **P2:** UX density, toggle visibility, context display.
- **P3:** Future enhancements (dynamic team, backend-driven roles).

## 13. Protected Behavior List
- **Functions:** executeProjectAiChat, executeProjectAiGuidance, setSharedLibrarySourceBridge, setSharedAiSource, getSharedAiSource, setSharedHandoff, setSharedAiDrawerReturn.
- **State:** session.teamMode, session.modeId, session.draftMessage, session.outputPreview.
- **Selectors:** [data-aicmd-tool-dock], [data-aicmd-tool-drawer-remove-source], [data-aicmd-composer-input].
- **No changes without explicit approval.**

## 14. Recommended Implementation Roadmap
1. Make Full Team vs Specialist toggle explicit and visible in UI.
2. Surface current source/project context more clearly.
3. Add stale context warning if project/source changes.
4. Visualize handoff chain and next best actions.
5. Plan for backend-driven team/specialist status (future).

## 15. Recommended First Safe Patch
- Add a visible, labeled toggle for "Full Team" vs "Ask Specialist" in the AI Command UI, with helper text. No backend or mutation changes.

## Validation Results
- git status --short: Clean
- node --check public/control-center/pages/ai-command.js: OK
- node --check public/control-center/pages/library.js: OK
- node --check public/control-center/app.js: OK
- node --check public/control-center/router.js: OK
- node --check public/control-center/api.js: OK
- node --check public/control-center/shared-context.js: OK
- Production files changed: None

## Recommended Next Step
- Review this evidence-based audit with stakeholders. Approve the first safe patch before implementation. No code or data changes until explicit approval.