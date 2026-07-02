# AI Command to Task Center Handoff Runtime Test Script

## Purpose

Verify that AI Command can send review-only task handoff context to Task Center and that Task Center displays it without creating durable tasks.

## Test scope

This test verifies:

- AI Command chat does not throw `languagePlan is not defined`.
- AI Command task outputs can target `task-center`.
- AI Command route/handoff code can write shared handoff.
- Task Center can read `getSharedHandoff(projectName, "task-center", ops)`.
- Task Center displays `Incoming Task Handoff`.
- Task counters do not increase automatically.
- Mutation controls remain disabled/deferred.

## Manual browser flow

1. Open AI Command.
2. Select `Operations Lead`.
3. Send a short message.
4. Confirm no `languagePlan is not defined` error appears.
5. Select/create a Task output.
6. Confirm Output Workspace shows:
   - Channel: Task Center
   - Output type: Task
7. Click `Route`.
8. Open Task Center.
9. Confirm:
   - Incoming Task Handoff appears.
   - Source is AI Command.
   - Destination is Task Center.
   - Status is Review-only intake.
   - Total tasks count does not increase automatically.

## Browser Console Runtime Check

Paste this in browser console while on Task Center:

```js
(() => {
  const text = document.body.innerText;

  const checks = {
    taskCenterOpen: /Task Center/.test(text),
    incomingHandoffVisible: /Incoming Task Handoff/.test(text),
    reviewOnlyVisible: /Review-only|Review only|review-only/i.test(text),
    noDurableTaskNotice: /No durable task is created automatically/i.test(text),
    totalZero: /Total\s+0/.test(text),
    mutationDeferred: /deferred: mutation safety pass/i.test(text),
  };

  console.table(checks);

  const failed = Object.entries(checks)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (failed.length) {
    console.warn("Task Center handoff runtime check failed:", failed);
  } else {
    console.log("Task Center handoff runtime check passed.");
  }

  return checks;
})();
Expected result

The runtime check should pass after AI Command routes a task handoff to Task Center.

If incomingHandoffVisible is false, then AI Command did not write a task-center handoff before navigation, or the page was refreshed and the in-memory handoff cache was lost.

Important limitation

Shared handoff currently uses in-memory frontend cache. A full browser page reload may clear the handoff. Route and navigation should be tested in the same browser session without hard refresh between AI Command and Task Center.

Acceptance

Accepted only if:

AI Command chat works.
Route action sends task-center handoff.
Task Center displays incoming handoff.
No durable task is created automatically.
