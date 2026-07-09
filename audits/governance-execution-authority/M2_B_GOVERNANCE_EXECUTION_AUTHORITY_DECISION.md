# M2-B — Governance + Execution Authority Decision

## 0. Decision Status

Status: DECISION RECORDED
Phase: M2 — Governance + Execution Authority Closeout
Mode: Documentation decision
Runtime changes: none
UI changes: none
Backend behavior changes: none
Provider execution changes: none
Publishing behavior changes: none
Ads execution changes: none
CRM mutation changes: none
Customer reply/send changes: none

## 1. Purpose

M2-B records the official governance and execution authority decision after the M2-A truth scan.

This document does not approve a runtime patch.

The goal is to define what is already protected, what remains frontend-only, what requires backend proof, and what future patch scope may be allowed only after another truth scan.

## 2. Prior Phase Baseline

M0 is closed.

M1 is closed.

M1 final closeout document:

`audits/ai-team-operating-contract/M1_AI_TEAM_OPERATING_CONTRACT_CLOSEOUT.md`

M1 confirmed the AI Team Operating Contract as valid and governance-safe.

M1 final commits:

- `10ab847 Add AI team contract alignment decision`
- `43e76c6 Align AI team role aliases`
- `3ef4c35 Close AI team operating contract phase`

## 3. M2-A Truth Scan Result

M2-A was read-only.

Final status:

- Repository clean
- Local branch equal to origin
- No runtime changes
- No UI changes
- No backend changes

Validation remained clean:

- AI Team Operating Contract validation: PASS
- Contract conformance check: PASS
- Failures: 0
- Warnings: 10
- Handoff drift pairs: 0
- Final verdict: READY FOR NARROW AI COMMAND ALIAS INTEGRATION CANDIDATE

Core syntax validation passed for:

