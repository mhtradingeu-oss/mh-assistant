# P2.2 — Runtime State Classification

## Canonical frontend state
Belongs in state.js:
- currentProject
- activeRoute
- activeRole projection
- loaded project data
- operations snapshot
- system health snapshot

## Transient bridge state
Allowed in shared-context.js:
- AI drafts before persistence
- handoff hints before backend confirmation
- cross-page navigation context
- temporary prefill payloads

## Page-local state
Allowed inside page sessions:
- selected tab
- selected card/item
- filters
- search text
- upload progress
- form draft before save
- local UI messages

## Backend authority state
Must not be owned by frontend:
- route permissions
- approvals
- workflow ownership
- governance policy
- handoff lifecycle
- AI team authority
- publishing guardrails

## Compatibility debt
Needs future consolidation:
- page-level session maps
- localStorage drafts
- duplicate loading flags
- direct document/window listeners
- shared-context handoff cache
- workflow/publishing automation runtime state
