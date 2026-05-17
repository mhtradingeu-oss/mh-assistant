# Canonical Candidate Map

Generated: 20260517-132208 UTC
Mode: AUDIT-ONLY. No existing documentation or application source files were modified.
Audit folder: audits/documentation-canonicalization-20260517-132208

## Summary

The repository has strong source material but no single approved canonical documentation set. The strongest current candidates are split across final system audits, frontend architecture truth, UX standards, AI Team final-room audits, runtime governance, backend route inventory, customer-operations architecture, and release/runbook docs.

| Canonical topic | Best existing file(s) | Completeness 1-10 | Freshness 1-10 | Conflict risk 1-10 | Recommendation |
| --- | --- | --- | --- | --- | --- |
| MH-OS Operating Model | audits/final-program/MH_OS_FINAL_EXECUTION_PROGRAM.md; audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md; audits/frontend-architecture/FRONTEND_ARCHITECTURE_TRUTH.md; docs/system/MASTER_SYSTEM_OVERVIEW.md | 7 | 8 | 5 | merge, then create missing canonical doc later |
| Page Relationship / Workflow Map | audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md; audits/final-program/MH_OS_FINAL_EXECUTION_PROGRAM.md; audits/final-system-audit/MH_OS_NEXT_DEVELOPMENT_PLAN.md | 7 | 7 | 4 | merge into a page registry/workflow map |
| Frontend Architecture Map | audits/frontend-architecture/FRONTEND_ARCHITECTURE_TRUTH.md; audits/frontend-shell/CANONICAL_SHELL_OWNERSHIP.md; audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md; public/control-center/components/COMPONENT_ARCHITECTURE.md | 8 | 8 | 3 | keep as source material; merge shell/runtime maps |
| Page Quality Standard | audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md; audits/frontend-architecture/FRONTEND_ARCHITECTURE_TRUTH.md | 9 | 8 | 2 | keep and promote after approval |
| AI Team Operating Model | audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_FINAL_ROOM_V1.md; audits/frontend/ai-command/AI_TEAM_V1_1_SPECIALIST_COVERAGE_TOOL_MAP_AUDIT.md; audits/frontend/ai-command/final-room-deep-audit-20260516-183012/AI_COMMAND_FINAL_ROOM_DEEP_AUDIT.md; audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md | 8 | 10 | 3 | merge into a canonical AI Team operating model |
| AI Team Final Room / Specialist Tool Map | audits/frontend/ai-command/AI_TEAM_V1_1_SPECIALIST_COVERAGE_TOOL_MAP_AUDIT.md; audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_FINAL_ROOM_V1.md; audits/frontend/ai-command/final-room-deep-audit-20260516-183012/AI_COMMAND_FINAL_ROOM_DEEP_AUDIT.md | 9 | 10 | 2 | keep as current supporting audit; distill later |
| Customer Operations Model | audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md; audits/customer-operations/CUSTOMER_OPS_PHASE_3_READ_ONLY_READINESS_SNAPSHOT.md; runtime/orchestrator-service/lib/customer-operations/README.md | 7 | 8 | 6 | merge later; keep stashes untouched until that phase |
| IVR / Voice Operations Model | audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md; runtime/orchestrator-service/lib/media/native/README.md | 4 | 7 | 6 | create missing canonical doc later |
| System Pages Final Audit | audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md; audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md; audits/final-system-audit/MH_OS_REMAINING_PROBLEMS_AND_FIX_PLAN.md | 8 | 7 | 4 | keep, then append supersession note in future approved pass |
| Capability Map | audits/capability-map/FULL_CAPABILITY_MAP.txt; audits/capability-map/ai-capabilities.txt; audits/capability-map/backend-domain-handlers.txt; audits/capability-map/governance-capabilities.txt | 6 | 7 | 5 | rewrite from raw evidence into canonical capability matrix |
| Runtime / Backend Capability Docs | audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY_SUMMARY.md; audits/runtime/runtime-dependency-graph.md; audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md; audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md | 8 | 7 | 4 | keep as evidence; merge stable facts into backend capability canon |
| Governance / Approval Policy | audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md; audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md; audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md; policies/approvals.md; policies/permissions.md | 6 | 8 | 5 | create missing canonical policy; policies files are empty |
| Production Readiness Checklist | audits/release/release-readiness.md; audits/checkpoints/production-hardening-checkpoint.md; docs/runbooks/PHASE1E_PRODUCTION_RUNBOOKS.md | 6 | 6 | 5 | rewrite with current disabled/planned execution status |
| Release / Runbook Docs | docs/runbooks/LAUNCH_EXECUTION_RUNBOOK.md; docs/runbooks/PROJECT_LIFECYCLE_RUNBOOK.md; docs/system/SEMI_AUTO_DRY_RUN_SOURCE_OF_TRUTH.md; audits/release/release-readiness.md | 7 | 6 | 5 | keep runbooks as operational references; update safety framing later |
| Backlog and Safe Upgrade Sequence | audits/final-program/MH_OS_FINAL_EXECUTION_PROGRAM.md; audits/final-system-audit/MH_OS_NEXT_DEVELOPMENT_PLAN.md; audits/final-system-audit/MH_OS_REMAINING_PROBLEMS_AND_FIX_PLAN.md; audits/frontend/final-status/FRONTEND_STATUS_AND_REMAINING_PLAN.md | 8 | 7 | 4 | merge into one safe backlog/release sequence |

