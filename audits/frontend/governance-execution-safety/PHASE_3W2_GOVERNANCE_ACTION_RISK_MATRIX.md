# PHASE 3W.2 — Governance Action Risk Matrix

## Status
Completed from static evidence review.

No browser mutation was executed in this phase.

## Summary Decision
Governance is a backend-authoritative operating surface.

It contains:
- UI-only navigation and focus actions
- backend approval creation actions
- backend approval decision mutations
- backend governance policy mutations
- settings-to-governance policy sync
- AI guidance-only handoffs

Governance is also connected to Publishing safety through backend policy checks:
- `freeze_publishing`
- `approval_before_publish`
- latest Publishing approval status
- accepted approval statuses: `approved` or `overridden`

This confirms Governance is an authority surface and must be handled with the same or higher caution than Publishing.

## Action Matrix

| Action / Button | Handler Evidence | Mutation Type | Backend/API? | Confirmation? | Affects Approval? | Affects Policy? | Affects Publishing? | Risk | Notes |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| Refresh Governance Data | `data-governance-action="refresh"` / `refreshGovernance` | Backend read / UI refresh | Yes, read only | No | No | No | No | Low | Reloads Governance summary only. |
| View Full Queue / Focus Tabs | `data-governance-focus` | Session/UI state | No | No | No | No | No | Low | Changes visible focus only. |
| Select Governance Item | `data-governance-select` | Session/UI state | No | No | No | No | No | Low | Selects item locally for inspection. |
| Submit Approval Decision | `data-governance-decision="approved"` / `decideProjectApproval` | Backend approval decision mutation | Yes | Yes | Yes | Indirect | Yes, when policy requires approval before publish | High | Records approved decision. Confirmation copy says it may affect downstream readiness. |
| Submit Rejection Decision | `data-governance-decision="rejected"` / `decideProjectApproval` | Backend approval decision mutation | Yes | Yes | Yes | Indirect | Yes, may block readiness | High | Records rejection decision and may affect linked queues/review state. |
| Request Changes Review | `data-governance-decision="changes_requested"` / `decideProjectApproval` | Backend approval decision mutation | Yes | Yes | Yes | Indirect | Yes, may block readiness | Medium-high | Records changes requested. |
| Escalate Review | `data-governance-decision="escalated"` / `decideProjectApproval` | Backend approval decision mutation | Yes | Yes | Yes | Indirect | Possible | Medium-high | Sends/records escalation path with `escalate_to`. |
| Record Override Decision | `data-governance-decision="overridden"` / `decideProjectApproval` | Backend approval decision mutation / override | Yes | Yes | Yes | Indirect | Yes, can satisfy approval-before-publish route if accepted | Critical | High-risk because backend publishing gate accepts `overridden` like `approved`. Must remain strongly confirmed and evidence-backed. |
| Request Approval | `data-governance-request-approval` / `createProjectApproval` | Backend approval record creation | Yes | No explicit browser confirm currently shown in evidence | Creates approval | No | Yes, if requested for publishing job/entity | High | Creates durable approval request. Consider future confirmation/copy clarity. |
| Save Governance Policy | `data-governance-action="save-policy"` / `updateProjectGovernancePolicy` | Backend durable policy mutation | Yes | Yes | Indirect | Yes | Yes | Critical | Can change approval-before-publish, claim review, brand safety review, admin override, freeze publishing, owners. |
| Review & Sync Settings Rules | `data-governance-action="sync-settings"` / `updateProjectGovernancePolicy(...mapSettingsToGovernancePolicy)` | Backend policy mutation from Settings bridge | Yes | Yes | Indirect | Yes | Yes | Critical | Syncs Settings-derived rules into enforceable Governance policy. Must remain explicit and reviewed. |
| Open AI Context | `data-governance-open-ai` / `navigateTo("ai-command")` | Navigation only | No backend mutation | No | No | No | No | Low | AI guidance/open context only. |
| AI Prompt Guidance | `data-governance-ai-prompt` / `savePromptToQuickCommand` + navigate | Local AI prompt handoff | No backend mutation | No | No | No | No | Low | Adds prompt to AI Command. Does not approve or mutate policy. |

## Key Findings

### 1. Governance has backend-mutating approval routes
Confirmed API/backend route evidence includes:
- `POST /media-manager/project/:project/approvals`
- `POST /media-manager/project/:project/approvals/:approvalId/decision`

### 2. Governance has backend-mutating policy routes
Confirmed API/backend route evidence includes:
- `GET /media-manager/project/:project/governance`
- `GET /media-manager/project/:project/governance/policy`
- `POST /media-manager/project/:project/governance/policy`

### 3. Publishing is backend-gated by Governance policy
Backend evidence shows publishing mutation checks use:
- `freeze_publishing`
- `approval_before_publish`
- durable publishing job id
- latest publishing approval
- approval status must be `approved` or `overridden`

This is stronger than the previous Publishing audit assumption. Governance is a real authority for approval-sensitive Publishing mutations when backend policy requires it.

### 4. Override is critical risk
Because backend publishing gates accept `overridden`, override is not merely visual. It may unblock downstream publishing mutations.

### 5. Request Approval lacks explicit confirmation in current evidence
Approval creation is a backend mutation. The current evidence shows `createProjectApproval` is called directly from `Request Approval` handler, with success message and refresh.

Future copy/safety plan should decide whether Request Approval needs confirmation or clearer helper copy.

### 6. AI boundary appears safe
AI actions navigate to AI Command or save a prompt. No evidence shows AI can submit approvals or policy changes silently.

## Required Decision
Proceed to:
`PHASE 3W.3 — Governance Boundary Copy / Approval Safety Plan`

Reason:
Before Browser QA or patching, Governance language and controls should clearly distinguish:
- view/focus only actions
- backend approval decisions
- override decisions
- approval request creation
- durable policy changes
- Settings-to-Governance sync
- AI guidance-only handoff

Likely future safe patch areas:
- Stronger warning/copy for Request Approval.
- Stronger override copy.
- Clearer policy save/sync language.
- Clearer Publishing gate relationship.
- Preserve existing confirmations.
- Do not change handlers until separately approved.
