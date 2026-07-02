# Library Operating Surface Audit
Date: 2026-05-10
Scope: public/control-center/pages/library.js and directly related library modules/styles
Mode: Audit only (no production code changes)

## 1. Current Capabilities
[CONFIRMED]
- Full Library route exists with dedicated render template and workspace shell.
  - Evidence: public/control-center/pages/library.js:2449-2658
- Asset lifecycle actions implemented from UI:
  - Upload asset(s)
  - Set source of truth
  - Update status (approve/review)
  - Rename
  - Archive
  - Soft delete
  - Open/download preview
  - Refresh library scan
  - Evidence: public/control-center/pages/library.js:1938-2443
- Required assets and readiness coverage are surfaced with actionable cards.
  - Evidence: public/control-center/pages/library.js:825-871, public/control-center/pages/library.js:1438-1461
- Finder UI supports foldering, filtering, search, sort, paging, grid/list state, inspector.
  - Evidence: public/control-center/pages/library.js:892-979, public/control-center/pages/library.js:1467-1613
- Managed media handoff assets are merged into library view (local + backend handoff pathways).
  - Evidence: public/control-center/pages/library.js:687-792
- Protected media fetching and blob URL caching implemented for secure preview/open.
  - Evidence: public/control-center/pages/library.js:237-411

## 2. API Dependencies
[CONFIRMED]
Imported API functions in Library:
- archiveProjectAsset
- deleteProjectAsset
- fetchProtectedMediaBlob
- refreshProjectLibrary
- renameProjectAsset
- setProjectAssetSourceOfTruth
- updateProjectAssetStatus
- uploadProjectAsset
- AccessKeyError handling path

Evidence:
- public/control-center/pages/library.js:1-11
- UI usage points: public/control-center/pages/library.js:1938-2443

Contract implications:
- [CONFIRMED] Library currently uses existing API contracts directly and does not define new contracts.
- [CONFIRMED] Route implementation is frontend projection over backend asset operations.

## 3. Global Listeners
[CONFIRMED]
Global listeners currently present in Library module:
- window.addEventListener("beforeunload", ...)
  - public/control-center/pages/library.js:413
- document.addEventListener("click", ...) x3 inside initializeLibraryGlobalListeners()
  - public/control-center/pages/library.js:422, 439, 461

Lifecycle ownership assessment:
- [CONFIRMED] Global listener registration is single-run guarded by libraryGlobalListenersInitialized flag.
  - public/control-center/pages/library.js:27, 420-470
- [RISK][CONFIRMED] No teardown/removeEventListener path tied to route lifecycle; listeners persist for app lifetime.
- [RISK][CONFIRMED] This violates ideal per-route lifecycle ownership for first Operating Surface standard.

## 4. Local State / Drafts
[CONFIRMED]
State holders:
- librarySessionStore Map (per project UI session)
  - public/control-center/pages/library.js:20, 473-495
- localStorage managed media map (mh-media-library-assets-v1)
  - public/control-center/pages/library.js:22, 149-162
- protected URL memory caches (Map + promise cache)
  - public/control-center/pages/library.js:23-31, 316-397
- thumb load queue concurrency state
  - public/control-center/pages/library.js:29-31, 326-355

Assessment:
- [CONFIRMED] Session/UI state is extensive and concentrated in one file.
- [RISK][CONFIRMED] Local managed-media persistence can act as compatibility fallback, but can diverge from backend durable state if not explicitly framed as fallback-only.

## 5. Overlay Behavior
[CONFIRMED]
Overlay/popup mechanisms in Library:
- window.prompt fallback usage for copy path / rename prompt.
  - public/control-center/pages/library.js:435, 1204
- Custom modal overlay created dynamically for promptForTextInput fallback.
  - public/control-center/pages/library.js:1211-1301
- window.alert and confirm usages for user feedback/guarded mutations.
  - public/control-center/pages/library.js:433, 457, 2008, 2046, 2121

Assessment:
- [RISK][CONFIRMED] Multiple modal paradigms (browser prompt/alert/confirm + custom overlay) create inconsistent operating-surface UX and potential interaction conflicts.
- [RISK][CONFIRMED] Overlay primitives are local page utilities, not unified shell-level action/AI panel behavior.

## 6. Source-of-Truth Behavior
[CONFIRMED]
- Source-of-truth indicator and toggle exist at asset level.
  - public/control-center/pages/library.js:657, 1670, 1692, 1957-1988
