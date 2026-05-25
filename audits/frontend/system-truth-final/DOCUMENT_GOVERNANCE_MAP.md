# Document Governance Map

Evidence base: `audits/frontend/system-truth-final/evidence/16-audit-document-inventory.txt`, `audits/frontend/system-truth-final/evidence/17-master-canonical-docs-inventory.txt`, `audits/frontend/system-truth-final/evidence/18-priority-audit-summaries.txt`, `audits/frontend/system-truth-final/evidence/19-duplication-legacy-signals.txt`, and `audits/frontend/system-truth-final/DOCUMENT_GOVERNANCE_INTAKE.md`.

This map classifies documents only. It does not move, delete, archive, rename, or edit any existing document.

## Canonical

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md` | Canonical product/frontend authority doctrine: MH-OS is an AI Business Operating System; Backend = Authority, Frontend = Projection + Experience. | Preserve as top canonical authority; update only through explicit governance. | Critical: would remove the system's frontend/product authority doctrine. | Preserve |
| `audits/frontend/master/ACTION_DESTINATION_MAP.md` | Canonical action/destination/authority semantics. | Preserve and use before UI/action redesign. | Critical: ambiguous actions and authority drift. | Preserve |
| `audits/frontend/master/PAGE_BLUEPRINTS.md` | Canonical page composition and convergence target. | Preserve; update only after final page governance. | High: page redesigns could diverge. | Preserve |
| `audits/frontend/ai-command/full-ai-team-truth-audit/AI_COMMAND_FULL_TEAM_TRUTH_AUDIT.md` | Current AI Command / AI Team truth source. | Preserve and update after AI Command changes. | High: AI Team scope and review-only boundaries could be lost. | Preserve / update |
| `audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md` | Confirms P1 runtime governance freeze and backend/frontend authority split. | Preserve as runtime governance checkpoint. | Critical: future work may reintroduce frontend authority. | Preserve |
| `audits/frontend/system-truth-final/MH_OS_SYSTEM_TRUTH_READINESS_FINAL_AUDIT.md` | Final system truth/readiness audit created from Phase 1 evidence pack. | Preserve as final truth layer for next phase. | Critical once accepted: would remove final readiness baseline. | Preserve / update |
| `audits/frontend/system-truth-final/DOCUMENT_GOVERNANCE_MAP.md` | Final document classification map. | Preserve and use before cleanup. | Critical: cleanup would lack a decision map. | Preserve / update |
| `audits/frontend/system-truth-final/FINAL_EXECUTION_ORDER.md` | Final ordered execution and QA protocol. | Preserve and use before implementation phases. | High: execution may skip authority/release gates. | Preserve |

## Active

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/frontend/system-truth-final/DOCUMENT_GOVERNANCE_INTAKE.md` | Intake rules for safe classification; explicitly says archive before delete. | Preserve until governance map is accepted, then keep as supporting intake. | High: cleanup constraints would be lost. | Preserve |
| `audits/frontend/system-truth-final/PHASE_1_EVIDENCE_PACK_CLOSEOUT.md` | Closeout proving the evidence pack scope and non-goals. | Preserve as provenance for final audit. | High: final audit evidence chain weakens. | Preserve |
| `audits/frontend/system-truth-final/EVIDENCE_LINE_COUNTS.txt` | Evidence size/index accountability. | Preserve with evidence pack. | Medium: loses audit completeness signal. | Preserve |
| `audits/frontend/system-truth-final/evidence/20-system-truth-evidence-index.txt` | Index for evidence files 01-28. | Preserve as evidence navigation source. | High: future reviewers lose map of the pack. | Preserve |
| `audits/release/release-readiness.md` | Existing release readiness document listed in canonical inventory. | Update or supersede with missing final release QA docs. | High: release process loses current readiness basis. | Preserve / update |
| `docs/mh-os/MH_OS_PRODUCTION_READINESS_CHECKLIST.md` | Production readiness checklist in canonical inventory. | Update after final QA. | High: production checklist history lost. | Preserve / update |
| `docs/runbooks/LAUNCH_EXECUTION_RUNBOOK.md` | Launch runbook in canonical inventory. | Keep active and align with final execution order. | High: release/launch operations lose runbook. | Preserve / update |
| `docs/system/MASTER_SYSTEM_OVERVIEW.md` | System-level overview in canonical inventory. | Update after final audit acceptance. | Medium: public/internal system overview may stale. | Preserve / update |
| `docs/system/SEMI_AUTO_DRY_RUN_SOURCE_OF_TRUTH.md` | Source of truth for semi-auto dry run process. | Keep active until replaced by release/prod readiness. | Medium: dry-run protocol may be lost. | Preserve / update |

