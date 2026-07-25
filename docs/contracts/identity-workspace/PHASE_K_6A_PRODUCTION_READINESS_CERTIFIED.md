# PHASE K-6A — Production Readiness Certification

## 1. Executive certification result

**Result: NOT CERTIFIED.**

The Workspace Governance creation preparation chain is not ready for the first
real Governance Approval request. Certification stopped at the mandatory K-6A
Step 4 gate because the authoritative `listApprovals` read path is not
filesystem-read-only for a missing authority partition.

Static inspection proves this call chain:

```text
readWorkspaceGovernanceApproval
  -> listApprovals("governance-system", { limit: 1000 })
  -> getOperationsPaths("governance-system")
  -> ensureDir(projectDir)
  -> ensureDir(opsDir)
  -> ensureOperationsFiles(paths)
  -> ensureJsonFile(...) for system, approvals, events, queues, and other ops files
```

Because `data/projects/governance-system` was absent at the baseline, invoking
the required missing-approval test against the production reader would have
created the forbidden partition and operations files. The invocation was
therefore not performed. This follows both the permanent no-production-mutation
rule and the Step 4 instruction to stop and report `PHASE_K_6A_CERTIFIED=NO`
when `listApprovals` creates directories or files during a read.

No production logic was patched in this phase.

## 2. Scope

This certification examined the K-6 production composition root and its direct
governance chain:

- the reserved Governance authority partition;
- the authoritative Approval reader;
- the Workspace creation Approval projection and assessment;
- the governed creation handoff;
- the controlled Workspace creation dry-run boundary;
- the production preparation route;
- the route permission classification and current service identity adapter;
- the underlying Approval Engine storage path reached by `listApprovals`.

## 3. Non-goals

This phase did not create or decide an Approval, execute K-5C apply, create a
Workspace or Workspace ID, modify Workspace Runtime or Approval Engine
behavior, add frontend work, repair unrelated fixtures, stage, commit, or push.
It does not certify human or multi-user governance.

## 4. Architecture authority map

| Concern | Producer / reader / consumer | Durable writer | K-6A finding |
|---|---|---|---|
| Approval creation | `createApproval` in `lib/ops/backbone.js` | `createApproval` writes `ops/approvals.json` | One implementation found |
| Approval read | `workspace-governance-approval-reader` calls `listApprovals` | Intended read reaches initialization writers | Authoritative but mutating on missing partition |
| Approval decision | `decideApproval` in `lib/ops/backbone.js` | `decideApproval` rewrites `ops/approvals.json` | One implementation found |
| Approval projection | `projectWorkspaceCreationApproval` | None directly | Read-only direct module |
| K-5E assessment | `assessWorkspaceCreationApproval` | None | Read-only direct module |
| K-5F.1 handoff | `prepareGovernedWorkspaceCreationHandoff` | None; invokes two dry-run preparations | Read-only direct module |
| K-6 composition | `prepareProductionGovernanceComposition` | None directly | Transitive Approval read can initialize storage |
| Workspace creation | `workspace-runtime.createWorkspace` | Workspace Runtime | One Workspace creation implementation found |
| HTTP composition | `server.js` | No direct Workspace writer call | Route reaches the mutating Approval read |

## 5. Approval producer / reader / decision authority

The durable Approval collection is
`data/projects/<partition>/ops/approvals.json`. Static write-site inspection
found creation at `createApproval` and decision persistence at
`decideApproval`. K-6 imports only `listApprovals` through
`workspace-governance-approval-reader`; it does not import `createApproval` or
`decideApproval`.

No Workspace-specific second Approval store was found in the affected chain.
The root-level `data/approvals.json` is not referenced by the K-6 reader,
composition, route, or server path and was not used during this certification.

The reader is authoritative in source selection but fails the read-only
behavior requirement because `listApprovals` initializes the complete
operations store before reading.

## 6. Workspace writer authority

Static inspection found one Workspace creation implementation:
`workspace-runtime.createWorkspace`. The controlled K-5C boundary is the caller
that may reach it in apply mode.

K-5E, the K-5F.1 handoff, and K-6 composition contain no direct Workspace
storage writer. The handoff calls the preparation-only K-5C function twice.
The production route does not call `createWorkspace` or
`executeControlledWorkspaceCreation`.

This writer boundary is structurally intact, but the overall endpoint is not
mutation-free because of the Approval read path.

## 7. Governance partition certification

The only runtime literal `"governance-system"` in the affected production tree
is the central `GOVERNANCE_AUTHORITY_PARTITION` constant in
`lib/security/governance-authority-partition.js`. Its contract states that it
is not a customer Project, Workspace, or caller-selectable Project scope.

Workspace-facing output uses `authority_partition`; the legacy Approval record
continues to use `record.project`. The production input accepts no partition
field and the composition injects the constant internally.

The partition identity design passes static inspection. Its missing-partition
read behavior does not pass.