## Top Canonical Candidates

1. `audits/final-program/MH_OS_FINAL_EXECUTION_PROGRAM.md` - strongest current execution doctrine and safe upgrade sequence.
2. `audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md` - broadest backend/frontend/system authority audit.
3. `audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md` - strongest page-by-page relationship and workflow source.
4. `audits/frontend-architecture/FRONTEND_ARCHITECTURE_TRUTH.md` - clearest current frontend identity and architecture doctrine.
5. `audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md` - strongest page quality and completion standard.
6. `audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_FINAL_ROOM_V1.md` - current AI Team Final Room implementation closeout.
7. `audits/frontend/ai-command/AI_TEAM_V1_1_SPECIALIST_COVERAGE_TOOL_MAP_AUDIT.md` - freshest specialist coverage and tool-state map.
8. `audits/frontend/ai-command/final-room-deep-audit-20260516-183012/AI_COMMAND_FINAL_ROOM_DEEP_AUDIT.md` - current AI Command validation evidence.
9. `audits/customer-operations/AI_CUSTOMER_OPERATIONS_MASTER_ARCHITECTURE.md` - best Customer Operations and voice/IVR architecture candidate, pending phase approval.
10. `audits/backend/route-inventory/BACKEND_ROUTE_INVENTORY_SUMMARY.md` - best compact backend route/capability inventory.
11. `audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md` - core backend-authority/frontend-projection doctrine.
12. `audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md` - latest runtime-governance freeze checkpoint.
13. `audits/release/release-readiness.md` - release-readiness source material, needs current caveats.
14. `docs/system/SEMI_AUTO_DRY_RUN_SOURCE_OF_TRUTH.md` - useful semi-auto execution safety contract.
15. `audits/capability-map/FULL_CAPABILITY_MAP.txt` - broad raw capability evidence that should be rewritten before becoming canonical.

## Notes

- audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md is the clearest current page quality standard.
- audits/frontend/ai-command/AI_TEAM_V1_1_SPECIALIST_COVERAGE_TOOL_MAP_AUDIT.md is the freshest AI Team specialist/tool map.
- audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_FINAL_ROOM_V1.md remains the best Final Room implementation closeout.
- audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md remains the best broad page-by-page map but needs supersession notes for AI Command and recent P0 fixes.
- policies/*.md are present but empty, so governance policy exists mostly in audits rather than policy docs.
