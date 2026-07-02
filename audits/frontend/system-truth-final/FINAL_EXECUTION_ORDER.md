# Final Execution Order

Evidence base: `audits/frontend/system-truth-final/evidence/01-git-status-and-history.txt` through `audits/frontend/system-truth-final/evidence/28-frontend-module-dependency-import-map.txt`, `audits/frontend/system-truth-final/DOCUMENT_GOVERNANCE_INTAKE.md`, and `audits/frontend/ai-command/full-ai-team-truth-audit/AI_COMMAND_FULL_TEAM_TRUTH_AUDIT.md`.

This execution order is document-only. It does not authorize production code changes, CSS changes, backend changes, `data/projects` changes, document deletion, archiving, renaming, or feature implementation.

## 1. Immediate next phase

Immediate next phase: consolidation and proof, not rebuild.

1. Accept the final truth audit and document governance map.
2. Create the missing release readiness documents identified in evidence: `audits/release/RELEASE_READINESS_FINAL_QA.md` and `audits/release/PRODUCTION_OPERATIONS_READINESS.md`.
3. Run read-only validation and browser QA.
4. Verify source-of-truth mismatch status.
5. Verify AI chat/backend guidance success with fresh evidence.
6. Confirm no document cleanup happens until governance classification is accepted.

## 2. What to do before any UI redesign

1. Confirm Backend = Authority, Frontend = Projection + Experience remains the active doctrine.
2. Re-read `audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md`, `audits/frontend/master/ACTION_DESTINATION_MAP.md`, and `audits/frontend/master/PAGE_BLUEPRINTS.md`.
3. Confirm action destinations, dangerous action confirmations, and review-only boundaries.
4. Complete route/lifecycle risk review for the page being touched.
5. Use existing shell/page primitives before adding page-specific UI.
6. Do not edit CSS until CSS ownership is explicitly in scope.
7. Browser QA the actual page before commit/closeout.

## 3. What to do before any AI Team expansion

1. Preserve AI Command as review-only unless backend-owned execution contracts are created.
2. Freshly verify AI chat/backend guidance success because release evidence includes historical 500 errors.
3. Confirm specialist/tool/destination mapping against `AI_COMMAND_FULL_TEAM_TRUTH_AUDIT.md`.
4. Add no direct publish, approval, workflow execution, CRM write, customer reply, or ticket mutation from AI Command.
5. Improve planned specialist visibility only after routing, handoff, and destination intake are mapped.
6. Browser QA solo mode, Full Team mode, Smart Tool Drawer, Library return, output preview, and handoff routing.

## 4. What to do before customer operations expansion

1. Treat current customer operations as partial.
2. Confirm backend contracts for inbox, conversations, messages, tickets, customers, SLA, channels, and escalations.
3. Define CRM provider strategy before any CRM claim.
4. Define live-send/ticket/escalation confirmation gates.
5. Prove persistence and audit logging for customer-facing actions.
6. Keep AI customer ops in draft/review mode until backend authority and confirmations exist.
7. Browser QA operations center and notification flows after backend readiness is proven.

## 5. What to do before video generator expansion

1. Treat current video generation as partial/planned, not complete.
2. Verify native media provider readiness and worker/GPU availability.
3. Prove `/media-manager/project/:project/native-media/generate` returns durable job/output evidence.
4. Prove `/api/media/generate-video-brief` and media job lifecycle are connected to the target page.
5. Define asset storage, Library save, review, approval, governance, and publishing handoff contracts.
6. Do not claim generated video support until a real output artifact is produced and browser QA verifies it.

## 6. What to do before voice/IVR work

1. Treat voice/IVR as missing until contracts exist.
2. Define telephony/voice provider integration and channel model.
3. Define calls, messages, recordings, transcripts, consent, caller identity, queue routing, SLA, escalation, audit, and retention contracts.
4. Define user confirmation for outbound communications.
5. Keep browser voice/read UI and voice scripts separate from IVR claims.
6. Do not implement frontend voice/IVR UI before backend/data contracts are accepted.

## 7. What to do before document cleanup

1. Accept `DOCUMENT_GOVERNANCE_MAP.md`.
2. Mark each target document as canonical, active, transitional, historical, superseded, duplicate, archive candidate, or delete candidate.
3. Archive before delete.
4. Preserve folder-level evidence packs as complete units unless owner review approves otherwise.
5. Reconcile superseded docs before archiving.
6. Do not delete any document that may contain unique authority, QA, regression, or release evidence.

## 8. What to do before release

1. Create missing final release QA and production operations readiness docs.
2. Run the read-only validation script described by `14-validation-test-script-map.txt`.
3. Browser QA startup, routing, shell, every primary page, confirmations, and handoffs.
4. Freshly prove AI chat/backend guidance works.
5. Triage source-of-truth mismatch logs.
6. Confirm integrations readiness and unsupported provider states.
7. Confirm publishing approval gates and dangerous action confirmations.
8. Confirm no frontend-only authority has been introduced.
9. Produce a release closeout with evidence paths.

## 9. Page-by-page execution order

