# M2-D — Backend Governance Enforcement Classification

## 0. Classification Status

Status: CLASSIFICATION RECORDED
Phase: M2 — Governance + Execution Authority Closeout
Mode: Documentation classification
Runtime changes: none
UI changes: none
Backend behavior changes: none
Provider execution changes: none
Publishing behavior changes: none
Ads execution changes: none
CRM mutation changes: none
Customer reply/send changes: none

## 1. Purpose

M2-D records the backend governance enforcement classification after the M2-C truth scan.

M2-C confirmed that protected API surfaces exist, but it did not prove that every protected action has independent backend enforcement.

This document classifies each protected execution area into one of the following categories:

- `backend-enforced`
- `frontend-confirmed-only`
- `documented-only`
- `missing-proof`
- `safe-no-execution-surface`
- `needs-narrow-patch`

This document does not approve a runtime patch.

## 2. Source Inputs

M2-B decision document:

`audits/governance-execution-authority/M2_B_GOVERNANCE_EXECUTION_AUTHORITY_DECISION.md`

Active AI Team Operating Contract:

`public/control-center/runtime/ai-team/ai-team-operating-contract.js`

Frontend API client:

`public/control-center/api.js`

Backend server:

`runtime/orchestrator-service/server.js`

Security guard files:

`runtime/orchestrator-service/lib/security/governance-mutation-gate.js`

`runtime/orchestrator-service/lib/security/runtime-security-enforcement.js`

## 3. M2-C Truth Scan Result

M2-C was read-only.

Final state:

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

## 4. Confirmed Protected API Surfaces

M2-C identified frontend API methods and backend-related surfaces for protected areas.

Observed protected API method candidates include:

- `approvePublishingItem`
- `publishPublishingItem`
- `savePublishingSchedule`
- `reschedulePublishingItem`
- `createProjectApproval`
- `decideProjectApproval`
- `fetchProjectGovernance`
- `fetchProjectGovernancePolicy`
- `updateProjectGovernancePolicy`
- `runProjectWorkflow`
- `syncProjectIntegration`
- `disconnectProjectIntegration`
- `fetchCustomerOperationsReadiness`
- `fetchCustomerOperationsInbox`
- `fetchCustomerConversations`
- `fetchCustomerConversationDetail`
- `fetchCustomerConversationMessages`
- `fetchCustomerProfilePreview`
- `fetchCustomerTickets`
- `fetchCustomerChannels`

This confirms that the system has real governance-sensitive surfaces.

It does not by itself prove backend enforcement for every surface.

## 5. Classification Rules

The classification uses the following meanings.

### 5.1 backend-enforced

Use only when the scan proves backend code independently blocks or validates the action with server-side rules.

Examples of sufficient evidence:

- backend checks approval status before status transition
- backend rejects protected action when governance approval is missing
- backend uses a security guard before mutation
- backend blocks forbidden action regardless of frontend confirmation

### 5.2 frontend-confirmed-only

Use when the frontend requires confirmation or displays warning copy, but backend enforcement is not proven.

This is safer than documented-only but weaker than backend-enforced.

### 5.3 documented-only

Use when the contract, decision docs, or page copy describe a rule, but no concrete runtime enforcement path is proven.

### 5.4 missing-proof

Use when an API surface exists but the scan output is insufficient to determine whether backend enforcement exists.

This requires a narrow follow-up scan before patching.

### 5.5 safe-no-execution-surface

Use when no live mutation/execution endpoint is found for the action area.

This is not the same as backend enforcement. It means the risk is currently limited because no execution surface was proven.

### 5.6 needs-narrow-patch

Use only when a concrete missing enforcement point is proven and the smallest safe patch target is known.

M2-D does not currently approve any patch.

## 6. Protected Area Classification

### 6.1 Publish Lifecycle Transitions

Observed surfaces:

- `savePublishingSchedule`
- `reschedulePublishingItem`
- `approvePublishingItem`
- `publishPublishingItem`

Frontend behavior from M2-A and M2-C indicates:

- publishing actions use confirmation prompts
- publishing page describes manual publishing records
- publish completion is described as manual completion recording
- external provider publishing is not proven by the UI action itself
- backend approval rules are referenced by UI copy

Classification:

`missing-proof`

Rationale:

The API surface exists and is high risk. M2-C confirms the frontend call path, but the available scan output does not fully prove that the backend independently enforces approval state before lifecycle transitions.

Decision:

No patch yet.

Next required proof:

- inspect backend route implementation for publishing schedule, ready, publish/complete, retry, fail, and status transitions
- verify whether backend rejects publish completion when approval is missing
- verify whether backend distinguishes manual completion recording from external provider publishing
- verify whether backend prevents AI Command or automation from invoking publish-like behavior directly

