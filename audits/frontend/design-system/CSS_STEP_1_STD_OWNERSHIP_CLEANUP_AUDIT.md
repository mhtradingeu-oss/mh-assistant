# CSS Step 1 std-* Ownership Cleanup Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only audit (no runtime JS, CSS, backend, or data changes)
Phase: CSS Step 1 — std-* Ownership Cleanup Audit

## 1. Executive Summary

This audit documents current ownership state for std-* selectors and cleanup readiness before any CSS edits.

Confirmed baseline:

- Shared std-* primitive target owner remains styles/14-page-standard.css (per CSS ownership contract).
- Duplicate std-page-shell ownership exists in styles/08-components-foundation.css and styles/12-pages.css while styles/14-page-standard.css currently wins by load order.
- Several planned standard primitives are missing as formal selectors and must be introduced only in a future edit pass.

This step performs no code changes. It is an evidence and cleanup-readiness audit only.

## 2. Current Load Order Relevant To 08 / 12 / 14

From public/control-center/index.html:

- styles/08-components-foundation.css loads first among the three.
- styles/12-pages.css loads after 08.
- styles/14-page-standard.css loads after 12 and therefore wins equal-specificity conflicts.

Relevant lines:

- public/control-center/index.html:16
- public/control-center/index.html:18
- public/control-center/index.html:20

## 3. Selector Inventory Table

| Selector | File | Line | Current role | Duplicate or canonical | Cleanup recommendation |
|---|---|---:|---|---|---|
| .std-page-shell | public/control-center/styles/08-components-foundation.css | 297 | Legacy/shared grid shell definition | Duplicate | Retire later in Step 2A after visual regression validation |
| .std-page-shell | public/control-center/styles/12-pages.css | 10 | Page family shell grouping | Duplicate | Retire later in Step 2B after page-family regression validation |
| .std-page-shell | public/control-center/styles/14-page-standard.css | 6 | Active runtime standard shell definition | Canonical candidate | Keep as canonical owner target |
| .std-page-shell | public/control-center/ui/page-standard.js | 397, 407 | Runtime DOM query + class assignment | Runtime producer (not CSS owner) | Keep behavior unchanged in this step |
| .std-context-ribbon | public/control-center/styles/14-page-standard.css | 15 | Standard context ribbon base styles | Canonical candidate | Keep canonical in 14 |
| .std-context-ribbon | public/control-center/ui/page-standard.js | 409 | Runtime DOM template class | Runtime producer (not CSS owner) | Keep unchanged |
| .std-main-grid | public/control-center/styles/08-components-foundation.css | 333 | Shared two-column grid primitive | Non-canonical under new contract | Migrate ownership intent to 14 before future retirement from 08 |
| .std-main-grid | public/control-center/styles/08-components-foundation.css | 511, 542 | Responsive overrides for same primitive | Non-canonical under new contract | Move future canonical responsive behavior to 14, then retire here |
| .std-action-panel | not found in audited CSS/JS set | n/a | Planned Action Panel primitive | Missing primitive | Add later in 14 only (Step 2C) |
| .std-ai-panel | not found in audited CSS/JS set | n/a | Planned AI Panel primitive | Missing primitive | Add later in 14 only (Step 2C) |
| .std-smart-strip | public/control-center/ui/page-standard.js | 426 | Runtime class applied on smart strip section | Runtime producer | Keep runtime output; align CSS canonical in 14 |
| .std-smart-strip-compact | public/control-center/styles/14-page-standard.css | 182 | Active smart strip layout style | Canonical candidate | Keep canonical in 14 |
| .std-smart-strip-compact | public/control-center/ui/page-standard.js | 426 | Runtime class on same section | Runtime producer | Keep unchanged |
| .std-main-content | not found in audited CSS/JS set | n/a | Requested primitive name | Missing primitive | Introduce later only if contract requires this exact name; otherwise keep slot naming strategy |
| .std-main-content-slot | public/control-center/styles/08-components-foundation.css | 305 | Shared slot/grid behavior | Duplicate scope risk | Evaluate retirement after 14 ownership is explicit |
| .std-main-content-slot | public/control-center/styles/14-page-standard.css | 229, 296, 461 | Active standard slot + behavior tuning | Canonical candidate | Keep canonical in 14 |
| .std-main-content-slot | public/control-center/ui/page-standard.js | 435 | Runtime DOM template class | Runtime producer | Keep unchanged |
| .std-main-column | not found in audited CSS/JS set | n/a | Requested primitive name | Missing primitive | Add later in 14 if right-rail/main-column model is formalized |
| .std-side-column | not found in audited CSS/JS set | n/a | Requested primitive name | Missing primitive | Add later in 14 if right-rail/main-column model is formalized |
| .std-context-actions | public/control-center/styles/14-page-standard.css | 161, 247, 279 | Active context action container styles + responsive behavior | Canonical candidate | Keep canonical in 14 |
| .std-context-actions | public/control-center/ui/page-standard.js | 419 | Runtime DOM template class | Runtime producer | Keep unchanged |

