# Publishing Runtime Ownership Audit

## Scope
- Branch: architecture/frontend-consolidation-v1
- Baseline: a6cf556, 02dde34, 96ec03f
- Mode: audit only (no production code changes)
- Primary page audited: public/control-center/pages/publishing.js

## Doctrine alignment check
- Backend authority doctrine is explicitly documented in public/control-center/runtime/authority/authority-projection.js:7-8.
- Frontend route fallback is centralized in public/control-center/runtime/authority/route-role-fallback.js.
- Publishing page is a runtime executor surface with approval/publish/fail/schedule controls and Auto Mode controls.

## 1) What Publishing owns today

### Display-only state
- Queue rendering, status pills, overview cards, recommendation chips, and filter chips are presentation-only: public/control-center/pages/publishing.js:893-1278, 1768-1806.
- Recommendation text and counts are derived projections over existing state: public/control-center/pages/publishing.js:852-892.

### Local session state
- Per-project in-memory UI session map: publishingSessions, selected item, filter, validation, form source id: public/control-center/pages/publishing.js:17, 274-290.
- Auto Mode UI-only progress/result banners: publishingAutomationState: public/control-center/pages/publishing.js:34-37.

### Draft/convenience state
- Local draft persistence in browser localStorage under mh-publishing-local-drafts-v1: public/control-center/pages/publishing.js:18, 208-247.
- Local fallback update path for schedule/approve/fail/publish status when item is localOnly: public/control-center/pages/publishing.js:1450-1458, 1509-1515, 1552-1557, 1576-1580.

### Backend-projected authority
- Route and active-role projection in app authority resolver: public/control-center/app.js:227-254.
- Governance/approvals/handoffs projection doctrine helpers: public/control-center/runtime/authority/authority-projection.js:41-84.
- Publishing queue itself is hydrated from backend-fed activity datasets in state: public/control-center/pages/publishing.js:340-385.

### Write actions (runtime mutations)
- savePublishingSchedule -> POST /publishing/schedule: public/control-center/api.js:1788-1798.
- reschedulePublishingItem -> POST /publishing/:jobId/reschedule: public/control-center/api.js:1801-1815.
- approvePublishingItem -> POST /publishing/:jobId/ready: public/control-center/api.js:1818-1832.
- publishPublishingItem -> POST /publishing/:jobId/publish: public/control-center/api.js:1835-1849.
- failPublishingItem -> POST /publishing/:jobId/fail: public/control-center/api.js:1852-1866.
- createProjectHandoff/consumeProjectHandoff durable endpoints exist: public/control-center/api.js:2162-2188.

### Approval-gated actions
- Frontend builder validation requires approvalStatus=approved for publish intent: public/control-center/pages/publishing.js:555-557.
- Backend hard-gates ready/publish via governance policy and approval record checks: runtime/orchestrator-service/server.js:13614-13704.

### Auto Mode actions
- Auto controls are bound to explicit buttons only (prepare/stop/approve gate/skip): public/control-center/pages/publishing.js:1655-1709.
- Plan contains safe prepare step plus intentional gated publish step type publish_now: public/control-center/pages/publishing.js:520-542.
- Engine safe-type whitelist excludes publish_now and blocks risky patterns: public/control-center/automation-engine.js:6-22, 203-214.

### Handoff actions
- Publishing consumes handoff data from shared context + operations fallback: public/control-center/pages/publishing.js:834-839.
- Load Handoff writes local draft/session fields only: public/control-center/pages/publishing.js:1591-1610.
- Push to AI writes shared ai-command handoff context (frontend cache): public/control-center/pages/publishing.js:1616-1649.

### Dangerous/destructive actions
- Publish now and fail are high-impact state transitions (durable backend mutations): public/control-center/pages/publishing.js:1520-1524, 1582-1586; runtime/orchestrator-service/server.js:11988-12049, 12052-12113.
- Local-only path can mark local draft as published/failed without backend record (UX-level only, but authority-adjacent for operator interpretation): public/control-center/pages/publishing.js:1509-1515, 1576-1580.

## 2) Where runtime actions are defined

