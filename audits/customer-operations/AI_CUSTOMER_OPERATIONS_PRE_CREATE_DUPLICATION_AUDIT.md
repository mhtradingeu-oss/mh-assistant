# AI Customer Operations OS — Pre-Create Duplication Audit

## Date
Fri May 15 02:14:31 AM UTC 2026

## Purpose
Check existing code, docs, audits, runtime, and data before creating any customer operations architecture file.

## Existing matching files
./archive/migration-safety/runtime-20260505/app.js.pre-xhr-watchdog-support
./audits/customer-operations/AI_CUSTOMER_OPERATIONS_PRE_CREATE_DUPLICATION_AUDIT.md
./audits/frontend/ai-command/AI_COMMAND_PHASE_2_5_UX_TOOLING_VOICE_CHAT_READINESS.md
./audits/frontend/full-frontend-audit/derived/api_calls_in_pages.txt
./audits/runtime/execution-runtime-called-functions.txt
./audits/runtime/performance-feedback-called-functions.txt
./audits/runtime/recommendation-runtime-called-functions.txt
./runtime/orchestrator-service/lib/insights/ingestion-service.js
./runtime/orchestrator-service/lib/integrations/providers/unsupported.js
./runtime/orchestrator-service/lib/media/native/knowledge/brand-voice-audio-guide.json
./runtime/orchestrator-service/lib/media/native/knowledge/voice-tone-profiles.json
./runtime/orchestrator-service/lib/media/native/native-voice-chat-runtime.js
./runtime/orchestrator-service/lib/media/native/rendering/rendering-voice-chat-adapter.js

