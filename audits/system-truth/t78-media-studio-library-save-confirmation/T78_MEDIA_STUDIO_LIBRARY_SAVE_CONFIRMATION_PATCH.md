# T78 — Media Studio Library Save Confirmation Patch

## Status
Narrow runtime-authority patch.

## Scope
Patch only:

- `public/control-center/pages/media-studio-workspace.js`

## Finding
T76/T77 confirmed Media Studio already guards most authority-sensitive actions with `confirmMediaAuthorityAction`, including provider generation, prompt improvement, brand check, approval decisions, task creation, and publishing handoff.

However, two Save to Library paths called `saveVersionToLibrary()` without confirmation:

1. Header Save to Library button
2. Version action `save-library`

`saveVersionToLibrary()` may create a backend Library handoff through `createProjectHandoff(backendProjectName, handoffPayload)`. This does not publish directly, but it can create a durable backend handoff record.

## Decision
Add explicit operator confirmation before both Save to Library entry points.

## Safety boundary
This patch does not redesign Media Studio.
This patch does not change payload shape.
This patch does not alter provider generation, approval, task, or publishing behavior.
