# PHASE K-6A-R — Production Readiness Recertification

## 1. Executive result

**NOT CERTIFIED.** The current Workspace governance preparation chain passes the
authority, pure-read, authentication, authorization, input-closure, Approval
semantics, preparation-only, determinism, immutability, bypass, and repository
safety checks. It does not emit the exact successful response contract required
by K-6A-R. No production logic was changed during this certification-only phase.

## 2. Original K-6A failure reasons

The original K-6A certification correctly failed because a missing Approval
store could be initialized by `listApprovals`, and because
`governance.workspace_creation.prepare` was catalogued but not enforced on the
production preparation route.

## 3. K-6B remediation reference

K-6B separated the canonical Approval read path from writer initialization.
This recertification independently invoked the real `listApprovals` against the
absent `governance-system` partition and received `[]` without any filesystem or
audit mutation. It did not rely on the K-6B targeted suite alone.

## 4. K-6C remediation reference

K-6C introduced exact service-scope enforcement before route processing. This
recertification independently exercised absent, malformed, forged, partial,
wildcard, unknown-principal, and caller-supplied authorization cases and proved
that each is denied before downstream processing. It did not rely on the K-6C
targeted suite alone.

## 5. Current scope

The certified scope is:

`POST /api/governance/workspaces/mh-trading/creation/prepare`

with a backend-resolved service principal, the reserved `governance-system`
authority partition, the canonical Approval Engine reader, the K-5E assessment,
the governed handoff, and two K-5C dry runs.

## 6. Explicit non-goals

This phase did not create or decide an Approval, apply a K-5C plan, create a
Workspace or Workspace ID, modify Approval or Workspace behavior, change
authentication or authorization, add frontend work, repair unrelated fixtures,
or certify human/system-wide RBAC.

## 7. Full authority map

```text
validated control credential
  -> trusted legacy-control-key identity assertion
  -> deeply frozen service authority context
  -> exact governance.workspace_creation.prepare enforcement
  -> closed { approval_id } input
  -> governance-system
  -> Approval Engine listApprovals
  -> Workspace Approval projection
  -> K-5E assessment
  -> governed handoff
  -> K-5C dry run #1
  -> K-5C dry run #2
  -> equivalence check
  -> deeply frozen preparation-only response
```

The preparation chain has no edge to `createApproval`, `decideApproval`,
K-5C apply, or `createWorkspace`.

## 8. Approval creation authority

`createApproval` in `lib/ops/backbone.js` is the one durable Approval creation
capability. Static definition/write-path reconciliation found no
Workspace-specific or second durable Approval creation authority.

## 9. Approval read authority

`listApprovals` in `lib/ops/backbone.js` is the canonical authoritative reader
used by `workspace-governance-approval-reader.js`. It uses the read-only
Approval collection path. `data/approvals.json` is not used by this chain, and
no shadow JSON reader was found.

## 10. Approval decision authority

`decideApproval` in `lib/ops/backbone.js` is the one durable Approval decision
capability. No second durable decision writer was found.

## 11. Workspace writer authority

`createWorkspace` in `lib/workspace/workspace-runtime.js` is the one Workspace
writer. K-5E, K-5F.1, K-6, and the preparation route do not invoke it. The
controlled boundary exposes apply separately, and this route remains
preparation-only.

## 12. Pure-read dynamic proof

With `data/projects/governance-system` and `data/workspaces` absent:

- actual `listApprovals("governance-system")` returned `[]`;
- the actual K-6 reader returned `GOVERNANCE_APPROVAL_NOT_FOUND`;
- no project, ops, Approval, event, notification, queue, system, workspace, or
  audit path was created;
- the full `data/` and `.mh-audit/` hashes remained identical.

An isolated existing-store fixture also preserved record shape, newest-first
ordering, filters, limits, and strict malformed-JSON failure without writing.

## 13. Authentication proof

The production-equivalent route harness returned 401 without a credential and
403 for malformed or incorrect credentials. A valid credential produced a
backend-created trusted assertion and authority context. The real credential
guard retains timing-safe comparison. Raw credentials were not stored in the
authority context, returned, or logged by the affected chain. Body fields and
arbitrary headers could not establish trusted identity.

## 14. Service-principal proof