## High signal references
audits/system-consolidation/master-docs-consolidation/MH_OS_MASTER_SOURCE_BUNDLE.md:2855:- Add Compliance Reviewer panel and approval SLA/status summary.
audits/system-truth/FULL_SYSTEM_TRUTH_AUDIT.txt:1240:runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/system-truth/FULL_SYSTEM_TRUTH_AUDIT.txt:1266:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/system-truth/FULL_SYSTEM_TRUTH_AUDIT.txt:1412:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/system-truth/03-backend-capabilities.txt:932:runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/system-truth/03-backend-capabilities.txt:958:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/system-truth/03-backend-capabilities.txt:1104:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md:74:- Missing AI team experience: Ownership/escalation exists in backend operations but is not strongly surfaced in-page.
audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md:263:- Missing smart tools: Better escalation guidance and historical override visibility.
audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md:264:- Missing AI team experience: Better than most pages, but escalation chain and ownership graph can be surfaced more explicitly.
audits/final-system-audit/MH_OS_PAGE_BY_PAGE_AUDIT.md:273:  - Add standardized side-panel layout and escalation UX.
audits/final-system-audit/MH_OS_NEXT_DEVELOPMENT_PLAN.md:63:- This page anchors approvals, violations, escalations, and policy visibility.
audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md:26:- Confirmed: Team model, role routes, service domains, escalation chains, status models, and canonical governance defaults live in the backend backbone.
audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md:29:  - Evidence: buildGovernanceSummary derives approval queue, claim review, brand safety review, publish guardrails, policy violations, escalation queue, and audit timeline in runtime/orchestrator-service/lib/ops/backbone.js.
audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md:42:- Confirmed: The AI team model exists in the backend as a durable team model with members, active role, route permissions, service model, and escalation chain.
audits/final-system-audit/MH_OS_FULL_SYSTEM_AUDIT.md:49:- Confirmed: Claim review, brand safety review, publish guardrails, notifications, escalation tasks, and overrides all have durable backend representations.
audits/customer-operations/AI_CUSTOMER_OPERATIONS_PRE_CREATE_DUPLICATION_AUDIT.md:7:Check existing code, docs, audits, runtime, and data before creating any customer operations architecture file.
audits/runtime-governance/p1-15-final-freeze/P1_15_FINAL_FREEZE_CHECKPOINT.md:24:- escalation chains
audits/runtime-governance/p1-4-backend-projection-contract/AUTHORITY_PROJECTION_FIELDS.md:11:- escalation_chain
audits/runtime-governance/p1-4-backend-projection-contract/P1_4_BACKEND_PROJECTION_CONTRACT.md:19:- escalation_chain
audits/runtime-governance/p1-4-backend-projection-contract/P1_4_BACKEND_PROJECTION_CONTRACT.md:45:- escalation authority
audits/runtime-governance/backend-authority-scan.txt:20:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
audits/runtime-governance/backend-authority-scan.txt:155:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/runtime-governance/backend-authority-scan.txt:176:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/runtime-governance/backend-authority-scan.txt:292:2690:      escalation_chain: approval.escalation_chain
audits/runtime-governance/backend-authority-scan.txt:313:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/runtime-governance/backend-authority-scan.txt:329:2900:      owner: roleDisplay(team, escalationTargetRole),
audits/runtime-governance/backend-authority-scan.txt:330:2901:      owner_role: escalationTargetRole,
audits/runtime-governance/backend-authority-scan.txt:331:2902:      assignee: roleDisplay(team, escalationTargetRole),
audits/runtime-governance/backend-authority-scan.txt:332:2903:      assignee_role: escalationTargetRole,
audits/runtime-governance/p1-11-route-permission-shadow/backend-route-permission-current.txt:11:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
audits/runtime-governance/p1-14-frontend-authority-deprecation/P1_14_FRONTEND_AUTHORITY_DEPRECATION_MAP.md:42:- escalation chain
audits/runtime-governance/p1-3-conflict-classification/P1_3_AUTHORITY_CONFLICT_CLASSIFICATION.md:11:Backend backbone already defines canonical team roles, service domains, permissions, route permissions, and escalation chains.
audits/runtime-governance/p1-3-conflict-classification/P1_3_AUTHORITY_CONFLICT_CLASSIFICATION.md:43:Backend backbone owns governance policy, approval decisions, escalation, and publish guardrails.
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:850:public/control-center/pages/settings.js:117:    service: "System control & escalation ownership",
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:863:public/control-center/pages/settings.js:349:    description: "Make ownership, escalation, and revision rules explicit so content moves quickly without losing control.",
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:877:public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:952:public/control-center/pages/settings.js:943:      escalationNotes: "Escalate legal-sensitive claims and launch blockers to brand owner plus operations lead."
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1068:public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">0. Review Model</div><h3>Ownership and escalation chain</h3></div></div>
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1074:public/control-center/pages/governance.js:168:        ${Object.entries(escalationChain).map(([risk, roles]) => `
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1075:public/control-center/pages/governance.js:171:            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1086:public/control-center/pages/governance.js:223:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1154:public/control-center/pages/governance.js:458:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1227:public/control-center/pages/governance.js:762:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1249:public/control-center/pages/governance.js:814:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1251:public/control-center/pages/governance.js:817:                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/runtime-governance/conflicts/frontend-authority-full-scan.txt:1316:public/control-center/pages/governance.js:1003:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:21:runtime/orchestrator-service/lib/ops/backbone.js:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:203:runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:216:runtime/orchestrator-service/lib/ops/backbone.js:1575:    ...escalationApprovals,
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:226:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:387:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:413:runtime/orchestrator-service/lib/ops/backbone.js:2763:  const escalationTargetRole = normalizeRoleKey(
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:414:runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:416:runtime/orchestrator-service/lib/ops/backbone.js:2791:        escalate_to: escalationTargetRole
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:429:runtime/orchestrator-service/lib/ops/backbone.js:2835:      escalate_to: escalationTargetRole
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:435:runtime/orchestrator-service/lib/ops/backbone.js:2899:      description: next.decision_note || 'Governance escalation requires follow-up.',
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:436:runtime/orchestrator-service/lib/ops/backbone.js:2900:      owner: roleDisplay(team, escalationTargetRole),
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:437:runtime/orchestrator-service/lib/ops/backbone.js:2901:      owner_role: escalationTargetRole,
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:438:runtime/orchestrator-service/lib/ops/backbone.js:2902:      assignee: roleDisplay(team, escalationTargetRole),
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:439:runtime/orchestrator-service/lib/ops/backbone.js:2903:      assignee_role: escalationTargetRole,
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:584:runtime/orchestrator-service/lib/ops/backbone.js:3911:      escalation_chain: asObject(team.escalation_chain)
audits/runtime-governance/conflicts/backend-authority-full-scan.txt:598:runtime/orchestrator-service/lib/ops/backbone.js:3932:      escalation_chain: asObject(team.escalation_chain)
audits/runtime-governance/conflicts/backbone-authority-head.txt:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
audits/frontend/full-cleanup/frontend-ui-reference-scan.txt:742:public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">0. Review Model</div><h3>Ownership and escalation chain</h3></div></div>
audits/frontend/consolidation/final-system-audit/NEXT_IMPLEMENTATION_PLAN.md:58:- Define explicit constraints for command execution and escalation.
audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt:1205:runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt:1336:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt:1357:runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/frontend/consolidation/final-system-audit/SCAN_EVIDENCE.txt:1373:runtime/orchestrator-service/lib/ops/backbone.js:2901:      owner_role: escalationTargetRole,
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:46:- The backend team model defines roles, route permissions, service domains, ownership, review roles, handoff paths, and escalation chains. See [runtime/orchestrator-service/lib/ops/backbone.js](../../runtime/orchestrator-service/lib/ops/backbone.js).
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:64:- Operations Centers already offer task, queue, job, and notification operational views, which are the correct destination for workflow execution and escalation. See [public/control-center/pages/operations-centers.js](../../public/control-center/pages/operations-centers.js).
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:91:| SEO and Insights Analyst | Interpret search, performance, and audience data into action. | Title, active datasets, signal health, platform scope, report status. | Trend analysis, ranking view, report draft, recommendation panel, research launch. | Analytics, SEO signals, campaign performance, content history. | Draft reports, surface weak signals, suggest research tasks. | Reframe unsupported metrics as facts, auto-execute changes. | insights, research, home, workflows | `Review readiness, signals, gaps, and recent activity. Tell me what data matters most and what to improve next.` | Required when the output becomes a task, workflow, or escalation. |
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:92:| Compliance Reviewer | Guard claims, brand safety, and publish safety. | Title, risk level, policy rules, approvals, escalation path. | Claim review, publish guardrails, policy view, decision panel. | Governance policy, legal docs, brand rules, campaign claims. | Review, request changes, approve or reject within policy. | Release content without review, invent policy, override admin limits. | governance, content-studio, media-studio, publishing | `Review launch blockers, claims, approvals, and publishing safety. Tell me what must be checked before release.` | Always required for risky content, publishing, or brand safety. |
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:93:| Operations Lead | Turn intent into tasks, timelines, handoffs, and operational control. | Title, backlog, blockers, task status, workflow stage, escalation status. | Task builder, workflow draft, handoff route, queue view, confirmation panel. | Tasks, approvals, queue items, jobs, handoffs, project state. | Draft tasks, workflows, handoffs, and escalation suggestions. | Run operations automatically from the frontend or hide authority. | workflows, operations centers, governance | `Review tasks, blockers, failed jobs, and execution health. Give me the next operational steps.` | Required for workflow run, publish, approval, or escalation. |
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:141:- Frontend may recommend escalation, but backend must decide and enforce.
audits/frontend/ai-command/AI_TEAM_COMMAND_CENTER_PRODUCT_TECHNICAL_AUDIT.md:262:- `escalation_path`
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:372:public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">Review model</div><h3>Ownership and escalation chain</h3></div></div>
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:1965:public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">Review model</div><h3>Ownership and escalation chain</h3></div></div>
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:2005:public/control-center/pages/governance.js:445:  const escalations = asArray(sections.escalation_queue).map((item) => ({
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:2074:public/control-center/pages/governance.js:628:            ${renderMetric("Escalations", asArray(sections.escalation_queue).length, "Higher-level review", escapeHtml)}
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:2108:public/control-center/pages/governance.js:883:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:2115:public/control-center/pages/governance.js:936:      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:6226:public/control-center/pages/governance.js:171:            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:6241:public/control-center/pages/governance.js:223:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:6281:public/control-center/pages/governance.js:628:            ${renderMetric("Escalations", asArray(sections.escalation_queue).length, "Higher-level review", escapeHtml)}
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:6318:public/control-center/pages/governance.js:831:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
audits/frontend/global-ui-ux-system/GLOBAL_UI_UX_SYSTEM_EVIDENCE.txt:6332:public/control-center/pages/governance.js:886:                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/frontend/global-ui/GLOBAL_FINAL_THEME_AUDIT_AND_DESIGN_CONTRACT.md:226:- Governance: confirm the review and escalation surfaces keep one clear action hierarchy.
audits/frontend/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md:137:| Job Monitor | Safe projection surface, destructive controls deferred | fetch job monitor, route navigation | 4 | Low | Low | Medium | 80 | Add retry/escalation flow only after policy-safe confirmation gate | Yes |
audits/frontend/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md:550:- Task/handoff path: route/escalation guidance.
audits/frontend/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md:558:- Purpose: execution status and escalation projection.
audits/frontend/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md:565:- Task/handoff path: escalation path.
audits/frontend/final-system-audit/FINAL_FRONTEND_SYSTEM_AUDIT_AND_COMPLETION_ROADMAP.md:570:- First safe improvement: add standardized escalation-to-task flow.
audits/frontend/interaction/03-form-click-handlers.txt:209:public/control-center/pages/governance.js:639:              ["escalations", "Escalations", focusCounts.escalations]
audits/frontend/governance/STEP_41E_GOVERNANCE_FINAL_SHELL_HEADER_ADOPTION_AUDIT.md:58:- Approval decisions derive the escalation target from the review model instead of hardcoding a branch decision.
audits/frontend/governance/STEP_41E_GOVERNANCE_FINAL_SHELL_HEADER_ADOPTION_AUDIT.md:87:- Do not change the approval workflow, payload shape, or escalation logic.
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:20:- escalation and override visibility,
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:107:- Required data model: readiness dimensions (policy health, approval latency, escalation burden, publish safety), score history.
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:112:### 2) SLA-Aware Approval Prioritization
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:113:- Feature name: Approval SLA Priority Engine
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:115:- Required backend/API: include SLA/deadline/priority fields per approval and queue item in governance summary.
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:116:- Required data model: approval SLA target, due_at, priority_reason, escalation countdown.
audits/frontend/governance/GOVERNANCE_FINAL_LAUNCH_READY_OPERATING_SURFACE_PASS.md:119:- Recommended future prompt: "Add backend SLA priority fields for governance queue and surface urgency-driven sorting."
audits/frontend/governance/GOVERNANCE_STEP_1_UX_CONTRACT.md:42:  focus: "all",         // Queue filter: all|approvals|claims|brand|publish|escalations
audits/frontend/governance/GOVERNANCE_STEP_1_UX_CONTRACT.md:71:Data source: summary.review_model.ownership, summary.review_model.escalation_chain
audits/frontend/governance/GOVERNANCE_STEP_1_UX_CONTRACT.md:83:Data source: summary.sections (approval_queue, policy_violations, claim_review, brand_safety_review, publish_guardrails, escalation_queue), summary.sections.audit_timeline
audits/frontend/governance/GOVERNANCE_STEP_1_UX_CONTRACT.md:104:- Focus tabs (all, approvals, claims, brand, publish, escalations)
audits/frontend/governance/GOVERNANCE_STEP_1_UX_CONTRACT.md:226:- escalate_to will be derived from escalation_chain
audits/frontend/authority-boundary/workflows-runtime-ownership-audit/WORKFLOWS_RUNTIME_EVIDENCE.txt:2505:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/frontend/authority-boundary/workflows-runtime-ownership-audit/WORKFLOWS_RUNTIME_EVIDENCE.txt:2605:2690:      escalation_chain: approval.escalation_chain
audits/frontend/authority-boundary/publishing-runtime-ownership-audit/PUBLISHING_RUNTIME_EVIDENCE.txt:2033:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/frontend/authority-boundary/publishing-runtime-ownership-audit/PUBLISHING_RUNTIME_EVIDENCE.txt:2129:2690:      escalation_chain: approval.escalation_chain
audits/frontend/safety/STEP_20A_GOVERNANCE_POLICY_SAVE_CONFIRMATION_AUDIT.md:94:escalation controls
audits/frontend/master/PAGE_BLUEPRINTS.md:126:A. Role: Execution job status projection and escalation surface.
audits/frontend/master/PAGE_BLUEPRINTS.md:129:D. Action Panel should include: refresh, open related page, create escalation task.
audits/frontend/master/PAGE_BLUEPRINTS.md:235:B. Header should show: pending approvals, SLA/age, risk level distribution.
audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md:123:- Job Monitor: Execution job status projection and escalation surface
audits/frontend/full-frontend-audit/SCAN_EVIDENCE.txt:853:public/control-center/pages/governance.js:1074:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/frontend/full-frontend-audit/derived/page_route_snippets.txt:627:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/frontend/full-frontend-audit/derived/routes_markers.txt:239:public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
audits/frontend/final-truth/FRONTEND_FINAL_TRUTH_AUDIT_AND_SMART_UX_PLAN.md:550:- Add Compliance Reviewer panel and approval SLA/status summary.
audits/runtime-mapping/runtime-global-scan.txt:2022:public/control-center/pages/governance.js:866:      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
audits/capability-map/FULL_CAPABILITY_MAP.txt:233:runtime/orchestrator-service/lib/ops/backbone.js:418:    escalation_chain: ESCALATION_CHAINS,
audits/capability-map/FULL_CAPABILITY_MAP.txt:234:runtime/orchestrator-service/lib/ops/backbone.js:440:    escalation_chain: {
audits/capability-map/FULL_CAPABILITY_MAP.txt:235:runtime/orchestrator-service/lib/ops/backbone.js:441:      ...defaults.escalation_chain,
audits/capability-map/FULL_CAPABILITY_MAP.txt:236:runtime/orchestrator-service/lib/ops/backbone.js:442:      ...asObject(current.escalation_chain),
audits/capability-map/FULL_CAPABILITY_MAP.txt:237:runtime/orchestrator-service/lib/ops/backbone.js:443:      ...asObject(patch.escalation_chain)
audits/capability-map/FULL_CAPABILITY_MAP.txt:326:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/capability-map/FULL_CAPABILITY_MAP.txt:475:runtime/orchestrator-service/lib/ops/backbone.js:2584:  const escalationChain = normalizeStringList(input.escalation_chain || current.escalation_chain).length
audits/capability-map/FULL_CAPABILITY_MAP.txt:476:runtime/orchestrator-service/lib/ops/backbone.js:2585:    ? normalizeStringList(input.escalation_chain || current.escalation_chain)
audits/capability-map/FULL_CAPABILITY_MAP.txt:479:runtime/orchestrator-service/lib/ops/backbone.js:2615:    escalation_chain: escalationChain,
audits/capability-map/FULL_CAPABILITY_MAP.txt:483:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/capability-map/FULL_CAPABILITY_MAP.txt:484:runtime/orchestrator-service/lib/ops/backbone.js:2760:  const escalationChain = normalizeStringList(current.escalation_chain).length
audits/capability-map/FULL_CAPABILITY_MAP.txt:485:runtime/orchestrator-service/lib/ops/backbone.js:2761:    ? normalizeStringList(current.escalation_chain)
audits/capability-map/FULL_CAPABILITY_MAP.txt:487:runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/capability-map/FULL_CAPABILITY_MAP.txt:488:runtime/orchestrator-service/lib/ops/backbone.js:2766:      escalationChain[0] ||
audits/capability-map/FULL_CAPABILITY_MAP.txt:489:runtime/orchestrator-service/lib/ops/backbone.js:2777:    escalation_chain: escalationChain,
audits/capability-map/FULL_CAPABILITY_MAP.txt:661:runtime/orchestrator-service/lib/ops/backbone.js:3911:      escalation_chain: asObject(team.escalation_chain)
audits/capability-map/FULL_CAPABILITY_MAP.txt:663:runtime/orchestrator-service/lib/ops/backbone.js:3932:      escalation_chain: asObject(team.escalation_chain)
audits/capability-map/FULL_CAPABILITY_MAP.txt:3727:public/control-center/pages/settings.js:561:        options: ["In-app only", "In-app + email", "In-app + Slack", "In-app + escalation queue"]
audits/capability-map/FULL_CAPABILITY_MAP.txt:3768:public/control-center/pages/settings.js:943:      escalationNotes: "Escalate legal-sensitive claims and launch blockers to brand owner plus operations lead."
audits/capability-map/FULL_CAPABILITY_MAP.txt:3820:public/control-center/pages/governance.js:149:  const escalationChain = asObject(reviewModel.escalation_chain);
audits/capability-map/FULL_CAPABILITY_MAP.txt:3821:public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">0. Review Model</div><h3>Ownership and escalation chain</h3></div></div>
audits/capability-map/FULL_CAPABILITY_MAP.txt:3823:public/control-center/pages/governance.js:168:        ${Object.entries(escalationChain).map(([risk, roles]) => `
audits/capability-map/FULL_CAPABILITY_MAP.txt:3850:public/control-center/pages/governance.js:458:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
audits/capability-map/FULL_CAPABILITY_MAP.txt:3866:public/control-center/pages/governance.js:814:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
audits/capability-map/FULL_CAPABILITY_MAP.txt:3870:public/control-center/pages/governance.js:866:      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
audits/capability-map/FULL_CAPABILITY_MAP.txt:3871:public/control-center/pages/governance.js:867:      const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
audits/capability-map/FULL_CAPABILITY_MAP.txt:3890:public/control-center/pages/governance.js:1003:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/capability-map/FULL_CAPABILITY_MAP.txt:5722:runtime/orchestrator-service/lib/ops/backbone.js:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
audits/capability-map/FULL_CAPABILITY_MAP.txt:5876:runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/capability-map/FULL_CAPABILITY_MAP.txt:5899:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/capability-map/FULL_CAPABILITY_MAP.txt:6014:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/capability-map/FULL_CAPABILITY_MAP.txt:6035:runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/capability-map/FULL_CAPABILITY_MAP.txt:6051:runtime/orchestrator-service/lib/ops/backbone.js:2900:      owner: roleDisplay(team, escalationTargetRole),
audits/capability-map/FULL_CAPABILITY_MAP.txt:6052:runtime/orchestrator-service/lib/ops/backbone.js:2901:      owner_role: escalationTargetRole,
audits/capability-map/FULL_CAPABILITY_MAP.txt:6053:runtime/orchestrator-service/lib/ops/backbone.js:2902:      assignee: roleDisplay(team, escalationTargetRole),
audits/capability-map/FULL_CAPABILITY_MAP.txt:6054:runtime/orchestrator-service/lib/ops/backbone.js:2903:      assignee_role: escalationTargetRole,
audits/capability-map/FULL_CAPABILITY_MAP.txt:6542:public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
audits/capability-map/FULL_CAPABILITY_MAP.txt:6678:public/control-center/pages/governance.js:168:        ${Object.entries(escalationChain).map(([risk, roles]) => `
audits/capability-map/FULL_CAPABILITY_MAP.txt:6679:public/control-center/pages/governance.js:171:            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/capability-map/FULL_CAPABILITY_MAP.txt:6689:public/control-center/pages/governance.js:223:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
audits/capability-map/FULL_CAPABILITY_MAP.txt:6753:public/control-center/pages/governance.js:458:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
audits/capability-map/FULL_CAPABILITY_MAP.txt:6823:public/control-center/pages/governance.js:762:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
audits/capability-map/FULL_CAPABILITY_MAP.txt:6842:public/control-center/pages/governance.js:814:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
audits/capability-map/FULL_CAPABILITY_MAP.txt:6844:public/control-center/pages/governance.js:817:                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/capability-map/FULL_CAPABILITY_MAP.txt:6891:public/control-center/pages/governance.js:1003:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/capability-map/governance-capabilities.txt:18:runtime/orchestrator-service/lib/ops/backbone.js:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
audits/capability-map/governance-capabilities.txt:172:runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
audits/capability-map/governance-capabilities.txt:195:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/capability-map/governance-capabilities.txt:310:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/capability-map/governance-capabilities.txt:331:runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/capability-map/governance-capabilities.txt:347:runtime/orchestrator-service/lib/ops/backbone.js:2900:      owner: roleDisplay(team, escalationTargetRole),
audits/capability-map/governance-capabilities.txt:348:runtime/orchestrator-service/lib/ops/backbone.js:2901:      owner_role: escalationTargetRole,
audits/capability-map/governance-capabilities.txt:349:runtime/orchestrator-service/lib/ops/backbone.js:2902:      assignee: roleDisplay(team, escalationTargetRole),
audits/capability-map/governance-capabilities.txt:350:runtime/orchestrator-service/lib/ops/backbone.js:2903:      assignee_role: escalationTargetRole,
audits/capability-map/governance-capabilities.txt:838:public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
audits/capability-map/governance-capabilities.txt:974:public/control-center/pages/governance.js:168:        ${Object.entries(escalationChain).map(([risk, roles]) => `
audits/capability-map/governance-capabilities.txt:975:public/control-center/pages/governance.js:171:            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/capability-map/governance-capabilities.txt:985:public/control-center/pages/governance.js:223:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
audits/capability-map/governance-capabilities.txt:1049:public/control-center/pages/governance.js:458:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
audits/capability-map/governance-capabilities.txt:1119:public/control-center/pages/governance.js:762:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
audits/capability-map/governance-capabilities.txt:1138:public/control-center/pages/governance.js:814:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
audits/capability-map/governance-capabilities.txt:1140:public/control-center/pages/governance.js:817:                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
audits/capability-map/governance-capabilities.txt:1187:public/control-center/pages/governance.js:1003:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/capability-map/ai-capabilities.txt:233:runtime/orchestrator-service/lib/ops/backbone.js:418:    escalation_chain: ESCALATION_CHAINS,
audits/capability-map/ai-capabilities.txt:234:runtime/orchestrator-service/lib/ops/backbone.js:440:    escalation_chain: {
audits/capability-map/ai-capabilities.txt:235:runtime/orchestrator-service/lib/ops/backbone.js:441:      ...defaults.escalation_chain,
audits/capability-map/ai-capabilities.txt:236:runtime/orchestrator-service/lib/ops/backbone.js:442:      ...asObject(current.escalation_chain),
audits/capability-map/ai-capabilities.txt:237:runtime/orchestrator-service/lib/ops/backbone.js:443:      ...asObject(patch.escalation_chain)
audits/capability-map/ai-capabilities.txt:326:runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
audits/capability-map/ai-capabilities.txt:475:runtime/orchestrator-service/lib/ops/backbone.js:2584:  const escalationChain = normalizeStringList(input.escalation_chain || current.escalation_chain).length
audits/capability-map/ai-capabilities.txt:476:runtime/orchestrator-service/lib/ops/backbone.js:2585:    ? normalizeStringList(input.escalation_chain || current.escalation_chain)
audits/capability-map/ai-capabilities.txt:479:runtime/orchestrator-service/lib/ops/backbone.js:2615:    escalation_chain: escalationChain,
audits/capability-map/ai-capabilities.txt:483:runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
audits/capability-map/ai-capabilities.txt:484:runtime/orchestrator-service/lib/ops/backbone.js:2760:  const escalationChain = normalizeStringList(current.escalation_chain).length
audits/capability-map/ai-capabilities.txt:485:runtime/orchestrator-service/lib/ops/backbone.js:2761:    ? normalizeStringList(current.escalation_chain)
audits/capability-map/ai-capabilities.txt:487:runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
audits/capability-map/ai-capabilities.txt:488:runtime/orchestrator-service/lib/ops/backbone.js:2766:      escalationChain[0] ||
audits/capability-map/ai-capabilities.txt:489:runtime/orchestrator-service/lib/ops/backbone.js:2777:    escalation_chain: escalationChain,
audits/capability-map/ai-capabilities.txt:661:runtime/orchestrator-service/lib/ops/backbone.js:3911:      escalation_chain: asObject(team.escalation_chain)
audits/capability-map/ai-capabilities.txt:663:runtime/orchestrator-service/lib/ops/backbone.js:3932:      escalation_chain: asObject(team.escalation_chain)
audits/capability-map/ai-capabilities.txt:3727:public/control-center/pages/settings.js:561:        options: ["In-app only", "In-app + email", "In-app + Slack", "In-app + escalation queue"]
audits/capability-map/ai-capabilities.txt:3768:public/control-center/pages/settings.js:943:      escalationNotes: "Escalate legal-sensitive claims and launch blockers to brand owner plus operations lead."
audits/capability-map/ai-capabilities.txt:3820:public/control-center/pages/governance.js:149:  const escalationChain = asObject(reviewModel.escalation_chain);
audits/capability-map/ai-capabilities.txt:3821:public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">0. Review Model</div><h3>Ownership and escalation chain</h3></div></div>
audits/capability-map/ai-capabilities.txt:3823:public/control-center/pages/governance.js:168:        ${Object.entries(escalationChain).map(([risk, roles]) => `
audits/capability-map/ai-capabilities.txt:3850:public/control-center/pages/governance.js:458:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
audits/capability-map/ai-capabilities.txt:3866:public/control-center/pages/governance.js:814:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
audits/capability-map/ai-capabilities.txt:3870:public/control-center/pages/governance.js:866:      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
audits/capability-map/ai-capabilities.txt:3871:public/control-center/pages/governance.js:867:      const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
audits/capability-map/ai-capabilities.txt:3890:public/control-center/pages/governance.js:1003:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
audits/ux/frontend-scan/routes-and-pages.txt:453:public/control-center/pages/settings.js:100:    description: "Manages variants, spend tests, and escalation into Ads Manager."
audits/ux/frontend-scan/routes-and-pages.txt:477:public/control-center/pages/settings.js:349:    description: "Make ownership, escalation, and revision rules explicit so content moves quickly without losing control.",
audits/ux/frontend-scan/routes-and-pages.txt:522:public/control-center/pages/governance.js:1003:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
runtime/orchestrator-service/lib/ops/backbone.js:170:    actions: ['override_policy', 'manage_team', 'resolve_escalation', 'manage_permissions']
runtime/orchestrator-service/lib/ops/backbone.js:418:    escalation_chain: ESCALATION_CHAINS,
runtime/orchestrator-service/lib/ops/backbone.js:440:    escalation_chain: {
runtime/orchestrator-service/lib/ops/backbone.js:441:      ...defaults.escalation_chain,
runtime/orchestrator-service/lib/ops/backbone.js:442:      ...asObject(current.escalation_chain),
runtime/orchestrator-service/lib/ops/backbone.js:443:      ...asObject(patch.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:1482:  const escalationApprovals = approvals.filter((item) => asString(item.status) === 'escalated');
runtime/orchestrator-service/lib/ops/backbone.js:1574:  const escalationQueue = [
runtime/orchestrator-service/lib/ops/backbone.js:1575:    ...escalationApprovals,
runtime/orchestrator-service/lib/ops/backbone.js:1596:      escalation_chain: governance.escalation_chain || ESCALATION_CHAINS
runtime/orchestrator-service/lib/ops/backbone.js:1610:      escalation_queue: escalationQueue
runtime/orchestrator-service/lib/ops/backbone.js:2584:  const escalationChain = normalizeStringList(input.escalation_chain || current.escalation_chain).length
runtime/orchestrator-service/lib/ops/backbone.js:2585:    ? normalizeStringList(input.escalation_chain || current.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:2615:    escalation_chain: escalationChain,
runtime/orchestrator-service/lib/ops/backbone.js:2690:      escalation_chain: approval.escalation_chain
runtime/orchestrator-service/lib/ops/backbone.js:2760:  const escalationChain = normalizeStringList(current.escalation_chain).length
runtime/orchestrator-service/lib/ops/backbone.js:2761:    ? normalizeStringList(current.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:2763:  const escalationTargetRole = normalizeRoleKey(
runtime/orchestrator-service/lib/ops/backbone.js:2765:      escalationChain.find((role) => normalizeRoleKey(role) !== normalizeRoleKey(current.reviewer_role)) ||
runtime/orchestrator-service/lib/ops/backbone.js:2766:      escalationChain[0] ||
runtime/orchestrator-service/lib/ops/backbone.js:2777:    escalation_chain: escalationChain,
runtime/orchestrator-service/lib/ops/backbone.js:2791:        escalate_to: escalationTargetRole
runtime/orchestrator-service/lib/ops/backbone.js:2835:      escalate_to: escalationTargetRole
runtime/orchestrator-service/lib/ops/backbone.js:2899:      description: next.decision_note || 'Governance escalation requires follow-up.',
runtime/orchestrator-service/lib/ops/backbone.js:2900:      owner: roleDisplay(team, escalationTargetRole),
runtime/orchestrator-service/lib/ops/backbone.js:2901:      owner_role: escalationTargetRole,
runtime/orchestrator-service/lib/ops/backbone.js:2902:      assignee: roleDisplay(team, escalationTargetRole),
runtime/orchestrator-service/lib/ops/backbone.js:2903:      assignee_role: escalationTargetRole,
runtime/orchestrator-service/lib/ops/backbone.js:3911:      escalation_chain: asObject(team.escalation_chain)
runtime/orchestrator-service/lib/ops/backbone.js:3932:      escalation_chain: asObject(team.escalation_chain)
public/control-center/pages/settings.js:100:    description: "Manages variants, spend tests, and escalation into Ads Manager."
public/control-center/pages/settings.js:117:    service: "System control & escalation ownership",
public/control-center/pages/settings.js:349:    description: "Make ownership, escalation, and revision rules explicit so content moves quickly without losing control.",
public/control-center/pages/settings.js:387:        path: "approval.escalationNotes",
public/control-center/pages/settings.js:561:        options: ["In-app only", "In-app + email", "In-app + Slack", "In-app + escalation queue"]
public/control-center/pages/settings.js:943:      escalationNotes: "Escalate legal-sensitive claims and launch blockers to brand owner plus operations lead."
public/control-center/pages/governance.js:149:  const escalationChain = asObject(reviewModel.escalation_chain);
public/control-center/pages/governance.js:153:      <div class="panel-header"><div><div class="panel-kicker">Review model</div><h3>Ownership and escalation chain</h3></div></div>
public/control-center/pages/governance.js:168:        ${Object.entries(escalationChain).map(([risk, roles]) => `
public/control-center/pages/governance.js:171:            <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
public/control-center/pages/governance.js:223:      <textarea id="${escapeHtml(noteId)}" class="setup-input setup-textarea governance-note" rows="3" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(item.decision_note || "")}</textarea>
public/control-center/pages/governance.js:445:  const escalations = asArray(sections.escalation_queue).map((item) => ({
public/control-center/pages/governance.js:447:    queue_kind: "escalation",
public/control-center/pages/governance.js:448:    selected_key: `escalation:${asString(item.entity_id || item.id || item.title)}`,
public/control-center/pages/governance.js:458:  return [...approvals, ...claims, ...brand, ...publish, ...escalations];
public/control-center/pages/governance.js:490:  const escalations = asArray(sections.escalation_queue).length;
public/control-center/pages/governance.js:504:  if (escalations > 0) {
public/control-center/pages/governance.js:505:    blockers.push(`${escalations} escalation${escalations === 1 ? " is" : "s are"} open for higher-level review.`);
public/control-center/pages/governance.js:509:  if (rules.freeze_publishing || escalations > 0) {
public/control-center/pages/governance.js:534:    escalations
public/control-center/pages/governance.js:633:    escalations: queueItems.filter((item) => item.queue_kind === "escalation").length
public/control-center/pages/governance.js:642:      escalations: "escalation"
public/control-center/pages/governance.js:680:              <p>Live governance pressure across approvals, policy, publishing, and escalations.</p>
public/control-center/pages/governance.js:689:            ${renderMetric("Escalations", asArray(sections.escalation_queue).length, "Higher-level review", escapeHtml)}
public/control-center/pages/governance.js:726:                  <span>${escapeHtml(asString(readiness.escalations))} active</span>
public/control-center/pages/governance.js:818:                  ["escalations", "Escalations", focusCounts.escalations]
public/control-center/pages/governance.js:945:              <textarea id="governanceDecisionNote" class="setup-input setup-textarea governance-note" rows="4" placeholder="Add a decision reason, change request, or escalation note.">${escapeHtml(selectedItem?.decision_note || "")}</textarea>
public/control-center/pages/governance.js:997:                    ${Object.entries(asObject(summary.review_model?.escalation_chain)).map(([risk, roles]) => `
public/control-center/pages/governance.js:1000:                        <span>${escapeHtml(asArray(roles).map(titleCase).join(" -> ") || "No escalation path")}</span>
public/control-center/pages/governance.js:1051:      const escalationChain = asObject(session.summary?.review_model?.escalation_chain);
public/control-center/pages/governance.js:1052:      const escalateTo = asArray(escalationChain.high)[1] || asArray(escalationChain.high)[0] || "admin";
public/control-center/pages/governance.js:1194:    description: "Review approvals, policy violations, overrides, escalation, and audit visibility across content, media, campaigns, and publishing."
archive/hairoticmen_cleanup_20260429-003522/hairoticmen/ops/queue.json.backup:22:      "escalation_chain": [
archive/hairoticmen_cleanup_20260429-003522/hairoticmen/ops/approvals.json:37:    "escalation_chain": [
archive/hairoticmen_cleanup_20260429-003522/hairoticmen/ops/queue.json:21:      "escalation_chain": [
archive/hairoticmen_cleanup_20260429-003522/hairoticmen/ops/approvals.json.backup:35:    "escalation_chain": [
archive/migration-safety/hairoticmen-20260505/products-full.json.pre-canonical-path-fix:6280:        "b2b_outreach",
archive/migration-safety/hairoticmen-20260505/products-full.json.pre-canonical-path-fix:6353:        "b2b_outreach",
archive/migration-safety/hairoticmen-20260505/products-full.json.pre-canonical-path-fix:6651:        "b2b_outreach",
data/projects/beauty-off-sprit/ops/team.json:224:        "resolve_escalation",
data/projects/beauty-off-sprit/ops/team.json:398:        "resolve_escalation",
data/projects/beauty-off-sprit/ops/team.json:620:  "escalation_chain": {
data/projects/testproject/ops/team.json:224:        "resolve_escalation",
data/projects/testproject/ops/team.json:398:        "resolve_escalation",
data/projects/testproject/ops/team.json:620:  "escalation_chain": {
data/projects/hairoticmen/ops/approvals.json.backup:35:    "escalation_chain": [
data/projects/hairoticmen/campaigns/internal-review-beard-kit-oil-hair-wax-campaign-package.json:158:      "Barbershop and reseller outreach",
data/projects/hairoticmen/products/product-intelligence/products-full.json:6280:        "b2b_outreach",
data/projects/hairoticmen/products/product-intelligence/products-full.json:6353:        "b2b_outreach",
data/projects/hairoticmen/products/product-intelligence/products-full.json:6651:        "b2b_outreach",
data/projects/nadeem-nour/ops/team.json:224:        "resolve_escalation",
data/projects/nadeem-nour/ops/team.json:398:        "resolve_escalation",
data/projects/nadeem-nour/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/multireadiness_1777665453855/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/multireadiness_1777665453855/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/multireadiness_1777665453855/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/phase375smoke/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase375smoke/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase375smoke/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/multireadiness_1777665476449/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/multireadiness_1777665476449/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/multireadiness_1777665476449/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/phase39smoke/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase39smoke/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase39smoke/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/phase39fresh/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase39fresh/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase39fresh/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/corestabilitysmokev2/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/corestabilitysmokev2/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/corestabilitysmokev2/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/projects/phase3smoke/ops/team.json:224:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase3smoke/ops/team.json:398:        "resolve_escalation",
data/_archive/2026-05-05/projects/phase3smoke/ops/team.json:620:  "escalation_chain": {
data/_archive/2026-05-05/legacy-hairoticmen/brand-assets-hairoticmen/product-intelligence/products-full.json:6280:        "b2b_outreach",
data/_archive/2026-05-05/legacy-hairoticmen/brand-assets-hairoticmen/product-intelligence/products-full.json:6353:        "b2b_outreach",
data/_archive/2026-05-05/legacy-hairoticmen/brand-assets-hairoticmen/product-intelligence/products-full.json:6651:        "b2b_outreach",
