# AI Command Phase 3B — Guidance-only Specialist AI Response Endpoint

## Summary
Phase 3B implemented a dedicated guidance-only specialist response path for AI Command Ask Specialist.
The previous durable AI command endpoint (`POST /media-manager/project/:project/ai/command`) remains unchanged.
A new guidance endpoint was added and wired to Ask Specialist so generated responses can be shown without creating operational records.

## Discovery findings
Mandatory discovery was completed before edits.

### Existing paths inspected (mandatory)
- `public/control-center/pages/ai-command.js`
- `public/control-center/api.js`
- `public/control-center/shared-context.js`
- `public/control-center/state.js`
- `public/control-center/app.js`
- `public/control-center/router.js`
- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/ops/ai-orchestrator.js`
- `runtime/orchestrator-service/lib/ops/backbone.js`
- `runtime/orchestrator-service/lib/ai/provider-config.js`
- `runtime/orchestrator-service/lib/ai/provider-registry.js`
- `runtime/orchestrator-service/lib/ai/providers/openai.js`
- `runtime/orchestrator-service/lib/media/native/*` (directory-level inspection for related capabilities)
- `audits/frontend/ai-command/`
- `audits/runtime-governance/`
- `audits/frontend/master/`

### Key discovery conclusions
- Existing route: `POST /media-manager/project/:project/ai/command` calls `executeCommand`.
- Existing `executeCommand` persists and mutates durable entities:
  - creates AI artifact
  - upserts AI memory
  - creates recommendations
  - may create task/workflow run/approval
  - may create handoff
  - writes AI command record
- No existing safe guidance-only route was found in server routes.
- No existing guidance-only orchestration function was found in `ai-orchestrator.js`.

## Decision (A/B/C)
Decision: **Option B**

Reason:
- A near-safe existing implementation exists: provider execution and response normalization inside `runtime/orchestrator-service/lib/ops/ai-orchestrator.js`.
- It was extended minimally with a dedicated guidance-only method (`executeGuidance`) that reuses provider/context logic but intentionally performs no durable mutations.
- Existing durable command behavior (`executeCommand`) was not changed.

## Files changed
- `runtime/orchestrator-service/lib/ops/ai-orchestrator.js`
- `runtime/orchestrator-service/server.js`
- `public/control-center/api.js`
- `public/control-center/app.js`
- `public/control-center/pages/ai-command.js`
- `audits/frontend/ai-command/AI_COMMAND_PHASE_3B_GUIDANCE_ONLY_RESPONSE_ENDPOINT.md`

## Backend route/function behavior
### New route
- `POST /media-manager/project/:project/ai/guidance`
- `POST /public/media-manager/project/:project/ai/guidance`

### Orchestrator function
- `executeGuidance(projectName, input)`
- Accepts:
  - `project`
  - `specialistId`
  - `specialistName`
  - `mode` (`solo` or `team`)
  - `request` / `prompt`
  - `language` (or inferred from prompt)
  - `contextSummary`
  - `safetyInstruction`
- Returns:
  - `status`
  - `response_text`
  - `specialist`
  - `provider` info (`id`, `model`, `usage`)
  - `timestamp`
  - `safety_label`
  - `bullets`
  - `sections`
  - structured `response`

## Frontend API wrapper behavior
Added in `public/control-center/api.js`:
- `executeProjectAiGuidance(projectName, payload)`
- Calls `POST /media-manager/project/:project/ai/guidance`
- Existing `executeProjectAiCommand` is unchanged.

## AI Command Ask Specialist behavior
Updated in `public/control-center/pages/ai-command.js`:
- Ask Specialist now uses `executeProjectAiGuidance`.
- Sends specialist context, team mode, prompt, language, context summary, and safety instruction.
- Keeps loading and error states visible.
- Writes response history only on successful API response.
- Does not synthesize fake specialist content on API failure.
- Safety copy when connected:
  - "Guidance only — no workflow/task/handoff was created."

## Safety guarantees
Guidance path is explicitly non-operational:
- no task creation
- no workflow run creation
- no handoff creation
- no approval creation
- no publish action
- no governance mutation
- no AI memory persistence
- no AI artifact persistence
- no durable operational state mutation

## Explicit list of side effects prevented
Returned side-effect guard flags in guidance response:
- `created_task: false`
- `created_workflow: false`
- `created_handoff: false`
- `created_approval: false`
- `published: false`
- `persisted_memory: false`
- `persisted_artifact: false`
- `mutated_operations: false`

## Whether real AI response is enabled
Yes.
Ask Specialist is now connected to a real backend guidance-only AI response route.

## Error handling
- Backend guidance route returns structured failure payload with status/error/safety label.
- Frontend surfaces errors in Specialist Conversation panel and keeps retry path available.
- No fallback fake response is created if backend fails.

## Validation results
Executed:
- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `node --check runtime/orchestrator-service/server.js`
- `node --check runtime/orchestrator-service/lib/ops/ai-orchestrator.js`

Result: all checks passed with no parse errors.

## Known follow-up items
- Add integration tests for `POST /media-manager/project/:project/ai/guidance` side-effect guarantees.
- Add contract tests asserting no backbone mutators are called by guidance execution path.
- Optionally add UI display chips for provider/model and `safety_label` in the Specialist Conversation card.
