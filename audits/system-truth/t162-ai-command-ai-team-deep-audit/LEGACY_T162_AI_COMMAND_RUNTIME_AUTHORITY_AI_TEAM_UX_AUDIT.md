# T162 — AI Command Runtime Authority + AI Team UX Audit

## Status
Audit started. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Establish the current runtime authority, safety boundaries, AI Team UX role, provider execution risk, and Governance handoff model for AI Command before any improvement.

AI Command is the heart of the AI Business Operating System. It must be audited before adding more AI Team power or visual polish.

## Core Questions
1. Is AI Command read-only, draft-only, handoff-only, or execution-capable?
2. Which actions can mutate backend state?
3. Which actions can trigger providers or external integrations?
4. Which actions require Governance approval?
5. Which outputs go to Library, Tasks, Campaign Studio, Publishing, Customer Center, or other surfaces?
6. What is the current AI Team role model?
7. Does the UI clearly separate:
   - advice
   - draft
   - handoff
   - approval request
   - execution
8. Does AI Command currently prevent direct unsafe mutation?
9. Does AI Command expose enough context for professional AI Team work?
10. What must be improved before calling it production-grade?

## Expected Source Areas
Primary:
- `public/control-center/pages/ai-command.js`

Possible related modules:
- `public/control-center/pages/ai-command/`
- `public/control-center/api.js`
- `public/control-center/app.js`
- `public/control-center/router.js`
- `runtime/orchestrator-service/server.js`

## Risk Classification
Expected risk: Very High.

AI Command may touch:
- AI execution
- provider routing
- generated content
- project memory/context
- task creation
- campaign handoff
- publishing preparation
- customer operations handoff
- governance approvals
- external integrations

## Forbidden During T162
No JS changes.
No CSS changes.
No backend changes.
No API changes.
No route changes.
No data/projects changes.
No provider execution behavior changes.
No AI execution behavior changes.
No mutation behavior changes.
No visual polish.

## Required Output
T162 must produce:
- runtime authority classification
- AI Team role/UX classification
- provider/execution boundary classification
- Governance handoff assessment
- output destination map
- current UI risk notes
- recommended next phase