The resolved identity has `principal_type = service`,
`principal_id = legacy-control-center-key`, and
`authentication_method = control_key`. Its permission comes from the frozen
backend `SERVICE_PRINCIPAL_PERMISSION_GRANTS` map. The assertion marker is
non-enumerable, the authority context and nested permissions are frozen, and
each request receives isolated retained state.

## 15. Authorization proof

The route catalog and runtime enforcement use the exact permission
`governance.workspace_creation.prepare`. Enforcement follows authentication and
precedes input-dependent Approval or Workspace processing. Missing or
unauthenticated contexts; missing, empty, wrong, malformed, substring, prefix,
suffix, or wildcard permissions; unknown services; forged contexts; and
caller-supplied exact permissions all failed closed. The backend-granted exact
permission passed.

All denied cases had zero calls to `listApprovals`, the K-6 reader, Workspace
lookup, composition, K-5E, governed handoff, K-5C dry run, Workspace writer, and
Approval writers.

## 16. Input-surface proof

The accepted body is exactly one nonblank string field:

```json
{"approval_id":"approval_..."}
```

Forty-six empty, missing, null, non-string, blank, array, nested, extra,
authority-spoof, mutation-spoof, query, and spoofable-header cases were
rejected. Dangerous extras were rejected rather than ignored. The separate
caller-spoof matrix rejected 48 body, query, and header attempts.

## 17. Approval-semantics proof

Only the exact unique durable Approval identity with internal project
`governance-system`, the MH Trading Workspace identity, required entity,
approval and mutation types, approved lifecycle state, trusted requester and
decider, valid decision time, and correct ownership/provenance passed.

Unknown, duplicate, pending, rejected, changes-requested, escalated, cancelled,
malformed, wrong-scope, wrong-identity, wrong-action, wrong-actor,
missing-actor/time, invalid-time, and caller-crafted records failed closed.
Legacy `overridden` is explicitly rejected by the current Workspace creation
policy; it was not treated as approved.

## 18. Composition proof

Controlled dependencies proved the intended ordered chain through two
equivalent K-5C dry runs and an immutable response. There were zero calls to
Approval creation/decision, apply, Workspace creation, events, notifications,
queues, or production-data writes.

The exact response-contract check failed on two names. Required:

```text
dry_run_state = DRY_RUN_READY
dry_runs_equivalent = true
```

Actual:

```text
dry_run.result_state = DRY_RUN_READY
dry_run_plans_equivalent = true
```

All other required safety fields were exact:
`authority_partition = governance-system`, `workspace_name = MH Trading`,
`approval_state = APPROVED`, `apply_executed = false`,
`workspace_created = false`, `workspace_id = null`, and
`mutation_allowed_by_this_endpoint = false`.

## 19. Determinism proof

Repeated successful controlled composition produced byte-identical canonical
serialized output. Both dry runs were equivalent; ordering was stable; no
current time, random ID, filesystem order, or unstable object key affected the
contract.

## 20. Deep immutability proof

Mutation attempts against the authority context, permissions, Approval
projection, K-5E assessment, governed handoff, dry-run artifacts, response,
nested safety flags, and nested plan items did not change retained state.
Permissions could not be extended, global grants remained immutable, and later
requests remained byte-equivalent.

## 21. Route safety proof

The production-equivalent route harness covered no credential, invalid
credential, missing permission, spoofed permission, invalid input, unknown
Approval, and a controlled valid approved record. Denied paths stopped before
downstream work. The positive path remained preparation-only and reached
`DRY_RUN_READY` in the nested dry-run artifact. No apply, Approval write,
Workspace creation, Workspace ID, production-data write, or audit write
occurred.

## 22. Static bypass proof

Executable production scans found no alternate governance preparation route,
unprotected public/authenticated alias, permission mismatch, caller-created
trusted context or grant, raw/shadow Approval read, `data/approvals.json`
authority, preparation-to-Workspace-writer edge, K-5C apply call, allow-on-error
authorization, wildcard fallback, substring match, or missing-context allow.
Documentation, comments, and test fixtures were distinguished from executable
paths.

## 23. Suite results

| Check | Result |
| --- | --- |
| K-5C controlled Workspace creation | PASS |
| K-5E Workspace creation Approval | PASS |
| K-5F.1 Approval authority reconciliation | PASS |
| K-6 production governance composition | PASS |
| K-6B pure-read remediation | PASS |
| K-6C service-scope enforcement | PASS |
| Approval backbone lifecycle | PASS |
| Runtime permission/security enforcement | PASS |
| Public alias compatibility and hardening | PASS |
| Affected module and server syntax | PASS |
| K-6A-R exact recertification verifier | FAIL — response field names |
| General `npm test` | FAIL — known unrelated fixtures below |