## Transitional

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/runtime-governance/P1_RUNTIME_GOVERNANCE_BASELINE.md` | Runtime governance baseline feeding P1 freeze. | Keep until P2 projection/runtime consolidation completes. | High: loses migration rationale. | Preserve now / archive later |
| `audits/runtime-governance/p1-14-frontend-authority-deprecation/P1_14_FRONTEND_AUTHORITY_DEPRECATION_MAP.md` | Tracks temporary frontend authority retirement. | Keep active through authority deprecation. | High: fallback layers may linger or be removed unsafely. | Preserve / update |
| `audits/runtime-governance/p1-14-frontend-authority-deprecation/FRONTEND_AUTHORITY_RETIREMENT_TABLE.md` | Specific retirement table for frontend authority. | Keep until fallback authority is retired. | High: loss of authority migration map. | Preserve / update |
| `audits/runtime-governance/p1-13-router-projection-shadow/P1_13_ROUTER_PROJECTION_SHADOW_PLAN.md` | Router projection shadow plan. | Keep until backend route permission projection is complete. | High: routing authority migration loses plan. | Preserve / update |
| `audits/runtime-state/p2-freeze/P2_RUNTIME_STATE_FREEZE.md` | P2 runtime state freeze source. | Keep for next consolidation phase. | High: runtime state work loses constraints. | Preserve / update |
| `audits/runtime-state/p2-3-state-boundary-contract/P2_3_RUNTIME_STATE_BOUNDARY_CONTRACT.md` | Runtime state boundary contract. | Keep active for P2 work. | High: runtime state boundaries may blur. | Preserve / update |
| `audits/frontend/page-upgrade-roadmap/FINAL_PAGE_UPGRADE_ROADMAP.md` | Page upgrade sequence source, but must now defer to final audit/execution order. | Reconcile with final execution order before further page work. | Medium: page work loses historical sequencing. | Update / later archive |
| `audits/frontend/global-ui/STEP_41B_FINAL_PAGE_SHELL_HEADER_STANDARD_PLAN.md` | Current page shell/header standard plan in priority summaries. | Reconcile with final UX/page shell governance before CSS/UI work. | Medium: page shell context lost. | Update / later archive |
| `audits/frontend/design-system/CSS_OWNERSHIP_CONTRACT.md` | CSS ownership contract remains relevant before any CSS cleanup. | Preserve until CSS governance phase. | High: CSS edits may create ownership drift. | Preserve / update |
| `audits/frontend/css-legacy-cleanup-planning/CSS_CLEANUP_IMPLEMENTATION_PLAN.md` | Transitional CSS cleanup plan. | Keep as reference; do not execute without current CSS ownership review. | Medium: loses cleanup context. | Archive later |

## Historical

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/frontend/ai-command/AI_COMMAND_PASS_1_ACCEPTANCE_QA.md` | Earlier AI Command pass evidence superseded by full truth audit. | Archive after AI Command canonical doc is accepted. | Medium: loses regression/history details. | Archive candidate |
| `audits/frontend/ai-command/AI_COMMAND_PASS_2E_CHAT_FIRST_MEETING_ROOM.md` | Earlier AI Command UX pass. | Archive with AI Command pass history. | Medium: may contain old rationale. | Archive candidate |
| `audits/frontend/ai-command/AI_COMMAND_PASS_3_CLOSEOUT_QA.md` | Prior AI Command closeout. | Archive after final AI Team truth remains canonical. | Medium: QA trail loss. | Archive candidate |
| `audits/frontend/ai-command/pass-4c-final-qa/AI_COMMAND_PASS_4C_FINAL_INTERACTION_UX_QA_AUDIT.md` | Recent but narrower AI Command final QA. | Preserve as supporting historical QA; not canonical over full truth audit. | Medium: interaction QA details lost. | Archive later |
| `audits/frontend/global-ui/STEP_37C_TASK_CENTER_CLEAN_LAYER_ADOPTION_QA_CLOSEOUT.md` | Page-specific clean layer closeout. | Archive under historical page/CSS work after CSS governance. | Low to medium: page-specific CSS history lost. | Archive candidate |
| `audits/frontend/global-ui/STEP_38C_QUEUE_CENTER_CLEAN_LAYER_ADOPTION_QA_CLOSEOUT.md` | Page-specific clean layer closeout. | Archive under historical page/CSS work after CSS governance. | Low to medium. | Archive candidate |
| `audits/frontend/global-ui/STEP_39C_JOB_MONITOR_CLEAN_LAYER_ADOPTION_QA_CLOSEOUT.md` | Page-specific clean layer closeout. | Archive under historical page/CSS work after CSS governance. | Low to medium. | Archive candidate |
| `audits/frontend/global-ui/STEP_40D_NOTIFICATION_CENTER_CLEAN_LAYER_ADOPTION_QA_CLOSEOUT.md` | Page-specific clean layer closeout. | Archive under historical page/CSS work after CSS governance. | Low to medium. | Archive candidate |
| `audits/frontend/layout-authority/20260511-192105/README.md` | Dated layout authority audit directory. | Archive as dated evidence. | Medium: older route/layout evidence lost. | Archive candidate |
| `audits/frontend/system-pages-final-audit-20260516-204742/SYSTEM_PAGES_FINAL_AUDIT.md` | Prior system-pages audit. | Archive after final system truth audit is accepted. | Medium: page-level detail may be useful. | Archive candidate |

