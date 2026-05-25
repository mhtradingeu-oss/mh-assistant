# AI Command Pass 4A - Route-only Contract Patch

## Summary

This patch fixes AI Command latest response routing without changing preview UI, Task Center, Workflows, backend, or durable task behavior.

## Root cause

Latest AI chat responses were stored as `outputType: "chat"` and the Route button fell back to guidance routing:

`destinationRouteForSpecialist(session.modeId, "guidance")`

For Operations Lead, guidance routes to Workflows. Therefore task/handoff-style Operations responses opened Workflows instead of Task Center.

## What changed

- Added one resolver: `resolveAiResponseOutputRoute(...)`.
- Latest response history stores normalized `outputType` and `destinationRoute`.
- The latest response Route button uses the same resolver fallback.

## What did not change

- No Create Preview changes.
- No Preview density changes.
- No CSS changes.
- No backend changes.
- No durable task creation.
- No Task Center mutation.
- No Workflows mutation.

## Safety

Routing remains review-only through shared handoff. Durable task creation remains gated and separate.