No newly introduced related regression was found.

## 24. Known unrelated failures

The general suite reached the previously known HairoticMen fixture failures:

- campaign finalization: campaign `beard_launch` has zero media jobs, zero
  publish packages, and no email package, so `ready = false`;
- semi-auto execution: package artifacts exist, but `semi_auto_mode`,
  `scheduler_job_available`, and `execution_result_available` are false.

These failures were not changed or suppressed.

## 25. Before/after production hashes

| State | Before | After |
| --- | --- | --- |
| `data/` | `a778ee798cf0f6f094b4cdd77f2295efd46d56a12370bc4e5e2512695e598f6a` | identical |
| `.mh-audit/` | `04aff2303cc0ad4c7a449bb5a7ff932ef79485a5cab0a80b2a9b6716a1cdba40` | identical |
| HairoticMen | `95a9510284b9e6669aeb4a64c2f506c6b7e5d14faa131e98514b6b711b5ae961` | identical |
| `data/workspaces` | absent; zero Workspaces | absent; zero Workspaces |
| `data/projects/governance-system` | absent | absent |
| Approval stores | 3 stores; 2 records total | unchanged |

## 26. Repository safety

The baseline had no staged files, seven pre-existing tracked modifications, and
1,028 pre-existing untracked paths. The tracked diff, unrelated tracked state,
unrelated untracked paths/content, production data, and audit state were
preserved byte-for-byte and status-identically. K-6A-R added only its verifier
and this document. Nothing was staged, committed, pushed, reset, stashed,
cleaned, or deleted.

## 27. Current limitation: service-principal-only governance

The route currently authorizes the backend-resolved
`legacy-control-center-key` service principal. This is a narrow service identity
activation, not a general identity or role system.

## 28. Human/system-wide RBAC non-certification

Human identity, role assignment, tenant-wide policy, delegation, and
system-wide RBAC are neither implemented nor certified by this phase.

## 29. Exact next production gate

K-7 is blocked. The next work must be a narrow response-contract reconciliation
that makes the successful production composition emit the two exact required
top-level fields without weakening existing safety or changing policy, followed
by a fresh K-6A-R recertification. No real governance Approval should be created
until that recertification passes.

## 30. Final certification matrix

```text
PHASE_K_6A_R_CERTIFIED=NO
PHASE_K_6A_CERTIFIED=NO

APPROVAL_ENGINE_COUNT=ONE
APPROVAL_READER_AUTHORITATIVE=YES
APPROVAL_READER_PURE=YES
APPROVAL_DECISION_AUTHORITY=ONE
WORKSPACE_WRITER_COUNT=ONE

RESERVED_AUTHORITY_PARTITION=governance-system
DATA_APPROVALS_JSON_USED=NO
MISSING_STORE_RETURNS_EMPTY=YES
READER_MUTATES_FILESYSTEM=NO
PREPARATION_ROUTE_MUTATES=NO

SERVICE_PRINCIPAL_BACKEND_RESOLVED=YES
AUTHORITY_CONTEXT_IMMUTABLE=YES
REQUIRED_PERMISSION=governance.workspace_creation.prepare
ROUTE_PERMISSION_CATALOGUED=YES
ROUTE_PERMISSION_ENFORCED=YES
AUTHENTICATION_FAIL_CLOSED=YES
AUTHORIZATION_FAIL_CLOSED=YES
DENIED_REQUEST_REACHES_APPROVAL_READER=NO
DENIED_REQUEST_REACHES_COMPOSITION=NO

INPUT_SURFACE_CLOSED=YES
APPROVAL_SEMANTICS_EXACT=YES
DETERMINISTIC=YES
DEEPLY_IMMUTABLE=YES
FAIL_CLOSED=YES
BYPASS_FOUND=NO

HUMAN_RBAC_IMPLEMENTED=NO
SYSTEM_WIDE_RBAC_CERTIFIED=NO
SERVICE_PRINCIPAL_FIRST_ACTIVATION_CERTIFIED=NO

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

NEXT_GATE=BLOCKED
```
