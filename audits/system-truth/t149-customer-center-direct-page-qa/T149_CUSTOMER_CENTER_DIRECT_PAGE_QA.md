# T149 — Customer Center Direct Page QA

## Status
Manual Browser QA required.

## Baseline
- 443a38e Add safe local Control Center runner

## Runtime URL
- http://127.0.0.1:3000/control-center/#customer-center

## Purpose
Verify the Customer Center page itself after app-shell browser load recovery.

## Must verify

1. Direct route `#customer-center` loads Customer Center.
2. Header/title clearly says Customer Center.
3. Page clearly communicates protected-read / read-only mode.
4. No fake customer placeholder records appear.
5. Inbox section is understandable.
6. Conversation preview section is understandable.
7. Tickets/SLA section is understandable.
8. Channel readiness section is understandable.
9. Locked actions are visible and explained.
10. Action Panel buttons are preparation/handoff only.
11. AI Panel says AI can summarize/draft guidance only.
12. Refresh reloads read-only data only.
13. AI handoff requires confirmation and opens AI Command only.
14. Task/Governance handoffs require confirmation and navigate only.
15. No button implies live send, reply, CRM write, ticket update, assignment, call, IVR, provider sync, auto-reply, or autonomous AI execution.
16. No console SyntaxError.
17. No blocking runtime crash.
18. No obvious layout overlap or unreadable critical copy.

## Hard Constraints
No backend changes.
No API changes.
No route changes.
No data/projects changes.
No customer send behavior.
No CRM write behavior.
No ticket update behavior.
No assignment write behavior.
No call/IVR behavior.
No provider execution behavior.
No AI execution behavior.

## Evidence to add manually
- Browser:
- Runtime status:
- Observed route:
- Console result:
- Visual result:
- Issues found:
- Screenshot path, if captured:
- Decision:
