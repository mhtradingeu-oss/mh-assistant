# Phase K-5F.1 — Workspace Approval Authority Reconciliation

## Decision

The existing Operations Backbone Governance Approval Engine is the only durable approval decision
authority for Workspace creation. K-5F.1 creates no approval store, approval record, Workspace,
Workspace ID, Project, identity, binding, or migration artifact.

The existing approval subject fields are sufficient and are reused without a Backbone schema
change:

| Approval field | Required value |
| --- | --- |
| `entity_type` | `workspace` |
| `entity_id` | `MH Trading` |
| `mutation_type` | `workspace_creation` |
| `approval_type` | `workspace_creation` |
| `requested_action` | `CREATE_WORKSPACE` |
| `requested_for` and `reviewer` | `MH Trading Owner` |
| `status` | `approved` |

`project` remains the durable Operations storage partition. It is not the approval subject. The
reader query binds the expected storage partition and approval ID, while the record fields above
bind the exact Workspace, action, and owner. This preserves existing project approval behavior and
requires no system-scope or Workspace-store extension.

## Authority and data flow

```text
Governance Approval Engine
  -> injected authoritative read capability
  -> Workspace creation approval projection
  -> K-5E APPROVED/BLOCKED assessment
  -> governed K-5C handoff
  -> two byte-equivalent deterministic K-5C dry runs
  -> future K-5C controlled execution
  -> Workspace Runtime
```

The projection calls only the injected reader. It accepts no approval record in its public query,
has an exact query contract, validates the durable record bindings, projects requester and
approver, and returns a deeply immutable value. Missing records project to K-5E `BLOCKED`.
Non-approved lifecycle states also project to `BLOCKED`; `overridden` is not valid for this
Workspace creation authority.

Production composition must inject a reader backed exclusively by the existing Backbone approval
collection. The injection point is the application trust boundary; tests use an in-memory reader
without writing. Arbitrary record JSON, copied projection JSON, and copied K-5C request JSON carry
no provenance and are rejected.

## K-5E and K-5C reconciliation

K-5E remains read-only. It does not import the Backbone writers, filesystem, Workspace Runtime, or
K-5C.

The governed handoff runs only after authoritative lookup, projection validation, and an `APPROVED`
K-5E result. It asks K-5C to produce the dry run twice and requires byte-equivalent results. The
handoff returns the authoritative projection, immutable assessment, provenance-bound creation
request, deterministic dry run, and explicit no-write safety declaration.

K-5C now rejects raw ownership evidence. Its approval evidence owner is
`governance-approval-engine`; Workspace Runtime remains its only possible Workspace writer. Phase
K-5F.1 does not invoke K-5C apply.

## Fail-closed verification

Run:

```sh
node scripts/verify-workspace-approval-authority-reconciliation.js
node scripts/verify-workspace-creation-approval.js
node scripts/verify-controlled-workspace-creation.js
```

The verification covers missing and every non-approved status, wrong Workspace/action/owner/scope,
requester and approver mismatch, missing decision timestamp, malformed evidence reference, unknown
query fields, replay attempts, raw caller objects, mutation attempts, forbidden imports/writers,
valid projection, deterministic K-5E assessment, exact double dry run, raw K-5C request rejection,
and unchanged live data.

## Remaining production gap

Before the first production Workspace creation, the server composition root must expose a
read-only approval reader backed by `listApprovals` (or an equivalent non-mutating Backbone read)
for the chosen Governance storage partition, authenticate and bind the requester/approver values,
create and decide the durable approval through the existing Governance routes, and pass the
governed handoff through an explicit operator-approved plan step. That future phase must separately
authorize K-5C apply. It must not weaken the provenance check or introduce another approval store.
