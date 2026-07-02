# Outdated Or Conflicting Docs

Generated: 20260517-132208 UTC
Mode: AUDIT-ONLY. No existing documentation or application source files were modified.
Audit folder: audits/documentation-canonicalization-20260517-132208

## Confirmed / Likely Conflict Candidates

| Path | Why it may conflict | Recommended handling | Confidence |
| --- | --- | --- | --- |
| docs/system/MASTER_SYSTEM_OVERVIEW.md | Frames MH Assistant primarily as an AI-powered Marketing Operating System with older five-layer model. | Supersede/merge into AI Business Operating System six-layer canonical operating model. | Medium |
| audits/frontend/ai-workspace/AI_WORKSPACE_ARCHITECTURE_NOTES.md | Describes AI Workspace before Final Room V1; useful lineage but not latest room model. | Supersede with AI Team Final Room V1/V1.1. | High |
| audits/frontend/ai-command/AI_TEAM_PHASE_5_FULL_UX_REDESIGN_PLAN.md | Plan-stage redesign material predates current Final Room V1 implementation. | Archive later after Final Room canonical model is approved. | High |
| audits/frontend/ai-command/AI_COMMAND_PHASE_1_SPECIALIST_WORKSPACE_FOUNDATION.md | Early phase foundation predates current AI Team room and tool map. | Archive later or keep as implementation lineage. | High |
| audits/frontend/ai-command/AI_COMMAND_PHASE_2_RESULTS_PREVIEW_AND_DRAFT_OUTPUTS.md | Early preview/output phase doc overlaps with current output workspace behavior. | Supersede with Final Room V1 and V1.1 tool map. | High |
| audits/frontend/ai-command/AI_COMMAND_PHASE_3_5_FINAL_TEAM_COMMAND_CENTER_UX.md | Older final-team UX phase may conflict with the later Final Room V1 language. | Merge only verified facts; archive after approval. | Medium-high |
| audits/frontend/final-vision/FINAL_FRONTEND_MASTER_VISION_AND_COMPLETION_PLAN.md | Vision-level frontend plan competes with newer page standard and final system audit. | Keep as historical vision; do not treat as current page-by-page truth. | Medium-high |
| audits/frontend/full-cleanup/FINAL_FRONTEND_REBUILD_PLAN.md | Rebuild framing conflicts with current no-massive-rewrite and audit-first doctrine. | Archive later or mark superseded by frontend architecture truth. | High |
| audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md | Still valuable, but it records a dirty working tree and predates AI Team Final Room V1.1 and P0.1/P0.2 fixes. | Keep as supporting audit; update facts in a future canonical doc. | Medium |
| audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md | Still best page map, but AI Command notes predate Final Room V1/V1.1 work. | Keep, but require page-specific supersession notes before implementation. | Medium |
| audits/release/release-readiness.md | Says production-hardened and operationally stable; could overstate readiness while frontend canonicalization and disabled/planned actions remain open. | Rewrite readiness checklist against current source and safety state. | Medium-high |
| policies/approvals.md | Empty placeholder, so it cannot serve as governance canon. | Create canonical governance/approval policy later. | High |
| policies/permissions.md | Empty placeholder, so route permissions/policy are not documented here. | Create canonical permissions policy later. | High |
| policies/task-flows.md | Empty placeholder, so workflow/task doctrine is missing. | Create canonical task-flow policy later. | High |

## Pattern-Level Risks

| Pattern | Why it matters | Recommended handling |
| --- | --- | --- |
| Older AI_COMMAND_PHASE_* and AI_TEAM_PHASE_* docs | They predate Final Room V1/V1.1 and may describe older UI layout, specialist coverage, or tool behavior. | Treat as implementation history; do not use as current design authority. |
| Frontend rebuild/full-cleanup plans | Some imply broader rebuilds than the current audit-first, one-concern-per-commit doctrine allows. | Archive later after extracting still-valid findings. |
| Release readiness docs | Some readiness claims are broad and may not include current disabled/planned action states. | Rewrite as a current production readiness checklist before release decisions. |
| Empty policies/*.md | They look like official policy locations but contain no enforceable documentation. | Create canonical policy docs later or remove/archive placeholders after approval. |
| Customer Operations docs | Architecture is strong, but current implementation phase and stashes are intentionally paused. | Keep as future-layer canon candidate; do not implement from it during frontend canonicalization. |
| Raw scan/evidence TXT files | Useful for provenance but can become stale as source files change. | Use only as evidence; regenerate or validate before acting. |

## Current Direction Alignment Check

The current direction used for this audit is: MH-OS is an AI Business Operating System; AI Team routes, thinks, drafts, reviews, and hands off; production workspaces remain official execution surfaces; backend mutation requires explicit confirmation; planned actions remain planned/disabled until source and authority prove otherwise.
