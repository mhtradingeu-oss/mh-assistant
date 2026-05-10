# Library Implementation Plan
Date: 2026-05-10
Scope: Library page only
Constraint: Planning only, no production code edits in this step

## 1. Objectives
1. Preserve current feature parity for Library while reducing architectural risk.
2. Align Library with Operating Surface standard:
   - Main View (Finder + Inspector)
   - Action Panel (deterministic operations)
   - AI Panel (contextual AI actions)
3. Move authority-like interpretation logic behind explicit projection adapters.
4. Introduce route-safe listener lifecycle and deterministic teardown.

## 2. Baseline and Decomposition Targets
Current file sizes:
- public/control-center/pages/library.js: 2658 lines
- public/control-center/asset-library.js: 454 lines

Target state (phase goal):
- library.js becomes thin route composition shell (< 400 lines target).
- Domain logic split into focused modules with explicit interfaces.
- No behavior regression in upload/preview/actions/readiness visibility.

## 3. Safe Decomposition Strategy
Decompose in compatibility-preserving phases.

Phase A: Extraction without behavioral changes
1. Extract pure helpers first (no DOM side effects).
2. Extract projection adapters and normalizers.
3. Extract render-template builders returning HTML strings.
4. Extract event-binding functions with explicit mount/unmount contracts.

Phase B: Listener lifecycle hardening
1. Replace ad hoc global listeners with scoped listener manager.
2. Ensure mount/unmount called by route render lifecycle.
3. Preserve single-init compatibility guard until full migration complete.

Phase C: Operating Surface panelization
1. Build Action Panel module preserving existing action semantics.
2. Build AI Panel module preserving existing prompt pathways.
3. Keep Finder workspace stable and route commands through panel controller.

Phase D: Cleanup and conformance
1. Remove dead/no-op utility hooks.
2. Consolidate duplicated library styles into one authoritative location.
3. Add verification checklist execution and parity review.

## 4. Proposed Modules
Proposed folder:
- public/control-center/pages/library/

Modules and responsibilities:
1. route-shell.js
- Owns route render entry.
- Assembles dependencies and initial state.
- Calls mount/unmount for sub-surfaces.

2. session-store.js
- Project-scoped library session state.
- viewMode, filters, pagination, selection, upload state, recent uploads.
- Explicit serialization boundaries (if any).

3. projection-adapter.js
- Converts backend payloads into UI-safe view models.
- Normalization and fallback behavior isolated here.
- Explicitly tags fallback-derived fields to prevent authority confusion.

4. catalog-readiness.js
- Category readiness and missing-required computation.
- Wraps/uses public/control-center/asset-library.js contracts.

5. preview-service.js
- Protected preview fetch lifecycle.
- Blob URL cache and revoke policy.
- Thumbnail queue and concurrency settings.

6. finder-view.js
- Finder grid/list/folder/filter/search UI rendering.
- Emits semantic events (select, filter-change, page-change).

7. inspector-view.js
- Selected asset details + preview zone rendering.
- Emits action intents (open, source-toggle, approve, review, rename, delete, archive).

8. upload-controller.js
- Drag/drop + input flow.
- Upload batch execution and summary mapping.
- Emits success/failure events and reload requests.

9. action-panel.js
- Dedicated right-rail or section for deterministic operational actions.
- Must remain backend-authoritative through API calls.

10. ai-panel.js
- Contextual AI suggestions + one-click prompt injection.
- No direct operational mutation authority.

11. listener-lifecycle.js
- Central register/unregister of document/window listeners.
- Returns disposer function for route unmount.

12. command-router.js
- Routes UI intents to controller actions.
- Keeps bind code thin and testable.

## 5. What Stays in library.js
Keep in route file:
1. Route id/meta/template contract.
2. Minimal render orchestration.
3. Module wiring and dependency injection.
4. Single place for mount/unmount coordination.

Remove from route file:
1. Large HTML template builders.
2. Data normalization and inference logic.
3. Preview cache internals.
4. Mutation handlers and prompt/confirm flows.
5. Global listener registration details.

## 6. What Moves to Modules
Move immediately:
1. normalize/merge/folder/filter/sort/pagination derivations.
2. renderPreview and protected media hydrators.
3. upload drag-drop/file sync logic.
4. per-button mutation handlers.
5. AI prompt helper logic and command handoff.

Move in second wave:
1. style-affecting structural templates with clear subcomponent boundaries.
2. legacy compatibility fallback utilities once parity is verified.

## 7. Action Panel Design
Purpose:
- Deterministic, auditable operational actions on selected asset(s).

Panel sections:
1. Selection Context
- Selected asset summary.
- Current status, source-of-truth state, path, category.

2. Lifecycle Actions
- Approve
- Needs Review
- Source/Unsource
- Rename
- Archive
- Soft Delete

3. Safety + Confirmation
- Single confirmation model (replace mixed alert/confirm/prompt usage over time).
- Mutation outcomes displayed via standardized notifications.

Design requirements:
- All actions emit intent -> command-router -> backend API.
- Disabled states if no project or no selected asset.
- Action-level loading and error state handling.

## 8. AI Panel Design
Purpose:
- Contextual AI support for Library operations without direct authority over mutations.

Panel sections:
1. Next Best AI Actions
- Classify selected/new assets
- Identify missing required assets
- Extract docs from selected eligible files

2. Context Pack Preview
- Project name
- Selected asset metadata
- Missing category list
- Recently uploaded assets

