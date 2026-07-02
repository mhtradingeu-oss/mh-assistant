# CSS Ownership Contract

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only contract (no runtime JS, CSS, backend, or data changes)
Verification step: Frontend Verification Step V3

## 1. Executive Summary

This contract establishes canonical CSS ownership boundaries before any cleanup edits. It resolves authority ambiguity by assigning each loaded stylesheet a primary ownership scope and defining where shared selectors are allowed to exist.

Core contract outcome:

- Shared std-* primitives must have one canonical owner.
- Page-specific variants may override only through scoped selectors.
- No CSS layer may create hidden authority conflicts through duplicate unscoped selectors.

This is a pre-change contract only. No CSS or runtime code is modified in this step.

## 2. Current CSS Load Order From index.html

Current active load order in public/control-center/index.html:

1. styles/00-tokens.css
2. styles/01-reset.css
3. styles/02-layer-system.css
4. styles/03-app-shell.css
5. styles/07-sidebar.css
6. styles/10-topbar-canonical.css
7. styles/04-command-layer.css
8. styles/05-ai-layer.css
9. styles/08-components-foundation.css
10. styles/09-operations-centers.css
11. styles/12-pages.css
12. styles/13-home-executive.css
13. styles/14-page-standard.css

Contract rule for this step:

- Do not change index.html load order.

## 3. Canonical Ownership Table

| Layer | Canonical owner scope | Allowed selector types | Not allowed in this layer |
|---|---|---|---|
| 00 tokens | Design tokens only (color, spacing, radius, type, shadows, transitions) | CSS custom properties | Component/layout selectors |
| 01 reset | Global browser normalization/reset | element/reset/state normalization selectors | App shell, component, page layout selectors |
| 02 layer system | Cross-app system layers and overlays (loading, fatal, startup, toasts, z-index) | global system surfaces and visibility hardening | Page layout or page feature styling |
| 03 app shell | Structural shell layout (app, os-layout, main-shell, workspace, page root) | shell grid and viewport behavior | Sidebar/topbar/command/AI details owned elsewhere |
| 04 command layer | Global command bar + backdrop | command bar, command backdrop, command mobile behavior | Page-specific command visual systems |
| 05 AI layer | Global AI dock and panel shell | ai-dock surfaces and responsive dock behavior | Page-local AI cards unrelated to dock shell |
| 07 sidebar | Sidebar, nav groups, project switcher, sidebar mobile behavior | sidebar/nav/brand/toggle/backdrop | Topbar or page content layout |
| 08 components foundation | Base reusable primitives (buttons, inputs, cards, badges, generic grids, inline loading/empty) | shared primitives without page ownership | Unscoped std-* authority primitives when owned by 14 |
| 09 operations centers | Operations centers page-specific layout and density policy | data-page scoped operations selectors | Unscoped shared primitives |
| 10 topbar canonical | Topbar and workspace chip behavior | topbar/page title/workspace chip/exec cluster | Sidebar/command/page layout ownership |
| 12 pages | Generic page family structures (Home/Setup/Library/Content/AI workspace) | page-family selectors and layout helpers | Shared std-* canonical primitive ownership |
| 13 home executive | Home-only executive visual language | home-* selectors | Generic shared primitives used across routes |
| 14 page standard | Canonical std-* page-standard primitives and shared operating-surface normalization | std-* primitives and scoped standard-layer refinements | Non-standard global shell ownership |

## 4. Standard Page Shell Ownership

Contracted ownership for standard page shell selector families:

- std-page-shell: canonical owner = styles/14-page-standard.css
- std-context-ribbon: canonical owner = styles/14-page-standard.css
- std-main-grid: canonical owner = styles/14-page-standard.css (future normalization target)
- std-action-panel: canonical owner = styles/14-page-standard.css (currently not formalized as shared selector)
- std-ai-panel: canonical owner = styles/14-page-standard.css (currently not formalized as shared selector)
- std-smart-strip: canonical owner = styles/14-page-standard.css (implemented as std-smart-strip-compact in current layer)

Clarification:

- data-page scoped refinements (for example in styles/09-operations-centers.css) are allowed.
- Unscoped duplicate definitions of canonical std-* primitives are not allowed.

## 5. Ownership Decision (No Edit In This Step)

Decision A: canonical std-* primitive owner later

- styles/14-page-standard.css becomes the single canonical owner for shared std-* primitives.

Decision B: duplicate definitions to retire later (no change now)

