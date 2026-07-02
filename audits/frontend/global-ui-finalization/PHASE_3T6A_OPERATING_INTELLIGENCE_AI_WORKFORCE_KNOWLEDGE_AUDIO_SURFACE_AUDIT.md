# PHASE 3T.6A — Operating Intelligence / AI Workforce / Knowledge / Audio Surface Audit

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: 02364f6 Add Customer Operations placement plan
- Current untracked closeout: PHASE_3T6_CUSTOMER_OPERATIONS_PLACEMENT_CLOSEOUT.md

## Purpose
Ensure Settings, AI Employees, AI Team behavior, knowledge/data stores, workflows, agent setup, memory/learning, and audio/voice engine placement are planned before closing Customer Operations placement and returning to CSS/page finalization.

## Why This Exists
Customer Operations placement cannot be closed in isolation if adjacent operating layers are not classified.

The system must show its power through a coherent operating model:

- Settings configures the system.
- Library stores knowledge, sources, evidence, and assets.
- AI Command uses AI employees/specialists to answer, reason, draft, and route.
- Workflows turns decisions into structured operating steps.
- Operations Centers tracks tasks, queues, jobs, notifications, and future Customer Operations.
- Integrations manages provider readiness.
- Media Studio owns media, voice scripts, and future audio generation readiness.
- Governance protects approvals, policies, and evidence.

## Surface Placement Matrix

| Capability | Recommended Surface | Classification | Decision |
|---|---|---|---|
| AI Employees / AI Team configuration | Settings | covered_sub_surface | Configure roles, permissions, tone, owners, and approval rules in Settings |
| AI Employee answering / collaboration | AI Command | covered_standalone_page | AI employees work and answer inside AI Command |
| AI specialist prompts/tools | AI Command + tool dock | covered_standalone_page | Keep as active intelligence and draft surface |
| Knowledge / Data Stores | Library + Settings | covered_sub_surface | Library owns sources/evidence/assets; Settings owns policy/configuration |
| Source registry / evidence | Library + Governance | covered_sub_surface | Library stores; Governance validates and protects |
| Memory / Learning | Settings + AI Command + Insights | planned_sub_surface | Expose as intelligence layer, not separate page yet |
| Workflow setup / automation logic | Workflows | covered_standalone_page | Keep workflow preparation and simulation here |
| Workflow execution authority | Workflows + backend | protected | Preserve confirmation gates |
| Tasks / queues / jobs | Operations Centers | covered_sub_surface | Keep review-first operational tracking |
| Customer Operations | Operations Centers future sub-surface + AI Command | planned_sub_surface | Do not create standalone page now |
| CRM / Support readiness | Integrations + AI Command | planned_sub_surface | Provider readiness in Integrations, drafting in AI Command |
| Audio / voice scripts | Media Studio + AI Command | covered_sub_surface | Voice script preparation only |
| Audio generation backend | Media Studio + Integrations | planned_future_surface | Provider/API evidence required before launch claim |
| Browser read aloud / voice input | AI Command | planned_sub_surface | Browser capability only, not IVR |
| IVR / Call Center / phone actions | Future dedicated phase | deferred_future_surface | Not launch-ready; do not claim complete |
| Agent setup wizard | Settings + Setup | planned_sub_surface | Configure agent/team defaults without creating new page now |

## Settings Decision
Settings should own configuration, not daily execution.

Settings should include or later expose:

- AI employee roles
- team permissions
- approval owners
- memory/data policies
- source usage rules
- claim safety rules
- escalation rules
- provider preferences
- audio/voice provider readiness
- workspace defaults

Settings should not become the place where the AI team works. That belongs to AI Command.

## AI Command Decision
AI Command is the active AI workforce surface.

It should show:

- which AI employee/specialist is active
- what knowledge/context is being used
- what the AI can help with
- what it cannot do
- draft/review outputs
- handoff path to Workflows, Operations, Publishing, Library, or Governance
- clear safety labels

AI Command should not directly mutate CRM, send replies, publish, approve, call, or run workflows without destination confirmation.

## Knowledge / Data Stores Decision
Knowledge and data stores should not be a separate page now.

Use:

- Library for files, assets, sources, evidence, generated media, and reusable knowledge
- Governance for proof, approval, claims, and policy evidence
- Settings for usage policy, memory scope, and source permissions
- AI Command for consuming the knowledge during AI work

Future dedicated Data Store page may be considered only if Library becomes overloaded.

## Workflow Decision
Workflow setup and execution remain in Workflows.

Workflows should connect to:

- AI Command for prompt/handoff preparation
- Operations Centers for task/queue/job tracking
- Publishing for schedule/publish readiness
- Governance for approvals/evidence
- Library for required source assets

No workflow execution expansion without backend authority and confirmations.

## Audio Engine Decision
Audio is split into three levels:

1. **Voice script / audio direction**
   - Surface: Media Studio + AI Command
   - Status: covered as draft/preparation

2. **Audio generation provider**
   - Surface: Media Studio + Integrations
   - Status: planned/provider-dependent

3. **Realtime voice / IVR / call center**
   - Surface: future phase
   - Status: deferred, not launch-ready

Do not present audio engine as a live IVR/call center until backend/API/provider evidence exists.

## Recommended Placement Model
Do not create new standalone pages now.

Use the existing operating surfaces:

- Settings for configuration
- AI Command for AI employee work
- Library for knowledge/data/source assets
- Workflows for process
- Operations Centers for operational tracking
- Integrations for provider readiness
- Media Studio for voice/media preparation
- Governance for authority and safety

## Planned/Future Items To Carry Forward
Add these to the roadmap without implementation now:

- Customer Operations sub-surface inside Operations Centers
- CRM/Support provider readiness panel improvement
- AI Employee configuration section inside Settings
- Knowledge/data policy section inside Settings
- Memory/Learning visibility through AI Command + Insights
- Audio provider readiness under Integrations/Media Studio
- Future IVR / Call Center phase
- Agent setup wizard under Setup/Settings

## Protected Behavior
- No production changes.
- No JS edits.
- No CSS edits.
- No backend/API edits.
- No route additions.
- No data/project edits.
- No fake AI employee, CRM, IVR, audio, or data-store claims.
- Do not weaken execution authority closeouts.
- Do not create new pages until evidence and implementation are explicitly approved.

## Decision
Operating intelligence placement is planned and does not require new standalone pages now.

Customer Operations closeout can proceed only if it references this adjacent placement plan and carries future items forward.
