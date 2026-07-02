# P2.3 — Runtime State Boundary Contract

## Doctrine
Frontend state is projection/runtime state only.
Backend owns operational authority.

## state.js may own
- selected/current project
- loaded project payload
- operations snapshot
- active route snapshot
- active role projection
- UI-safe system health snapshot

## shared-context.js may own
- transient cross-page draft hints
- AI draft prefill before durable save
- temporary handoff hints
- navigation intent payloads

## page sessions may own
- visible filters
- selected item/card/tab
- form drafts before save
- upload progress
- local validation message
- local loading indicator

## runtime modules may own
- overlay state
- command bar state
- shell measurements
- diagnostic state

## frontend must not own
- route permission source of truth
- approval authority
- workflow execution authority
- governance policy
- durable handoff lifecycle
- AI team authority
- publishing guardrail authority

## migration rule
Any state movement must be:
1. audited
2. classified
3. shadow-compatible
4. rollback-safe
5. committed separately