- publish: UI data-publishing-action="publish" and publish button handling at public/control-center/pages/publishing.js:1008, 1484-1524.
- approve: manual approve button at public/control-center/pages/publishing.js:1542-1563.
- fail: manual fail button at public/control-center/pages/publishing.js:1567-1587.
- schedule: builder schedule button and queue schedule action at public/control-center/pages/publishing.js:1440-1477, 1498-1503.
- reschedule: reschedulePublishingItem calls in publish/pause/retry flows at public/control-center/pages/publishing.js:1463, 1528, 1534.
- execute: publishPublishingItem path + backend execution result record at runtime/orchestrator-service/server.js:11988-12049.
- auto prepare: public/control-center/pages/publishing.js:1655-1686.
- auto stop: public/control-center/pages/publishing.js:1689-1694.
- auto approve: public/control-center/pages/publishing.js:1697-1702.
- auto skip: public/control-center/pages/publishing.js:1705-1710.
- handoff load: public/control-center/pages/publishing.js:1591-1610.
- AI push: public/control-center/pages/publishing.js:1616-1652.
- buttons with onclick: concentrated in bindPublishingWorkspace: public/control-center/pages/publishing.js:1383-1710.
- context/API calls: runAndRefresh wrappers + direct shared-context writes: public/control-center/pages/publishing.js:1308-1317, 1364-1374, 1463-1472, 1522-1535, 1560-1561, 1584-1585, 1628-1629.

## 3) Auto Mode lifecycle

- createAutoModeController imported in publishing and used in ensurePublishingAutoModeBinding: public/control-center/pages/publishing.js:9, 62-72.
- subscribeAutoMode used in ensurePublishingAutoModeBinding once per process unless already subscribed: public/control-center/pages/publishing.js:74-88.
- startAutoMode called from explicit Auto Prepare button click only: public/control-center/pages/publishing.js:1657-1679.
- Auto Mode does not start from render/mount. Render path only ensures controller/subscription when publishingAutomationEnabled=true: public/control-center/pages/publishing.js:62-67, 1668-1669.
- Controller binding happens in render cycle via ensurePublishingAutoModeBinding call inside bindPublishingWorkspace: public/control-center/pages/publishing.js:1341.
- Guard flags exist:
  - publishingAutomationEnabled gate: line 65.
  - publishingAutoModeControllerReady one-time controller creation: lines 69-72.
  - publishingAutoModeUnsubscribe existence gate: lines 74-76.
- Unsubscribe cleanup is not executed on route unmount in this file; unsubscribe function is stored but never called in publishing.js.
- State leak risk:
  - module-level flags and callback references persist across route revisits: public/control-center/pages/publishing.js:38-42.
  - schedulePublishingRender keeps callback/timeouts across route renders: lines 44-60.
  - risk is moderate: duplicate subscriptions are guarded, but stale callback/subscription lifecycle is not explicitly torn down.

## 4) Backend authority alignment

### Actions that call backend through API/context
- schedule draft or new schedule: savePublishingSchedule: public/control-center/pages/publishing.js:1366, 1464.
- reschedule/pause/retry: reschedulePublishingItem: public/control-center/pages/publishing.js:1463, 1528, 1534.
- approve ready: approvePublishingItem: public/control-center/pages/publishing.js:1560.
- publish: publishPublishingItem: public/control-center/pages/publishing.js:1522.
- fail: failPublishingItem: public/control-center/pages/publishing.js:1584.

### Frontend-only actions
- Local draft save/update/approve/fail/publish markers for localOnly items: public/control-center/pages/publishing.js:1450-1458, 1509-1515, 1552-1557, 1576-1580.
- Filter/select/review/scroll behaviors: public/control-center/pages/publishing.js:1383-1400, 1492-1503.
- Push to AI shared cache/handoff: public/control-center/pages/publishing.js:1628-1649; shared cache implementation in public/control-center/shared-context.js:52-77.

### Durable operation records
- Backend publishing mutations write/update scheduled jobs and execution outcomes: runtime/orchestrator-service/server.js:11818-12113.
- syncPublishingJob persists queue/event/notification durable operations: runtime/orchestrator-service/lib/ops/backbone.js:3142 onward.
- Durable handoffs: create/consume handoff in backbone: runtime/orchestrator-service/lib/ops/backbone.js:2931-3128.

### Should require backend/governance authority
- ready/publish and freeze-sensitive schedule/reschedule are governed by assertPublishingMutationAllowed: runtime/orchestrator-service/server.js:13614-13704.

### Reliant on local session only
- Form draft edits, selected item, validation map, draft message, filter state: public/control-center/pages/publishing.js:274-290.

### Should remain local UX
- Filter chips, queue row highlighting, scroll navigation, inline validation text, recommendation display.

## 5) Approval/governance boundary

- Approval state read in frontend:
  - Local form approvalStatus and validateBuilder check: public/control-center/pages/publishing.js:555-557.
  - Queue item approval projection normalization: public/control-center/pages/publishing.js:327-333.
