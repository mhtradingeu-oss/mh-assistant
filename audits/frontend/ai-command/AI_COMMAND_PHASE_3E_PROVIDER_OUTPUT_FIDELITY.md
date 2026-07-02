# AI Command Phase 3E - Provider Output Fidelity

Date: 2026-05-15
Branch: architecture/frontend-consolidation-v1
Mode: Discovery-first with targeted patch

## Scope
- Investigated guidance-only specialist chat response depth.
- Focused on provider output path and transformation chain.
- No UI redesign.
- No customer-operations changes.
- No data/projects changes.
- No task/workflow/handoff/approval execution changes.

## Provider Path Discovered
1. Frontend Ask Specialist action calls guidance API bridge:
   - public/control-center/pages/ai-command.js
   - public/control-center/api.js -> executeProjectAiGuidance()
2. HTTP endpoint:
   - runtime/orchestrator-service/server.js -> /media-manager/project/:project/ai/guidance
3. Guidance execution:
   - runtime/orchestrator-service/lib/ops/ai-orchestrator.js -> executeGuidance()
4. Provider resolution:
   - runtime/orchestrator-service/lib/ai/provider-config.js -> resolveAiProviderConfig()
   - runtime/orchestrator-service/lib/ai/provider-registry.js -> openai -> createOpenAiProvider
5. Provider adapter used by executeGuidance:
   - runtime/orchestrator-service/lib/ai/providers/openai.js

## Real Provider vs Fallback
- executeGuidance uses runtime/orchestrator-service/lib/ai/providers/openai.js via provider registry.
- Provider call is real HTTP to OpenAI chat completions endpoint:
  - POST {baseUrl}/chat/completions
- No local mock/demo fallback is used in executeGuidance provider path.
- media/native providers/adapters are separate media execution adapters and are not used by executeGuidance.

## Discovery Answers
1. Which provider adapter is used by executeGuidance?
- runtime/orchestrator-service/lib/ai/providers/openai.js

2. Does provider.execute call real OpenAI or a local/demo fallback?
- Real OpenAI API call via axios POST to /chat/completions.

3. Does the provider adapter pass the full guidance prompt?
- Yes. executeGuidance builds guidanceCommand from buildGuidancePrompt() and sends it as command in provider.execute payload.

4. Does it limit output tokens too aggressively?
- No explicit max_tokens/max_output_tokens are set in this provider. No hard cap observed in code.

5. Does it ask the model for JSON or summary instead of chat content?
- Yes. It enforces STRICT JSON with response_format json_object.
- This can bias toward compact summaries unless content fidelity is explicitly preserved.

6. Does it transform the answer into summary/recommendations?
- Yes. Normalization can prefer summary-like content when parsed content is short or missing.
- Guidance extraction consumed provider chat_answer/content/summary in that order.

7. Does providerOutput contain the full answer anywhere?
- Often structured output may exist in contentPack/adIdeas.
- Prior implementation could still expose short content/summary, so chat_answer could become shallow even when structured payload had richer material.

8. Is the short German sentence coming from provider or fallback builder?
- Primary cause is provider normalization/output selection path favoring short summary-like text.
- No local demo fallback was identified in executeGuidance path.

## Root Cause
- Provider normalization in runtime/orchestrator-service/lib/ai/providers/openai.js could keep short flat content (or summary-like content) as primary response text.
- Rich structured payloads (contentPack/adIdeas) were not reliably promoted into provider content/chat_answer for guidance chat rendering.

## Patch Applied
Changed file:
- runtime/orchestrator-service/lib/ai/providers/openai.js

What changed:
- Added structured-output-to-text builders for content_pack and ad_ideas.
- Added selection logic to prefer structured content when output type is content_pack/ad_ideas and direct content is short/flat.
- Added explicit chat_answer normalization output from provider.
- Ensured provider.execute returns chat_answer alongside content.

Why:
- Preserve full model answer fidelity for guidance chat.
- Avoid collapsing rich structured outputs into short summary-only chat responses.

## Safety Confirmation
- Guidance-only behavior preserved.
- No operational mutator calls were added to executeGuidance.
- No changes to AI command operational execution path.
- No server route changes.
- No customer-operations changes.
- No data/projects changes.

## Validation Results
Command checks passed:
- node --check runtime/orchestrator-service/lib/ops/ai-orchestrator.js
- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/api.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js
- node --check runtime/orchestrator-service/lib/ai/providers/openai.js

Safety scan result:
- NO_MUTATOR_CALLS_IN_EXECUTE_GUIDANCE

Git status after patch:
- Modified: runtime/orchestrator-service/lib/ai/providers/openai.js
- Added: audits/frontend/ai-command/AI_COMMAND_PHASE_3E_PROVIDER_OUTPUT_FIDELITY.md

## Remaining Follow-ups
- Live-run Ask Specialist with Arabic prompt:
  - "اكتب لي 3 Hooks قصيرة لحملة Beard Kit"
- Verify response now returns concrete numbered hooks in Arabic plus one short next-step suggestion.
- If provider still returns compact output, consider a second small provider prompt refinement requiring content to contain the full direct answer text for guidance mode.
