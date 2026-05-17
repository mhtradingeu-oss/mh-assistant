# MH-OS Customer And Voice Operations Model

Status: Canonical target model with current/planned boundaries
Created: 2026-05-17

## Purpose

Customer Operations extends MH-OS into customer service, customer history, tickets, SLA, escalations, sales/CRM, outreach drafts, and voice/IVR channels.

It is not a standalone customer service product. It must reuse MH-OS governance, AI Team routing, workflow operations, escalation, approvals, and backend authority.

## Current Evidence Boundary

Current evidence supports:

- A canonical Customer Operations architecture.
- Runtime-level read-only readiness snapshot reporting channel and customer-ops counts.
- Draft-only Customer Operations and Sales/CRM support inside AI Team.
- Relationship to Operations Centers, AI Team context, integrations readiness, and future dedicated Customer Operations surface.

Current evidence does not prove production-ready sending customer replies, creating tickets from UI/AI Team, changing SLA, triggering escalations, syncing integrations from the Customer Ops snapshot, a dedicated Customer Operations frontend route, or a dedicated IVR/Voice execution route.

Until proven otherwise, customer-facing actions are draft-only, planned, or require human approval.

## Core Customer Operations Domains

| Domain | Purpose | Current status |
| --- | --- | --- |
| Unified Inbox | Gather customer messages from supported channels. | Target model; readiness snapshot can count inbox entries. |
| Conversation Workspace | Inspect message thread, customer context, drafts, and handoff state. | Planned/dedicated surface not confirmed. |
| Ticket Center | Track support issues, status, owner, priority, and resolution. | Target model; ticket count can be projected read-only. |
| Reply Drafts | AI prepares customer-safe response drafts. | Supported as draft-only AI Team concept. |
| SLA | Track deadlines, risk, and escalation triggers. | Read-only counts exist; mutation/change not proven. |
| Escalations | Route sensitive/high-risk customer issues to human or governance. | Target model; triggering escalation is not proven from current snapshot. |
| Customer History | Timeline of messages, tickets, orders, profile data, and prior decisions. | Target model; dedicated UI not confirmed. |
| Sales / CRM | Lead qualification, outreach drafts, CRM summaries, sales handoffs. | Draft-only AI Team support; CRM mutation not connected. |
| Voice / IVR | Calls, transcripts, intents, transfers, summaries, follow-up tasks. | Target model; production execution not confirmed. |

## Customer Ops AI Specialist

The Customer Operations Lead helps with summarizing customer threads, drafting customer replies, creating ticket drafts, checking SLA risk, preparing escalation drafts, preparing customer profile snapshots, and routing support/sales/operations context.

Safety: these are draft and review activities unless a future audited handler exists.

## Sales / CRM Handoff

Sales/CRM handoffs should be used when customer context becomes commercial context: lead qualification, dealer/salon/outreach plan, influencer lead plan, follow-up sequence draft, pipeline next-step recommendation, and CRM profile summary.

No CRM stage mutation, outreach send, follow-up scheduling, or contact enrichment execution should happen without explicit approved handlers and confirmation.

## IVR / Voice As A Channel

IVR/Voice is a channel inside Customer Operations. It should produce transcripts, intent, customer/order lookup context where available, AI draft responses, transfer recommendations, call summaries, and follow-up task drafts.

Voice does not bypass text/customer safety rules. Human approval is required before customer-facing responses until the phase proves audited send/voice handlers.

## Relationship To Operations Centers

Operations Centers should project customer operations readiness and work items when connected: customer-related tasks, escalation queues, SLA risk notifications, integration readiness, follow-up jobs, and operational alerts.

Operations Centers monitor and route. They do not become the customer conversation UI unless explicitly designed for that phase.

## Relationship To AI Team

AI Team can analyze customer context, draft replies/tickets/escalations/sales handoffs, choose Customer Ops Lead or Sales / CRM Lead, and route to Workflows, Task Center, Operations Centers, or future Customer Operations pages.

AI Team cannot currently send the customer reply, create the ticket as a durable customer record from planned AI Team controls, change SLA, trigger escalation, or mutate CRM.

## Safety Rules

- No automatic mass outreach without approval.
- Prefer official APIs over scraping-first architecture.
- Track source/provenance for every lead and customer record.
- Add opt-out and do-not-contact support before outreach execution.
- Human approval is required for sensitive replies.
- Backend owns authority; frontend projects state and actions.
- Reuse existing governance, escalation, operations, and AI Team systems.
- Keep Customer Operations stashes untouched unless the Customer Operations phase is explicitly reopened.
