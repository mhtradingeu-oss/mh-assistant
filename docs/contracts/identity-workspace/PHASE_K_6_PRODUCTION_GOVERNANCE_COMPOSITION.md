# Phase K-6 — Production Governance Composition

## Decision

`governance-system` is the single reserved Governance authority storage partition. It is not a
customer Project, a Workspace, or a user-selectable Project scope. The central immutable definition
is owned by `lib/security/governance-authority-partition.js`; Workspace callers cannot override it.

The legacy Approval Engine continues to store the partition in its `projectName` argument and
durable `record.project` field. That representation is retained solely for backward compatibility.
Every Workspace governance contract outside the Approval Engine uses `authority_partition`.

## Authority and data ownership

The existing Approval Engine remains the sole approval lifecycle owner:

- `createApproval` produces durable requests.
- `decideApproval` produces durable decisions.
- `listApprovals` reads `data/projects/<partition>/ops/approvals.json`.

The K-6 reader calls only `listApprovals(GOVERNANCE_AUTHORITY_PARTITION, ...)`. It accepts only an
`approval_id`, requires exactly one matching identity, validates the reserved durable partition,
and returns an immutable copy. Missing, duplicate, non-array, non-plain, cyclic, or otherwise
malformed output fails closed.

`data/approvals.json` is rejected as authority because no active producer, consumer, or lifecycle
owner has been proven for it. K-6 neither reads nor writes that file and does not introduce another
Approval Engine or store.

## Authenticated composition

The canonical backend boundary is:

`POST /api/governance/workspaces/mh-trading/creation/prepare`

The body must be exactly:

```json
{ "approval_id": "approval_..." }
```

The route uses the existing configured control-key comparison and attaches the existing
`req.mhAuthorityContext`. The current repository resolves that credential to the authenticated
service principal `legacy-control-center-key`; it has no human session resolver and its RBAC arrays
are empty. K-6 therefore authorizes only an authenticated service principal and requires that
principal to match both durable lifecycle identity fields, while preserving `requested_by` and
`decided_by` as distinct fields in projection. Caller body identity fields never become authority.

This intentionally fails closed for older approvals whose actor fields do not contain the trusted
backend principal identity.

## Read-only flow

The composition is:

authenticated backend context → fixed reserved partition → authoritative `listApprovals` adapter →
Workspace approval projection → K-5E assessment → governed handoff → two byte-equivalent K-5C dry
runs → immutable preparation response.

Workspace Runtime is injected through a facade exposing only
`findWorkspaceByCreationEvidence`. K-5C apply is not imported or exposed. The endpoint rejects
ownership evidence, approval records, partition/Workspace overrides, identity overrides, apply
flags, approved plans, and raw K-5C plans.

The success response states `MH Trading`, the approval ID, `governance-system`, `APPROVED`,
`DRY_RUN_READY`, plan equivalence, and explicit false/null mutation outcomes.

## No-mutation guarantee

K-6 does not create or decide an Approval, execute K-5C apply, create a Workspace or Workspace ID,
write `data/workspaces`, mutate HairoticMen, or migrate Projects. Its reader and composition service
import no filesystem writer. Verification hashes the live data tree and confirms no change.

## Remaining production steps

1. Issue and decide the required `governance-system` approval through the existing governed
   lifecycle using trusted backend principal attribution; K-6 does not do this.
2. Replace the legacy fixed service identity with a real authenticated principal/RBAC resolver when
   that repository capability exists, without accepting request-body identity.
3. Keep Workspace creation as a separate explicit apply phase owned only by Workspace Runtime; this
   preparation endpoint must never be expanded to apply.
4. If customer Project APIs must globally exclude the reserved name, introduce that as a separately
   audited compatibility phase because Approval Engine storage still depends on the legacy Project
   key representation.
