# Frontend Final Recommendations

## What is clean now
- Single active frontend root under public/control-center.
- Route/page ownership is explicit and complete for 19 active routes.
- disableStandardLayout is consistently enabled across active routes, reducing double-shell conflict.
- API access is centralized in api.js with request diagnostics and timeout protections.
- Navigation targets are valid against active route IDs.

## What is stable
- App shell startup path: index.html -> app.js -> router.js -> pages
- Operations centers now project through dedicated ops-shell surfaces.
- Governance/settings route shells are explicit.
- Backend route coverage for frontend endpoints is present in server.js markers.

## What is not clean / structurally risky
- Legacy CSS/JS set remains inside active public tree and duplicates many selectors.
- Authority fallback maps are duplicated in app.js and router.js.
- Authority-adjacent shaping (roles/policy fields/handoffs) is spread across multiple page files.
- Listener/timer density is high in app.js and several large pages.
- Several modules appear unreferenced or ambiguous in ownership.

## What is duplicated
- CSS authority overlap between modern layered styles and legacy monolith styles.
- state helper naming overlap (global state.js vs integrations/state.js).
- page-standard compatibility implementation exists in both active ui and legacy JS versions.

## What is connected well
- Core operations pages, workflows, governance, settings, publishing, insights/research, media/content/campaign flows have backend-linked paths.
- Handoff flows can persist to backend while supporting local fallback behavior.

## What is not connected enough
- ads-manager appears more local/planner-oriented than backend-projection-oriented.
- ai-team-model.js is exported but not in active import graph.
- runtime-boundaries.js exists but appears disconnected from active enforcement path.

## Canonical structure recommendation
Canonical keep set:
- public/control-center/index.html
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/pages/** (active route owners + active submodules)
- public/control-center/styles/00..14 layered stack
- public/control-center/runtime/authority, runtime/overlay
- public/control-center/api.js, state.js, shared-context.js, constants.js

Compatibility-only keep set (quarantined):
- public/control-center/legacy/**
- runtime/command-runtime.js (until runtime layer decision)

Audit-later set:
- pages-core/, layouts/
- styles/integrations/*.css empty placeholders
- ai-team-model.js
- pages/integrations/layout.js
- pages/integrations/state.js
- pages/library/catalog-readiness.js
- runtime/runtime-boundaries.js

## Route ownership doctrine direction
- Keep one route owner per route ID, with explicit shared-owner exception only where approved (operations-centers.js currently).
- Move duplicated route fallback authority map to one canonical resolver path.
- Keep data-page strictly equal to route ID.

## Lifecycle management direction
- Introduce a centralized lifecycle registry for:
  - document/window listeners
  - setTimeout/setInterval handles
  - route-level cleanup hooks
- Keep page-level listener registration idempotent and route-scoped.

## API boundary direction
- Maintain api.js as the only backend call authority layer.
- Keep pages on context-injected API functions where possible.
- Document /media-manager vs /api endpoint ownership split and migration policy.

## AI Panel / Action Panel standard direction
Target page contract should converge to:
- Header
- Main View
- Action Panel
- AI Panel

Current closest implementation:
- Library already has explicit action-panel and ai-panel module boundaries.

## Suggested implementation order (post-audit)
1. Authority boundary hardening: unify route role fallback map and document policy/role payload limits.
2. Lifecycle hardening: listener/timer registry and cleanup policy.
3. CSS authority hardening: freeze canonical layer ownership; keep legacy excluded.
4. Operations-centers modularization plan (without behavior change first).
5. AI Panel/Action Panel structural standard rollout page-by-page.

## What should not be touched yet
- No page redesign before authority/lifecycle/API boundary decisions are approved.
- Do not relink legacy CSS/JS into index.html.
- Do not remove compatibility files until explicit retirement plan and rollback strategy exist.
