# Frontend Master Execution Protocol

## Status
Active protocol for all remaining page upgrades.

## Core Doctrine
Backend owns operational authority.
Frontend projects operational authority.

## Upgrade Method
Every page must follow:

1. Audit
2. Confirm
3. Decide
4. Implement
5. Browser QA
6. Commit
7. Closeout

No page may be redesigned or patched without completing the audit and decision step first.

## Page Model
Every upgraded page must converge toward:

- Header
- Main View
- Action Panel
- AI Panel
- Guardrails / Danger Zone where needed

## CSS Doctrine
- Do not add repeated CSS layers.
- Do not patch over old patches.
- Do not relink legacy CSS or JS.
- Each page must have one canonical scoped CSS section.
- Prefer selectors scoped by:
  [data-page="<page>"] ...

## JavaScript Doctrine
- Do not change backend authority.
- Do not rewrite handlers during visual work.
- Do not remove data attributes.
- Do not move mutation logic without audit.
- Do not start Auto Mode or heavy intelligence from render.
- Use read-only projection first.

## Smart Tools Doctrine
Smart tools must start read-only:
- Next Best Action
- Readiness Summary
- Missing Items
- Selected Item Context
- Suggested Destination
- AI Prompt Preview

Execution tools require a separate audit:
- Auto classify
- Bulk approve
- Bulk archive
- Auto source-of-truth
- AI extraction that writes data
- Publish/send/execute actions

## Validation Required For Every Page
- node --check target page
- node --check related modules
- node --check app.js
- legacy guard
- forbidden diff check
- action selector preservation check
- browser QA
- git status clean after commit

## Forbidden Without Separate Audit
- backend changes
- api.js changes
- app.js changes
- index.html changes
- data/projects changes
- legacy file relinking
- destructive action redesign
- runtime authority changes

## Page Completion Definition
A page is complete only when:
- it loads without stuck loading
- its core actions are visible
- its core actions work or remain preserved
- it follows the page model
- duplicate visual surfaces are removed or de-emphasized
- CSS is canonicalized
- Browser QA passes
- closeout report is committed
