# PHASE 3T.1 — Global CSS Ownership and Duplication Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: f70726f Add global UI finalization rollout scan

## Purpose
Identify active CSS ownership, duplicate page styling, historical polish layers, inline/scoped CSS ownership, and the safest sequence before global UI finalization.

## Scope
- Active CSS files
- CSS load order
- Global CSS ownership
- Page-scoped CSS ownership
- Inline/scoped style ownership
- Duplicate selectors
- Historical polish/final/density blocks
- Legacy/archive CSS candidates
- Existing CSS/visual audit coverage

## Executive Summary
The scan confirms that global UI finalization must not start with a broad CSS patch.

The frontend has accumulated many historical visual layers, page-specific polish passes, density passes, final passes, clean-layer passes, and legacy CSS candidates. This means the safest path is not a new global redesign layer, but page-by-page CSS ownership consolidation.

## Active CSS / Legacy Finding
The scan found clear legacy CSS candidates under:

- `public/control-center/legacy/06-topbar.legacy.css`
- `public/control-center/legacy/09-command-legacy-isolation.legacy.css`
- `public/control-center/legacy/11-runtime-safety-overrides.legacy.css`
- `public/control-center/legacy/99-legacy-compat.legacy.css`
- `public/control-center/legacy/styles.legacy-20260508.css`
- `public/control-center/legacy/styles.legacy-full.css`

These should remain treated as legacy/archive assets and must not be re-linked or used as active UI sources.

## Inline / Scoped CSS Owners
The scan confirms page-scoped inline CSS ownership in:

- `public/control-center/pages/publishing.js`
  - `renderScopedStyles()`
- `public/control-center/pages/media-studio-workspace.js`
  - `renderScopedStyles()`
- `public/control-center/pages/content-studio-workspace.js`
  - `renderScopedStyles()`

These pages must not be changed through broad global CSS patches. Any visual work on them needs a page-specific scoped CSS ownership audit.

## Historical Polish / Final / Density Finding
The scan found extensive prior visual audit and polish history across:

- AI Command
- Publishing
- Workflows
- Library
- Governance
- Settings
- Operations Centers
- Home
- Setup
- Integrations
- Media Studio
- Global UI primitives

This confirms that the project already contains many visual correction layers and historical design documents. The next phase should consolidate ownership rather than create another parallel visual direction.

## Existing CSS / Visual Audit Coverage
Significant CSS and visual documentation already exists, including:

- `audits/frontend/css/*`
- `audits/frontend/css-legacy-cleanup-planning/*`
- `audits/frontend/design-system/*`
- `audits/frontend/global-ui/*`
- `audits/frontend/global-ui-ux-system/*`
- `audits/frontend/page-upgrade-roadmap/*`
- page-specific visual audits for AI Command, Publishing, Workflows, Library, Governance, Settings, Setup, Operations Centers, Media Studio, Home, and Integrations

This means future implementation should reference existing ownership evidence instead of restarting the design process.

## High-Risk Selector / Ownership Areas
High-risk areas for duplication or overlapping ownership include:

- Library selectors and workspace layout classes
- AI Command / AI Team classes
- Publishing scoped CSS and global publishing-related selectors
- Workflows stepper / workflow operating surface classes
- Settings form and policy layout classes
- Governance policy / decision / evidence classes
- Operations Centers shared scaffold classes
- Clean-layer / standard-shell primitives

## Risk Matrix

| Priority | Risk | Finding | Handling |
|---|---|---|---|
| P0 | New broad CSS layer creates more conflicts | Likely | Do not add broad CSS polish layer |
| P0 | Scoped CSS pages get affected by global patches | Possible | Require page-specific scoped CSS audit |
| P1 | Legacy CSS accidentally re-linked | Known candidates exist | Keep legacy guard and do not link legacy assets |
| P1 | Library duplication pattern repeats elsewhere | Likely | Use page-by-page ownership consolidation |
| P2 | Historical visual documents conflict | Many exist | Consolidate decisions into current phase docs |
| P2 | UI polish weakens execution safety wording | Possible | Preserve 3S execution authority closeout |

## Decision
**C) Start page-by-page CSS ownership consolidation.**

Do not start global redesign yet.

Do not add another broad global polish layer.

## Recommended Next Step
Proceed to:

**PHASE 3T.2 — Page CSS Ownership Prioritization Matrix**

Purpose:
- choose first page or page-group for CSS ownership consolidation
- classify each page as:
  - global CSS owned
  - scoped CSS owned
  - hybrid
  - legacy/conflict risk
  - browser QA only
- decide the first safe page for final UI pass

## Protected Behavior
- No production changes.
- No CSS edits.
- No JS edits.
- No backend/API edits.
- No shared-context edits.
- No automation-engine edits.
- No data/project edits.
- Do not weaken execution authority closeouts.
- Do not add another broad polish layer.
- Do not touch scoped CSS owners without page-specific audit.
- Do not re-link legacy CSS.
