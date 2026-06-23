# T150B — Operations Centers Browser QA

## Status
Manual Browser QA required.

## Baseline
- 8c17da6 Close Customer Center direct page QA

## Routes to Verify
- http://127.0.0.1:3000/control-center/#operations-centers
- http://127.0.0.1:3000/control-center/#task-center
- http://127.0.0.1:3000/control-center/#queue-center
- http://127.0.0.1:3000/control-center/#job-monitor
- http://127.0.0.1:3000/control-center/#notification-center

## Purpose
Verify rendered Operations Centers surfaces after source authority classification.

## Must Verify

### Operations Overview
1. Route `#operations-centers` loads.
2. Visible page label matches Operations Overview / Operations Centers.
3. Page does not imply direct execution.
4. Overview cards route to owning workspaces only.
5. Planned mutation actions are disabled.
6. AI/workflow buttons are navigation or guidance only.

### Task Center
1. Route `#task-center` loads.
2. Refresh is projection reload only.
3. Copy actions are local utility only.
4. Task mutation buttons are visibly disabled:
   - Update status
   - Reassign owner
   - Change priority
   - Update due date
   - Delete task
5. AI guidance copy says no task creation, owner assignment, status change, approval, publishing, or backend execution.

### Queue Center
1. Route `#queue-center` loads.
2. Refresh is projection reload only.
3. Retry / Approve / Publish / Remove buttons are disabled.
4. AI guidance copy says no approve, publish, retry, remove, Governance bypass, or backend execution.

### Job Monitor
1. Route `#job-monitor` loads.
2. Refresh is projection reload only.
3. Retry / Cancel / Rerun / Delete job buttons are disabled.
4. AI guidance copy says no worker trigger, retry, cancel, rerun, delete, approve, publish, or backend execution.

### Notification Center
1. Route `#notification-center` loads.
2. Refresh is projection reload only.
3. Mark Read, if visible, says read-state only.
4. Mark Read confirmation, if tested, must say it does not acknowledge, resolve, dismiss, delete, send, approve, publish, or execute.
5. Acknowledge / Resolve / Dismiss / Delete notification buttons are disabled.
6. Governance decision buttons, if visible, must clearly update approval record only and not publish/send/execute directly.

### Global QA
1. No console SyntaxError.
2. No blocking runtime crash.
3. No layout overlap hiding safety copy.
4. No production behavior change was made during this audit.

## Evidence to Add
- Browser:
- Console result:
- Operations Overview visual result:
- Task Center visual result:
- Queue Center visual result:
- Job Monitor visual result:
- Notification Center visual result:
- Issues found:
- Decision:
