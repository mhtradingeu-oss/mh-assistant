# PHASE K-6B — Pure Read Approval Authority Remediation

## 1. Original defect

PHASE K-6A correctly failed because the authoritative K-6 Approval read reached
writer-oriented project initialization:

```text
readWorkspaceGovernanceApproval
  -> listApprovals("governance-system")
  -> getOperationsPaths("governance-system")
  -> ensureDir(projectDir)
  -> ensureDir(opsDir)
  -> ensureOperationsFiles(paths)
  -> ensureJsonFile(...)
```

With the reserved partition absent, a missing-Approval lookup could create
`data/projects/governance-system/ops` and the complete operations file set.

## 2. Why list-side initialization violated read-only governance

An Approval lookup must be observational. Returning “not found” must not create
a Project-shaped directory, an empty Approval store, system state, events,
notifications, queues, governance defaults, or audit evidence. The prior path
made storage existence depend on whether a caller had read it, violating the
K-6 preparation endpoint's read-only contract and making K-6A certification
impossible.

`readCollection` was not sufficient for the remediation. Although it maps an
absent file to `[]`, its durable JSON reader quarantines malformed files with a
rename. That behavior is appropriate for legacy writer-oriented operations
flows but not for a zero-mutation Governance read.

## 3. Producer / consumer map

| Capability | Owner | Consumers | K-6B behavior |
|---|---|---|---|
| `createApproval` | Approval Engine / backbone | Governance mutation gate, AI orchestration, Approval HTTP routes | Explicitly initializes storage and writes the durable Approval |
| `listApprovals` | Approval Engine / backbone | K-6 reader, governance mutation gate, Approval list route, publishing lookup | Canonical pure Approval read |
| `decideApproval` | Approval Engine / backbone | Approval decision route | Rejects absent store before initialization; valid existing decisions retain writer flow |
| `readWorkspaceGovernanceApproval` | Workspace Governance adapter | K-6 composition | Consumes `listApprovals` only and fixes the partition to `governance-system` |
| `workspace-runtime.createWorkspace` | Workspace Runtime | Controlled K-5C apply boundary | Unchanged and unreachable from K-6B |

Direct-call inspection found no `listApprovals` use during service startup,
project bootstrap, project initialization, or AI orchestration. Its production
consumers interpret an empty list as no Approval and already fail closed. No
consumer depended on read-time storage creation.

Other operations collections still use the legacy `getOperationsPaths` read
pattern. K-6B intentionally did not broaden into those unrelated collections.

## 4. Source-of-truth decision

Design A was selected: the existing `listApprovals` capability is now the one
canonical pure read. No parallel `listApprovalsReadOnly` API, Workspace-specific
JSON reader, second store, or duplicated Approval semantics was introduced.

The Approval Engine remains the sole authority:

```text
Pure read:
Approval Engine listApprovals
  -> Approval-owned non-mutating path resolution
  -> strict existing-file read
  -> [] when absent
  -> existing list limit projection

Write:
createApproval
  -> getOperationsPaths
  -> explicit initialization
  -> durable Approval write and existing side effects

Decision:
decideApproval
  -> validate decision
  -> reject absent Approval store
  -> existing writer initialization and decision lifecycle for a present store
```

## 5. Canonical pure-read capability

`listApprovals(projectName, options)` remains the public Approval Engine read
capability. Internally it uses:

- `resolveApprovalReadPath`, which performs normalization and path-containment
  resolution only;
- `readApprovalCollectionReadOnly`, which uses only existence checking,
  synchronous file reading, trimming, JSON parsing, and array validation;
- the existing `listItems` limit behavior.

The capability does not expose a filesystem path to consumers. It preserves
durable record order and shape. The prior implementation did not implement
field filters or sorting; K-6B therefore preserves the same no-filter,
durable-order contract rather than inventing new semantics.

## 6. Missing-store and malformed-store behavior

For an absent `ops/approvals.json`, `listApprovals` returns `[]`. It does not
create a Project directory, ops directory, Approval file, or any companion
operations file.

The K-6 authoritative reader receives the empty collection and fails closed
with:

```text
code       = GOVERNANCE_APPROVAL_NOT_FOUND
statusCode = 404
```

An existing empty, malformed, or non-array Approval file throws a structured
Approval storage error. It is not overwritten, renamed, quarantined, or
silently converted to an empty collection.

## 7. Writer initialization separation

`createApproval` is unchanged. It still calls `getOperationsPaths`, explicitly
initializes the operations store, writes the Approval, and performs the
established system, event, notification, queue, and linked-entity behavior.

`decideApproval` still performs the established valid decision lifecycle. K-6B
added only an absent-store preflight before `getOperationsPaths`, so an unknown
partition is rejected as `Approval not found` without initialization. It does
not create an Approval.

No valid decision status, timestamp, escalation, event, notification, queue, or
linked-entity behavior was changed.

## 8. K-6 reader integration

`workspace-governance-approval-reader.js` already imported the Approval
Engine-owned `listApprovals` capability directly. Because K-6B made that
existing capability canonical and pure, no Workspace-layer source change or
alternate injection was necessary.

The reader continues to:

