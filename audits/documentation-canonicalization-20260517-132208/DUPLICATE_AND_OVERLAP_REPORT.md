# Duplicate And Overlap Report

Generated: 20260517-132208 UTC
Mode: AUDIT-ONLY. No existing documentation or application source files were modified.
Audit folder: audits/documentation-canonicalization-20260517-132208

## Duplicate / Overlap Clusters

| Area | Files in area | Current best source | Competing / overlapping docs | Risk | Proposed later cleanup |
| --- | --- | --- | --- | --- | --- |
| AI Team / AI Command versions | 36 | audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_FINAL_ROOM_V1.md; audits/frontend/ai-command/AI_TEAM_V1_1_SPECIALIST_COVERAGE_TOOL_MAP_AUDIT.md; audits/frontend/ai-command/final-room-deep-audit-20260516-183012/AI_COMMAND_FINAL_ROOM_DEEP_AUDIT.md | audits/frontend/ai-command/AI_COMMAND_PHASE_1_SPECIALIST_WORKSPACE_FOUNDATION.md; audits/frontend/ai-command/AI_COMMAND_PHASE_2_5_UX_TOOLING_VOICE_CHAT_READINESS.md; audits/frontend/ai-command/AI_COMMAND_PHASE_2_RESULTS_PREVIEW_AND_DRAFT_OUTPUTS.md; audits/frontend/ai-command/AI_COMMAND_PHASE_3B_GUIDANCE_ONLY_RESPONSE_ENDPOINT.md; audits/frontend/ai-command/AI_COMMAND_PHASE_3C_RESPONSE_QUALITY_AND_LANGUAGE_CONTROL.md; audits/frontend/ai-command/AI_COMMAND_PHASE_3D_SMART_SPECIALIST_CHAT_MODE.md; audits/frontend/ai-command/AI_COMMAND_PHASE_3E_PROVIDER_OUTPUT_FIDELITY.md; audits/frontend/ai-command/AI_COMMAND_PHASE_3F_LANGUAGE_AND_PUBLISHING_ALIGNMENT.md; ... 10 more | High if older phase docs are treated as the current UX or tool model. | Merge into canonical summary; archive older phase evidence only after approval |
| Frontend final audits and vision plans | 60 | audits/frontend-architecture/FRONTEND_ARCHITECTURE_TRUTH.md; audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md; audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md | audits/frontend/consolidation/FRONTEND_CONSOLIDATION_QA_REPORT.md; audits/frontend/consolidation/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT.md; audits/frontend/consolidation/final-system-audit/FRONTEND_RISK_MATRIX.md; audits/frontend/consolidation/final-system-audit/NEXT_IMPLEMENTATION_PLAN.md; audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt; audits/frontend/consolidation/pass-2-surface-ownership/surface-ownership-scan.txt; audits/frontend/final-execution/STEP_33A_FINAL_FRONTEND_EXECUTION_SUMMARY_AND_DOCUMENT_INVENTORY.md; audits/frontend/final-status/FRONTEND_STATUS_AND_REMAINING_PLAN.md; ... 10 more | High because multiple docs can imply different final page layouts or implementation order. | Merge into canonical summary; archive older phase evidence only after approval |
| Runtime governance and authority migration | 42 | audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md; audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md | audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md; audits/runtime-governance/backend-authority-scan.txt; audits/runtime-governance/conflicts/ai-team-authority-scan.txt; audits/runtime-governance/conflicts/backbone-authority-head.txt; audits/runtime-governance/conflicts/backend-authority-full-scan.txt; audits/runtime-governance/conflicts/frontend-authority-full-scan.txt; audits/runtime-governance/conflicts/frontend-authority-head.txt; audits/runtime-governance/frontend-authority-scan.txt; ... 10 more | Medium. Older conflict tables should not override the freeze checkpoint. | Merge into canonical summary; archive older phase evidence only after approval |
| Customer Operations plans and readiness snapshots | 10 | audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md; audits/customer-operations/CUSTOMER_OPS_PHASE_3_READ_ONLY_READINESS_SNAPSHOT.md | audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md; audits/customer-operations/AI_CUSTOMER_OPERATIONS_PRE_CREATE_DUPLICATION_AUDIT.md; audits/customer-operations/CUSTOMER_OPERATIONS_INTEGRATION_BRIDGE_DEEP_SCAN.md; audits/customer-operations/CUSTOMER_OPS_PHASE_3_READ_ONLY_READINESS_SNAPSHOT.md | Medium-high until the Customer Operations phase resumes; current stashes must remain untouched. | Merge into canonical summary; archive older phase evidence only after approval |
| Backend route and runtime capability inventories | 110 | audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY_SUMMARY.md; audits/runtime/runtime-dependency-graph.md | audits/backend/project-creation/project-routes-audit.txt; audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY.md; audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY_SUMMARY.md; audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md; audits/runtime-governance/backend-authority-scan.txt; audits/runtime-governance/conflicts/ai-team-authority-scan.txt; audits/runtime-governance/conflicts/backbone-authority-head.txt; audits/runtime-governance/conflicts/backend-authority-full-scan.txt; ... 10 more | Medium. Raw route scans can age quickly as source code changes. | Merge into canonical summary; archive older phase evidence only after approval |
| Release, production, and runbook claims | 33 | audits/release/release-readiness.md; docs/runbooks/LAUNCH_EXECUTION_RUNBOOK.md; docs/system/SEMI_AUTO_DRY_RUN_SOURCE_OF_TRUTH.md | audits/checkpoints/intelligence-runtime-modularization-checkpoint.md; audits/checkpoints/m0-baseline.txt; audits/checkpoints/p0-baseline-start.txt; audits/checkpoints/p0-validation-output.txt; audits/checkpoints/phase2-performance-runtime-checkpoint.md; audits/checkpoints/phase2-runtime-extraction-checkpoint.md; audits/checkpoints/production-hardening-checkpoint.md; audits/checkpoints/recommendation-runtime-builders-checkpoint.md; ... 10 more | Medium-high if release readiness is read without the current frontend and disabled-action caveats. | Merge into canonical summary; archive older phase evidence only after approval |
| Capability maps and raw grep evidence | 5 | audits/capability-map/FULL_CAPABILITY_MAP.txt plus topic-specific capability files | audits/capability-map/FULL_CAPABILITY_MAP.txt; audits/capability-map/ai-capabilities.txt; audits/capability-map/backend-domain-handlers.txt; audits/capability-map/finalization-capabilities.txt; audits/capability-map/governance-capabilities.txt | Medium. Evidence is broad but not normalized into an official capability matrix. | Merge into canonical summary; archive older phase evidence only after approval |