## 4. Confirmed Canonical Owner Candidates In 14-page-standard.css

Confirmed strong owner candidates in styles/14-page-standard.css:

- .std-page-shell (line 6)
- .std-context-ribbon (line 15)
- .std-context-actions (line 161; responsive at 247, 279)
- .std-smart-strip-compact (line 182)
- .std-main-content-slot (line 229; additional usages at 296, 461)

These selectors are directly compatible with runtime output generated by ui/page-standard.js.

## 5. Duplicate Definitions In 08-components-foundation.css

Confirmed duplicates or ownership conflicts in styles/08-components-foundation.css:

- .std-page-shell (line 297) duplicates canonical shell intent now assigned to 14.
- .std-main-content-slot (line 305) overlaps with active 14 ownership.
- .std-main-grid (line 333 + responsive references at 511, 542) remains shared in 08 but contract target is to centralize std-* primitives in 14.

Readiness note:

- .std-page-shell is the first safe retirement candidate once Step 2 regression checks are prepared.

## 6. Duplicate Definitions In 12-pages.css

Confirmed duplicate in styles/12-pages.css:

- .std-page-shell appears in grouped selector block at line 10.

Readiness note:

- This duplicate should be retired after 08 cleanup sequencing, with page-family visual checks focused on Home/Setup/Library/Content/AI page shells.

## 7. Missing std-* Primitives

Missing in audited CSS/JS set:

- .std-action-panel
- .std-ai-panel
- .std-main-content
- .std-main-column
- .std-side-column

Interpretation:

- Contract and UX docs define these as logical/zone targets, but they are not yet formalized as stable selectors.
- Missing selectors should be introduced only in a future controlled CSS edit pass, owned by styles/14-page-standard.css.

## 8. Risk Assessment Per Selector

- .std-page-shell: high risk due to multi-file duplicate ownership and cascade masking.
- .std-context-ribbon: low risk; appears canonical in 14 with runtime alignment.
- .std-main-grid: medium risk; currently owned in 08 but contract target is 14, requiring migration care.
- .std-action-panel: medium risk from absence (zone intent exists without canonical selector).
- .std-ai-panel: medium risk from absence (zone intent exists without canonical selector).
- .std-smart-strip / .std-smart-strip-compact: low-medium risk; runtime emits both, but styling center is compact variant.
- .std-main-content: medium risk from naming gap versus existing .std-main-content-slot implementation.
- .std-main-column / .std-side-column: medium risk from absent formalization while right-rail patterns are implemented via page-specific selectors.
- .std-context-actions: low risk; canonical styling and responsive behavior present in 14 with runtime alignment.

## 9. Safe Cleanup Plan

Step 2A — Remove/retire duplicate .std-page-shell from 08 if safe

- Preconditions:
  - Confirm no route regresses when 08 shell declaration is removed.
  - Confirm 14 remains loaded after 08 and selector specificity remains stable.
- Action scope (future pass only): retire .std-page-shell in 08.

Step 2B — Remove/retire duplicate std-* from 12 if safe

- Preconditions:
  - Validate Home/Setup/Library/Content/AI page shells remain stable without 12 ownership of .std-page-shell.
  - Confirm no hidden dependency on grouped selector side effects.
- Action scope (future pass only): retire .std-page-shell from 12 grouped block.

Step 2C — Add missing canonical primitives if needed

- Preconditions:
  - Finalize naming contract for std-main-content vs std-main-content-slot.
  - Finalize right-rail semantic model for std-main-column/std-side-column and zone selectors std-action-panel/std-ai-panel.
- Action scope (future pass only): introduce missing selectors in 14 as canonical owner.

## 10. Validation Plan For Future CSS Edit Pass

Required checks for the future edit pass:

1. Selector grep verification before and after edits for audited std-* list.
2. Visual route sweep for REQUIRED_ROUTES from page-standard.js.
3. Focused checks on Home, Setup, Library, AI Command, Workflows, Publishing, Media, Content, Ads, Insights, Research, Settings.
4. Confirm no index.html load-order changes.
5. Confirm no runtime JS behavior change.
6. Confirm no data/projects changes.
7. Run syntax checks:
   - node --check public/control-center/app.js
   - node --check public/control-center/router.js
   - node --check public/control-center/ui/page-standard.js

## 11. Do-not-touch List

- Do not edit runtime JS in this step.
- Do not edit CSS in this step.
- Do not edit backend.
- Do not edit data/projects.
- Do not change index.html load order.
- Do not delete legacy files/folders.
- Do not refactor Governance runtime.
- Do not refactor Settings runtime.
- Do not commit forensic snapshot files.

## 12. No-change Confirmation

This Step 1 artifact is documentation-only.

Confirmed:

- No runtime JS modified.
- No CSS modified.
- No backend modified.
- No data/projects modified.
- No load-order changes in index.html.
- No legacy deletion.
- No Governance or Settings refactor.
- No forensic snapshot files committed in this step.
