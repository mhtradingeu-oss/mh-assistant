# Patch Plan

## Exact Files
1. public/control-center/pages/ai-command.js
2. public/control-center/pages/ai-command/tool-dock.js

## Exact Changes
- AI Command Strategist copy uplift:
  - strategist summary in MODE_DEFS
  - strategist position/summary/placeholder/canHelp in SPECIALIST_DEFS
  - strategist suggested prompt chips in SPECIALIST_SUGGESTED_PROMPTS
- Tool Dock Strategist clarity uplift:
  - labels: Build Strategy, Plan Launch, Define Audience, Offer Angles, Funnel Map, Next Move
  - templates aligned to Campaign Brief / launch waves / audience map language

## Why Safe
- No behavior changes, IDs unchanged, safety levels unchanged.
- No new routes, no backend/provider/workflow execution changes.
- Frontend-only, tiny diff, no CSS changes.

## Not Touched
- campaign-studio.js logic
- ai-team-model.js
- shared-context.js
- runtime/orchestrator-service and backend execution layers
