# AI Command Phase 3D - Smart Specialist Chat Mode

Date: 2026-05-15
Branch: architecture/frontend-consolidation-v1
Mode: Controlled patch only (no authority mutation)

## Summary

Phase 3D upgrades Ask Specialist from generic guidance phrasing toward real specialist-chat behavior.

Key outcomes:
- Added explicit `chat_answer` output path in guidance response payload.
- Preserved `response_text` and existing `response`/`sections` metadata.
- Strengthened live-chat prompt instructions to require direct, practical, same-language output.
- Improved frontend extraction order to prefer `chat_answer`.

No workflow/task/handoff/approval/publish mutations were enabled.

## Why previous answer was weak

Phase 3C improved text extraction but still returned `response_text` only and relied on generalized response shaping.
That made some answers feel like summaries instead of direct conversational specialist output, especially for concrete requests such as "write 3 hooks".

The missing contract was a dedicated chat field carrying the best conversational answer path.

## Files inspected

- runtime/orchestrator-service/lib/ops/ai-orchestrator.js
- public/control-center/pages/ai-command.js
- public/control-center/api.js
- audits/frontend/ai-command/AI_COMMAND_PHASE_3C_RESPONSE_QUALITY_AND_LANGUAGE_CONTROL.md
- audits/frontend/ai-command/AI_TEAM_CONTROLLER_FINAL_UX_AND_KNOWLEDGE_AUDIT.md

Discovery checks included:
- `buildGuidancePrompt`
- `extractGuidanceProviderText`
- `executeGuidance`
- `provider.execute`
- `buildResponseFromContext`
- `response_text`
- `response`
- `sections`
- `extractGeneratedResponseText`
- `buildSpecialistChatPrompt`
- specialist/language fields

## Files changed

- runtime/orchestrator-service/lib/ops/ai-orchestrator.js
- public/control-center/pages/ai-command.js
- audits/frontend/ai-command/AI_COMMAND_PHASE_3D_SMART_SPECIALIST_CHAT_MODE.md

## Chat answer model

### Backend response contract

`executeGuidance` now returns:
- `chat_answer`
- `response_text`

For Phase 3D, `response_text` mirrors `chat_answer`.

Existing metadata remains intact:
- `response`
- `sections`
- `bullets`
- `provider`
- `safety_label`
- `side_effects`

### Extraction strategy

New helper path uses conversational-first extraction before normalized summaries.
The model now prefers provider chat-like output candidates and then falls back to normalized response fields.

## Language control

`buildGuidancePrompt` is now explicit about live-chat behavior and language lock:
- answer inside a live specialist chat
- answer directly to the user
- match user language exactly
- Arabic request => Arabic answer
- German request => German answer
- if user asks for N items, return exactly N items

It also explicitly forbids generic task-summary behavior:
- do not summarize task
- do not say "I can create" / "I would create"
- generate actual requested output now
- add one short next-step suggestion only after delivering requested output

## Specialist behavior improvements

Prompt rules were tightened per specialist:
- Content Writer: return actual hooks/captions/CTA/emails/scripts/landing copy, never description-only.
- Video Lead: return actual hooks/script/storyboard beats/shot-list style output.
- Strategist: return practical priority plan with positioning and ordered next moves.
- Operations Lead: return draft checklist/task/workflow steps only, no execution claims.
- Compliance Reviewer: return concrete risks, safer wording replacements, and approval notes.

## Frontend extraction improvements

`extractGeneratedResponseText` now prefers:
1. `response.chat_answer`
2. `response.response_text`
3. `response.content`
4. `response.summary`

Then it falls back to analysis/title and bullets/sections logic.

When Ask Specialist receives guidance result, `result.chat_answer` is explicitly passed into extraction.

## Safety confirmations

Confirmed in this patch:
- No mutator calls were added inside `executeGuidance`.
- No task/workflow/handoff/approval/publish creation from guidance path.
- No server route modifications.
- No changes in `data/projects`.
- No customer-operations file changes.

## Validation results

Executed:
- `node --check runtime/orchestrator-service/lib/ops/ai-orchestrator.js`
- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Safety scan executed:
- `awk '/async executeGuidance\(/,/^    executeWorkflow\(/ {print}' runtime/orchestrator-service/lib/ops/ai-orchestrator.js | rg "createTask\(|recordWorkflowRun\(|createApproval\(|createHandoff\(|createAiArtifact\(|upsertAiMemory\(|createAiRecommendation\(" && echo "MUTATOR_FOUND" || echo "NO_MUTATOR_CALLS_IN_EXECUTE_GUIDANCE"`

Result expectations for Phase 3D:
- Syntax checks pass.
- Safety scan prints `NO_MUTATOR_CALLS_IN_EXECUTE_GUIDANCE`.

## Follow-up UI redesign recommendation

For full Phase 4 UX quality, keep this backend/frontend chat contract and then refine presentation only:
1. Display explicit "chat answer" label in Specialist Conversation card.
2. Add lightweight formatter presets by specialist (writer/video/strategist/compliance/operations).
3. Keep safety badge persistent in chat card.
4. Defer broader UI redesign until role model unification work is approved.