- fix the authority partition to `governance-system`;
- accept one validated `approval_id`;
- reject missing, duplicate, malformed, and wrong-partition records;
- deep-copy and deep-freeze the durable record;
- import neither `createApproval` nor `decideApproval`;
- avoid raw JSON and root `data/approvals.json`.

Authentication, permission classification, and route authorization were not
modified.

## 9. Static no-writer proof

The K-6B verifier extracts the production pure-read call chain without comments
and rejects calls to:

- `ensureDir` and `ensureOperationsFiles`;
- `writeJsonFile`, mkdir, write, append, rename, and unlink APIs;
- `createApproval` and `decideApproval`;
- event, notification, and queue writers;
- Workspace Runtime mutation methods.

It also proves:

- `listApprovals` calls the pure collection reader and not
  `getOperationsPaths`;
- `createApproval` retains `getOperationsPaths`;
- the `decideApproval` absent-store check precedes `getOperationsPaths`;
- the K-6 reader imports `listApprovals` and no Approval writer;
- the affected chain does not reference `data/approvals.json`.

Result: **PASS**.

## 10. Dynamic no-mutation proof

The production-root test began with both
`data/projects/governance-system` and `data/workspaces` absent.

It then:

1. called `listApprovals("governance-system", { limit: 1000 })`;
2. received `[]`;
3. called the K-6 reader with `approval_k6b_missing_001`;
4. received `GOVERNANCE_APPROVAL_NOT_FOUND`;
5. compared complete `data/` and `.mh-audit/` inventories and hashes.

After both reads:

```text
data/projects/governance-system = ABSENT
data/workspaces                 = ABSENT
data/ hash                      = ceb0453be60b7b7df53a488a48f045d94ddf26ac72bb004eaf56c98710449b59
.mh-audit/ hash                 = 04aff2303cc0ad4c7a449bb5a7ff932ef79485a5cab0a80b2a9b6716a1cdba40
```

No system file, Approval, event, notification, queue, audit record, Workspace,
or Workspace ID was created. Result: **PASS**.

## 11. Existing-store compatibility

An isolated temporary root contained three controlled Approval records in
durable newest-first order. Child processes loaded the real backbone with that
root and proved:

- all existing records were returned unchanged;
- `limit: 2` returned the first two records;
- durable order was preserved;
- nested fields and record shapes were preserved;
- repeated reads left the fixture inventory byte-identical.

A malformed controlled Approval file produced
`APPROVAL_STORAGE_CORRUPT_JSON` and remained byte-identical with no quarantine
file. Result: **PASS**.

## 12. Verification results

| Verification | Result |
|---|---|
| K-6B pure-read verifier | PASS |
| K-5F.1 Approval authority reconciliation | PASS |
| K-6 production Governance composition | PASS |
| Backbone syntax | PASS |
| Workspace Governance reader syntax | PASS |
| K-6B verifier syntax | PASS |
| Production `server.js` syntax | PASS |
| Production data and audit hashes across suites | UNCHANGED |

The general `npm test` suite was not run. The known unrelated missing
HairoticMen campaign-finalization and semi-auto execution fixtures were not
modified or hidden.

## 13. Remaining authorization defect and K-7 block

K-6B remediates only the Approval read-side mutation defect. The K-6A finding
that `governance.workspace_creation.prepare` is classified but not enforced
remains open. The identity adapter still resolves only the
`legacy-control-center-key` service principal and exposes no enforced
permission set.

K-6A remains failed and was not recertified. The system must not claim readiness
for a real Approval request, and K-7 remains blocked.

## 14. Exact next phase

The next gate is:

**PHASE K-6C — SERVICE SCOPE AUTHORIZATION ENFORCEMENT**

K-6C must narrowly enforce the exact service scope without changing the
Approval Engine, Workspace Runtime, K-6B pure-read behavior, or human principal
architecture. After K-6C, K-6A must be rerun before K-7.

```text
PHASE_K_6B_COMPLETE=YES

APPROVAL_ENGINE_AUTHORITY_PRESERVED=YES
CANONICAL_PURE_READ_CAPABILITY=YES
MISSING_STORE_RETURNS_EMPTY=YES
READER_MUTATES_FILESYSTEM=NO
K6_READER_USES_PURE_AUTHORITY_READ=YES

CREATE_APPROVAL_BEHAVIOR_CHANGED=NO
DECISION_LIFECYCLE_CHANGED=NO
DATA_APPROVALS_JSON_USED=NO
SECOND_APPROVAL_STORE_CREATED=NO
SECOND_APPROVAL_AUTHORITY_CREATED=NO

AUTHORIZATION_DEFECT_REMEDIATED=NO
K6A_RECERTIFIED=NO
READY_FOR_REAL_APPROVAL=NO

APPROVAL_CREATED=NO
APPROVAL_DECIDED=NO
K5C_APPLY_EXECUTED=NO
WORKSPACE_CREATED=NO
WORKSPACE_ID_CREATED=NO
DATA_WORKSPACES_WRITTEN=NO
GOVERNANCE_PARTITION_CREATED=NO
HAIROTICMEN_CHANGED=NO
PRODUCTION_DATA_CHANGED=NO

STAGED_FILES=NONE
COMMIT=NO
PUSH=NO

NEXT_GATE=PHASE_K_6C_SERVICE_SCOPE_AUTHORIZATION_ENFORCEMENT
```
