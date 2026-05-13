# STEP 11 - Auto Mode / Publishing / Workflows Safety Audit

Date: 2026-05-13
Scope: Documentation-only safety audit (no production code changes)
Branch context: architecture/frontend-consolidation-v1

## 1) Executive Summary

This Step 11 audit reviewed high-risk automation and execution surfaces across Workflows, Publishing, AI Command, Governance, Settings, shared frontend APIs, and backend authority enforcement.

Primary outcome:
- Backend authority controls are present for publishing mutations and governance policy normalization.
- Frontend surfaces can trigger high-impact intents (publish, approval decisions, workflow runs, policy changes), but most durable enforcement is backend-side.
- Risk remains in UX/action semantics: the UI can still appear to "execute" authority actions directly, and some local-only or cross-page handoff flows can blur operator understanding.

Audit decision:
- No code changes in this step.
- Treat this as a safety classification and control-point inventory before any behavior modifications.

## 2) Files Inspected

Frontend
- public/control-center/pages/publishing.js
- public/control-center/pages/workflows.js
- public/control-center/automation-engine.js
- public/control-center/pages/ai-command.js
- public/control-center/pages/governance.js
- public/control-center/pages/settings.js
- public/control-center/api.js

Backend
- runtime/orchestrator-service/lib/ops/backbone.js
- runtime/orchestrator-service/server.js

Doctrine references used for classification
- audits/frontend/master/FRONTEND_MASTER_AUTHORITY.md
- audits/frontend/master/ACTION_DESTINATION_MAP.md
- audits/frontend/master/PAGE_BLUEPRINTS.md

## 3) Risk Inventory by Surface

### A) Auto Mode (Workflows + Publishing + shared automation engine)
Observed:
- Workflows page exposes Start/Pause/Resume/Stop/Approve/Skip Auto Mode controls.
- Publishing page exposes Auto Prepare with gated publish intent step.
- Shared automation engine has a safe-type allowlist and block-pattern gates for publish/destructive/external-send/payment/credential actions.
- Approval gate handling intentionally does not auto-publish; approval advances flow and navigates for manual handling.

Risk note:
- "Approve and Continue" wording may still imply execution to operators unless consistently framed as navigation/continuation only.

### B) Publishing
Observed:
- Frontend can schedule/reschedule/approve-ready/publish/fail via API methods.
- Frontend form validation requires approvalStatus=approved before local publish intent path.
- Backend publish/ready endpoints call assertPublishingMutationAllowed.
- Backend enforcement checks freeze_publishing and approval_before_publish with restrictive defaults (approval required by default).

Risk note:
- Frontend has local-only draft paths that can mark local state as published; this is non-durable but can create perception risk if misunderstood.

### C) Workflows
Observed:
- Manual and auto runs can call runProjectAiWorkflow/runProjectWorkflow.
- Workflow run outputs can create handoffs/tasks and route into other operational surfaces.

Risk note:
- This is correct as orchestration, but still a high-leverage trigger surface requiring unambiguous labels for "prepare/route" vs "execute externally".

### D) AI Command
Observed:
- AI command auto-plan builder can append a publish_now gated step for publish/external-send/paid-ads/final-approval intent patterns.
- Durable command execution endpoint exists via executeProjectAiCommand.

Risk note:
- Intent-to-plan mapping is broad by keyword and can propose high-risk routes; safety relies on downstream gates and backend policy.

### E) Governance + Settings
Observed:
- Governance page can create approvals, decide approvals, and post policy patches.
- Settings save-all writes governance policy + team model (durable backend updates) and creates handoff context.
- Policy mapping includes approval_before_publish and freeze_publishing bridge semantics.

Risk note:
- These are authority-adjacent controls and should remain explicitly backend-authoritative, with frontend treated as policy projection/editor.

### F) API Layer
Observed:
- API exports direct methods for destructive asset operations, workflow run, AI execution, approvals, governance policy updates, and publishing actions.

Risk note:
- API centralization is useful, but it is also a concentrated authority trigger surface; requires strict endpoint-level backend checks and clear UX destinations.

## 4) Classification Table

