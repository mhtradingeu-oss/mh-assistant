# Operations Final UX Composition — Authority Summary

## Status
Audit completed.

## Confirmed Runtime Authority
Operations is controlled by one main runtime file:

- `public/control-center/pages/operations-centers.js`

## Confirmed Operations Surfaces
The same file owns:

- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`

## Backend Data Sources
Operations uses backend endpoints through `api.js` for:

- `/operations`
- `/task-center`
- `/queue-center`
- `/job-monitor`
- `/notification-center`

## High-Risk Contracts
Must preserve:

- route IDs
- `data-page` values
- refresh buttons
- filter inputs/selects
- selected item behavior
- AI assistant prompt buttons
- Governance notification decision actions
- shared handoff behavior
- backend refresh/update logic

## Design Decision
Do not redesign all Operations sub-pages at once.

Proceed with:

1. Operations Overview Shell first.
2. Then Task Center.
3. Then Queue Center.
4. Then Job Monitor.
5. Then Notification Center.

## Recommended First Target
`operations-centers` overview shell.

Reason:
- It is the main entry from Home.
- It summarizes runtime state.
- It routes to operational sub-pages.
- It can adopt GDS primitives without touching each sub-page yet.

## Forbidden
- No backend changes.
- No API changes.
- No route changes.
- No handler removal.
- No broad rewrite of `operations-centers.js`.
- No changing sub-page behavior in the overview pass.

## Decision
Proceed to OPS-FINAL-1 Operations Overview Shell Plan.
