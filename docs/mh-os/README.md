# MH-OS Canonical Documentation Set

Status: Canonical source-of-truth set
Created: 2026-05-17
Mode: Documentation-only

## Purpose

This directory is the official documentation source for MH-OS before page-by-page implementation continues. It consolidates the current truth from the documentation canonicalization audit and the strongest supporting audits.

Audits remain evidence and history. These docs are the decision layer used for future implementation prompts, page finalization, and release planning.

## Current Product Truth

MH-OS is an AI Business Operating System. It is not a traditional dashboard, a set of disconnected widgets, or an AI chat page that replaces every workspace.

The system is organized around six layers:

1. Project Intelligence
2. Production Workspaces
3. AI Team Command Center
4. Execution & Operations
5. Governance & Safety
6. Customer & Voice Operations

The operating workflow is:

Observe -> Decide -> Draft -> Review -> Route -> Execute -> Monitor

## Canonical Docs

1. `MH_OS_OPERATING_MODEL_AND_PAGE_RELATIONSHIP.md` - system model, layers, workflow, and page relationships.
2. `MH_OS_PAGE_QUALITY_STANDARD.md` - completion criteria and scoring for every page.
3. `MH_OS_FRONTEND_ARCHITECTURE_MAP.md` - frontend shell, routing, page, CSS, and validation rules.
4. `MH_OS_PAGE_REGISTRY_AND_WORKFLOW_MAP.md` - known pages, route IDs, ownership, AI connections, and transitions.
5. `MH_OS_AI_TEAM_OPERATING_MODEL.md` - AI Team role, specialists, output types, real/planned actions, and safety.
6. `MH_OS_PAGE_TO_AI_TEAM_HANDOFF_CONTRACT.md` - required handoff fields and source-to-specialist defaults.
7. `MH_OS_CUSTOMER_AND_VOICE_OPERATIONS_MODEL.md` - Customer Operations target model and current/planned boundaries.
8. `MH_OS_IVR_VOICE_CHANNEL_MODEL.md` - IVR/Voice channel model and safety constraints.
9. `MH_OS_PRODUCTION_READINESS_CHECKLIST.md` - readiness, QA, blocker, launch, and rollback checklists.
10. `MH_OS_BACKLOG_AND_RELEASE_SEQUENCE.md` - completed work, remaining priorities, and safe release path.
11. `MH_OS_SAFE_UPGRADE_PROTOCOL.md` - mandatory rules for future Codex prompts and implementation passes.

## Engineering Contracts

The canonical engineering contracts governing architecture, runtime authority,
identity and Workspace relationships, capabilities, AI roles, governance,
security, providers, missions, workflows, and artifacts are maintained in the
[MH-OS Engineering Contracts Index](../contracts/README.md).

Product documentation explains the operating model and user experience.
Engineering contracts define the reviewed implementation boundaries,
authority decisions, compatibility requirements, and current-truth records.

## Evidence Base

Primary evidence came from:

- `audits/documentation-canonicalization-20260517-132208/`
- `audits/final-program/MH_OS_FINAL_EXECUTION_PROGRAM.md`
- `audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md`
- `audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md`
- `audits/frontend-architecture/FRONTEND_ARCHITECTURE_TRUTH.md`
- `audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md`
- `audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_FINAL_ROOM_V1.md`
- `audits/frontend/ai-command/AI_TEAM_V1_1_SPECIALIST_COVERAGE_TOOL_MAP_AUDIT.md`
- `audits/frontend/ai-command/final-room-deep-audit-20260516-183012/AI_COMMAND_FINAL_ROOM_DEEP_AUDIT.md`
- `audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md`
- `audits/customer-operations/CUSTOMER_OPS_PHASE_3_READ_ONLY_READINESS_SNAPSHOT.md`
- `audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY_SUMMARY.md`
- `audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md`
- `audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md`
- `docs/system/SEMI_AUTO_DRY_RUN_SOURCE_OF_TRUTH.md`
- `docs/runbooks/LAUNCH_EXECUTION_RUNBOOK.md`
- `docs/runbooks/PROJECT_LIFECYCLE_RUNBOOK.md`

## Non-Negotiable Rules

- Backend owns operational authority.
- Frontend projects operational authority.
- AI Team prepares, reasons, drafts, reviews, and routes. It does not replace production workspaces.
- Workspaces remain the official places for production, execution, review, and monitoring.
- Planned and disabled actions must be visibly marked as planned or disabled.
- No backend mutation happens without explicit user confirmation and an authority/safety audit.
- No duplicate pages, routes, files, IDs, or source-of-truth definitions.
- Customer Operations stashes and P0.3 stashes are not applied or touched unless that phase is explicitly opened.
