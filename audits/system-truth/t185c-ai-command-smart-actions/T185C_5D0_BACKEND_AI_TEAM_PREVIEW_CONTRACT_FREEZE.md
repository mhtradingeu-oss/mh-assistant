# T185C.5D0 — Backend AI Team Preview Contract Freeze

## Status
Contract frozen. No runtime backend code changed in this phase.

## Reason
The frontend Campaign Wizard and destination handoff loop are now complete through:
- T185C.5A Smart Action Wizard Foundation
- T185C.5B Campaign Preview Quality
- T185C.5C1 Safe Media/Publishing Handoff Routing
- T185C.5C2 Premium Destination Intake
- T185C.5C3 Local AI Command Handoff Intake Polish

The next backend step must not bypass the review-first architecture.

## Backend Truth
The backend already contains powerful execution and write capabilities, including:
- AI orchestration
- OpenAI provider output contracts
- campaign package generation concepts
- operations plans
- task creation
- approval creation
- durable handoff creation
- provider write scopes
- route security and mutation enforcement

Because those capabilities can write durable state, create approvals, create tasks, or create handoffs, the Campaign Wizard backend connection must be preview-only first.

## Frozen Contract

### Endpoint Intent
The first backend-owned Campaign Wizard endpoint must generate a review-ready AI Team campaign preview only.

### Allowed
- read project context
- read selected source metadata
- build campaign package preview
- return structured campaign package
- return suggested destination handoffs as suggestions only
- return safety warnings
- return missing inputs
- return approval requirements as informational flags

### Forbidden
The preview endpoint must not:
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
- claim execution occurred

## Required Response Shape

The response should include:

```json
{
  "type": "smart_campaign_preview",
  "source": "backend_ai_team",
  "title": "",
  "summary": "",
  "source_type": "",
  "goal": "",
  "channel": "",
  "campaignPackage": {
    "concept": "",
    "targetAudience": "",
    "offer": "",
    "products": [],
    "channels": [],
    "launchPhases": [],
    "contentAngles": [],
    "adAngles": [],
    "requiredAssets": [],
    "missingBlockers": [],
    "nextActions": [],
    "suggestedHandoffs": []
  },
  "sections": [],
  "safety": {
    "preview_only": true,
    "requires_approval_before_publish": true,
    "no_backend_mutation_performed": true,
    "no_provider_execution_performed": true
  }
}
```

## Frontend Contract
AI Command may call this endpoint only to replace the current local preview builder with a backend-owned preview result.

AI Command must continue to:
- show preview first
- stage or hand off only after user action
- keep Media Studio / Publishing as owning surfaces
- keep Governance / Operations / Library durable writes deferred until explicit contracts are verified

## Product Decision
T185C.5D should be split:

1. T185C.5D0 — contract freeze and safety boundary.
2. T185C.5D1 — implement preview-only backend endpoint.
3. T185C.5D2 — frontend adapter to use backend preview when available, with local fallback.
4. T185C.5D3 — backend closeout tests and audit.

No durable backend write is allowed in T185C.5D1.
