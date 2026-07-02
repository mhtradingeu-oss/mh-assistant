# PHASE 3AP.0 — Global UI/UX Polish Audit + Page Order Plan

## Status
Plan-only / audit-only.

No production UI changes in this phase.

## Purpose
Start the full UI/UX global polish pass for MH-OS / MH Assistant after closing Customer Center readiness.

This phase defines the page-by-page execution order and safety rules.

## Baseline
Closed before this phase:
- Customer Center protected-read UX
- Customer Center Browser QA
- Customer Center sub-routes readiness
- Read-only live key guard QA
- Customer mutation safety audit
- Future customer actions plan
- Messages readiness
- CRM readiness
- Calls & IVR readiness

## Product direction
MH-OS is an AI Business Operating System.

Frontend must feel:
- clean
- premium
- calm
- operational
- smart
- not crowded
- not fake
- not execution-unsafe

Every page should show:
- where the user is
- current project/system state
- what is ready
- what is locked
- what the next safe action is
- how AI can help safely
- where execution actually happens

## Global safety rules
- No random patches.
- No full-repo redesign.
- No broad CSS stacking.
- No duplicate page shells.
- No backend changes.
- No route changes unless explicitly approved in a page phase.
- No mutation behavior changes.
- No hidden execution.
- Keep confirmations and safety copy.
- Preserve IDs, data attributes, handlers, API calls unless the page phase explicitly approves otherwise.
- Validate with node --check.
- Browser QA required before commit for visual page changes.

## CSS rules
- Prefer existing global primitives.
- Prefer page-scoped CSS when absolutely needed.
- Do not add new CSS blocks over old duplicates without auditing existing selectors.
- Avoid changing global typography/spacing unless the phase is explicitly global CSS.
- Never fix one page by breaking another page.

## Page polish protocol
Each page must follow:

1. Page Truth Audit
2. Decide allowed scope
3. Implement small safe polish
4. Browser QA
5. Commit
6. Push
7. Closeout

## Recommended page order

### Group A — Already critical / recently active
1. Customer Center
2. Operations Overview / Task Center / Queue Center / Job Monitor / Notifications
3. AI Command
4. Publishing
5. Workflows
6. Governance
7. Settings

### Group B — Core operating surfaces
8. Home
9. Setup
10. Library
11. Integrations
12. Campaign Studio
13. Content Studio
14. Media Studio

### Group C — Intelligence / growth surfaces
15. Insights
16. Research
17. Ads Manager

## Current next recommended phase
PHASE 3AP.1 — Customer Center Final Visual QA + Polish Decision

Reason:
Customer Center was just completed. Before moving away, we should do one final page-level QA decision:
- accept current page as launch-ready
- or apply one small visual polish if needed

No new customer features should be added.

## 3AP.0 Result
This phase creates the global UI/UX polish plan and page order.

No production code changed.

## Next phase
PHASE 3AP.1 — Customer Center Final Visual QA + Polish Decision