1. Global Shell / Router / Home: verify startup, project context, navigation, command bar, AI dock, topbar, and next-best-action projection.
2. Setup: verify project foundation, template/save flows, readiness, and safe persistence.
3. Library: verify source-of-truth projection, asset actions, source return, archive/delete confirmations, and mismatch status.
4. Integrations: verify connector health, connect/reconnect/test/sync/import/disconnect, and confirmation gates.
5. AI Command: verify solo/team modes, role mapping, Smart Tool Drawer, Library return, review-only outputs, and destination routing.
6. Workflows: verify workflow run paths, Auto Mode gates, handoffs, and no frontend execution authority.
7. Task Center: verify task visibility, handoff intake, ownership, and status projection.
8. Queue Center: verify queue state, prioritization, and no hidden execution.
9. Job Monitor: verify job status projection, failures, retries/escalation semantics, and no unsafe mutation.
10. Notification Center: verify notification projection, acknowledgement, and customer/ops signal clarity.
11. Governance: verify policy/approval decision confirmations and no publish/send/execute authority.
12. Content Studio: verify draft/version persistence, AI panel, handoff to Media/Publishing, and review boundaries.
13. Media Studio: verify media job states, image/video brief helpers, Library save, review, and Publishing handoff.
14. Campaign Studio: verify campaign planning/package preparation and downstream handoffs.
15. Publishing: verify readiness, schedule/reschedule, approval requirements, final confirmation, and fail paths.
16. Ads Manager: verify planning/projection and no unproven platform execution.
17. Insights: verify insights source projection and learning/recommendation evidence.
18. Research: verify research/learning intake, assistant prompts, and source clarity.
19. Settings: verify configuration saves, confirmations, and backend projection.

## 10. Required Browser QA order

1. Desktop startup smoke: loading overlay, startup unlock, shell, nav, project context.
2. Mobile/tablet shell smoke: sidebar, topbar, overlays, command bar, AI dock.
3. Route sweep: every index navigation route loads the correct page.
4. Home -> Next Best Action -> destination route.
5. Setup save/template paths.
6. Library asset select, status change, source-of-truth, archive/delete confirmation, AI source return.
7. Integrations connect/test/sync/reconnect/disconnect confirmation paths.
8. AI Command solo specialist: chat, tool drawer, source-required flow, output preview, route handoff.
9. AI Command Full Team: team preview, no direct execution, destination handoff.
10. Workflows: run/prep paths, Auto Mode labels, confirmation gates.
11. Task/Queue/Job/Notification centers: data projection, handoff intake, empty/error states.
12. Governance: approval/policy decision confirmations.
13. Content/Media/Campaign studios: draft persistence, handoff states, AI panels.
14. Publishing: approval/readiness blocking, schedule/reschedule, final publish confirmation.
15. Ads/Insights/Research/Settings: projection, safe actions, responsive layout.
16. Regression sweep: no text overlap, broken route, blank page, stuck overlay, or hidden side effect.

## 11. Required commit/closeout protocol

Use the canonical sequence:

Audit -> Confirm -> Decide -> Implement -> Browser QA -> Commit -> Closeout

For authority-sensitive or lifecycle-sensitive changes, the closeout must include:
- evidence paths used
- files changed
- commands run
- browser QA result
- known risks
- rollback note
- confirmation that no backend/frontend authority boundary was weakened

## 12. What must never be done

- Never rebuild the existing system when consolidation is sufficient.
- Never move authority from backend into frontend.
- Never bypass approval, publishing, governance, dangerous action, or customer communication confirmations.
- Never claim voice/IVR, customer CRM/support, or GPU video generation is complete without end-to-end evidence.
- Never delete/archive/rename documents before governance classification.
- Never edit CSS outside an explicit CSS ownership task.
- Never create direct AI Command execution for publishing, approvals, workflows, CRM, tickets, or customer replies.
- Never change `data/projects` during audit/document-only work.
- Never run broad repo scans when the evidence pack is sufficient.
- Never ship release without fresh read-only validation and browser QA evidence.

## 13. Final 2026-ready roadmap

P0 - Truth and release proof:
- Accept final truth/governance/execution docs.
- Create missing release QA and production operations docs.
- Run read-only validation and browser QA.
- Prove AI chat/backend guidance success.
- Triage source-of-truth mismatch.

P1 - Authority and operations consolidation:
- Complete projection runtime/lifecycle consolidation.
- Retire temporary frontend authority fallbacks through backend projection.
- Harden workflows, publishing, governance, and operations centers.
- Clarify integration provider readiness.

P2 - Operating surface completion:
- Reduce large-page coupling risk page by page.
- Improve AI Team planned specialist visibility and advanced intake.
- Complete customer ops backend/data/UI contracts before live operations.
- Prove media/native generation provider readiness before video expansion.

P3 - Expansion after proof:
- Voice/IVR only after communications contracts and provider readiness.
- GPU video generation only after worker/provider/job/output proof.
- CRM/customer live operations only after confirmation gates, audit logs, and provider sync.
- Deeper automation only through backend-owned governance and execution authority.
