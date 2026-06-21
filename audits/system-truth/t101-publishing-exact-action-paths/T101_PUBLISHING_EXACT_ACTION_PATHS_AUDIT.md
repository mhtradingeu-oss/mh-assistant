# T101 — Publishing Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact user-facing runtime authority paths in:

- `public/control-center/pages/publishing.js`

This follows T100, which confirmed Publishing contains publish/schedule/channel/approval signals and multiple confirmation signals.

## Paths to classify

### 1. Save publishing draft
Expected classification:
- Local draft only or durable backend record.
- Must classify exact storage.

### 2. Queue for Manual Publishing / Schedule
Expected classification:
- Manual schedule record or local status change.
- Must require confirmation if durable record/status mutation occurs.
- Must guard blockers and approval state.

### 3. Record Manual Completion / Publish
Expected classification:
- Should record manual completion only.
- Must not externally publish.
- Must require approval and confirmation.

### 4. Pause / Retry / Fail
Expected classification:
- Status mutation path.
- Must require confirmation if durable or authority-sensitive.

### 5. Approval action
Expected classification:
- Approve/readiness status only or backend approval decision.
- Must require confirmation.

### 6. Load handoff
Expected classification:
- Shared handoff/context only unless durable draft created.

### 7. Send publishing context to AI
Expected classification:
- Shared AI draft or prompt only.
- Must not execute AI automatically or create backend records.

### 8. Auto-prepare publishing plan
Expected classification:
- Auto Mode planning only or automation step creation.
- Must require approval if it records/executes anything.

### 9. Auto approve / skip
Expected classification:
- Auto Mode control action.
- Must be confirmation-gated if it changes automation state.

### 10. Payload builders
Expected classification:
- Preview/payload only.
- Must not publish externally.

## Decision Rule
- If live publish/send/schedule exists without confirmation and approval guard, patch.
- If durable publishing record changes exist without confirmation, patch.
- If actions are local draft/shared context only, document and close.
- If Auto Mode steps are state-only but authority-sensitive, verify confirmation and messaging.
- Do not redesign Publishing in this pass.
