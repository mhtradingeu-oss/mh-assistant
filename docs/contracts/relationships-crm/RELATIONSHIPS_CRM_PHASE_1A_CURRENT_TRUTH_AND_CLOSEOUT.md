# Relationships and CRM Phase 1A Current Truth and Closeout

Status: Phase 1A documentation closeout and current-truth record

## Purpose and decision status

This record closes Phase 1A-11 documentation by separating the durable Workspace-to-Project relationship authority from customer/CRM records and projections. It does not create a generic relationship registry or claim live CRM, outreach, send, voice, or IVR execution. The [universal reconciliation](../architecture/PHASE_1A_UNIVERSAL_CONTRACT_RECONCILIATION.md) controls precedence.

## Evidence baseline

- Baseline: `main` at `baf62a747f5defa51fa1376eb63272cd965a15b3`.
- Controlling evidence: `.mh-audit/phase-1a-efficient-closeout/20260720T101815Z/CODEX_RECONCILIATION.md` and its compact relationships-CRM index.
- Workspace detail: [Identity/Workspace runtime truth supplement](../identity-workspace/IDENTITY_WORKSPACE_RUNTIME_TRUTH_SUPPLEMENT.md).

## Current owners and mutation boundary

| Concern | Current authoritative owner | Current mutation owner |
| --- | --- | --- |
| Workspace-to-Project relationship | `workspace-relationship-runtime.js` | Its attach, detach, and archive lifecycle functions through Workspace storage |
| Project-side Workspace projection | `project-workspace-projection.js` | Its explicit projection writer only |
| Customer domain | Customer-operations runtime and its stores/contracts | Concrete customer-domain store functions |
| Integration channels | Integration registry/adapter and customer channel mapper in their own scopes | Their concrete domain handlers |

The relationship runtime does not own Project identity, customer relationships, CRM records, or frontend state. The Project projection is subordinate to Workspace relationship authority.

## Producers, consumers, and read-only projections

Producers include Workspace attach/detach lifecycle functions, Project projection writer, customer-domain stores, integration channel adapters, and readiness producers. Consumers include the projection orchestrator, drift inspector, reconciliation executor, Customer Center, integrations, AI draft lanes, and diagnostics. Customer Center, Project Workspace projection reads, readiness snapshots, AI drafts, and reports are projections; they do not acquire send or CRM mutation authority.

## Scope and compatibility

- **Project scope:** Workspace relationships bind identified Projects; customer records retain the Project/domain context supplied by their owner.
- **Workspace scope:** durable versioned Workspace-to-Project relationships exist. Generic Workspace-shared customer relationships, membership, and CRM ownership do not.
- **Compatibility behavior:** Project-side Workspace projection, integration channel mapping, Customer Center read models, transient context, and AI draft/handoff lanes remain adapters or projections. Drift reconciliation flows one way from the named Workspace authority.

## Current verified capabilities

Workspace relationship lifecycle, versioned records, Project projection, drift inspection, and bounded reconciliation foundations exist. Customer inbox/ticket/customer/readiness structures and read projections exist separately. These facts do not combine into a universal relationship or CRM runtime.

## Explicit non-capabilities and unresolved contradictions

- No generic relationship ID/schema, authenticated membership relationship, Workspace CRM authority, durable cross-domain customer graph, or universal relationship permission model is proven.
- Customer stores shown in the controlling evidence are process-memory; their presence does not prove durable CRM.
- Live CRM mutation, outbound send, outreach, reply, consent enforcement, telephony, voice, and IVR execution are missing or unproven.
- A Workspace relationship, customer association, conversation, integration account, and frontend handoff are different domain relationships.

## Deferred implementation gaps and proposed future owner

Workspace relationship evolution remains owned by the Workspace relationship runtime. A future customer/CRM execution owner requires a separately approved durable domain contract and provider path. Deferred work includes durable customer identity/merge rules, consent, membership and access, provider ownership, send/call jobs, audit, retry/idempotency, retention, and cross-domain correlation.

## Adoption gate and validation requirements

Adoption requires domain-namespaced IDs, an explicit durable store owner, Project/Workspace access rules, consent/privacy review, provider readiness and execution proof, idempotent send/call handling, retry/failure/audit evidence, projection parity, compatibility migration and rollback, and proof that Workspace relationship authority is not duplicated.

## Non-production-certification statement

This closeout is not CRM certification, customer-data durability proof, outbound-send proof, provider health proof, voice/IVR execution proof, or production-readiness approval.

## Phase 1A closeout verdict

`PHASE_1A_11_DOCUMENTATION_CLOSED=YES` — Workspace relationship authority and separate customer projections are documented; live CRM/communications runtime remains deferred.
