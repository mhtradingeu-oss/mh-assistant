# MH-OS IVR Voice Channel Model

Status: Canonical target model with current planned/disabled boundary
Created: 2026-05-17

## Purpose

IVR/Voice is a customer interaction channel inside Customer Operations. It turns calls into operational context: transcript, intent, customer lookup context, draft response, routing recommendation, call summary, and follow-up task draft.

It is not a separate authority system and does not bypass Customer Operations, Governance, or Operations Centers.

## Target Voice Flow

Call received -> voice provider -> speech-to-text -> intent detection -> customer/order lookup -> AI draft support -> human review or transfer -> transcript -> summary -> follow-up task or handoff -> monitor SLA/escalation

## Core Concepts

| Concept | Definition | Safety boundary |
| --- | --- | --- |
| Transcript | Text record of the call or voice message. | Must not expose private data beyond authorized surfaces. |
| Intent detection | Classification of caller need: support, sales, order, refund, complaint, escalation, etc. | AI classification is advisory until reviewed. |
| Routing | Send call context to Customer Ops, Sales/CRM, Operations, Governance, or human handoff. | Routing can be suggested; execution requires owning surface. |
| AI draft support | Suggested response, summary, ticket draft, or next step. | Draft-only unless an audited customer-facing handler exists. |
| Human approval | Human confirms sensitive or customer-facing action. | Required before replies, transfers, SLA changes, or escalations until proven otherwise. |
| Monitoring | Follow-up through tasks, queues, notifications, and SLA signals. | Operations Centers project and monitor; backend owns records. |

## Routing Defaults

| Voice scenario | Route to | AI specialist |
| --- | --- | --- |
| Support issue | Customer Operations | Customer Operations Lead |
| Complaint, refund, risky claim | Customer Operations + Governance | Customer Operations Lead + Compliance Reviewer |
| Sales inquiry | Sales / CRM | Sales / CRM Lead |
| Operational blocker | Operations Centers or Workflows | Operations Lead |
| Ambiguous caller intent | AI Team Full Team or Operations Lead | Full Team / Operations Lead |

## Relationship To Customer Operations

Customer Operations is the owning layer for IVR/Voice. Voice should feed Unified Inbox or conversation history, ticket drafts, customer profile timeline, SLA risk indicators, escalation drafts, Sales/CRM handoffs, and follow-up tasks.

If the dedicated Customer Operations surface is not available, route to AI Team, Workflows, Task Center, Operations Centers, or Governance with a clear planned destination note.

## Current Planned / Disabled State

Current documentation supports IVR/Voice as a target model and Customer Operations channel. It does not prove a production-ready IVR execution stack.

Treat these as planned unless separately audited:

- Real inbound phone provider integration.
- Production speech-to-text pipeline.
- Production text-to-speech response pipeline.
- Automatic customer-facing voice replies.
- Automatic human transfer.
- Durable ticket/SLA/escalation mutation from voice.
- Dedicated IVR Builder route.
- Dedicated Voice Center route.

## Required Approval Rules

Before any customer-facing voice action:

- Confirm customer identity and context where relevant.
- Show transcript or summary to a human operator.
- Show intended response or transfer action.
- Confirm SLA/escalation effects.
- Record provenance and decision history.
- Respect opt-out/do-not-contact where sales/outreach is involved.

## AI Team Role

AI Team may summarize voice transcripts, detect likely intent, prepare response drafts, prepare ticket or escalation drafts, and recommend Customer Ops, Sales/CRM, Operations, or Governance routes.

AI Team may not speak to the customer live, transfer calls, send messages, create durable ticket/SLA changes, mutate CRM, or execute outreach. Those actions require future audited backend handlers and explicit confirmation.
