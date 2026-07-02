# MH-OS Page To AI Team Handoff Contract

Status: Canonical
Created: 2026-05-17

## Purpose

This contract defines how any MH-OS page should send context to AI Team. It prevents ad hoc prompt passing, duplicate role logic, and unclear execution expectations.

A handoff is not execution. It is structured context for thinking, drafting, review, and routing.

## Required Handoff Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `source_page` | Yes | Route ID or page ID that created the handoff. |
| `title` | Yes | Human-readable title for the work. |
| `summary` | Yes | Short summary of the current state, selected item, or operator intent. |
| `prompt` | Yes | Suggested AI Team prompt. Must be specific and action-oriented. |
| `suggested_specialist` or `modeId` | Yes | Best specialist or mode for the handoff. |
| `routeSuggestions` | Yes | Array of likely destination routes with reason/label. |
| `draft_context` | Yes | Structured page context: selected item, project, market, language, status, constraints. |
| `outputPreview` | Optional | Existing draft/preview content that AI Team can refine or route. |
| `safety_note` | Yes | What AI Team may not execute and what requires confirmation. |

## Recommended Shape

```json
{
  "source_page": "content-studio",
  "title": "Review landing page draft",
  "summary": "Draft needs claim review and publishing handoff.",
  "prompt": "Review this landing page draft for claim risk, missing proof, and publishing readiness. Prepare the next safe handoff.",
  "suggested_specialist": "Content Writer",
  "modeId": "writer",
  "routeSuggestions": [
    { "route": "governance", "label": "Governance", "reason": "Claim review may be required." },
    { "route": "publishing", "label": "Publishing", "reason": "Route after approval." }
  ],
  "draft_context": {
    "project": "current project",
    "market": "current market",
    "language": "current language",
    "selected_item_id": "optional",
    "status": "draft"
  },
  "outputPreview": "optional existing draft",
  "safety_note": "Draft/review only. Do not publish or approve. Route to Governance if claims are risky."
}
```

## Source-To-Specialist Defaults

| Source page | Default specialist | Default modeId | Notes |
| --- | --- | --- | --- |
| Content Studio | Content Writer | `writer` | Use Compliance Reviewer if the source item contains claims or approval risk. |
| Media Studio | Media Director / Video Lead | `media` or `video_lead` | Use Video Lead for scripts, storyboards, voiceover, reels, or video assets. |
| Publishing | Publisher | `publisher` | Use Compliance Reviewer when approval, claims, or brand safety are blockers. |
| Campaign Studio | Strategist | `strategist` | Use Ads Optimizer when paid media is primary. |
| Ads Manager | Ads Optimizer | `ads` | Route creative needs to Writer/Media if needed. |
| Research / Insights | SEO & Insights Analyst | `analyst` | Route campaign opportunities to Strategist. |
| Governance | Compliance Reviewer | `compliance_reviewer` | AI Team may summarize or prepare handoff, not decide approvals. |
| Workflows / Task Center / Operations | Operations Lead | `operations` | Use Full Team when multiple workspaces are involved. |
| Customer Ops | Customer Operations Lead | `customer_ops` | Draft-only until reply/ticket/SLA handlers are audited. |
| Sales / CRM | Sales / CRM Lead | `sales_crm` | Draft-only until CRM/outreach handlers are audited. |

## Safe Fallback Behavior

If a page cannot determine a specialist:

1. Use `Operations Lead` for operational/task/workflow uncertainty.
2. Use `Strategist` for campaign/business direction uncertainty.
3. Use `Full Team` when the handoff spans multiple domains.
4. Include route suggestions rather than guessing one destination.
5. Mark unknown execution capabilities as planned or needs review.

If a destination route is missing, do not create the route during the handoff implementation. Route to the closest existing owning surface, mark the destination as planned, and add a backlog item.

## Planned / Disabled Execution Limits

AI Team may not execute these from a page handoff unless the owning surface and backend handler are audited and confirmed:

- Publish or schedule publishing.
- Approve, reject, or override governance policy.
- Create or mutate durable backend tasks from AI Team planned controls.
- Send customer replies.
- Create or mutate tickets/SLA/escalations.
- Mutate CRM records or send outreach.
- Generate media through provider/GPU pipeline without explicit confirmation.
- Run workflow execution without user confirmation.

## What AI Team May Do

AI Team may summarize page context, prepare draft copy/task/workflow/handoff/review outputs, recommend owner and route, convert selected context into an output preview, navigate or route context to an existing owning workspace when connected, and save local drafts where existing behavior supports it.

## What AI Team May Not Do

AI Team may not override backend governance, invent route permissions or team authority, execute customer-facing actions without approval, treat preview outputs as durable records, hide planned/disabled state, or replace the owning production workspace.
