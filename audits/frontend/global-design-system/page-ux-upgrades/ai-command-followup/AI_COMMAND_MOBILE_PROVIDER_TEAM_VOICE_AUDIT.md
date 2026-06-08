# AI Command Follow-up Audit — Mobile / Provider / Team Runtime / Voice

## Status

Audit started.

## Trigger

Browser QA after AI Command international UX upgrade identified four follow-up areas:

1. Mobile/small viewport shows too many sections before the composer.
2. AI Team did not respond during QA.
3. Some team members remain planned lanes rather than active specialists.
4. Voice conversation is not confirmed as an implemented capability.

## Safety Rule

No implementation in this audit.

## Questions To Answer

### Mobile Composer UX

- Should composer appear earlier on mobile?
- Which sections should collapse or move below composer?
- Can this be solved with scoped CSS only?

### Provider Readiness

- Is `executeProjectAiChat` connected?
- Is the route blocked by Governance approval?
- Is the provider/API key missing?
- Is backend route returning an error or an approval record?

### Team Runtime

- Are planned specialists intentionally not active?
- Does Full Team mode actually orchestrate multiple specialist prompts or only changes label/context?
- What is safe to expose as active today?

### Voice Capability

- Is there browser mic capture code?
- Is there STT/TTS/realtime provider support?
- Is there a backend route for voice?
- Should voice remain planned until a capability pass exists?

## Current Rule

Do not change:
- backend/API
- data/projects
- app/router
- AI chat execution behavior
- specialist runtime behavior
- voice UI/behavior

