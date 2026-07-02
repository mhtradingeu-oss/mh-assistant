# T162 — AI Command + AI Team Deep Runtime / UX / Chat Workflow Audit

## Status
Audit started. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Audit AI Command and the AI Team as the heart of the AI Business Operating System.

The goal is to ensure the platform can become a powerful, smart, professional AI Team experience where the user can chat naturally with each specialist, similar to a ChatGPT-style conversation, while still respecting workflow, ownership, Governance, and safe execution boundaries.

## Target Experience
The desired experience is:

- ChatGPT-like chat room
- Specialist-based AI Team
- Natural human-style conversation
- Clear role identity per specialist
- Easy-to-understand interface
- Real workflow handoff
- Strong project context
- Smart tool suggestions
- Safe output routing
- Governance approval for risky actions
- No unsafe direct execution

## Audit Questions

### AI Team Coverage
1. Which specialists already exist?
2. Which specialists are partial or pending?
3. Which specialists are missing?
4. Which roles overlap or should be merged?
5. Which roles are critical for MVP?
6. Which roles belong to future phases?

### Specialist Conversation UX
1. Can the user chat with each specialist separately?
2. Is there a unified AI workspace/chat room?
3. Is the chat close to a natural ChatGPT-style conversation?
4. Does each specialist have a clear personality, role, and scope?
5. Does each specialist know what it can and cannot do?
6. Are conversations persistent, session-based, or only prompt-preview?
7. Can a specialist continue a workflow like a human teammate?

### Workflow Intelligence
1. Can AI convert chat into tasks?
2. Can AI create campaign briefs?
3. Can AI prepare publishing handoffs?
4. Can AI prepare Governance approval packages?
5. Can AI route outputs to Library, Tasks, Campaign Studio, Content Studio, Media Studio, Publishing, Ads Manager, Customer Center, Sales/CRM, and Governance?
6. Are output destinations clear and safe?

### Runtime Authority
1. Is AI Command read-only, draft-only, handoff-only, or execution-capable?
2. Which actions mutate backend state?
3. Which actions trigger providers?
4. Which actions only prepare a draft?
5. Which actions require confirmation?
6. Which actions require Governance approval?

### Safety Boundaries
AI Team must not:
- publish directly
- send customer messages directly
- mutate CRM directly
- approve Governance decisions directly
- override Governance gates
- execute providers without confirmation
- invent unsupported claims
- bypass source/evidence requirements

### Tooling + Intelligence
Audit whether the system supports or should support:
- role-specific prompt templates
- source-aware responses
- project context
- Library grounding
- workflow handoff
- approval package generation
- provider routing
- tool recommendations
- task creation handoff
- campaign/content/media/publishing handoff
- customer reply draft handoff
- CRM/sales handoff
- analytics/insights review
- knowledge/source return flow

## Expected Source Areas
Primary:
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

Related:
- `public/control-center/pages/ai-command/`
- `public/control-center/api.js`
- `public/control-center/app.js`
- `public/control-center/router.js`
- `runtime/orchestrator-service/server.js`

## Risk Classification
Very High.

AI Command can become the central AI operating surface. It must be architected carefully before more power is added.

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
- AI Team role inventory
- specialist capability map
- missing/pending specialist recommendation
- ChatGPT-like conversation UX assessment
- runtime authority classification
- provider/tool boundary classification
- Governance handoff assessment
- output destination map
- current UI/UX risks
- recommended next phases