- Publish/fail/approve state changed in frontend via backend mutation APIs or local-only branch:
  - approve: 1542-1563
  - publish: 1520-1524
  - fail: 1567-1587
- Frontend does not finalize governance authority; it requests mutation and backend enforces policy:
  - assertPublishingMutationAllowed governance gate: runtime/orchestrator-service/server.js:13614-13704.
- Backend stores approvals/handoffs durably:
  - createApproval/decideApproval: runtime/orchestrator-service/lib/ops/backbone.js:2555-2918.
  - createHandoff/consumeHandoff: runtime/orchestrator-service/lib/ops/backbone.js:2931-3128.
- Potential bypass check:
  - Frontend localOnly branch can mark local drafts approved/published/failed without backend mutation (not durable, UX-visible only). This does not bypass backend authority for durable operations but can create misleading local status.

## 6) Handoff boundary

- Handoffs loaded:
  - getPublishingHandoff uses getSharedHandoff with operations fallback: public/control-center/pages/publishing.js:834-839.
- Handoffs consumed in publishing:
  - load handoff button transfers summary into local draft/session: public/control-center/pages/publishing.js:1591-1610.
- Publishing receives data from shared-context:
  - imports and calls getSharedHandoff/setSharedHandoff/setSharedAiDraft: public/control-center/pages/publishing.js:1, 836-838, 1628-1629.
- Shared-context durability level:
  - shared context caches are in-memory maps only: public/control-center/shared-context.js:2-3, 52-77.
  - durable handoffs require backend create/consume endpoints (not invoked in publishing page handlers directly).
- What can become orphaned:
  - cached shared handoff/AI draft may be superseded by operations data or lost on reload.
  - local draft loaded from handoff may diverge from backend if never persisted.

## 7) Loading/session lifecycle

- No dedicated session.loading/isLoading flag in publishing session model (session tracks form/filter/validation only): public/control-center/pages/publishing.js:274-290.
- Render does not trigger fetch itself; mutations call runAndRefresh which invokes reloadProjectData after action success: public/control-center/pages/publishing.js:1308-1313.
- Fetch lifecycle settlement:
  - success -> showMessage
  - failure -> showError with message
  - both settle and return (no uncaught throw from runAndRefresh): public/control-center/pages/publishing.js:1308-1317.
- Error visibility exists through showError wiring in runAndRefresh and button handlers.
- Repeated render rebind risk:
  - root.innerHTML rewrite then bindPublishingWorkspace reassigns handlers every render, but old nodes are replaced, reducing duplicate-listener accumulation on DOM nodes.
  - module-level Auto Mode subscription is not cleaned up explicitly, so lifecycle risk remains for long-lived callbacks.

## 8) Authority risk classification summary

- Safe projection:
  - queue/status rendering from backend activity, recommendation summaries, route-role projection read paths.
- Safe local UX:
  - filters, local form typing, scroll/open queue, review selection.
- Authority-adjacent:
  - local draft status changes (localOnly approve/publish/fail), push-to-AI handoff payload shaping.
- Duplicate authority risk:
  - localOnly path can show terminal statuses without durable backend record.
- High-risk execution:
  - publish/fail endpoints and ready transition.
- Needs backend confirmation:
  - schedule/reschedule/ready/publish/fail.
- Needs explicit user action:
  - startAutoMode, publish/fail/approve buttons, load handoff button.
- Should not be changed yet:
  - core publish/approve/fail semantics and governance guard coupling, until shadow-compare lifecycle audit is complete.

## 9) Recommended next step

Recommended: F. Create shadow-compare plan before extraction.

Why this is safest now:
- Publishing has mixed local-only and durable paths.
- Auto Mode has module-level lifecycle state and render-time bindings.
- Governance enforcement is backend-only and must remain untouched while extracting.
- A shadow-compare phase allows evidence-based parity checks on action outcomes before any structural refactor.

## 10) Implementation-later anchor (high-level)

- First safe change (future): add a publishing action lifecycle registry document + non-invasive instrumentation contract (no behavior change).
- Candidate files later: public/control-center/pages/publishing.js, public/control-center/automation-engine.js, and an audit registry markdown under audits/frontend/authority-boundary.
- Validate with static checks and targeted route behavior verification before any extraction.

## Risk summary
- Primary risk: authority-adjacent local status transitions can appear equivalent to backend durable transitions.
- Secondary risk: Auto Mode binding lifecycle lacks explicit unsubscribe cleanup in page teardown.
- Governance boundary is currently strong at backend mutation guard level, which should remain primary and unchanged.