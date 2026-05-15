# AI Command Phase 3C - Response Quality and Language Control

## Summary
Phase 3C improves Specialist Conversation response quality by preserving raw provider-generated text before normalized summaries. It also strengthens prompt controls so specialist guidance produces concrete requested items in the same language as the user.

## Files changed
- runtime/orchestrator-service/lib/ops/ai-orchestrator.js
- audits/frontend/ai-command/AI_COMMAND_PHASE_3C_RESPONSE_QUALITY_AND_LANGUAGE_CONTROL.md

## Why response quality was weak
In Phase 3B guidance execution, `response_text` was derived from normalized output (`response.content`, `response.summary`, `response.analysis`, `response.title`) after `buildResponseFromContext`.
That could shorten or generalize richer provider output.

## What was changed
1. Added a local helper: `extractGuidanceProviderText(providerOutput, response)`.
2. Updated `executeGuidance` to set `response_text` from provider output first, then normalized fallback.
3. Updated `buildGuidancePrompt` instructions to require concrete deliverables and stricter language/output behavior.

## Raw provider output preservation
`response_text` now prefers this order:
1. `providerOutput.content`
2. `providerOutput.summary`
3. `providerOutput.text`
4. `providerOutput.output`
5. `providerOutput.message`
6. `providerOutput.raw.content`
7. `providerOutput.raw.text`
8. `providerOutput.raw.output`
9. `providerOutput.raw.message`
10. fallback: `response.content`
11. fallback: `response.summary`
12. fallback: `response.analysis`
13. fallback: `response.title`

`buildResponseFromContext` was kept and is still used for structured metadata (`sections`, `routeSuggestions`, and response structure).

## Language control
Prompt guidance is stronger and explicit:
- Match user language exactly.
- Produce the exact requested items when asked (hooks, captions, scripts, emails, headlines, tasks, workflow steps, checklists).
- Do not explain what would be done.
- Do not answer with generic summary output.
- Provide ready-to-copy practical output.

## Specialist behavior improvements
`buildGuidancePrompt` now adds specialist-specific instruction:
- Content Writer: generate actual copy.
- Video Lead: generate hook/script/storyboard beats.
- Strategist: produce prioritized strategic plan.
- Compliance Reviewer: provide risk checklist and safer wording.
- Operations Lead: provide task/workflow draft steps only, no execution.

## Safety confirmation
No operational side effects were added.
Phase 3B safety behavior remains intact:
- no task/workflow/handoff/approval creation
- no publishing
- no governance mutation
- no durable operational state mutation

## Validation results
Executed:
- `node --check runtime/orchestrator-service/lib/ops/ai-orchestrator.js`
- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result: all checks passed (no syntax errors).

## Follow-up items
1. Add focused unit coverage for `extractGuidanceProviderText` precedence behavior.
2. Add response-quality regression checks for specialist prompt classes (writer, video lead, strategist, compliance, operations).
3. Optionally capture token-level provider output quality metrics in non-operational telemetry only.
