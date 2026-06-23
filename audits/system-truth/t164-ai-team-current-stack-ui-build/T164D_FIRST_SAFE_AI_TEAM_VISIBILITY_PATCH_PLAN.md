# T164-D — First Safe AI Team Visibility Patch Plan

## Status
Plan only. No implementation.

## Goal
Make AI Command visibly feel like an AI Team Command Center without changing execution behavior.

## Patch Scope
Allowed:
- AI Command UI markup/copy improvements
- existing data projection
- visible AI Team state summary
- visible authority/risk/governance/source/destination chips
- better empty-state wording
- better handoff preview language

Forbidden:
- backend changes
- API changes
- route changes
- data/projects changes
- provider execution
- publishing/send/CRM/workflow mutation
- new autonomous AI execution
- duplicate specialist definitions

## Candidate UI Additions
1. AI Team State Strip
2. Active Specialist Card
3. Team Mode / Single Mode indicator
4. Output Type indicator
5. Risk / Governance badge
6. Source Grounding badge
7. Destination / Handoff badge
8. Next Best Action hint

## Success Criteria
The user can immediately understand:
- who is helping
- what the AI is preparing
- where the output should go
- whether governance is needed
- that no execution happened yet

## Next Step
Run source excerpts for AI Command render sections, then implement the smallest safe UI-only patch.