3. One-click Prompt Dispatch
- Injects structured prompt into AI command input and navigates to ai-command route.
- Records source action in UI telemetry/log event (non-authoritative).

Guardrails:
- AI panel proposes and prepares, but does not directly mutate asset status/source.

## 9. Next Best Action Design (Library)
Decision engine inputs:
1. Missing required categories.
2. Needs-review asset count.
3. Unclassified/newly uploaded assets.
4. Stale source-of-truth coverage.

Output shape:
- actionId
- label
- reason
- severity
- suggestedRouteOrAction

Example actions:
1. Upload missing required category asset.
2. Review and approve pending assets.
3. Set canonical source-of-truth for key category.
4. Trigger AI classification for untyped assets.

Implementation location:
- catalog-readiness.js + command-router.js (pure compute + intent dispatch).

## 10. AI Team Roles Shown in Library
Display model (read-only operational guidance):
1. Strategist
- Interprets readiness gaps and campaign implications.
2. Content Specialist
- Suggests extract/repurpose opportunities for docs and assets.
3. Media Specialist
- Suggests visual/media classification and packaging readiness.
4. Compliance Specialist
- Highlights legal/proof/certificate coverage concerns.

Role usage rules:
- Roles generate recommendations and prompt scaffolds.
- Final operational mutations remain explicit human-triggered API actions.

## 11. Listener Lifecycle Plan
Current risk:
- Global listeners are one-time init only and not route-teardown aware.

Target lifecycle contract:
1. mountLibraryListeners({ root, session, dispatch, showError, showMessage }) -> disposeFn
2. disposeFn removes all document/window listeners created by module.
3. Route render stores disposer and invokes on route exit or re-render replacement.

Migration steps:
1. Wrap existing global listeners in listener-lifecycle.js with stable handler refs.
2. Preserve behavior while introducing explicit disposal.
3. Remove legacy initializeLibraryGlobalListeners once route-level mount/unmount is verified.

## 12. Validation Checklist
Functional parity checks:
1. Library loads with same cards, folders, filters, grid, inspector.
2. Upload supports multi-file, drag/drop, type classification, success/failure summary.
3. Protected image/video previews render and revoke object URLs correctly.
4. Actions (source, status, rename, archive, delete, open) all still call backend and handle errors.
5. AI buttons still dispatch to ai-command with expected prompt content.
6. Missing required assets panel still computes and renders accurately.

Architectural checks:
1. library.js reduced to orchestration shell.
2. No module owns backend authority; adapters are projection-only.
3. Listener attach/detach audited and testable.
4. Style ownership consolidated, duplicate blocks removed.

Operational checks:
1. No mutation pathway bypasses access key protections.
2. No local fallback state presented as authoritative without labeling.
3. Regression test script for Library interactions passes.

## 13. Suggested Execution Order (When Edits Begin)
1. Extract pure compute helpers and adapters.
2. Extract preview-service and upload-controller.
3. Introduce command-router and listener lifecycle manager.
4. Split finder/inspector/action-panel/ai-panel views.
5. Reduce route shell to composition.
6. Consolidate styles and run parity verification.

## 14. Non-Goals for First Refactor Pass
1. No redesign of backend API contracts.
2. No expansion of business capabilities beyond existing Library features.
3. No cross-page refactor outside Library surface.

## 15. Exit Criteria for Library Refactor Readiness
1. Parity retained for all current Library operations.
2. Route has explicit mount/unmount lifecycle for listeners.
3. Action Panel and AI Panel operate as distinct surface modules.
4. Authority boundaries documented and enforced through adapters/command-router.
5. Library becomes a stable template for subsequent page-by-page modernization.

## 16. Projection Boundary Rules
1. No Library module may derive governance authority locally.
2. No Library module may store durable operational truth.
3. All asset mutations must flow through existing backend APIs only.
4. Fallback-derived values must be labeled as compatibility/fallback values.
5. AI recommendations are non-authoritative and must not mutate assets directly.
6. Route shell must not own business decisions.
7. Source-of-truth state must remain backend-authoritative.
8. Projection adapters may normalize display values but must not redefine backend semantics.

## 17. Transient vs Durable State Rules

### Durable State
Owned by backend/API/data layer:
- Asset records
- Source-of-truth flags
- Approval/review status
- Readiness state
- Asset lifecycle state
- Project registry data

### Transient State
Owned by frontend route/session only:
- Selected asset
- Filters
- Search query
- Pagination
- View mode
- Upload progress
- Preview cache
- Expanded panels
- Temporary prompt context

Rule:
Transient state can improve UX but must never be presented as canonical project truth.

## 18. Phase Parity Checkpoints
Every implementation phase must end with:

1. Syntax checks:
   - node --check public/control-center/pages/library.js
   - node --check public/control-center/app.js

2. Functional parity check:
   - Library loads
   - Finder renders
   - Inspector renders
   - Upload still works
   - Preview still works
   - Source-of-truth action still calls backend
   - Approve/review/archive/delete still call backend
   - AI prompt actions still route to AI Command

3. Git checkpoint:
   - git status --short
   - commit only scoped files
   - do not include unrelated data changes

## 19. First Implementation Slice
The first production-code slice must be small:

1. Create Library module folder.
2. Extract pure projection/helper functions only.
3. Do not change UI.
4. Do not change API calls.
5. Do not change listener behavior yet.
6. Verify syntax.
7. Commit.