- styles/08-components-foundation.css should stop defining std-page-shell once cleanup phase begins.
- styles/12-pages.css should stop defining std-page-shell once cleanup phase begins.
- styles/09-operations-centers.css may keep scoped route-specific adjustments, but must not own unscoped std-* definitions.

Decision C: currently missing standard selectors

- std-action-panel and std-ai-panel should be introduced later under styles/14-page-standard.css as formal canonical selectors, aligned with UX operating surface zones.

## 6. Page-Specific CSS Policy

Operations pages

- Owner: styles/09-operations-centers.css
- Required policy: selectors must remain data-page scoped.
- Shared std-* usage: only scoped refinements; no canonical ownership.

Library

- Baseline page family ownership: styles/12-pages.css
- Standard-layer polish ownership: styles/14-page-standard.css
- Required policy: keep library-specific rules data-page scoped where possible to prevent cross-route bleed.

Home

- Owner: styles/13-home-executive.css
- Required policy: home visual language and density belong here.
- 12/14 overlap must be resolved in a later cleanup pass without changing behavior in this step.

Governance

- Current status: page-local runtime/layout remains outside page-standard migration.
- Policy: do not force into std-* migration until Governance UX Contract is completed.

Settings

- Current status: settings-shell/settings-workspace remains local while route is standard-eligible.
- Policy: no runtime/layout redesign before Settings UX Contract.

Media / Publishing / AI

- Shared primitives: std-* from styles/14-page-standard.css when applicable.
- Page-local families: remain under page-specific rules in styles/12-pages.css or dedicated page CSS scope.
- Policy: no cross-file duplicate ownership of shared primitives.

## 7. Legacy / Archive Policy

- public/control-center/legacy remains present in the tree.
- Legacy is documented as not directly runtime-loaded based on forensic scan and canonical layer map.
- Any archive/delete action requires a separate dedicated validation and approval step.
- This contract does not authorize legacy deletion.

## 8. Responsive / Device Sizing Policy

Desktop

- Main view keeps priority width.
- Right rail is secondary and must not collapse main operational readability.

Tablet

- Two-column layouts may collapse to single-column when readability or interaction density requires it.
- Context/action clusters remain discoverable and usable without hidden authority behavior.

Mobile

- Single-column first.
- Header context remains visible and actionable.
- Action and AI zones stack below primary content when required.

Right rail behavior

- Right rail is optional by breakpoint but not by authority.
- If collapsed, action and AI intent must remain available in deterministic stacked layout.

Main view width priority

- Main view content has priority over decorative or secondary side surfaces.
- Overflow behavior must preserve interaction and readability for operational data.

## 9. Anti-Duplication Rules

- No duplicate canonical selectors across files.
- No new !important usage unless documented with explicit reason and retirement intent.
- Page-specific selectors must be data-page scoped where feasible.
- Shared selectors must live in one canonical owner only.
- Later-loading files must not silently redefine another file's canonical unscoped selector.

## 10. Risk List

1. Active duplicate ownership risk: std-page-shell is defined in multiple files and cascade currently masks conflicts.
2. Drift risk: 12/13/14 overlap for home and library structures can cause unpredictable future regressions.
3. Scope bleed risk: unscoped selectors in page layers may style unintended routes.
4. Authority mismatch risk: visual standard zones (action/ai/right rail) are defined conceptually before fully canonical selector alignment.
5. !important accumulation risk: emergency overrides can harden temporary fixes into hidden long-term authority conflicts.

## 11. Recommended Implementation Sequence

CSS Step 1: std-* ownership cleanup audit

- Inventory all std-* selectors and classify: canonical, scoped refinement, deprecated duplicate.

CSS Step 2: remove duplicate std-page-shell definition safely

- Retire duplicate unscoped std-page-shell definitions outside canonical owner.
- Validate no route layout regressions after each retirement action.

CSS Step 3: page-specific migration

- Align page-family ownership boundaries (operations, home, library, media/publishing/ai) to prevent cross-layer drift.
- Keep Governance and Settings out of runtime redesign until their dedicated UX contracts are complete.

CSS Step 4: legacy archive plan

- Execute separate legacy archive validation and approval workflow.
- Only then archive/delete legacy candidates.

## 12. No-Change Confirmation

This artifact is documentation-only.

Confirmed for this step:

- No runtime JS files modified.
- No CSS files modified.
- No backend files modified.
- No data/projects files modified.
- No index.html load order changes performed.
- No legacy files deleted.
- No Governance or Settings refactor performed.
- No forensic snapshot files committed in this step.