## 8. Authentication source

The route-specific guard validates `MH_CONTROL_CENTER_WRITE_KEY` from the
control-key header or Bearer credential using a timing-safe comparison. Missing
credentials return 401 and invalid credentials return 403.

After backend validation, `attachAuthorityContext` produces
`req.mhAuthorityContext`. The identity adapter resolves the current principal
to:

```text
principal_id   = legacy-control-center-key
principal_type = service
authenticated  = true
```

Body fields cannot establish this principal.

## 9. Authorization and route classification

The permission catalog classifies the exact route as:

```text
access = service
scope  = governance.workspace_creation.prepare
mode   = read
```

No public alias or second route to the composition function was found.

However, the catalog explicitly describes itself as non-enforcing. The
route-specific middleware authenticates the control key but does not evaluate
`requiredScope`, and the identity adapter emits `permissions: []`. The route is
registered before the general runtime security middleware, and that middleware
does not treat this read-classified POST as a sensitive mutation route.

Therefore service authentication is fail-closed, but scope authorization is
not independently enforced. `AUTHORIZATION_FAIL_CLOSED` cannot be certified.

## 10. Input surface

`exactInput` requires a plain non-array object with exactly one key,
`approval_id`. The value must be a non-empty, trimmed string of at most 160
characters; the authoritative reader applies the stricter Approval ID pattern.

Consequently empty, missing, null, non-string, blank, extra, nested, identity,
authority, Workspace, ownership, execution, mutation, plan, Approval-record,
and runtime-injection fields are rejected rather than ignored. This conclusion
is based on static inspection and the existing K-6 verifier; the downstream
K-6A dynamic matrix was not run after the mandatory stop.

## 11. Reader non-mutation proof

**Failed by static proof.**

At `lib/ops/backbone.js`, `listApprovals` calls `getOperationsPaths`.
`getOperationsPaths` unconditionally calls both `ensureDir` and
`ensureOperationsFiles`. `ensureOperationsFiles` invokes `ensureJsonFile` for:

- `system.json`;
- campaigns, content items, media jobs, workflow runs;
- AI commands, artifacts, recommendations, and memory;
- tasks and `approvals.json`;
- notifications, queue, handoffs, team, governance, and events.

The precondition `data/projects/governance-system = ABSENT` makes these writes
reachable during a missing-Approval read. No dynamic invocation was permitted,
so the forbidden directory remains absent.

## 12. Static mutation safety

The reader, composition, projection, and handoff do not directly import
`createApproval`, `decideApproval`, filesystem APIs, or `writeJsonFile`. They do
not reference root `data/approvals.json`. The composition and route do not
invoke Workspace creation or K-5C apply.

The prior source-local static check is insufficient for production
certification because it misses the transitive mutation in the imported
`listApprovals` capability. K-6A therefore fails static mutation safety at the
capability boundary.

## 13. Approval semantic restrictions

Static inspection shows the intended exact durable semantics:

- exact Approval ID and internal `record.project = governance-system`;
- `entity_type = workspace`, `entity_id = MH Trading`;
- `approval_type = mutation_type = workspace_creation`;
- `requested_action = CREATE_WORKSPACE`;
- owner fields equal `MH Trading Owner`;
- durable requester and approver equal the authenticated service principal;
- approved status with matching valid UTC decision timestamps.

Non-approved states, including `overridden`, do not yield an approved K-5E
assessment under the existing contract. Unknown and duplicate identities fail
in the reader. Caller-crafted records are not accepted by the production HTTP
surface.

The full K-6A semantic test matrix was not executed after the mandatory stop.

## 14. Determinism proof

The handoff source performs two preparation-only K-5C calls and compares their
serialized plans. The existing K-6 verifier also compares repeated preparation
responses. No timestamp is generated by the K-6 composition itself; the
durable decision timestamp is projected into the plan.

This phase did not execute the required repeated K-6A path after the stop
condition, so determinism is not newly certified by K-6A.

There is also a response-name discrepancy against the K-6A requested matrix:
production emits `dry_run.result_state` and
`dry_run_plans_equivalent`; the requested certification text names
`dry_run_state` and `dry_runs_equivalent`.

## 15. Deep immutability proof

The reader copies and deep-freezes its durable record. Projection, assessment,
handoff, dry-run artifacts, and final composition use frozen validated
structures, and the existing K-6 verifier recursively checks the successful
response.

The K-6A caller-mutation matrix was not executed after the mandatory stop.
Deep immutability is therefore not newly certified by this phase.

## 16. Route execution proof

Source and the established K-6 verifier support the 401/403 authentication
behavior. The handler passes only `req.body` and backend-derived
`req.mhAuthorityContext` to the composition.

A real valid or unknown-Approval route execution was not performed. An unknown
Approval request while the reserved partition is absent would initialize the
Governance operations store before returning not found. The preparation route
therefore cannot be certified mutation-free.

## 17. Existing suite compatibility

