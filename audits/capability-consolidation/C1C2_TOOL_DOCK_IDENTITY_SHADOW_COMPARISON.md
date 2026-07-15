# C1-C2 — Tool Dock Identity Shadow Comparison

## Status

Implemented as a read-only shadow integration.

## Scope

The change adds:

- a pure capability identity comparator;
- bounded in-memory diagnostic observations;
- a narrow hook inside `findToolMetadataById`;
- specialist context at the three active lookup call sites.

## No behavior switch

The existing Tool Dock remains authoritative for current UI behavior.

The shadow result:

- does not replace Tool Dock metadata;
- does not change prompts;
- does not change routes;
- does not change the Tool Drawer;
- does not execute providers;
- does not create workflows;
- does not write project data;
- does not bypass governance.

## Hook decision

`findToolMetadataById` was selected because it is the narrow central lookup used by:

1. Library return restoration;
2. Tool Drawer opening;
3. Tool Dock click handling.

Render and listener lifecycle paths were intentionally avoided.

## Diagnostic storage

Observations are:

- memory-only;
- bounded to 200 unique tool/specialist keys;
- silent by default;
- accessible only through the exported diagnostic getter.

## Legacy observation

`BASE_TOOL_DOCK_TOOLS` currently has no active consumer and remains unchanged.
It is a future cleanup candidate only after a separate no-caller proof.

## Next phase

C1-C3 must inspect shadow outcomes and classify:

- matched;
- specialist mismatch;
- destination mismatch;
- unmapped;
- ambiguous.

No source switch or Tool Drawer removal is permitted yet.

## C1-C2A logic completion

A narrow pre-commit completion patch added:

- explicit `destination_mismatch` classification;
- `null` destination comparison when active Tool Dock metadata contains no destination evidence;
- explicit-tool shadow observation when `openToolDrawer` receives an already-resolved tool object;
- test coverage for destination mismatch, unresolved destination evidence and unknown specialist context.

### Specialist context decision

Within AI Command, `session.modeId` is the normalized active specialist identifier and is used by the current specialist, destination and Tool Dock flows.

This interpretation is local to AI Command. Other pages may use `modeId` with different vocabularies, so it must not be treated as a universal system-wide specialist field.

Library return continues to prefer:

```text
specialistId
→ modeId compatibility fallback
→ empty unresolved context

