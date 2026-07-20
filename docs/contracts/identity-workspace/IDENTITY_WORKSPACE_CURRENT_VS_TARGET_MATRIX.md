# Phase 1A-8 — Current vs Target Architecture Matrix

Status: Current Phase 1A matrix at baseline `baf62a747f5defa51fa1376eb63272cd965a15b3`. This matrix supersedes its earlier blanket “Workspace missing” classification. See the [runtime truth supplement](IDENTITY_WORKSPACE_RUNTIME_TRUTH_SUPPLEMENT.md) and [Phase 1A universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md).

| Domain | Current Runtime | Target Architecture | Status |
| --- | --- | --- | --- |
| Human identity | Shared-key operator context | Authenticated human principal | Missing |
| Service identity | Implicit/runtime-specific | Authenticated service principal | Missing / partial |
| System actor | Metadata and defaults | Canonical system principal | Missing / partial |
| Workspace | Durable schema, storage, lifecycle runtime, version checks and recovery classifications | Retain current Workspace authority boundary | Present / bounded |
| Workspace-to-Project relationship | Durable versioned attach/detach lifecycle | Retain relationship authority and one-way Project projection | Present |
| Project Workspace projection | Durable derived Project-side projection with drift/reconciliation foundations | Retain as subordinate read model | Present |
| Workspace ownership | Manual proof hint | Principal-to-workspace ownership | Missing |
| Workspace membership | None proven | Durable membership contract | Missing |
| Project membership | None proven | Workspace/project scoped membership | Missing |
| Active workspace | Workspace records exist; no authenticated selected-Workspace authority | Authenticated selected Workspace | Missing / partial foundation |
| Active project | Frontend transient selection | Authorized project context | Partial |
| Project runtime | Implemented | Project under workspace | Present |
| Project path isolation | Implemented | Retain and extend | Present |
| Effective permissions | Keys + route classifications | Principal + membership + RBAC/ABAC | Missing |
| Route security | Implemented | Retain under effective permissions | Present |
| Governance | Implemented | Principal-aware governance | Present / partial |
| Approval identity | Text metadata | Authenticated approver attribution | Missing |
| AI-team operational model | Backend Operations Backbone | Versioned universal AI-team contract | Present / partial |
| AI-team experience model | Frontend model | Projection of canonical role vocabulary | Present / partial |
| Handoffs | Durable + transient compatibility | Durable canonical handoffs | Present |
| Data resolver | Project/execution/legacy roots plus separate durable Workspace storage | Explicit Project/Workspace ownership without collapsing scopes | Present / extend |
| Knowledge scope | Durable Project AI memory plus source-specific knowledge/learning stores | Workspace/Project knowledge policy and provenance contract | Partial / federated |
| Shared assets | Not canonical | Workspace-shared asset scope | Missing |
| Shared relationships | Durable Workspace-to-Project relationship only | Additional relationship domains require separate contracts | Present for Workspace-to-Project; otherwise missing |
| Business readiness | Partial readiness outputs | Explainable universal readiness | Missing / partial |
| Organization | No runtime authority | Separate approved authority only if evidence and ownership justify it | Deferred |
