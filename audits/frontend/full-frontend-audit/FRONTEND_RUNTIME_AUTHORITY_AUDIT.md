# Frontend Runtime Authority Audit

## Core doctrine check
Documented projection doctrine exists in runtime/authority/authority-projection.js:
- Backend owns authority.
- Frontend projects authority.
- Helper explicitly states it must not enforce or generate authority.

## Auto Mode and heavy intelligence markers
Auto Mode implementation surface:
- automation-engine.js exports createAutoModeController, startAutoMode, runAutomationPlan, subscribeAutoMode.
- workflows.js imports and uses createAutoModeController/startAutoMode/runAutomationPlan/subscribeAutoMode.
- publishing.js imports and uses createAutoModeController/startAutoMode/subscribeAutoMode.

Heavy intelligence surface:
- system-intelligence.js exports buildSystemIntelligence and recommendation/blocker/handoff derivations.
- workflows.js, publishing.js, and ui/page-standard.js consume intelligence outputs.

## Initialization posture (implicit vs explicit)
- Auto Mode starts through explicit user actions in workflows/publishing handlers (button/confirmation flows), not from app bootstrap.
- No evidence of startAutoMode invocation during app init sequence.
- runAutomationPlan is called from explicit workflow actions.

## Frontend authority duplication signals
### Duplicated route access fallback maps
- router.js defines ACTIVE_ROUTE_ROLES and DEFAULT_ROUTE_ROLE_ACCESS.
- app.js defines the same fallback structures again.
Risk: dual fallback authority map can drift.

### Authority-like rule creation in page flows
Authority-like fields appear in payload assembly (examples):
- owner_role/assignee_role in workflows/media/campaign flows
- policy_rules construction in settings/governance flows
- execution_mode mapping in settings/app context
- handoff creation across multiple pages

These are mostly projection/payload shaping, but still authority-adjacent in frontend.

## Classification by doctrine
- safe transient UX state:
  - local render/session flags, selected filters, drawer open state, temporary form drafts
- compatibility fallback:
  - default route role maps in router/app
  - legacy shell and legacy css/js files
- duplicate authority risk:
  - duplicated role-route fallback maps in both router.js and app.js
  - local owner/assignee role stamping in page payload builders
- should move to backend later:
  - policy_rules shaping and normalization now performed in settings/governance page logic
  - approval/role gate semantics encoded in frontend prompt and form templates
- must remain frontend-only:
  - shell rendering decisions, local navigation, UI-level command overlays, temporary handoff UX buffering

## Lifecycle and listener risks
Global listeners/timers are concentrated in app.js and selected pages.
Key observations:
- app.js registers many document/window listeners; init is bound once on DOMContentLoaded.
- workflows bridge listener uses one-time guard (workflowBridgeRegistered) and auto-mode unsubscribe replacement logic.
- integrations page removes prior Escape listener before re-registering.
- multiple timers/watchdogs exist in app.js and api.js (timeouts/intervals) and should be governed by lifecycle registry over time.

Risk callout:
- High listener density in app.js increases cross-page side-effect risk if future re-init paths are introduced.

## Must-fix-before-redesign list (audit decision, not implementation)
1. Consolidate route fallback authority map into single canonical location.
2. Define lifecycle ownership registry for global listeners/timers.
3. Document Auto Mode gate contract (explicit trigger, approval-required behavior, safe-step constraints).
4. Formalize authority boundary for role/policy payload shaping in settings/governance/workflows.
