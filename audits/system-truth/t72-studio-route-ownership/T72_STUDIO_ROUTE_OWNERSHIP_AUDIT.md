# T72 — Studio Route Ownership + Duplicate Surface Audit

## Status
Audit-only. No production files changed.

## Scope
Classify whether these files are active routed surfaces, legacy wrappers, duplicate implementations, or unused modules:

- `public/control-center/pages/media-studio-workspace.js`
- `public/control-center/pages/media-studio/workspace.js`
- `public/control-center/pages/content-studio-workspace.js`
- `public/control-center/pages/content-studio/workspace.js`

## Why this audit exists
T71 ranked `media-studio-workspace.js` and `content-studio-workspace.js` as high risk, while previous closeouts referenced the nested workspace files. Before auditing runtime authority, route ownership must be confirmed to avoid patching the wrong surface.

## Required classification
For each file:

1. Is it imported by app/router/page registry?
2. Is it directly routable?
3. Is it a wrapper around another workspace?
4. Is it legacy/unused?
5. Does it duplicate runtime authority or UI?
6. Which file is canonical?

## Decision Rule
- If the top-level `*-workspace.js` files are active routed surfaces, audit them next.
- If they are legacy duplicates, document and decide whether later cleanup/removal is needed.
- If both top-level and nested workspace files are active, treat as a duplication risk and stop before patching.
- No runtime changes in this step.

## Source Inspection Result

### File existence
Only the top-level routed files exist in the current tree:

- `public/control-center/pages/media-studio-workspace.js`
- `public/control-center/pages/content-studio-workspace.js`

The previously referenced nested paths were not present in the current filesystem inspection:

- `public/control-center/pages/media-studio/workspace.js`
- `public/control-center/pages/content-studio/workspace.js`

### Router ownership
`public/control-center/router.js` imports the active routes directly from the top-level files:

- `./pages/content-studio-workspace.js`
- `./pages/media-studio-workspace.js`

### Route exports
The active route exports are:

- `mediaStudioRoute` with route id `media-studio`
- `contentStudioRoute` with route id `content-studio`

## Decision
There is no active duplicate route pair to patch in this step.

The canonical active routed surfaces are:

- `public/control-center/pages/media-studio-workspace.js`
- `public/control-center/pages/content-studio-workspace.js`

## Follow-up
T71 correctly identified `public/control-center/pages/media-studio-workspace.js` as the next active runtime-authority candidate.

Proceed to a focused Media Studio runtime authority audit before any patch.