| Surface / Action Family | Classification | Why |
| --- | --- | --- |
| Auto Mode safe plan steps (navigate/create draft/handoff/prompt prep) | Safe | Explicit allowlist and block patterns in automation-engine; designed for non-destructive orchestration. |
| Auto Mode gated steps (publish/external send/destructive/payment/credentials) | Approval Required | Gate rules stop auto execution and require human approval action path. |
| Publishing schedule/reschedule/ready/publish/fail | Backend Controlled | Backend assertPublishingMutationAllowed enforces freeze and approval-before-publish with restrictive defaults. |
| Governance approval decisions and policy updates | Backend Controlled + Review Needed | Durable authority mutations are backend endpoints; UX semantics still need strict clarity and audit visibility. |
| Settings save-all durable governance/team writes | Review Needed | Intended architecture is valid, but this is high-authority mutation from frontend control surface. |
| Workflow run/AI workflow run endpoints | Review Needed | Legit orchestration entrypoint; can chain into high-impact outcomes depending on downstream controls. |
| Asset archive/delete endpoints | Dangerous | Destructive semantics (even if soft-delete style) exposed through direct frontend API methods. |
| Local-only publishing "published" marking | Review Needed | Non-durable but can mislead operators if interpreted as true outbound execution. |

## 5) Ambiguous Actions vs ACTION_DESTINATION_MAP

Potentially ambiguous or overloaded labels to monitor:
- "Approve and Continue" in Auto Mode: can be interpreted as execute-now rather than continue-to-manual stage.
- "Publish" from frontend queue controls: valid action, but must always be understood as backend-authorized mutation, not client authority.
- "Auto Prepare" flows containing publish_now step: safe due to gate, but language should remain explicit that execution is blocked until approval and backend checks.

No implementation changes made in this step; this section is a target list for future wording/UX hardening only.

## 6) Hidden Execution Risks

Findings:
- No evidence that frontend Auto Mode directly bypasses backend policy to force publishing.
- Hidden-risk vector is primarily operator perception and route chaining (AI Command -> Workflows -> Publishing) rather than silent client-side hard execution.
- Durable backend AI command/workflow endpoints remain powerful and should be treated as execution authority boundaries requiring server-side validation.

## 7) Destructive Action Risks

Findings:
- Asset archive/delete operations are exposed via direct frontend API methods and backend mutation routes.
- These are high-risk by nature even when modeled as archival/soft deletion.
- Classification: Dangerous; keep behind explicit review/approval UX and robust backend audit logging.

## 8) Frontend-Only Approval Risks

Findings:
- Frontend performs local validation for publishing approval state.
- Backend is the authoritative enforcer for publish-ready/publish mutation gating via governance rules.
- Main risk is mismatch in perceived vs durable state (especially local-only drafts and UI status labels), not pure bypass of backend approval policy.

## 9) Recommended Safe Next Steps (No Changes Applied Here)

1. Add explicit destination labels to all authority-adjacent controls: "Requests backend mutation" vs "Local draft only".
2. Introduce a unified confirmation taxonomy for dangerous/destructive actions (delete/archive/publish-now).
3. Add backend-response provenance badges in UI (for example: "Enforced by governance policy").
4. Add dedicated tests for approval_before_publish and freeze_publishing across ready/publish endpoints and UI trigger flows.
5. Audit and standardize wording for Auto Mode gate actions to remove execute-now ambiguity.

## 10) Must NOT Modify Yet (Guardrails for Next Step)

Do not modify in this Step 11 closeout:
- Backend policy logic or endpoint behavior in runtime/orchestrator-service/server.js
- Backbone governance defaults and normalization in runtime/orchestrator-service/lib/ops/backbone.js
- Runtime routing/authority behavior in app/router layers
- CSS or visual redesign changes
- Data model migrations or persistent schema changes

Reason:
- Step 11 is audit-only and documentation-only by instruction.

## 11) Validation Commands and Results

Commands required by step:
- git status --short
- node --check public/control-center/pages/publishing.js
- node --check public/control-center/pages/workflows.js
- node --check public/control-center/automation-engine.js
- node --check public/control-center/pages/ai-command.js
- node --check public/control-center/pages/governance.js
- node --check public/control-center/pages/settings.js
- node --check public/control-center/app.js
- node --check public/control-center/router.js

Result summary:
- git status --short: ?? audits/frontend/safety/
- node --check public/control-center/pages/publishing.js: pass (exit 0)
- node --check public/control-center/pages/workflows.js: pass (exit 0)
- node --check public/control-center/automation-engine.js: pass (exit 0)
- node --check public/control-center/pages/ai-command.js: pass (exit 0)
- node --check public/control-center/pages/governance.js: pass (exit 0)
- node --check public/control-center/pages/settings.js: pass (exit 0)
- node --check public/control-center/app.js: pass (exit 0)
- node --check public/control-center/router.js: pass (exit 0)
- No syntax errors were introduced by this step (documentation-only).

## 12) Explicit No-Code-Change Statement

Step 11 delivered documentation-only safety auditing.
No production code behavior was modified in this step.
