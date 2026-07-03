# Phase 13 Execution Authority Classification Matrix

## Classification fields

| Field | Meaning |
|---|---|
| Surface | Backend/frontend/AI Command/page involved |
| Route/action | Endpoint or action |
| Method | GET/POST/PATCH/PUT/DELETE or local write |
| Risk | Low/Medium/High/Critical |
| Existing protection | read key/write key/confirm/approval/governance/none/unknown |
| AI Command reachable? | yes/no/indirect/unknown |
| Frontend reachable? | yes/no/unknown |
| Provider execution? | yes/no/unknown |
| Mutation? | yes/no |
| Verdict | safe / safe with notes / needs follow-up / blocker |

## Initial categories to classify

| Category | Expected routes/actions | Initial risk |
|---|---|---|
| Native media generation | native-media/generate | High/Critical |
| Publishing schedule | publishing/schedule | High |
| Publishing ready/approval | publishing/:jobId/ready | High/Critical |
| Publishing reschedule | publishing/:jobId/reschedule | High |
| Integration connect/reconnect | integrations/:id/connect/reconnect | Critical |
| Integration sync/test/import | integrations/:id/sync/test/import-history | High |
| Integration disconnect | integrations/:id/disconnect | Critical |
| Workflow run writes | recordWorkflowRun / workflow run routes | High |
| Task creation | createTask / task write routes | Medium/High |
| Approval creation/approval | createApproval / approve routes | High/Critical |
| Handoff creation | createHandoff / handoff writes | Medium/High |
| Customer operations mutations | replies/tickets/messages/CRM writes | Critical |
| AI Command execution | AI-triggered backend execution | Critical |

## Safety expectation before live expansion

Any action that can publish, send, connect, disconnect, sync, generate provider output, mutate CRM/tickets/tasks/workflows, or approve must have:
- explicit owning surface
- confirmation gate
- backend write protection
- audit log
- governance/approval rule where relevant
- no silent AI Command auto-execution
