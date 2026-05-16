# P0.2 Operations Centers Composite Route Fix

## Problem
System audit found references to `operations-centers`, but the route was not registered.

References included:
- Home page openRoute("operations-centers")
- AI Team route destination/hints for operations/customer operations flows

## Fix
Added a safe composite `operations-centers` route that acts as an overview and routing hub for:
- Task Center
- Queue Center
- Job Monitor
- Notification Center
- AI Team / Workflows handoff

## Safety
The route is read-only and does not execute jobs, mutate tasks, send notifications, approve workflows, or trigger backend actions.

## Files changed
- public/control-center/pages/operations-centers.js
- public/control-center/router.js
