# PHASE 3Z.3 — Queue Center Boundary Copy / Deferred Publishing Mutation Safety Plan

## Status
Plan-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous phase: `PHASE 3Z.2 — Queue Center Execution / Mutation Safety Audit`
- Previous commit: `89bc368 Add Queue Center mutation safety audit`

## Source Truth
Queue Center is implemented inside:
- `public/control-center/pages/operations-centers.js`

Route:
- `queueCenterRoute`
- id: `queue-center`

## Purpose
Plan safe copy/label improvements for Queue Center after mutation boundary audit confirmed:

- Queue Center itself is read/review/filter/route/AI-guidance.
- Active Queue Center controls do not mutate queue or publishing records.
- Retry/Approve/Publish/Remove controls are disabled and deferred.
- Publishing mutations exist in Publishing page and backend, not active inside Queue Center.
- Backend publishing mutations are guarded by Governance policy:
  - `freeze_publishing`
  - `approval_before_publish`
- AI actions route/prompt context only.
- Owner page routing is navigation only.

## Evidence From PHASE 3Z.2

### Queue Center safe active actions
- Refresh Queue Center reads from `fetchProjectQueueCenter`.
- Search/focus/status/select are local UI/session state.
- Open Owner Page navigates to the owning workspace.
- AI prompt/context is guidance-only.

### Disabled/deferred actions
Queue Center shows but disables:
- Retry item.
- Approve item.
- Publish item.
- Remove item.

These are correctly deferred because enabling them could touch publishing lifecycle, approval readiness, external provider workflows, or destructive queue mutation.

### External publishing mutations
Confirmed real durable mutations exist outside Queue Center:
- Publishing schedule.
- Publishing reschedule.
- Publishing ready/approve.
- Publishing publish/manual completion record.
- Publishing fail/failure record.

### Governance gates
Confirmed backend governance gates:
- `freeze_publishing` blocks schedule/reschedule/ready/publish.
- `approval_before_publish` blocks ready/publish unless Governance approval is approved or overridden.

## Copy Risk Areas

### 1. “Control workflow, content, media, approval, publishing, and sync queues”
Risk:
Could imply Queue Center can control/execute publishing or approval mutations.

Recommended copy direction:
- Review workflow, content, media, approval, publishing, and sync queue pressure.
- Route queue items to owning workspaces for controlled action.

### 2. “Queue operations”
Risk:
Could imply operational execution.

Recommended copy direction:
- Queue review operations.
- Review queue pressure and route each item to its owner.

### 3. “Queue actions”
Risk:
Could imply active mutation capability.

Recommended copy direction:
- Queue review actions.
- Active actions are refresh, route, and AI guidance only.

### 4. “Retry item / Approve item / Publish item / Remove item”
Risk:
These are high-risk verbs.

Recommended copy direction:
- Retry item (disabled: future mutation safety pass).
- Approve item (disabled: Governance/Publishing-owned).
- Publish item (disabled: Publishing-owned and Governance-gated).
- Remove item (disabled: future destructive mutation safety pass).

### 5. AI Panel
Risk:
Could imply AI can approve/publish/retry.

Recommended copy direction:
- AI receives context/prompt only.
- AI cannot approve, publish, retry, remove, or bypass Governance.

### 6. Route metadata
Risk:
Current route metadata says “Control ... queues from one central operations surface.”

Recommended copy direction:
- Review queue pressure and route workflow, content, media, approval, publishing, and sync items to owning workspaces without silent mutation.

## Allowed Future Patch Scope
A future patch may change:
- Route metadata copy.
- Section headings.
- Helper copy.
- Panel descriptions.
- Disabled action explanatory copy.
- AI panel safety copy.
- Owner route label copy.

A future patch must not change:
- Handlers.
- API calls.
- Backend routes.
- CSS.
- Data files.
- Queue mutation logic.
- Publishing mutation logic.
- Governance policy behavior.
- Disabled/enabled state.
- Publishing page behavior.
- Governance behavior.
- AI behavior.

## Required Browser QA After Patch
Check:
- Queue Center page loads.
- Copy says review/projection/routing, not silent queue control.
- Refresh remains read-only.
- Retry/Approve/Publish/Remove remain disabled.
- AI panel says context/guidance only and no approve/publish/retry/remove.
- Open Owner Page remains routing-only.
- No publishing mutation occurs.
- No Governance approval occurs.
- No backend POST for publishing is triggered.

## Recommended Next Phase
`PHASE 3Z.4 — Queue Center Copy-Only Deferred Publishing Mutation Boundary Safe Patch`

Do not implement until this plan is reviewed and committed.
