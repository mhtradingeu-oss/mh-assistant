# PHASE 3AM — Customer Messages Section Readiness

## Status
Plan-only / audit-only.

No implementation in this phase.

## Baseline
Closed before this phase:
- 3AI.6 — Customer Center Protected-Read UX Safe Patch
- 3AI.7 — Browser QA Closeout
- 3AI.8 — Safe UX Patch Closeout
- 3AI.9 — Sub-Routes Readiness Audit
- 3AJ — Read-Only Live Key QA Guard Check
- 3AK — Customer Mutation Safety Audit
- 3AL — Customer Actions Plan

## Purpose
Define readiness requirements for a future Messages section inside Customer Center.

This phase does not create:
- a Messages route
- a Messages tab
- a send action
- a reply action
- a provider send action
- any backend write route

## Current state
The system already has read-only customer message/conversation projection references.

Current permitted model:
- Read conversation list
- Read conversation detail
- Read messages projection
- Show masked/truncated context
- Prepare AI draft/guidance handoff

Current forbidden model:
- Send reply
- Provider send
- WhatsApp send
- Instagram DM send
- SMS send
- Email send
- Auto-reply
- Mark message reviewed
- Mutate conversation state
- Assign conversation

## Messages readiness requirements

### 1. Read-only projection contract
A future Messages section must first define:
- conversation id
- channel
- direction
- timestamp
- sender display/masked identity
- subject/summary
- preview text
- message body truncation policy
- attachment policy
- sentiment or priority if available
- SLA/escalation hints if available

### 2. Privacy / GDPR boundary
Before displaying messages, define:
- masking policy
- personal data minimization
- retention policy
- export/delete implications
- no sensitive data leakage in AI prompts
- audit boundary for viewed customer data

### 3. AI draft boundary
AI may:
- summarize messages
- detect risk/escalation
- draft safe reply text
- suggest follow-up questions
- prepare handoff to Task Center or Governance

AI must not:
- send replies
- update CRM
- close tickets
- assign conversation
- contact provider
- trigger auto-reply

### 4. Future send readiness
Before any send action exists, require:
- backend send route design
- provider contract
- channel-specific validation
- role permission check
- confirmation gate
- audit log
- rate limit
- template safety
- compliance review for regulated claims
- human approval requirement
- rollback/failure behavior
- no autonomous execution default

### 5. UI readiness
A future Messages section must:
- show read-only badge
- show channel/source label
- show masked customer identity
- show disabled send/reply controls until write readiness passes
- explain why sending is locked
- keep AI as draft-only
- expose safe handoffs only

## Recommended implementation order
1. Keep current Customer Center overview.
2. Add internal Messages section only after live-key read-only projection QA passes.
3. Do not add separate route first.
4. Start with read-only conversation/message preview.
5. Add AI summary/draft handoff only.
6. Add send readiness audit later as a separate phase.
7. Do not implement send in 3AM.

## Forbidden until future approval
- POST/PATCH/PUT/DELETE customer message routes
- send reply
- provider send
- WhatsApp send
- Instagram DM send
- SMS send
- email send
- auto-reply
- autonomous support execution

## Validation required
- No customer mutation routes.
- No provider send routes.
- No frontend send handlers.
- No route/sidebar changes.
- Existing Customer Center remains read-only.
- Node syntax validation passes.

## Result
3AM defines future Messages readiness only.

No code implementation is allowed in this phase.

## Next phase
PHASE 3AN — CRM Readiness + Provider Contract

Plan-only / audit-only.