Potential future classification after proof:

- `backend-enforced` if server-side checks exist
- `needs-narrow-patch` if server allows high-risk transitions without enforcement

### 6.2 Approval Status Transitions

Observed surfaces:

- `createProjectApproval`
- `decideProjectApproval`
- `listProjectApprovals`
- governance page and approval-related routes

Classification:

`missing-proof`

Rationale:

Approval APIs exist. The contract explicitly forbids AI-driven approve/reject actions, and governance is approval-required. However, M2-C does not fully prove that the backend enforces who may decide approvals or prevents self-approval / governance override.

Decision:

No patch yet.

Next required proof:

- inspect backend approval creation and decision endpoints
- confirm server-side validation for decision action values
- confirm audit trail creation
- confirm no self-approval or AI auto-approval path
- confirm governance override is blocked
- confirm rejected/approved state transitions are constrained

Potential future classification:

- `backend-enforced` if backend validates approval decisions and audit trail
- `needs-narrow-patch` if backend accepts decisions without guard checks

### 6.3 Provider Execution

Observed surfaces:

- provider keywords found in scan
- integration-related API methods
- AI provider configuration surfaces
- no confirmed direct external provider execution endpoint from AI Command in the M2-C summary output

Classification:

`safe-no-execution-surface` for AI Command direct provider execution.

Secondary classification:

`missing-proof` for backend provider/integration sync paths.

Rationale:

The AI Team contract forbids `run_provider_execution`. M2-C did not prove an AI Command direct provider execution endpoint. However, integration sync/test/reconnect/disconnect endpoints exist and may interact with providers.

Decision:

No provider execution patch is approved.

Next required proof:

- inspect integration sync/test/reconnect/disconnect backend handlers
- confirm whether these actions are simulation/local-state only or real provider calls
- verify credential handling and provider mutation boundaries
- verify `sync_provider` protection is enforced server-side

### 6.4 Ads Launch and Budget Changes

Observed surfaces:

- Ads Manager frontend exists
- ads-related terms are present
- no strong proof of live ads launch or live budget mutation endpoint from M2-C output

Classification:

`safe-no-execution-surface`

Rationale:

M2-C did not show a confirmed live `launch_ads` or budget mutation endpoint. The contract forbids `launch_ads` and `change_budget`, and Ads Manager is `approval_required`.

Decision:

No ads execution patch is required unless a live ads endpoint is later found.

Next required proof:

- inspect Ads Manager API calls and backend ads routes more narrowly
- confirm whether all ads operations are planning/reporting only
- verify no provider spend mutation exists
- verify budget suggestions are draft/review only

### 6.5 CRM Mutations

Observed surfaces:

- customer operations profile/inbox/ticket read APIs
- CRM/customer/ticket keywords
- customer operations readiness and inbox endpoints
- ticket and customer profile fetch methods

Classification:

`safe-no-execution-surface` for confirmed read-only customer surfaces.

Secondary classification:

`missing-proof` for any unscanned mutation/send endpoints.

Rationale:

M2-C output clearly showed multiple customer/customer-operations read surfaces. It did not prove a customer reply, CRM mutation, ticket status mutation, or assignment endpoint in the visible summary.

Decision:

No patch now.

Next required proof:

- verify whether backend has any POST/PATCH/DELETE routes under customer operations
- verify whether send reply, change ticket status, assign conversation, or mutate CRM endpoints exist
- if they exist, inspect backend enforcement before approving use

### 6.6 Customer Reply / Send Email

Observed surfaces:

- customer conversation/message fetch methods
- contract forbids `send_customer_reply` and `send_email`
- no confirmed send endpoint in the M2-C visible summary

Classification:

`safe-no-execution-surface`

Rationale:

No direct send email or customer reply endpoint was proven by M2-C output. The customer operations methods visible from the API client appear read-oriented.

Decision:

No send/reply execution patch is approved.

Next required proof:

- run a narrow scan for POST/PATCH customer conversation endpoints
- verify no hidden send/reply backend handler exists
- confirm any email/provider send capability is not exposed through AI Command

### 6.7 Governance Approvals / Rejections

Observed surfaces:

- `createProjectApproval`
- `decideProjectApproval`
- `fetchProjectGovernance`
- `fetchProjectGovernancePolicy`
- `updateProjectGovernancePolicy`

Classification:

`missing-proof`

Rationale:

Governance APIs exist and are high risk. M2-C confirmed the surface but does not fully prove backend enforcement for approval/rejection authority, policy updates, audit trail, or override prevention.

Decision:

No patch yet.

Next required proof:

- inspect backend decision handler
- inspect governance policy update handler
- verify audit log / timeline events
- verify protected statuses
- verify governance override is impossible or explicitly rejected