- Action calls backend setProjectAssetSourceOfTruth.
  - public/control-center/pages/library.js:1975

Assessment:
- [CONFIRMED] Source-of-truth mutation uses backend API, which is aligned with backend authority doctrine.
- [RISK][CONFIRMED] UI decides immediate optimistic context assumptions through local rerender patterns; requires clean boundary to remain projection-only.

## 7. Upload / Preview / Actions Flow
[CONFIRMED]
Upload:
- Drag/drop + file input + type selection + batch upload + per-file success/failure summary.
- Calls uploadProjectAsset per file and optionally reloads project data.
- Evidence: public/control-center/pages/library.js:2208-2392

Preview:
- Dynamic preview rendering for image/video/audio/text/json.
- Protected previews hydrated via fetchProtectedMediaBlob + object URLs.
- Evidence: public/control-center/pages/library.js:980-1165, 1636-1655

Actions:
- Toolbar delegates to selected asset actions.
- Per-asset actions from inspector.
- Evidence: public/control-center/pages/library.js:1904-1933, 1938-2140

Assessment:
- [CONFIRMED] Functional breadth is high and production-valuable.
- [RISK][CONFIRMED] The same bindLibraryWorkspace function mixes data shaping, DOM generation, action wiring, preview hydration, and mutation orchestration, raising regression risk.

## 8. Authority-like Logic (Frontend)
Classification:
- Projection-safe:
  - Backend API mutations for asset lifecycle actions.
  - Backend-driven category/readiness interpretation support from asset-library and state payloads.
- Compatibility fallback:
  - localStorage managed media handoff map and merge logic.
- Risky authority-like (needs boundary hardening):
  - Local classification/mapping decisions that can influence operational interpretation (status normalization, source options, managed asset inference) if backend semantics evolve.

Evidence:
- Status/type normalization and inference:
  - public/control-center/pages/library.js:540-686, 687-792
- Local selection of effective status filters and source filters:
  - public/control-center/pages/library.js:892-979

Assessment:
- [CONFIRMED] Library does not own backend governance/publish guards and does not bypass API contracts.
- [RISK][CONFIRMED] It does own significant frontend interpretation logic that should be reduced and isolated into explicit projection adapters.

## 9. Related Module/Style Coupling
[CONFIRMED]
Code dependencies:
- public/control-center/asset-library.js (category catalog, canonical type mapping, readiness helpers)
- public/control-center/pages/library.js

Style dependencies:
- public/control-center/styles/12-pages.css (library blocks)
- public/control-center/styles/14-page-standard.css (extensive library section overrides and duplicated blocks)
- public/control-center/styles/08-components-foundation.css (shared library selectors)

Risk notes:
- [RISK][CONFIRMED] Library styles are spread and partially duplicated in 14-page-standard.css, increasing maintenance complexity and unintended cascade impacts.

## 10. Risks Before Implementation
P0
1. [CONFIRMED] Monolithic library.js (2658 lines) combines compute/render/bind/mutate concerns.
2. [CONFIRMED] Global document/window listeners have no teardown lifecycle.
3. [CONFIRMED] Multiple modal/overlay mechanisms are inconsistent with Operating Surface goals.

P1
1. [CONFIRMED] Local fallback state (managed media in localStorage) can drift from backend if not explicitly scoped.
2. [CONFIRMED] Extensive imperative innerHTML + rebind patterns can cause event wiring churn.
3. [CONFIRMED] Style duplication across page style files increases regression risk.

P2
1. [CONFIRMED] Some helper functions are dead/no-op placeholders (e.g., bindLibraryControlEventShield/protectLibraryInteractiveControls), indicating unfinished boundary cleanup.

## 11. Operating Surface Readiness (Library)
Current readiness against required pattern:
- Header: [PARTIAL CONFIRMED] Provided by global shell/page-standard but Library body still custom-heavy.
- Main View: [CONFIRMED] Finder workspace and grid/inspector exist.
- Action Panel: [PARTIAL CONFIRMED] Action controls exist but not isolated as dedicated operating panel module.
- AI Panel: [MISSING CONFIRMED] AI actions are button triggers; no persistent contextual AI panel.

Conclusion:
- [CONFIRMED] Library is functionally rich but architecturally not yet aligned with first-class Operating Surface standards.
- [CONFIRMED] Safe next move is decomposition and surface-contract planning before production refactor.
