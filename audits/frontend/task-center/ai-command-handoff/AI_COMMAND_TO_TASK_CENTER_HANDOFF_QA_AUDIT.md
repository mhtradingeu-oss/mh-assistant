# AI Command to Task Center Handoff QA Audit

## Purpose

Verify whether AI Command task outputs can route review-only handoff context into Task Center and appear as `Incoming Task Handoff`.

## Current accepted baseline

- Workflows to Task Center review-only handoff is accepted.
- Task Center reads `getSharedHandoff(projectName, "task-center", ops)`.
- Task Center shows incoming handoff without creating durable tasks.

## Scope

Inspect:

- AI Command task output generation.
- AI Command destination route selection.
- AI Command shared handoff send handlers.
- Task Center read path.
- Shared context contract.

## Evidence files

- `01-ai-command-task-output-routes.txt`
- `02-ai-command-handoff-send-handlers.txt`
- `03-task-center-read-path.txt`
- `04-shared-handoff-contract.txt`

## Questions to answer

- Does AI Command create task output previews?
- Do task outputs route to `task-center`?
- Does AI Command write `setSharedHandoff(..., "task-center", ...)` or use dynamic destination that can be `task-center`?
- Does clicking Route/Prepare Handoff send review-only context?
- Does Task Center display that handoff?
- Does opening Task Center create zero durable tasks automatically?

## Safety checklist

- [ ] AI Command task output is preview/guidance only.
- [ ] Route to Task Center writes review-only handoff.
- [ ] Task Center displays incoming handoff.
- [ ] No durable task is created automatically.
- [ ] Mutation controls remain disabled/deferred.

## Current status

Pending evidence review and browser QA.

## Evidence review result

The audit confirms that AI Command has a task-output route path that can target Task Center, but the browser path still needs confirmation.

Confirmed:

- `destinationRouteForSpecialist(...)` exists.
- `operations` task outputs route to `task-center`.
- `customer_ops` task outputs route to `task-center`.
- Team mode task tools can route to `task-center`.
- AI Command has dynamic shared handoff writes through `setSharedHandoff(projectName || "__default__", destination, ...)`.
- Task Center already reads `getSharedHandoff(projectName, "task-center", ops)`.
- Task Center displays incoming handoff when the destination cache key is `task-center`.

Important detail:

AI Command writes handoffs to a dynamic `destination`. Therefore this path is correct only when the generated preview/output has `destinationRoute === "task-center"`.

## Current classification

- Code-level route capability: present.
- Task Center read capability: present.
- Shared handoff contract: present.
- Browser-confirmed AI Command -> Task Center path: pending.
- Durable task creation: not indicated by this path.

## Browser QA required

To accept this path, test:

1. Open AI Command.
2. Use Operations specialist or Full Team mode.
3. Create a Task output preview.
4. Route/prepare handoff.
5. Open Task Center.
6. Confirm `Incoming Task Handoff` appears.
7. Confirm task counters do not increase automatically.
8. Confirm no console errors.

## Recommendation

Commit this audit as evidence, then perform browser QA before patching.

If Browser QA fails because the destination is not `task-center`, apply a small AI Command route normalization patch for task outputs destined to Task Center.
