# Home / Command Center — Review Decision

## Status
Deep active audit completed.

## Confirmed Active Files

Active Home / Command Center evidence points to:

- `public/control-center/pages/home.js`
- `public/control-center/pages/home/render-sections.js`
- `public/control-center/styles/13-home-executive.css`
- Home route/nav binding through `index.html`, `router.js`, and app shell route handling.

## Backend Binding Decision

Home is not a raw/static-only page.

It reads from active project state and backend-derived projections, including:

- overview
- readiness
- integrations
- activity
- assets
- operations snapshot
- notifications
- tasks
- approvals
- queue/job/notification indicators

## Raw / Mock / Placeholder Decision

No direct raw/mock/TODO/placeholder signals were found inside the active Home page scan.

Legacy matches from the broader baseline must not be treated as active Home defects unless imported by the runtime.

## UI / UX Risk Decision

The main Home risk is not missing backend binding. The main risk is visual/UX layering:

- `13-home-executive.css` is large and page-specific.
- Home styling also appears in `12-pages.css`.
- Several late-stage Home blocks use strong overrides and `!important`.
- This suggests the page may need consolidation/polish, but only after browser evidence.

## Production UX Goal For Home

Home must become the clearest entry point of the operating system:

- show project/system status in one scan
- expose backend readiness and blockers
- present one strong Next Best Action
- explain AI Team value without overwhelming the user
- route the operator to Operations, AI Command, Setup, Library, or Integrations when relevant
- avoid feeling like a dashboard dump

## Required Browser QA

Before implementation, manually verify:

- First screen clarity at desktop size.
- Whether the header, score, Next Best Action, and executive signals fit without clutter.
- Whether scrolling is reasonable.
- Whether AI Team cards are useful or too dense.
- Whether Customer/Ops planned/partial signals confuse the user.
- Whether buttons route correctly.
- Whether empty states are understandable.
- Mobile/tablet behavior if possible.

## Recommended Patch Scope

Do not rewrite the page.

If browser QA confirms issues, use a targeted P1 Home polish patch:

1. Clarify top hierarchy.
2. Reduce visual density where needed.
3. Strengthen Next Best Action.
4. Keep backend-bound data.
5. Avoid broad CSS changes.
6. Avoid touching unrelated pages.
7. Avoid adding new global CSS authority.

## Decision

Proceed to Home / Command Center browser QA before any implementation.