- `runtime/orchestrator-service/server.js`
- `runtime/orchestrator-service/lib/media/library-engine.js`
- `runtime/orchestrator-service/lib/security/governance-mutation-gate.js`
- `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js`
- `public/control-center/app.js`
- `public/control-center/router.js`
- `public/control-center/api.js`
- `public/control-center/automation-engine.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/governance.js`
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/ads-manager.js`

## 4. Authority Model Confirmed

The active AI Team Operating Contract defines the following authority levels:

- `review_only`
- `draft_only`
- `handoff_only`
- `approval_required`
- `owner_workspace_required`
- `manual_execution_only`
- `auto_mode_later`
- `forbidden_from_ai_command`

These levels are considered the current governance vocabulary for AI team behavior, page ownership, and execution limits.

## 5. Forbidden Actions Confirmed

The active AI Team Operating Contract defines the following forbidden actions:

- `publish`
- `send_customer_reply`
- `send_email`
- `approve`
- `reject_approval`
- `launch_ads`
- `change_budget`
- `mutate_crm`
- `change_ticket_status`
- `assign_conversation`
- `run_provider_execution`
- `run_backend_job`
- `override_governance`
- `sync_provider`
- `delete_record`

These actions are considered protected and must not be performed directly by AI Command or any AI specialist output.

## 6. Page Authority Decision

M2-A confirmed the following high-risk page authority posture:

- `ai-command` = `handoff_only`
- `publishing` = `approval_required`
- `ads-manager` = `approval_required`
- `governance` = `approval_required`
- `workflows` = `manual_execution_only`
- `customer-center` = `draft_only`
- `integrations` = `approval_required`
- `task-center` = `owner_workspace_required`
- `queue-center` = `review_only`
- `job-monitor` = `review_only`

Decision:

This authority posture is acceptable for M2 closeout direction.

No new authority level is required now.

No page should be moved to a more permissive authority level in M2.

## 7. AI Command Execution Boundary

Decision:

AI Command remains a handoff-only and review/draft workspace.

AI Command may prepare:

- guidance
- drafts
- task previews
- workflow previews
- handoffs
- approval requests
- execution reviews

AI Command must not directly:

- publish externally
- launch ads
- send customer replies
- send emails
- mutate CRM
- change ticket status
- run provider execution
- run backend jobs
- approve or reject governance items
- override governance

M2 does not approve AI Command direct execution.

## 8. Publishing Execution Boundary

M2-A found that the publishing page is structured around manual publishing records, queue preparation, manual review, and recording manual completion.

Important decision:

Publishing status actions are high-risk lifecycle updates.

The current page copy indicates that recording manual publish completion does not prove external provider publishing by itself.

This is acceptable as long as publishing remains manual-review and approval-governed.

M2 does not approve external auto-publishing.

M2 does not approve provider publish execution from AI Command.

M2 does not approve removing final confirmation prompts.

Future work may inspect whether backend publishing endpoints enforce approval gates independently from frontend confirmation prompts.

## 9. Ads Execution Boundary

Decision:

Ads Manager remains approval-required.

M2 does not approve:

- launching live ads
- changing budgets
- syncing or mutating paid provider state
- external ads execution from AI Command
- automatic spend changes

Future work must verify backend ads endpoints before enabling any execution behavior.

## 10. Governance Page Boundary

Decision:

Governance remains approval-required but AI and page logic must not bypass governance by approving itself.

The governance workspace may prepare review, risk, policy, compliance, and approval context.

M2 does not approve AI-driven self-approval.

M2 does not approve governance override.

## 11. Automation Engine Boundary

M2-A found that the Automation Engine is conservative and includes manual approval concepts for sensitive flows.

Decision:

Automation may prepare safe steps, drafts, handoffs, and guided state.

Automation must not directly:

- publish externally
- perform destructive actions
- spend money
- change provider credentials
- bypass approval gates
- mutate CRM/customer/ticket records without owner workspace rules

Future M2 work may document automation gate requirements more formally.

## 12. Backend vs Frontend Decision

M2-A confirms that the contract and frontend contain strong governance language and safety boundaries.

However, M2-A does not fully prove every backend endpoint enforces those same gates independently.

Decision:

Before any new execution capability is enabled, the system must run a backend endpoint enforcement scan.

The scan must verify whether the following are enforced server-side:

- publish lifecycle transitions
- approval status transitions
- provider execution
- ad launch/budget changes
- CRM mutations
- customer reply/send actions
- governance approvals/rejections
- destructive record operations
- integration sync/provider mutations

Until that proof exists, the safe assumption is:

Backend enforcement must still be verified before expanding execution authority.

Frontend confirms and explains, but backend enforcement must still be verified per endpoint before expanding execution authority.

## 13. Remaining Known Warnings

The M1/M2 conformance warnings remain accepted and non-blocking for this decision:

- AI Command local alias drift remains expected.
- route-role-fallback alias drift remains expected.
- unknown route candidates remain classification warnings, not authority failures.

Unknown route candidates remain:

- `action`
- `analysis`
- `automation-engine`
- `command`
- `idle`
- `set-page`

Current classification:

- `action` = UI action key, not page route
- `analysis` = internal AI route/state, not confirmed page route
- `automation-engine` = automation source/handoff source, not standard UI page
- `command` = command runtime concept, not page by itself
- `idle` = status/state value, not page route
- `set-page` = library internal command, not page route

No page owner mapping is approved for these tokens in M2-B.

## 14. M2 Decision

M2-B decision:

No runtime patch is approved yet.

No UI patch is approved yet.

No backend patch is approved yet.

The next approved step is a narrow backend enforcement scan or a closeout document, depending on whether M2 requires stronger proof before closure.

Recommended next step:

M2-C — Backend Governance Enforcement Truth Scan

This scan should inspect route handlers and API methods for protected actions before deciding if a patch is required.

## 15. Safety Rules for Next Step

Do not patch blindly.

Do not normalize route-role-fallback yet.

Do not change AI Command execution behavior yet.

Do not change publishing behavior yet.

Do not change ads behavior yet.

Do not add provider execution.

Do not remove confirmation prompts.

Do not relax forbidden actions.

Do not change authority levels without a dedicated decision document.

