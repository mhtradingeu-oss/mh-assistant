# Media Studio Step 2B - Extraction Readiness Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only extraction readiness audit
Primary source file: public/control-center/pages/media-studio-workspace.js

## Step 2C Pointer

- Step 2C formatter extraction plan created: MEDIA_STUDIO_STEP_2C_FORMATTER_EXTRACTION_PLAN.md

## 1. Executive Summary

This Step 2B audit classifies extraction readiness for Media Studio without changing runtime behavior. The current file remains a 3215-line monolith with tightly coupled state, rendering, and handler orchestration. A limited subset is safe to extract in a future pass: pure formatting/string/shape helpers only.

Doctrine alignment:
- Backend owns operational authority.
- Frontend projects operational authority.

Readiness conclusion:
- Safe now: pure deterministic helpers with no session mutation, no DOM dependency, no storage, no API calls, and no authority decisions.
- Safe later with tests: local storage adapters, payload/readiness builders, and selected render sections.
- Defer: orchestration and bind surfaces that can alter generation/approval/handoff/task/save/session behavior if sequence changes.
- Do not extract yet: bindMediaStudio, sendPublishingHandoff, mediaStudioRoute.render, loadMediaWorkspace.

## 2. Extraction Candidates Grouped By Safety

### safe_now_pure_helpers

Functions/lines:
- asArray (90)
- asObject (94)
- asString (98)
- clean (103)
- titleCase (107)
- toKey (113)
- nowIso (117)
- firstText (121)
- formatDateTime (129)
- formatCount (140)
- statusTone (176)
- statusClass (183)
- safeJsonParse (450)
- parseStructuredList (1908)
- normalizeMediaUrl (1915)

Why safe now:
- Pure or near-pure deterministic logic.
- No backend authority decisions.
- No event ordering dependence.
- Minimal coupling to session shape.

### safe_later_with_tests

Functions/lines:
- normalizeStatus (162)
- requestTypeForMode (489)
- normalizeApprovalStatus (908)
- classifyLibraryUsage (915)
- getVersionReadiness (1815)
- checklistValue (1857)
- readDraftMap/writeDraftMap (187, 197)
- readLibraryAssetMap/writeLibraryAssetMap (204, 214)
- loadLocalDrafts/loadLocalLibraryAssets (226, 230)
- upsertLocalLibraryAsset/saveLocalDraft (234, 253)
- buildGenerationRequestPayload (857)
- buildOutputVersionFromGeneration (877)
- buildMediaPayload (812)
- buildLibraryAssetPayload (932)
- buildPublishingHandoff (2315)

Why safe later:
- Coupled to local session or payload contract shapes.
- Some include localStorage side effects.
- Require behavior parity checks before extraction.

### defer_due_to_state_coupling

Functions/lines:
- ensureSession (460)
- defaultForm (269)
- syncFormFromItem (684)
- resetForm (711)
- syncSessionForm (726)
- validateGenerator (736)
- saveDraftToSession (1129)
- persistMediaJob (2368)
- applyInboundHandoff (676)
- loadMediaWorkspace (571)
- versioning lifecycle set:
  - createVersionEntry (294)
  - normalizeVersionEntry (322)
  - createVersioningState (347)
  - ensureVersioning (369)
  - selectedVersionEntry (385)
  - previousVersionEntry (394)
  - appendVersion (402)
  - hydrateVersioningFromItem (413)
  - syncVersionFromForm (431)
  - applySelectedVersionToForm (440)

Why defer:
- Session mutation ordering is behavior-critical.
- Load/fallback and versioning semantics are interdependent.
- Refactor risk is high without deep scenario tests.

### defer_due_to_authority_coupling

Functions/lines:
- ownerRoleForMode (495)
- normalizeMediaItem (499)
- buildMediaPayload (812)
- buildPublishingHandoff (2315)
- createTask/approval/handoff action payload composition inside bindMediaStudio (2389+)

Why defer:
- Uses local authority defaults and role projection assumptions.
- Touches operational metadata passed to backend workflows.
- Should move only with backend-projection strategy and contract tests.

### do_not_extract_yet

Functions/lines:
- bindMediaStudio (2389)
- sendPublishingHandoff (3094)
- mediaStudioRoute.render (3140)
- loadMediaWorkspace (571)
- renderScopedStyles (1233)

Why do-not-extract-yet:
- bindMediaStudio centralizes operational sequencing for generation, approval, task, handoff, and save flows.
- route render + load coordination controls first-load lifecycle and rerender recursion.
- style block and render composition are stable but large; extracting now introduces high merge/churn risk.

## 3. Candidate Module Map

Planned module names for future extraction pass (not created in Step 2B):
- media-formatters.js
- media-normalizers.js
- media-draft-storage.js
- media-payload-builders.js
- media-readiness.js
- media-render-sections.js
- media-bind-handlers.js
- media-role-defaults.js

## 4. Candidate Details (Source, Dependencies, Risk, Tests, Order)

