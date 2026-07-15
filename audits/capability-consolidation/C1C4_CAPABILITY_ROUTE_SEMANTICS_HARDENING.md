# C1-C4 — Capability Route Semantics Hardening

## Status

Implemented as an additive diagnostic contract.

## Purpose

C1-C3 proved that one `destinationRoute` field cannot safely represent:

- the surface that owns a capability;
- the route that executes it;
- its handoff destinations;
- its output consumers.

This phase separates those dimensions without changing current UI or runtime behavior.

## New semantic dimensions

- `surfaceOwnerRoute`
- `primaryExecutionRoute`
- `handoffRoutes`
- `consumerRoutes`
- `routeSemanticResolution`

The existing `destinationRoute` remains unchanged as a compatibility field.

## Explicit overrides

Only the 15 C1-C3 destination mismatches receive explicit semantic overrides.

No route is invented when execution ownership remains unproven. Such cases use:

- `primaryExecutionRoute: null`
- an explicit `requires_proof` resolution.

## Certified groups

- Research and SEO: Research owns the capability; other pages remain consumers or handoff targets.
- Customer Operations: `operations-centers` is observed as the surface owner; execution route remains unresolved.
- Task planning/checklists: Workflows owns the surface and execution path, with task/governance/publishing handoffs.
- Sales CRM: AI Command remains the preparation surface; execution ownership remains unresolved and multi-route.
- Priority recommendation: AI Workspace prompt suggestion with optional campaign/workflow/task handoff.
- Content send: AI Workspace intent with workflow execution.

## Safety

This phase does not:

- change Tool Dock behavior;
- change routes;
- change the Tool Drawer;
- execute providers;
- create workflows;
- write project data;
- alter backend authority.

## Next phase

C1-C5 must regenerate shadow certification using the separated route dimensions before any page migration begins.
