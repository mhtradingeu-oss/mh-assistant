# Authority Source and Evidence Map

Status: Phase 1B-1B documentation map only; it does not install, replace, or certify any authority.

## Purpose and precedence

This map connects the proposed contracts to current evidence and explicitly identifies gaps. Current installed backend behavior at the exact call site outranks this design. Current bounded owners retain mutation authority. Historical proposals and frontend projections never establish runtime authority.

Evidence basis: the Phase 1B-1 truth scan at baseline `a435111afa83cb82d47d32019208b45f1e44c6dd`, the Phase 1B-1A canonical authority decision, and current contracts under `docs/contracts`.

## Current and future authority map

| Domain | Current source/owner evidence | Current classification | Future contract boundary |
|---|---|---|---|
| Credential acceptance | `runtime/orchestrator-service/server.js` protected read/write key boundaries | Installed, scoped authentication compatibility | Supplies authentication state only |
| Protected-route proof | `runtime/orchestrator-service/lib/security/protected-route-authority.js` | Installed at selected call sites; proof semantics are bounded | Remains independent evidence/gate |
| Runtime security | `runtime/orchestrator-service/lib/security/runtime-security-enforcement.js` | Installed, partial route coverage | Remains current enforcement owner |
| Governance | `runtime/orchestrator-service/lib/security/governance-mutation-gate.js` and Operations Backbone governance records | Installed at selected mutations | Supplies policy/approval evidence; retains mutations |
| Provider constraints | `runtime/orchestrator-service/lib/security/provider-execution-gate.js` | Installed/partial at selected execution paths | Supplies provider/execution evidence; retains gate ownership |
| Project isolation | `runtime/orchestrator-service/lib/security/project-isolation.js` and contained path consumers | Installed safety control, not authorization | Supplies safety evidence only |
| Route classification | `runtime/orchestrator-service/lib/security/route-permission-catalog.js` | Classification; not universal permission | Supplies resource/action/risk hints with provenance |
| Workspace lifecycle | `runtime/orchestrator-service/lib/workspace/workspace-runtime.js` through `workspace-storage.js` | Installed lifecycle authority | Retains Workspace mutation ownership |
| Workspace-to-Project relationship | `runtime/orchestrator-service/lib/workspace/workspace-relationship-runtime.js` | Installed relationship authority | Validates Project context; not Principal membership |
| Project identity/business data | Existing Project/domain owners | Federated installed owners | Retain identity and business mutations |
| Principal identity | No complete canonical authenticated Principal lifecycle proved | Missing/future | [Principal Contract](PRINCIPAL_CONTRACT_DESIGN.md) |
| Workspace membership | No canonical Principal-to-Workspace lifecycle proved | Missing/future | [Workspace Membership Contract](WORKSPACE_MEMBERSHIP_CONTRACT_DESIGN.md) |
| Project membership | No canonical Principal-to-Project membership proved | Missing/future | [Project Membership Contract](PROJECT_MEMBERSHIP_CONTRACT_DESIGN.md) |
| Role/grant assignment | Labels and checks exist; authoritative durable scoped assignment not proved | Missing/future | [Role and Grant Contract](ROLE_AND_GRANT_CONTRACT_DESIGN.md) |
| Effective permission | No composite resolver proved; decisions are distributed | Missing/future | [Effective Permission Contract](EFFECTIVE_PERMISSION_CONTRACT_DESIGN.md) |
| Frontend visibility/roles | Control Center router, fallback, and authority projection | Projection only | May display backend result only |

## Evidence contract

Every future evidence item must include:

- `evidence_id` or opaque reference and `evidence_type`;
- `source_authority` and source contract/version/revision;
- exact Principal, Workspace, Project, resource, action, and scope bindings as applicable;
- observation or issue time, expiry/freshness limit, and status/disposition;
- correlation and audit references;
- redaction classification and permitted consumer class.

Evidence is immutable or revision-pinned for a decision. References are preferred over copied payloads. A consumer must validate provenance, binding, version, freshness, and source disposition; evidence presence alone proves nothing.

Prohibited evidence includes raw credentials, secret values, tokens, session material, provider configuration secrets, unrestricted headers/bodies, unredacted approval payloads, unnecessary personal data, and unrelated resource contents. Hashes or fingerprints must not be included where they create credential-verification or correlation risk.

## Producer, consumer, and mutation boundaries

