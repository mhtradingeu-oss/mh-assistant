# PHASE 3AL — Customer Actions Plan: Tickets / Review / Assignment

## Status
Plan-only / audit-only.

No implementation in this phase.

## Baseline
Closed before this phase:
- 3AI.6 — Customer Center Protected-Read UX Safe Patch
- 3AI.7 — Customer Center Browser QA Closeout
- 3AI.8 — Customer Center Safe UX Patch Closeout
- 3AI.9 — Customer Center Sub-Routes Readiness Audit
- 3AJ — Customer Center Read-Only Data / Live Key QA Guard Check
- 3AK — Customer Mutation Safety Audit Plan

## Purpose
Define the future safe action model for Customer Center without enabling any customer mutation.

This phase plans future actions only:
- Ticket update
- Ticket review state
- Conversation assignment
- CRM note
- Escalation handoff
- Human follow-up task

## Current decision
Customer Center remains read-only.

No direct customer mutation may be implemented until:
1. Live read-only key QA passes with safe projection payloads.
2. Backend write routes are designed separately.
3. Role permission boundaries are defined.
4. Confirmation gates are implemented.
5. Audit logging is implemented.
6. Browser QA confirms no accidental execution.
7. Rollback/undo policy is documented where applicable.

## Existing allowed actions
The current Customer Center only supports safe handoff / context actions:
- Refresh read-only data
- Prepare AI Command prompt
- Prepare Task Center handoff
- Prepare Governance review

These do not mutate customer records.

## Future action categories

### 1. Ticket update
Potential future action:
- update ticket status
- add internal ticket note
- change priority
- link customer context

Required before implementation:
- backend route design
- role permission check
- confirmation dialog
- audit log entry
- validation schema
- rollback or correction policy
- UI disabled-by-default state

### 2. Review state
Potential future action:
- mark conversation reviewed
- flag conversation for follow-up
- mark SLA reviewed

Required before implementation:
- ownership model
- reviewer identity
- timestamp audit
- comment/reason capture
- confirmation gate
- non-destructive review event model

### 3. Assignment
Potential future action:
- assign conversation
- assign ticket
- route to specialist
- route to Customer Ops / Sales / CRM / Governance

Required before implementation:
- assignee/source-of-truth model
- role matrix
- queue ownership
- audit log
- notification policy
- rejection/reassignment policy

### 4. CRM note
Potential future action:
- add internal CRM note
- attach summary to customer profile
- sync safe customer metadata

Required before implementation:
- GDPR-safe field model
- data minimization rules
- customer identity handling
- provider contract
- write route audit
- confirmation gate
- audit log

### 5. Escalation handoff
Potential future action:
- create escalation handoff
- send to Governance
- send to Operations
- send to Sales / CRM

Allowed earlier than mutations if implemented as a durable internal handoff only.

Required before implementation:
- durable handoff contract
- route target
- owner role
- reviewer role
- no external send
- no customer record mutation unless explicitly approved later

## Recommended safe order
1. Durable internal follow-up task
2. Durable escalation handoff
3. Review-state event
4. Assignment event
5. Ticket internal note
6. CRM internal note
7. External customer reply/send — not in this roadmap stage

## Forbidden until future safety approval
- Send reply
- Provider send
- WhatsApp send
- Instagram DM send
- SMS send
- Email send
- Auto-reply
- Call placement
- IVR trigger
- Direct CRM write
- Direct ticket update without confirmation
- Silent assignment
- Any autonomous customer support execution

## Required future backend write contract
Any future write route must include:
- method and route
- request schema
- response schema
- role permission
- confirmation requirement
- audit log event
- error behavior
- idempotency plan where needed
- rollback/compensation policy
- rate limit
- provider safety boundary

## Required future frontend contract
Any future action UI must include:
- disabled-by-default state
- clear locked copy before readiness
- explicit confirmation
- no hidden auto-execution
- no execution from AI draft
- visible result state
- error state
- audit reference display

## 3AL Result
No customer actions were implemented.

This plan establishes the future safe action model.

## Next phase
PHASE 3AM — Messages Section Readiness

Plan-only / audit-only.
No messages route or send action should be implemented in 3AM.