| Candidate Module | Source Functions / Lines | Dependencies | Risk | Required Tests / Smoke Checks | Recommended Order |
|---|---|---|---|---|---:|
| media-formatters.js | asArray, asObject, asString, clean, titleCase, toKey, nowIso, firstText, formatDateTime, formatCount, statusTone, statusClass, safeJsonParse, parseStructuredList, normalizeMediaUrl (90-193, 450, 1908-1915) | None beyond JS built-ins | Low | Unit checks for deterministic outputs; no runtime flow checks needed beyond node --check | 1 |
| media-normalizers.js | normalizeStatus, requestTypeForMode, normalizeApprovalStatus, resolvePreviewMedia, checklistValue (162, 489, 908, 1924, 1857) | Uses helper functions and constant lists | Low-Medium | Status mapping parity tests; preview-type detection checks for image/video/audio/text payloads | 2 |
| media-draft-storage.js | read/write draft map and library asset map; loadLocalDrafts, loadLocalLibraryAssets, upsertLocalLibraryAsset, saveLocalDraft (187-262) | localStorage, projectKey, nowIso, asArray/asObject/asString | Medium | Browser smoke: save draft, reload page, verify key continuity and list caps (30/120) | 3 |
| media-payload-builders.js | buildMediaPayload, buildGenerationRequestPayload, buildOutputVersionFromGeneration, buildLibraryAssetPayload, buildPublishingHandoff, findExistingLibrarySave (812-987, 2315+) | Session shape, role defaults, readiness helpers, preview resolver | Medium-High | Snapshot tests for payload shape; smoke for generation save, library save, publishing handoff payload integrity | 4 |
| media-readiness.js | getVersionReadiness, classifyLibraryUsage, normalizeApprovalStatus, getApiReadiness, getGeneratorFallbackMessage (908-927, 1203-1229, 1815+) | Status helpers, operations payload, session/form fields | Medium | Readiness matrix tests across modes/statuses; API readiness fallback checks with missing operations | 5 |
| media-render-sections.js | renderStatusPill through renderApiReadiness (1559-2269), optionally renderScopedStyles (1233+) | escapeHtml contract, session shape, constants, helper functions | Medium-High | UI smoke: page render baseline screenshots + functional click-through after bind | 6 |
| media-bind-handlers.js | bindMediaStudio, runGenerationAction closure, per-action callbacks, sendPublishingHandoff hook calls (2389-3093) | DOM ids/data attrs, session mutation, API and shared-context calls | Very High | Full interaction smoke: save/generate/approve/reject/task/library/publishing/specialist/AI flows | 7 |
| media-role-defaults.js | MEDIA_ROLE_DEFAULTS, SPECIALISTS, ownerRoleForMode (37-87, 495) | Authority model and payload builders | High (authority coupling) | Contract checks for role fields in task/approval/handoff payloads; backend-projection fallback checks | 8 |

## 5. Explicit Classification Matrix

### Pure text helpers
- asString, clean, titleCase, firstText, parseStructuredList, normalizeMediaUrl
- Classification: safe_now_pure_helpers

### localStorage helpers
- readDraftMap/writeDraftMap, readLibraryAssetMap/writeLibraryAssetMap, loadLocalDrafts/loadLocalLibraryAssets, upsertLocalLibraryAsset, saveLocalDraft
- Classification: safe_later_with_tests

### Payload builders
- buildMediaPayload, buildGenerationRequestPayload, buildOutputVersionFromGeneration, buildLibraryAssetPayload, buildPublishingHandoff
- Classification: safe_later_with_tests (with authority-aware validation)

### Generation orchestration
- runGenerationAction (inside bindMediaStudio), generationApiForMode closure, persistMediaJob linkage
- Classification: defer_due_to_state_coupling

### Approval/handoff/task actions
- requestApproval/approve/reject/createTask/sendPublishing actions in bindMediaStudio and sendPublishingHandoff
- Classification: defer_due_to_authority_coupling

### Render functions
- render* functions and renderScopedStyles
- Classification: safe_later_with_tests (sections), renderScopedStyles defer unless styling isolation strategy exists

### Bind handlers
- bindMediaStudio and all data-attribute/id binding loops
- Classification: do_not_extract_yet

### Role defaults
- MEDIA_ROLE_DEFAULTS, SPECIALISTS, ownerRoleForMode
- Classification: defer_due_to_authority_coupling

## 6. Recommended First Extraction (Future Pass Only)

If and only if a future implementation pass is allowed, extract first:
- pure formatting/string helpers only
- target: media-formatters.js
- explicit non-goals for first extraction:
  - no storage helpers
  - no payload builders
  - no render functions
  - no bind handlers
  - no role-default authority logic

Rationale:
- Lowest coupling.
- Fastest parity verification.
- Minimal blast radius for behavior regressions.

## 7. What Not To Touch

Do not modify in extraction-readiness pass:
- public/control-center/pages/media-studio-workspace.js
- public/control-center/api.js
- public/control-center/app.js
- backend routes/contracts
- data/projects

Do not change behavior for:
- generation
- approvals
- handoffs
- task creation
- save paths
- local drafts
- session lifecycle
- event handler surface

## 8. No-Change Confirmation

This Step 2B artifact is documentation-only.
No runtime code, endpoints, handlers, payload behavior, or authority routing was changed.
