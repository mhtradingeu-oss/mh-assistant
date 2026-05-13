# MH-OS Frontend Master Authority

## Product Vision

MH-OS is an AI Business Operating System.

It is not a dashboard, not a chatbot, and not a task list.

The user experience target is that a user feels guided by a smart operating team across every page and transition. Pages are not isolated screens. Each page is a role in one operating surface.

## Canonical User Flow

User Goal -> Page Context -> AI Guidance -> Workflow Session -> Task/Handoff -> Destination Page -> Tracking -> Result/Next Action

This flow is canonical and must be preserved across all major frontend work.

## Architecture Doctrine

- Backend = Authority
- Frontend = Projection + Experience
- Duplicate authority is a defect
- Frontend compatibility fallbacks must be temporary and documented

Authority rule:
- Permissions, governance, approvals, execution authority, and durable operational truth belong to backend services.
- Frontend may project, summarize, and guide, but may not become authority.

## Frontend Non-Authority Boundaries

Frontend must not independently own:
- permissions
- approvals
- live publishing
- live execution
- Auto Mode
- governance
- durable tasks
- operational authority

## Frontend Responsibilities

Frontend responsibilities are to:
- render state
- guide the user
- preserve context
- prepare drafts/packages
- route to AI, Workflow, and Task Center paths
- show clear feedback
- expose safe actions only
- remain a projection/runtime UX layer

## Universal Page Model

Every major page should converge toward this structure:
- Header
- Main Workspace
- Action Panel
- AI Guidance
- Workflow Quick Action
- Task/Handoff Path
- Technical Details collapsed

Design intent:
- keep high-signal operating actions visible
- keep low-signal technical diagnostics available but collapsed
- reduce competing CTAs in the same panel

## Action Destination Rule

Every important action must clearly indicate destination and authority path. Each action must explicitly communicate whether it:
- navigates
- opens AI
- starts workflow
- creates task
- creates handoff
- prepares draft/package
- requests approval
- runs backend action
- is dangerous and needs confirmation/governance

No ambiguous primary actions are allowed.

## Safety Rules

- No unsafe Auto Mode
- No live publishing without governance
- No destructive action without confirmation
- No frontend-only approvals
- No raw secrets in UI
- No metrics shown as fact without source
- No hidden execution behind UI buttons
- No page redesign before authority/lifecycle risks are handled

Safety interpretation:
- If authority is unclear, action must resolve through backend validation or explicit governance gate.
- If execution side effects are meaningful, user confirmation and traceability are required.

## UX Rules

- premium, dark, executive, compact, clear
- visual guidance over long text
- one primary action per panel
- secondary actions quieter
- danger zone separated
- technical details collapsed
- no duplicate actions
- no random CSS layering
- use global primitives before page-specific CSS

UX consistency rule:
- page-specific styling is allowed only after global primitives and canonical shells are reused.

## Page Role Summary

- Home: Executive mission control and next-best-action entry
- Setup: Project foundation and operational readiness baseline
- Library: Asset truth projection, readiness, and controlled asset actions
- Integrations: Connector health projection, diagnostics, and safe remediation routing
- AI Command: Guided AI operating entry with context-aware command drafting
- Workflows: Structured multi-step orchestration planning and controlled execution routing
- Task Center: Operational task visibility and action tracking projection
- Queue Center: Queue state visibility and prioritization projection
- Job Monitor: Execution job status projection and escalation surface
- Notifications: Operational signal inbox and acknowledgment routing
- Campaign Studio: Campaign planning surface and package preparation
- Content Studio: Content planning and draft preparation workspace
- Media Studio: Media production planning and asset package preparation
- Publishing: Publication package preparation and governance-gated release path
- Insights: Performance and operational insight projection with sourced evidence
- Ads Manager: Paid activity projection, planning, and safe action routing
- Research: Market/competitor intelligence projection and decision support
- Governance: Policy projection, approvals visibility, and controlled governance actions
- Settings: Configuration projection and safe system preference management

## Implementation Protocol

For every page and major frontend feature, execution order is mandatory:

Audit -> Confirm -> Decide -> Implement -> Browser QA -> Commit -> Closeout

Protocol rule:
- Skip-order implementation is not allowed for authority-sensitive or lifecycle-sensitive changes.

## Current Progress

Completed hardening work to date:
- route authority boundary
- lifecycle registry foundation
- listener/timer density audit
- app shell lifecycle integration
- app shell regression audit
- app shell lifecycle closeout
- Library lifecycle tiny integration

Current state:
- App shell lifecycle baseline is stable.
- Library is now aligned to shared lifecycle plumbing internally.
- Publishing and Workflows remain deferred for lifecycle migration due to higher coupling risk.

## Next Required Companion Docs

- ACTION_DESTINATION_MAP.md
- PAGE_BLUEPRINTS.md

Intent:
- ACTION_DESTINATION_MAP.md defines explicit action-to-authority routing semantics.
- PAGE_BLUEPRINTS.md defines canonical page compositions and convergence targets.

## Governance Alignment Statement

This document is canonical for frontend/product authority posture.

If any page behavior, design decision, or implementation proposal conflicts with this document:
- backend authority wins
- safety rules win
- explicit action destination clarity wins

## Explicit No-Code-Change Statement

This Step 8 task is documentation-only.

No production code was modified.
- No frontend JS changes
- No CSS changes
- No backend changes
- No data/projects changes
- No route behavior changes