## Superseded

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md` | Older system audit now superseded by final evidence-pack audit. | Mark superseded; archive only after final audit acceptance. | High if deleted before comparison: may contain context not migrated. | Archive later |
| `audits/final-system-audit/MH_OS_NEXT_DEVELOPMENT_PLAN.md` | Older next plan replaced by final execution order. | Mark superseded; reconcile unique items first. | Medium: old plan items may be lost. | Archive later |
| `audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md` | Older page audit superseded by evidence-based final audit plus execution order. | Mark superseded; preserve until page-by-page order is accepted. | Medium: page-specific findings may be lost. | Archive later |
| `audits/frontend/consolidation/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT.md` | Older frontend-only system audit. | Mark superseded by final system truth audit for system-level decisions. | Medium: frontend-only detail may be useful. | Archive later |
| `audits/frontend/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md` | Older roadmap replaced by final readiness audit/order. | Reconcile unique open items, then archive. | Medium. | Archive later |
| `audits/frontend/final-truth/FRONTEND_FINAL_TRUTH_AUDIT_AND_SMART_UX_PLAN.md` | Older frontend truth/UX plan. | Supersede for final truth; retain as UX historical context. | Medium. | Archive later |
| `audits/frontend/full-cleanup/FINAL_FRONTEND_REBUILD_PLAN.md` | Rebuild framing conflicts with preserve/consolidate recommendation. | Mark superseded; do not execute as rebuild plan. | High if deleted early: may hide rejected rationale. | Archive later |
| `audits/system-consolidation/master-docs-consolidation/MH_OS_MASTER_SOURCE_BUNDLE.md` | Consolidation bundle is now a supporting source, not final authority. | Reconcile unique canonical content, then archive/support. | High if deleted before extraction. | Preserve until reconciled |

## Duplicate

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt` | Duplicate-named scan evidence signal. | Keep until evidence is either referenced or archived with its parent audit. | Medium: may be only scan backing old audit. | Archive later |
| `audits/frontend/full-frontend-audit/SCAN_EVIDENCE.txt` | Duplicate-named scan evidence signal. | Keep with full frontend audit archive package. | Medium. | Archive later |
| `audits/documentation-canonicalization-20260517-132208/README.md` | Duplicate generic README signal inside dated canonicalization folder. | Keep as folder index until folder archived. | Low to medium. | Archive later |
| `audits/frontend/layout-authority/20260511-192105/00-status.txt` | Duplicate generic status naming pattern. | Keep with dated layout audit. | Low to medium. | Archive later |
| `audits/documentation-canonicalization-20260517-132208/DUPLICATE_AND_OVERLAP_REPORT.md` | Duplicate analysis overlaps with this governance map. | Preserve as supporting historical duplicate report. | Medium: detail loss. | Archive later |
| `audits/system-consolidation/master-docs-consolidation/DUPLICATE_DOCS_REPORT.md` | Duplicate analysis overlaps with this governance map. | Preserve as supporting historical duplicate report. | Medium. | Archive later |
| `audits/integrations/check-contract-drift.sh` | Duplicate-named contract drift script path signal. | Do not delete via doc cleanup; classify separately as script/tooling. | High if still used by validation. | Preserve / separate tooling review |
| `audits/runtime/check-contract-drift.sh` | Duplicate-named contract drift script path signal. | Do not delete via doc cleanup; classify separately as script/tooling. | High if still used by validation. | Preserve / separate tooling review |

