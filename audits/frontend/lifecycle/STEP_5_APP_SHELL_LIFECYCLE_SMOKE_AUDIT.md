# Step 5: App Shell Lifecycle Smoke / Regression Audit

Audit Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: Audit only (no production code changes)

## Executive Summary

Step 4 app-shell lifecycle integration is functionally safe based on code inspection and syntax validation.

Verified safe:
- appShellLifecycle is module-level and created once.
- No appShellLifecycle cleanup is triggered during normal route changes.
- Guard flags prevent duplicate registration in the three target binders.
- The two hashchange listeners are intentional and non-duplicative in responsibility.
- No page-scoped listeners were migrated to lifecycle registry.
- No CSS/backend/data/projects changes were introduced by this step.

Finding:
- Wording mismatch exists in Step 4 documentation and one app.js comment that says listeners are cleaned up on route changes; actual runtime behavior does not call appShellLifecycle.cleanup() during normal operation.

Recommendation:
- Patch audit wording only (Step 4 audit doc). No code behavior patch needed.

## Validation Commands And Results

Commands run:
- git status --short
- node --check public/control-center/runtime/lifecycle/lifecycle-registry.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js
- grep -n "createLifecycleRegistry\|appShellLifecycle\|addAppShellListener" public/control-center/app.js
- grep -n "cleanup" public/control-center/app.js audits/frontend/lifecycle/STEP_4_APP_SHELL_LIFECYCLE_INTEGRATION.md || true

Results summary:
- git status --short: clean for tracked production files before this Step 5 document.
- node --check lifecycle-registry.js: PASS
- node --check app.js: PASS
- node --check router.js: PASS
- grep lifecycle markers in app.js: found import, module-level registry, helper, and 5 migrated registrations.
- grep cleanup references: no appShellLifecycle.cleanup() call in app.js; Step 4 audit contains cleanup references and one contradictory phrase.

## Evidence Review

Primary files inspected:
- public/control-center/app.js
- public/control-center/router.js
- public/control-center/runtime/lifecycle/lifecycle-registry.js
- audits/frontend/lifecycle/STEP_4_APP_SHELL_LIFECYCLE_INTEGRATION.md

### 1) No cleanup on normal route changes

Confirmed in app.js:
- appShellLifecycle is created and used for addEventListener registrations.
- No appShellLifecycle.cleanup() invocation exists.

Normal route flow remains:
- window "mh:route-change" listener updates route state and renders current page.
- activeRouteCleanup applies to page render cleanup callbacks, not appShellLifecycle cleanup.

Conclusion:
- No lifecycle-registry cleanup is triggered on route changes in current implementation.

### 2) Module-level lifecycle registry

Confirmed in app.js near top-level imports/config section:
- const appShellLifecycle = createLifecycleRegistry("app-shell");

Conclusion:
- Registry is module-scoped and not recreated per render or per route.

### 3) bindRouteListener guard prevents duplicate registration

Confirmed:
- if (window.__mhRouteListenerBound) return;
- window.__mhRouteListenerBound = true;

Conclusion:
- Route listener registration is idempotent across repeated init calls.

### 4) bindResponsiveUi guard prevents duplicate registration

Confirmed:
- if (window.__mhResponsiveUiBound) return;
- window.__mhResponsiveUiBound = true;

Conclusion:
- Responsive shell listener registration is idempotent.

### 5) initializeAiDock guard prevents duplicate registration

Confirmed:
- if (window.__mhAiDockBound) return;
- window.__mhAiDockBound = true;

Conclusion:
- AI dock listener registration is idempotent.

## Listener Table (Step 4 Migrated Set)

| Event | Registration Site | Responsibility | Scope | Regression Note |
|---|---|---|---|---|
| mh:route-change | app.js bindRouteListener | route state + render + shell scroll reset | app shell | safe; guarded |
| hashchange (route/nav) | app.js bindRouteListener | browser back/forward route sync | app shell | safe; guarded |
| resize | app.js bindResponsiveUi | responsive shell sync and sidebar close | app shell | safe; guarded |
| orientationchange | app.js bindResponsiveUi | mobile shell sync | app shell | safe; guarded |
| hashchange (AI dock context) | app.js initializeAiDock | update dock workspace context text | app shell | safe; guarded |

## Duplicate hashchange Listener Explanation

Two hashchange listeners are present intentionally:
- Route/navigation hashchange: synchronizes route navigation behavior when URL hash changes.
- AI dock hashchange: updates dock context label text to reflect current workspace.

These do not duplicate the same work:
- One handles navigation flow and route synchronization.
- One handles secondary shell UI text synchronization.

Risk is low because:
- Responsibilities are separated.
- Both binders have one-time guards.
- No recursive route mutation loop observed in inspected code path.

## Page-Specific Migration Check

Confirmed not migrated to addAppShellListener:
- modal-local listeners
- button-local listeners
- form submit listeners
- command input listeners
- AI suggestion button listeners
- page module listeners

Conclusion:
- Step 4 stayed within app-shell global listener scope.

## CSS / Backend / Data Change Check

No evidence of Step 4 impact to:
- CSS files
- backend runtime/orchestrator-service
- data/projects

Step 4 change footprint observed in app.js plus audit docs only.

## Wording Mismatch Review (Step 4)

Mismatch identified:
- Step 4 audit snippet includes wording equivalent to "Cleaned up on route changes".
- app.js also includes comments suggesting cleanup on route changes.
- Actual runtime behavior does not call appShellLifecycle.cleanup() during normal route changes.

Impact:
- Documentation clarity issue only.
- No functional regression detected.

## Regression Risk Assessment

Overall risk: Low

Assessed dimensions:
- Duplicate listener registration: Low (guards present)
- Route behavior drift: Low (route listener logic unchanged)
- Responsive shell regression: Low (same handlers, new registration wrapper)
- AI dock context regression: Low (separate hashchange handler remains scoped)
- Cleanup semantics confusion: Medium documentation risk, low runtime risk

## Recommendation

Recommended action: Patch audit wording only.

Why:
- Code behavior is safe and consistent with current implementation goals.
- No evidence requiring behavior/code patch.
- Primary issue is contradictory wording around cleanup timing.

Suggested wording correction target:
- Replace claims implying automatic cleanup on route changes with:
  - "Listeners are registered via lifecycle registry and persist during normal app runtime; cleanup is available but not invoked on normal route changes in Step 4."

## Explicit Statement

This was an audit-only step.
- No production code changed in this Step 5 task.
- No app.js/router.js/pages/CSS/backend/data/projects modifications were made.
- No lifecycle behavior was altered.
