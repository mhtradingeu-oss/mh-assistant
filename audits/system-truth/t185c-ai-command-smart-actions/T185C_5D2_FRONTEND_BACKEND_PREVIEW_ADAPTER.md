# T185C.5D2 — Frontend Backend Preview Adapter

## Status
Implemented as frontend adapter with local fallback.

## Scope
AI Command Campaign Builder now attempts to call the backend preview-only endpoint:
- `POST /api/ai-command/project/:project/campaign-preview`

If the backend is unavailable, blocked, or does not confirm preview-only safety, the existing local preview builder remains the fallback.

## Safety Boundary
The frontend accepts a backend preview only when the response confirms:
- `safety.preview_only`
- `safety.no_backend_mutation_performed`
- `safety.no_provider_execution_performed`

The frontend still does not:
- publish
- send messages
- mutate CRM
- create tasks
- create approvals
- create durable handoffs
- execute providers
- run workflows

## UX Behavior
- Successful backend preview: shows backend AI Team preview.
- Failed backend preview: keeps the current local preview path.
- Destination handoff remains user-triggered and destination-owned.