### 6.8 Destructive Record Operations

Observed surfaces:

- broad delete/destructive scan was performed
- no final proof of a dangerous destructive endpoint was identified in the visible M2-C summary

Classification:

`missing-proof`

Rationale:

The scan searched for delete/destructive surfaces, but M2-D should not claim absence without a focused endpoint table.

Decision:

No patch yet.

Next required proof:

- create a backend route table for DELETE and destructive POST/PATCH operations
- classify each destructive surface by owner, guard, and risk
- verify no delete operation bypasses governance or audit

### 6.9 Integration Sync / Provider Mutation

Observed surfaces:

- `syncProjectIntegration`
- `disconnectProjectIntegration`
- test/reconnect/import integration methods implied by API client context
- provider/integration keywords found

Classification:

`missing-proof`

Rationale:

Integration operations are sensitive because they may mutate provider state, connection state, credentials, or synced data. M2-C confirms API surface but does not prove backend enforcement.

Decision:

No patch yet.

Next required proof:

- inspect backend integration handlers
- identify whether sync/test/reconnect/disconnect are local mock, local state mutation, or real provider calls
- verify approval/credential gates
- verify no secrets are exposed or logged
- verify provider mutation requires owner workspace and explicit approval

### 6.10 Workflow / Backend Job Execution

Observed surfaces:

- `runProjectWorkflow`
- workflow run endpoint
- automation and task/job center surfaces
- workflows page copy says workflow preparation does not publish, send messages, create CRM records, bypass Governance, or perform destructive actions

Classification:

`frontend-confirmed-only`

Secondary classification:

`missing-proof` for backend workflow runner enforcement.

Rationale:

The frontend has strong confirmation and safety language. However, M2-C does not fully prove backend enforcement inside the workflow run endpoint.

Decision:

No patch yet.

Next required proof:

- inspect backend workflow run endpoint
- inspect workflow execution engine
- confirm protected action list cannot be executed by workflow steps
- confirm approval gate is enforced before any backend job transition
- confirm automation cannot call publish/send/provider/delete operations

## 7. Summary Classification Table

| Protected Area | Classification | Patch Approved Now | Reason |
|---|---|---:|---|
| Publish lifecycle transitions | missing-proof | No | API exists, backend enforcement not fully proven |
| Approval status transitions | missing-proof | No | approval APIs exist, authority checks need proof |
| AI Command direct provider execution | safe-no-execution-surface | No | no confirmed direct provider execution surface |
| Backend integration/provider sync | missing-proof | No | sync/disconnect surfaces exist, enforcement unclear |
| Ads launch / budget change | safe-no-execution-surface | No | no confirmed live launch/budget endpoint |
| CRM read surfaces | safe-no-execution-surface | No | visible surfaces appear read-oriented |
| CRM/customer/ticket mutations | missing-proof | No | mutation/send endpoints need focused proof |
| Customer reply / send email | safe-no-execution-surface | No | no confirmed send endpoint in M2-C output |
| Governance approvals / rejections | missing-proof | No | decision APIs exist, backend guard proof needed |
| Destructive record operations | missing-proof | No | requires focused destructive route table |
| Workflow / backend job execution | frontend-confirmed-only + missing-proof | No | frontend safety exists, backend runner enforcement needs proof |

## 8. M2-D Decision

M2-D decision:

No runtime patch is approved.

No UI patch is approved.

No backend patch is approved.

No authority level is changed.

No forbidden action is relaxed.

The system remains in review-first and governance-first mode.

M2 cannot be fully closed until backend enforcement proof is either documented or narrow patches are applied where concrete gaps are proven.

## 9. Recommended Next Step

Next approved step:

M2-E — Protected Backend Route Table Scan

Purpose:

Create an exact table of backend routes and handlers for:

- publishing lifecycle transitions
- approval decisions
- governance policy updates
- integration sync/test/reconnect/disconnect
- workflow run execution
- customer operations mutations
- send/reply/email actions
- delete/destructive operations
- ads launch/budget operations

The next scan should identify for each route:

- HTTP method
- path
- handler location
- protected action category
- current guard function, if any
- required approval/owner status
- whether backend enforcement is proven
- whether patch is needed

## 10. Safety Rules

Do not patch blindly.

Do not change publishing behavior yet.

Do not change approval behavior yet.

Do not change integrations behavior yet.

Do not change workflow execution behavior yet.

Do not add provider execution.

Do not add ads launch or budget mutation.

Do not add send/customer reply behavior.

Do not relax AI Command limitations.

Do not remove confirmation prompts.

Do not weaken forbidden actions.

Do not close M2 until backend route proof is documented.