The mission baseline states that K-5C, K-5E, K-5F.1, and K-6 verification
suites previously passed. K-6A did not rerun those suites, syntax checks, route
catalog checks, or a new K-6A verifier after the mandatory Step 4 stop.

No verification script was added.

## 18. Known unrelated test failures

The general `npm test` suite was not run. The two established unrelated
readiness fixture failures remain:

- HairoticMen campaign-finalization fixture absent;
- semi-auto execution fixture absent.

They were not modified, hidden, or repaired.

## 19. Before / after hashes

Baseline:

```text
data/      24ae298f37ad07e01c456cf8540726a6bd77c57027e1768c79b705654a47757a
.mh-audit/ 04aff2303cc0ad4c7a449bb5a7ff932ef79485a5cab0a80b2a9b6716a1cdba40
```

The final safety check must match these values. At the failure discovery and
immediately before creation of this document, both values still matched.

`data/workspaces` and `data/projects/governance-system` were absent. No
authoritative Workspace or Approval count was obtained because the relevant
Approval read would mutate missing storage.

## 20. Repository safety proof

The baseline contained five pre-existing modified tracked files and 1,023
pre-existing untracked files. No staged file existed. Their aggregate status
and content fingerprints were captured before certification work.

This document is the only intended K-6A filesystem change. No cleanup, reset,
stash, deletion, staging, commit, or push was performed.

## 21. Current service-principal limitation

The only resolved principal is `legacy-control-center-key`. There is no human
session, RBAC principal resolver, role assignment, or permission-set
enforcement. Even after read-path remediation, readiness can apply only to a
controlled service-governed first activation until a later Human Governance
Principals phase is completed.

## 22. Remaining production steps

Before a real Approval request:

1. Run a separate, narrow remediation phase that separates pure Approval reads
   from operations-store initialization. A missing partition and missing
   `approvals.json` must return an empty collection without creating anything.
2. Add and enforce the exact service permission
   `governance.workspace_creation.prepare`; do not rely only on catalog
   classification.
3. Reconcile the final response field names with the locked K-6A contract.
4. Repeat K-6A from a fresh safety baseline, including the missing-Approval
   filesystem proof, full semantic/input matrices, route harness, determinism,
   immutability, targeted suites, and before/after hashes.

## 23. Final certification matrix

| Requirement | Result | Evidence |
|---|---|---|
| Single Approval authority | PASS (static) | One backbone creation and decision implementation |
| Authoritative Approval reader | PASS WITH BLOCKER | Uses `listApprovals`; read capability mutates missing storage |
| Single Workspace writer | PASS (static) | One `workspace-runtime.createWorkspace` implementation |
| Reserved partition | PASS (static) | One central runtime literal; not caller-overridable |
| Root `data/approvals.json` unused | PASS | No affected-chain reference |
| Reader mutation-free | **FAIL** | `listApprovals -> getOperationsPaths -> ensure*` |
| Preparation endpoint mutation-free | **FAIL** | Unknown read can initialize the Governance store |
| Authentication fail-closed | PASS | Missing 401; invalid 403; backend-derived service principal |
| Authorization fail-closed | **FAIL** | Scope is classified but not enforced; permissions are empty |
| Closed input surface | PASS (static / existing K-6 evidence) | Exact one-field input validation |
| Approval semantics | NOT COMPLETED | Mandatory stop prevented K-6A dynamic matrix |
| Determinism | NOT COMPLETED | Mandatory stop prevented K-6A rerun |
| Deep immutability | NOT COMPLETED | Mandatory stop prevented K-6A mutation matrix |
| Production data unchanged | PASS | Final hash verification required and recorded at closeout |
| Ready for first real Approval | **FAIL** | Mutating read and unenforced scope |

```text
PHASE_K_6A_CERTIFIED=NO

APPROVAL_ENGINE_COUNT=ONE
APPROVAL_READER_AUTHORITATIVE=YES
APPROVAL_DECISION_AUTHORITY=ONE
WORKSPACE_WRITER_COUNT=ONE

RESERVED_AUTHORITY_PARTITION=governance-system
DATA_APPROVALS_JSON_USED=NO
READER_MUTATES_FILESYSTEM=YES
PREPARATION_ROUTE_MUTATES=YES

AUTHENTICATION_FAIL_CLOSED=YES
AUTHORIZATION_FAIL_CLOSED=NO
INPUT_SURFACE_CLOSED=YES
DETERMINISTIC=NO
DEEPLY_IMMUTABLE=NO
FAIL_CLOSED=NO
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

NEXT_GATE=PHASE_K_6A_READ_ONLY_APPROVAL_READER_REMEDIATION
```

The originally proposed `PHASE_K_7_FIRST_REAL_GOVERNANCE_APPROVAL_REQUEST` is
not safe as the immediate next gate. It becomes the exact production gate only
after the narrow remediation and a successful K-6A recertification.
