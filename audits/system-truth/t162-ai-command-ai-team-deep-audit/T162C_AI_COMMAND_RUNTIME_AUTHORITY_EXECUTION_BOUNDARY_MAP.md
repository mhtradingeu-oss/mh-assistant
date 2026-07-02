# T162C — AI Command Runtime Authority + Execution Boundary Map

## Status
Audit / contract document. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Classify the runtime authority of AI Command and define the execution boundary for a powerful but safe AI Team.

AI Command should become very smart and useful, but it must remain safe, explainable, and workflow-aware.

## Current Runtime Classification
AI Command is primarily:

- guidance-capable
- draft-capable
- preview-capable
- handoff-capable
- source/context capable
- route/handoff capable

AI Command is not currently approved to be:

- direct publishing authority
- direct customer send authority
- direct CRM mutation authority
- direct Governance approval authority
- direct workflow execution authority
- direct external provider execution authority without confirmation

## Authority Layers

### Layer 1 — Conversation / Advice
Allowed:
- answer questions
- analyze project context
- suggest strategy
- compare options
- explain risks
- ask clarifying questions
- summarize conversation

Risk:
- low, unless unsupported claims are made.

Required guardrail:
- identify missing context and evidence.

### Layer 2 — Draft / Preview
Allowed:
- draft captions
- draft ads
- draft emails
- draft customer replies
- draft sales outreach
- draft campaign briefs
- draft media briefs
- draft publishing packages
- draft task plans
- draft workflow sequences
- draft Governance approval packages

Risk:
- medium.

Required guardrail:
- label outputs as draft/review-only.
- do not claim sent/published/saved/executed.

### Layer 3 — Handoff
Allowed:
- prepare handoff packages
- set shared draft context
- route user to owning workspace
- suggest destination route
- prepare source/evidence notes

Risk:
- medium/high depending on destination.

Required guardrail:
- destination workspace owns execution.
- handoff is not execution.

### Layer 4 — Approval Request / Governance Package
Allowed:
- prepare approval package
- prepare claim review notes
- prepare evidence checklist
- prepare unresolved issue list
- route to Governance

Risk:
- high.

Required guardrail:
- AI Command must not approve, reject, override, or modify policy.
- Governance remains the authority surface.

### Layer 5 — Backend Mutation
Examples:
- create real task
- save campaign
- save publishing schedule
- update Governance policy
- mutate CRM
- create live ticket
- save Library asset
- run workflow

AI Command default:
- not allowed unless explicitly designed as a separate confirmed backend action.

Required guardrail:
- confirmation
- backend validation
- project context
- permission gate
- Governance gate when risk requires it.

### Layer 6 — External Execution
Examples:
- publish to channel
- send customer message
- send sales outreach
- launch ad
- run provider job
- sync external platform
- auto-send / auto-publish

AI Command default:
- not allowed.

Required guardrail:
- must remain in owning surface or backend executor.
- requires explicit user confirmation.
- requires Governance approval for high-risk work.

## Action Type Contract

### Advice
Human-readable guidance only.

### Draft
Review-ready content only.

### Preview
Structured proposal or output card only.

### Handoff
Prepared package for another workspace.

### Approval Package
Governance-bound review package.

### Mutation
Backend write. Not allowed directly from AI Command unless separately designed and approved.

### Execution
External/provider action. Not allowed directly from AI Command.

## Tool Dock Boundary
Tool Dock must remain preparation-first.

It may:
- select output type
- select source
- select destination
- prepare composer prompt
- restore Library source bridge
- prepare handoff context

It must not:
- publish
- send
- save
- route externally
- create CRM records
- run workflows
- mutate backend data

## Specialist Boundary

Every specialist must respect:

### Can do
- think
- advise
- draft
- review
- summarize
- prepare
- handoff

### Cannot do
- publish
- send
- approve
- override
- mutate CRM
- run workflow
- execute provider
- create records without confirmation
- claim action happened when it did not

## Destination Ownership

### Campaign Studio
Owns campaign creation/update workflows.

AI Command may prepare:
- campaign plan
- offer strategy
- channel plan
- campaign handoff

### Content Studio
Owns content drafting/editing workflows.

AI Command may prepare:
- captions
- landing copy
- email copy
- content variants
- content handoff

### Media Studio
Owns media generation/preparation workflows.

AI Command may prepare:
- creative brief
- video script
- asset checklist
- visual direction

### Publishing
Owns publishing schedule and live publish operations.

AI Command may prepare:
- publishing package
- readiness checklist
- schedule draft
- approval checklist

### Ads Manager
Owns paid ad planning/execution surfaces.

AI Command may prepare:
- ad copy
- angle map
- targeting review
- creative testing plan

### Governance
Owns approvals, policy, overrides, and high-risk decisions.

AI Command may prepare:
- approval package
- claim review
- evidence checklist
- risk summary

### Operations / Task Center / Workflows
Own task planning, workflow execution, operational tracking.

AI Command may prepare:
- task plan
- workflow draft
- execution checklist
- handoff summary

### Customer Center
Owns customer conversations and customer operations.

AI Command may prepare:
- safe reply draft
- customer summary
- ticket draft
- escalation draft

### Sales / CRM
Owns CRM state and sales actions.

AI Command may prepare:
- outreach draft
- lead qualification
- CRM context summary
- follow-up plan

### Library
Owns trusted source assets and reusable knowledge.

AI Command may prepare:
- source context
- evidence checklist
- library handoff
- knowledge summary

## Governance Triggers
AI Command should recommend Governance handoff when work includes:

- publishing readiness
- legal or compliance claims
- product performance claims
- pricing or discount claims
- customer-impacting commitments
- external send/publish actions
- paid advertising launch
- provider execution with external output
- override request
- missing evidence
- policy uncertainty

## Source / Evidence Rules
AI Command must:
- prefer Library/source-of-truth context
- identify unsupported claims
- ask for proof when needed
- avoid inventing operational status
- avoid claiming external execution
- distinguish draft from fact

## Required UX Signals
The interface must show:

- selected specialist
- current authority mode
- output type
- source grounding status
- destination handoff
- risk level
- Governance needed / not needed
- execution disabled unless in owning surface
- last saved draft/session status

## Decision
AI Command can be powerful if it remains a command and preparation layer, not an unsafe execution layer.

Next phase:
- `T162D — Missing Specialist Roadmap + Final AI Team Recommendation`
