# T185C.5D1 — Preview-Only Backend Endpoint

## Status
Implemented as backend preview-only endpoint.

## Endpoint
- `POST /api/ai-command/project/:project/campaign-preview`

## Contract
The endpoint returns a `smart_campaign_preview` payload for AI Command Campaign Builder.

## Safety Boundary
This endpoint does not:
- create tasks
- create approvals
- create durable handoffs
- publish
- send messages
- mutate CRM
- execute providers
- write workflow runs
- write campaign records
- change governance state
- change publishing state
- change media job state

## Implementation Decision
The endpoint intentionally does not call `ai-orchestrator.js` yet because that module contains legitimate execution paths for task, approval, and handoff creation.

This phase keeps backend preview generation independent and mutation-free.

## Public Route Decision
No `/public/...` POST alias is exposed in this phase. Even though the endpoint is preview-only, public POST aliases can be classified by the security layer as mutation aliases. The frontend adapter should use the canonical `/api/...` endpoint.