## Archive Candidate

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/documentation-canonicalization-20260517-132208/` | Dated documentation cleanup/canonicalization pack. | Archive as a complete folder after final governance map is accepted. | High if partial deletion: may lose cleanup rationale. | Archive candidate |
| `audits/frontend/ai-command/chatgpt-style-chat-audit-20260517-145145/` | Dated AI chat audit/fix pack now historical. | Archive as folder; keep until AI chat fresh proof exists. | Medium to high: contains chat route context. | Archive candidate |
| `audits/frontend/ai-command/final-room-deep-audit-20260516-183012/` | Dated AI Command deep audit. | Archive as folder after final AI Team truth acceptance. | Medium: detailed evidence loss. | Archive candidate |
| `audits/frontend/ai-command/team-vision/` | Team vision/gap/routing/tool-drawer history. | Archive after unique contracts are reconciled into canonical AI Team docs. | Medium to high: may contain route/tool contract detail. | Archive candidate |
| `audits/frontend/page-upgrade-roadmap/` | Many page upgrade passes and closeouts. | Archive only after current final execution order is accepted and unique findings are linked. | High if deleted early: page-specific regressions may be forgotten. | Archive candidate |
| `audits/frontend/css-legacy-cleanup-planning/` | CSS cleanup planning history. | Archive after CSS ownership contract and current CSS map are accepted. | Medium: CSS cleanup rationale lost. | Archive candidate |
| `audits/frontend-debug/interaction-blocking/` | Debug evidence folder. | Archive as debug history; do not delete until interaction bugs are closed. | Medium. | Archive candidate |
| `audits/frontend-debug/interaction-fix/index.before.html` | Before snapshot, useful only as regression evidence. | Archive with debug pack; later delete only after owner review. | Medium: loses before/after regression proof. | Archive then possible later delete |
| `audits/frontend-debug/interaction-fix/setup.before.js` | Before snapshot, useful only as regression evidence. | Archive with debug pack; later delete only after owner review. | Medium. | Archive then possible later delete |
| `audits/runtime-state/p2-5-aiworkspace-selectors/ai-command.before-selectors.bak` | Backup/before selector snapshot signal from duplication inventory. | Archive with runtime-state migration evidence; later delete only if preserved elsewhere. | Medium. | Archive then possible later delete |

## Delete Candidate

| Path | Reason | Recommended action | Risk if deleted | Disposition |
|---|---|---|---|---|
| `audits/frontend-debug/interaction-fix/index.before.html` | Possible later delete candidate only after archived and confirmed redundant. | Do not delete now. Archive first, then owner review. | Medium: may be only before snapshot for interaction fix. | Later delete only |
| `audits/frontend-debug/interaction-fix/setup.before.js` | Possible later delete candidate only after archived and confirmed redundant. | Do not delete now. Archive first, then owner review. | Medium. | Later delete only |
| `audits/runtime-state/p2-5-aiworkspace-selectors/ai-command.before-selectors.bak` | Backup snapshot, likely redundant after migration closeout but not proven by evidence. | Do not delete now. Archive first, then owner review. | Medium: selector regression context may be lost. | Later delete only |
| `audits/runtime-state/p2-5-selector-adoption/home.js.before-selectors.bak` | Backup snapshot named in duplication/legacy signals. | Do not delete now. Archive first, then owner review. | Medium. | Later delete only |
| `audits/runtime-state/p2-7-workflows-selector-adoption/workflows.before-selectors.bak` | Backup snapshot named in duplication/legacy signals. | Do not delete now. Archive first, then owner review. | Medium. | Later delete only |

No immediate deletion is approved by this map. Every delete candidate above is a later-delete-only candidate after archive, owner review, and proof that canonical evidence is preserved.