## Similar-Name / Same-Topic Signals

| Topic | Document count | Cleanup concern |
| --- | --- | --- |
| Frontend architecture / UX | 343 | Very broad topic cluster; merge canonical summaries before implementation. |
| AI Team / AI Command | 182 | Very broad topic cluster; merge canonical summaries before implementation. |
| Customer and voice operations | 60 | Large topic cluster; identify source-of-truth and archive old phase evidence later. |
| Runtime / backend capability | 60 | Large topic cluster; identify source-of-truth and archive old phase evidence later. |
| Customer operations | 56 | Large topic cluster; identify source-of-truth and archive old phase evidence later. |
| Project context | 5 | Manageable cluster. |
| Governance / safety | 4 | Manageable cluster. |
| Release / runbook / production readiness | 3 | Manageable cluster. |
| General documentation | 1 | Manageable cluster. |
| System operating model / page map | 1 | Manageable cluster. |

## Repeated Conclusions Found

- Backend owns operational authority; frontend projects authority.
- Audit -> confirm -> decide -> implement -> verify -> commit.
- AI Team is a thinking/routing layer, not the replacement for production workspaces.
- Workspaces remain the official execution and production surfaces.
- Planned or disabled actions must be visibly marked and must not imply backend mutation.
- Customer Operations and voice/IVR are important future layers, but several docs are architecture or readiness snapshots rather than implementation authority.

## Highest Duplicate Risks

1. AI Command phase docs versus Final Room V1/V1.1.
2. Multiple frontend final/vision/rebuild plans versus frontend architecture truth and UX operating surface standard.
3. System operating model split between older marketing OS docs and current AI Business OS doctrine.
4. Release readiness claims versus final system/page audit risks.
5. Customer Operations architecture/readiness docs versus paused or stashed implementation state.
