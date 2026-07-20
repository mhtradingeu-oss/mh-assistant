# Phase 1B-1B Final Review

Status: Final architecture review; documentation only. This review does not approve runtime implementation or change current authority.

## Executive Summary

The eight Phase 1B-1B contracts form a coherent federated authority design. They correctly separate authentication, Principal identity, Workspace membership, Project membership, scoped assignments, effective permission, governance approval, provider readiness, execution safety, evidence, frontend projection, and shadow observation. Current bounded backend gates and mutation owners remain authoritative.

The design is suitable for canonical-reference approval after the required refinements below. The refinements do not change the architecture. They close implementation ambiguity around fail-closed resolution, authoritative not-applicable evidence, lifecycle transitions, bootstrapping, grant ownership, and scope inheritance.

## Architecture Strengths

- Authority remains federated: the resolver composes evidence and owns only its decision envelope.
- Workspace lifecycle and Workspace-to-Project relationship ownership are preserved and are not confused with Principal membership.
- Project path containment is correctly treated as execution safety rather than authorization.
- Role labels, frontend visibility, access keys, and approval-presence signals are explicitly non-authoritative.
- Principal types distinguish `HUMAN`, `SERVICE`, `SYSTEM`, and `INTEGRATION` actors.
- Membership and assignment records are scoped, versioned, revocable, provenance-aware, and concurrency-aware.
- Decision outcomes distinguish denial, missing context, approval requirements, and unsupported actions.
- Evidence is bounded, redacted, source-qualified, and prohibited from carrying raw credentials or secrets.
- Shadow adoption is non-enforcing and independently reversible without modifying current enforcement.

## Architecture Risks

| ID | Risk | Assessment |
|---|---|---|
| `AR-01` | Permission semantics describe non-allow behavior but do not state one canonical fail-closed rule covering authority, transport, frontend, approval, provider, and execution unknowns. | Required refinement |
| `AR-02` | A caller could interpret an explicit “not applicable” value as self-asserted evidence unless applicability ownership is frozen. | Required refinement |
| `AR-03` | Lifecycle vocabularies identify positive and terminal states but do not freeze minimum permitted transition direction. | Required refinement |
| `AR-04` | Principal, first-membership, and first-grant provisioning could be implemented as an implicit authorization fallback unless bootstrap is explicitly isolated. | Required refinement |
| `AR-05` | “Scoped membership/grant authority” could be read as shared membership mutation ownership. | Required refinement |
| `AR-06` | Future inheritance policy could silently widen a Workspace grant into Project scope without an explicit non-widening rule. | Required refinement |
| `AR-07` | Exact public reason codes, transport mappings, storage components, and freshness budgets remain undecided. | Acceptable deferred implementation work; no authority ambiguity |

## Suggested Improvements

The required changes should:

1. Add a canonical fail-closed rule to the decision-semantics contract using normative engineering language.
2. Require authoritative, versioned applicability evidence before governance, provider, execution, or Project context may be treated as not applicable.
3. Add minimum lifecycle transition rules and make terminal-state behavior explicit for Principals, memberships, and assignments.
4. Define bootstrap and recovery as separate, explicitly approved, auditable operations that can never act as fallback permission.
5. Rename the assignment owner consistently as the future scoped grant authority and preserve membership authorities as validation inputs only.
6. Require inheritance to be explicit, versioned, provenance-bearing, active at both scopes, and unable to exceed the source grant.

## Required Improvements

- `PERMISSION_DECISION_SEMANTICS.md`: add the canonical fail-closed rule and authoritative applicability rule.
- `EFFECTIVE_PERMISSION_CONTRACT_DESIGN.md`: bind not-applicable dispositions to canonical resource/action policy evidence.
- `PRINCIPAL_CONTRACT_DESIGN.md`: freeze minimum transition direction and isolate bootstrap/recovery authority.
- `WORKSPACE_MEMBERSHIP_CONTRACT_DESIGN.md`: freeze minimum transitions and isolate first-membership/recovery provisioning.
- `PROJECT_MEMBERSHIP_CONTRACT_DESIGN.md`: freeze minimum transitions and constrain inherited access to non-widening authoritative policy.
- `ROLE_AND_GRANT_CONTRACT_DESIGN.md`: make the scoped grant authority the unambiguous assignment owner, freeze transitions, isolate initial privileged assignment, and constrain inheritance.

No other contract content requires modification for approval.

## Optional Improvements

The following are intentionally deferred and are not applied in this refinement:

- select concrete persistence components and adapter APIs;
- freeze public transport status/body mappings;
- define the complete reason-code registry;
- set risk-specific evidence freshness and cache budgets;
- choose whether explicit deny assignments ship in the first implementation;
- define operational thresholds and retention periods for future shadow observation.

These choices require a separately approved implementation phase and current-runtime evidence. Resolving them now would exceed documentation refinement or invent runtime ownership.

## Approval Recommendation

`APPROVAL_RECOMMENDATION=APPROVE_AFTER_REQUIRED_REFINEMENTS`

After the required refinements and validation pass, the eight contracts may serve as the permanent implementation reference for future approved work. Approval must remain architectural only: it does not approve runtime adoption, enforcement migration, database work, frontend authority, staging, commit, or push.