| Producer | May produce | Must not do through this contract |
|---|---|---|
| Authentication boundary | Credential-acceptance state and bounded method/freshness metadata | Create Principal, membership, grant, or permission |
| Principal authority (future) | Typed active/inactive Principal assertion | Mutate membership, approval, provider, or resource |
| Membership authorities (future) | Scoped lifecycle evidence | Mutate Workspace/Project identity or grants implicitly |
| Grant authority (future) | Versioned scoped assignments and expansion evidence | Own capability definitions or approve governance actions |
| Current governance/provider/security owners | Their bounded decisions and safe reason/evidence references | Become universal identity or permission owner |
| Effective resolver (future) | Immutable normalized decision/comparison evidence | Mutate any input domain or execute the action |

Consumers request only fields needed for their bounded purpose. Frontend and reports receive redacted projections. Audit/security reviewers may receive more detail under separate access control, but never secrets.

## Source-of-truth and collision rules

1. The existing Workspace lifecycle and Workspace-to-Project relationship runtimes are not duplicated by membership contracts.
2. Project membership never replaces Project identity, Project business data, relationship history, or path safety.
3. Route catalogs classify; installed middleware and handler-local checks enforce at their current call sites.
4. Governance owns approval evidence; approval is one permission input, not permission.
5. Provider and execution owners retain readiness and safety decisions.
6. Role/capability definition catalogs remain distinct from scoped assignments.
7. Frontend labels, visibility, buttons, and selected roles remain projection only.
8. Access/control keys remain authentication compatibility and are not membership evidence.
9. The resolver coordinates evidence and owns only its decision record; it is not a universal mutation authority.

## Missing context, denial, idempotency, and concurrency

Unavailable, ambiguous, stale, conflicting, unbound, unsupported-version, or redaction-invalid evidence fails closed under [Permission Decision Semantics](PERMISSION_DECISION_SEMANTICS.md). No alternative projection or label fills an authoritative gap.

Evidence producers use their own idempotency and optimistic-concurrency rules. Resolver evaluation pins source revisions when available and bounds validity by the earliest expiry. Concurrent change, partial observation, or uncertain commit invalidates positive inference. Evidence retries must not duplicate mutations because the resolver is read-only.

## Audit and validation requirements

Audit must distinguish source fact, derived interpretation, normalized outcome, current live result, and shadow comparison. It records provenance and redaction decisions without copying secrets. Retention and access are source- and risk-specific.

Validation requires source availability and version checks; exact binding; freshness/revocation; cross-scope isolation; safe redaction; provenance chain integrity; link/correlation resolution; duplicate-owner detection; and negative tests for key-to-membership, label-to-grant, approval-to-permission, path-to-membership, and frontend-to-authority equivalence.

## Documentation collision register

The following existing records overlap and must be read as prior design/current-truth context, not competing runtime owners:

- [Canonical Architecture](../architecture/MH_OS_CANONICAL_ARCHITECTURE.md) and [Principal/Workspace/Project ADR](../architecture/ADR-001-PRINCIPAL-WORKSPACE-PROJECT-MODEL.md);
- [Identity/Workspace Runtime Truth Supplement](../identity-workspace/IDENTITY_WORKSPACE_RUNTIME_TRUTH_SUPPLEMENT.md);
- [Route/Permission/Security Closeout](../security/ROUTE_PERMISSION_SECURITY_PHASE_1A_CLOSEOUT_DECISION.md);
- [Governance Approval Closeout](../governance/GOVERNANCE_APPROVAL_PHASE_1A_CLOSEOUT_DECISION.md);
- [Capability Execution Contract](../capabilities/canonical-capability-execution-contract.md);
- earlier `docs/final-truth` identity, membership, permission, evidence, resolver, security, and Workspace designs.

If language conflicts, current installed bounded behavior and the Phase 1A universal reconciliation control current truth; the Phase 1B-1A decision controls this phase's future ownership design. No filename containing “canonical,” “authority,” or “contract” creates runtime authority.

## Deferred implementation questions

- What exact source adapters and schemas expose each evidence family safely?
- Which evidence is synchronous, cached, or snapshot-based, and what freshness applies?
- What restricted audit store retains comparisons without becoming a duplicate domain store?
- How are source outages and conflicting versions surfaced operationally?

## Prohibited interpretations

This map is not proof of complete coverage, current Principal/membership/grant/resolver implementation, permission migration, production certification, frontend authority, or approval of a new universal registry.
