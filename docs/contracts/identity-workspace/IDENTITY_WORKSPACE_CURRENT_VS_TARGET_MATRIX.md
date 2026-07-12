# Phase 1A-8 — Current vs Target Architecture Matrix

| Domain | Current Runtime | Target Architecture | Status |
|---|---|---|---|
| Human identity | Shared-key operator context | Authenticated human principal | Missing |
| Service identity | Implicit/runtime-specific | Authenticated service principal | Missing / partial |
| System actor | Metadata and defaults | Canonical system principal | Missing / partial |
| Workspace | No canonical runtime | Workspace authority boundary | Missing |
| Workspace ownership | Manual proof hint | Principal-to-workspace ownership | Missing |
| Workspace membership | None proven | Durable membership contract | Missing |
| Project membership | None proven | Workspace/project scoped membership | Missing |
| Active workspace | None | Authenticated selected workspace | Missing |
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
| Data resolver | Project/execution/legacy roots | Workspace/project aware resolver | Present / extend |
| Knowledge scope | Project-specific and fragmented | Workspace/project knowledge contract | Not yet inventoried |
| Shared assets | Not canonical | Workspace-shared asset scope | Missing |
| Shared relationships | Not canonical | Workspace relationship scope | Missing |
| Business readiness | Partial readiness outputs | Explainable universal readiness | Missing / partial |
