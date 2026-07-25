# PHASE K-6C — Service Scope Authorization Enforcement

## 1. Original authorization defect

The Workspace Governance preparation route was correctly authenticated but not
authorized by scope. Its route catalog declared:

```text
governance.workspace_creation.prepare
```

The validated control credential produced `req.mhAuthorityContext`, but that
context contained `roles: []` and `permissions: []`. The route registered only
its authentication middleware before the preparation handler. The permission
catalog classified the route but did not enforce its required scope.

## 2. Authentication versus authorization

Authentication answers which backend principal presented a valid credential.
Authorization answers whether that trusted principal has the exact permission
required by this route.

K-6C preserves the established authentication outcomes:

- missing credential: 401;
- malformed or incorrect credential: 403;
- valid credential: backend-created service identity.

K-6C adds a separate 403 authorization decision after successful
authentication and before any preparation work.

## 3. Current authenticated service principal

The current principal remains:

```text
principal_type        = service
principal_id          = legacy-control-center-key
authenticated         = true
authentication_method = control_key
```

The principal is derived only after the established control key or Bearer
credential is compared to `MH_CONTROL_CENTER_WRITE_KEY` with
`crypto.timingSafeEqual`. No raw credential is stored in the context, response,
or new authorization error.

## 4. Backend-owned permission source

The route-permission catalog now exports the one canonical constant:

```text
GOVERNANCE_WORKSPACE_CREATION_PREPARE_PERMISSION
  = governance.workspace_creation.prepare
```

The exact route declaration and runtime enforcement import this constant.
`identity-adapter.js` owns a narrow backend grant map for recognized service
principals. Only `legacy-control-center-key` receives this explicit permission.
There is no wildcard, prefix grant, role inference, filesystem dependency, or
request-derived grant.

## 5. Authority context contract

After validated backend authentication, the authority context contains:

```text
principal.principal_type = service
principal.principal_id   = legacy-control-center-key
principal.authenticated  = true
roles                    = []
permissions              = [governance.workspace_creation.prepare]
```

The identity assertion carries a private, non-enumerable module trust marker.
A plain object with matching public fields is not trusted. The authority
context, principal, roles, permissions, decision context, evidence, and shadow
observations are recursively frozen.

Unauthenticated and forged contexts receive no permissions.

## 6. Permission resolver

`resolveServicePrincipalPermissions`:

- accepts only a backend-marked, authenticated service assertion;
- recognizes only the exact current service principal;
- returns a deterministic, de-duplicated, frozen permission array;
- returns an empty frozen array for malformed, unauthenticated, forged, or
  unknown identities;
- rejects malformed backend grant values by resolving to no permissions;
- never consumes request bodies, queries, headers, cookies, roles, or caller
  permission arrays.

## 7. Canonical authorization helper

`assertAuthorityPermission(context, requiredPermission)` is the narrow
canonical helper. It fails closed when:

- context or principal is missing;
- context, principal, or permissions are not frozen;
- the principal lacks the backend trust marker;
- the principal is unauthenticated or not a service;
- the permissions collection is missing or malformed;
- the context permission set differs from the backend-resolved set;
- the exact required permission is absent.

Authorization uses exact array membership. There is no substring, prefix, role,
or wildcard matching.

## 8. Required route permission

The exact required permission remains:

```text
governance.workspace_creation.prepare
```

The route catalog continues to classify the endpoint as:

```text
requiredAccess = service
readWrite      = read
providerRisk   = low
destructive    = false
```

POST remains a transport choice for a closed preparation request; it does not
grant mutation authority.

## 9. Enforcement order

The production route is registered in this order:

```text
1. requireGovernancePreparationAuthentication
2. requireGovernancePreparationAuthorization
3. rejectGovernancePreparationAuthoritySpoofing
4. handleGovernanceWorkspacePreparation
```

The handler then performs its existing closed-input validation through the K-6
composition and proceeds to the pure Approval read, projection, K-5E
assessment, governed handoff, and two K-5C dry runs.

Authorization therefore occurs before every Approval, Workspace, projection,
assessment, handoff, and dry-run operation.

## 10. Denied-request downstream non-execution

The K-6C route harness instruments composition, Approval read, Workspace
evidence lookup, and Workspace mutation entry points.

For missing context, missing permissions, empty permissions, wrong permission,
malformed permissions, forged context, and unknown service identity:

```text
HTTP status             = 403
composition calls       = 0
Approval reader calls   = 0
Workspace lookup calls  = 0
Workspace create calls  = 0
```

Because the handler is not reached, projection, K-5E assessment, handoff, K-5C
dry runs, Approval writers, events, notifications, queues, and audits are also
unreachable.

## 11. Caller-spoofing protections

The backend ignores `permissions` and `roles` supplied to authority-context
construction. A caller-created principal object cannot reproduce the private
trust marker.

The route explicitly rejects these names in body, query, and spoofable header
positions:

- permissions, permission, scopes, scope;
- roles, role;
- principal, principal ID, principal type;
- authority context and MH authority context;
- authenticated, service identity, service principal;
- access level, capabilities, grants.

All 17 fields across three input locations were tested: 51 attempts rejected.
The legitimate Bearer and `x-mh-control-key` credential transports remain
supported and do not become permission sources.

## 12. Route catalog reconciliation

The exact route catalog and the enforcement middleware use the same exported
permission constant. Static verification finds the literal permission string
once in the production security catalog.

No public or legacy alias for the preparation endpoint exists. The production
composition remains reachable through one server route, with authentication
and authorization middleware attached.

## 13. Positive route evidence

An established server boundary created the production middleware chain with a
controlled composition dependency. The controlled Approval reader returned
one valid in-memory durable record; no real Approval or store was used.

With a valid control credential, backend-resolved principal, exact permission,
and body containing only `approval_id`, the response reached:

```text
approval_state                    = APPROVED
dry_run.result_state              = DRY_RUN_READY
dry_run_plans_equivalent          = true
apply_executed                    = false
workspace_created                 = false
workspace_id                      = null
mutation_allowed_by_this_endpoint = false
```

The Approval reader was called once, the read-only Workspace evidence lookup
was called twice for the deterministic dry runs, and Workspace creation was
never called.

## 14. Negative authorization matrix

| Case | Result |
|---|---|
| Missing credential | 401 |
| Malformed credential | 403 |
| Incorrect credential | 403 |
| Valid credential | Backend service principal |
| Missing authority context | 403 |
| Missing permissions | 403 |
| Empty permissions | 403 |
| Wrong permission | 403 |
| Malformed permissions | 403 |
| Caller-supplied required permission on forged context | 403 |
| Unknown service identity | 403 |
| Exact backend-granted permission | Allowed |

## 15. Immutability and secret-safety evidence

The verifier proves:

- the authority context and every permission array are frozen;
- push and reassignment attempts throw;
- separate requests receive distinct context and permission-array instances;
- one request cannot mutate another request's grants;
- caller objects are copied or ignored rather than adopted as authority;
- repeated context creation deterministically re-resolves backend grants;
- JSON serialization of the context contains no raw control key;
- the preparation response contains neither the control key nor permission
  collection.

Shadow observation reconstruction also re-resolves permissions from the trusted
principal rather than preserving a mutable caller array.

## 16. Static security checks

Targeted source checks prove:

- authorization middleware does not read body, query, or headers;
- identity resolution does not read `input.permissions` or `input.roles`;
- no wildcard permission fallback exists;
- no allow-on-error or missing-context allow path exists;
- no substring authorization exists;
- authentication precedes authorization and authorization precedes handler
  execution;
- the permission literal is canonical;
- no duplicate preparation route or alias exists;
- no response or new error includes raw credential material.

Result: **PASS**.

## 17. Targeted verification suites

| Suite | Result |
|---|---|
| K-6C service-scope authorization verifier | PASS |
| K-6 production Governance composition | PASS |
| K-6B pure-read Approval remediation | PASS |
| K-5F.1 Approval authority reconciliation | PASS |
| Runtime permission/catalog verifier | PASS |
| Identity adapter syntax | PASS |
| Route permission catalog syntax | PASS |
| Server syntax | PASS |
| K-6C verifier syntax | PASS |

The general `npm test` suite was not run.

## 18. Current limitation and system-wide debt

K-6C does not implement human users, sessions, memberships, organizations, or
RBAC. It grants one explicit permission to the existing backend service
principal.

Other control-key-protected server routes still rely on their established
coarse authentication and legacy gates. K-6C does not claim system-wide
fine-grained authorization and intentionally does not retrofit those routes.
That broader authorization debt remains.

The two known unrelated missing readiness fixtures—HairoticMen
campaign-finalization and semi-auto execution—were not modified or hidden.

## 19. K-7 remains blocked

K-6C closes the known preparation-route authorization defect, and K-6B remains
green. The failed K-6A result was not rewritten or recertified in this phase.

K-7 remains blocked until the complete production-readiness certification is
rerun against the combined K-6B and K-6C implementation.

## 20. Exact next gate

The next phase is:

**PHASE K-6A-R — PRODUCTION READINESS RECERTIFICATION**

Baseline and final production-data evidence for K-6C:

```text
data/      a778ee798cf0f6f094b4cdd77f2295efd46d56a12370bc4e5e2512695e598f6a
.mh-audit/ 04aff2303cc0ad4c7a449bb5a7ff932ef79485a5cab0a80b2a9b6716a1cdba40
```

Both hashes remained identical through implementation and all targeted suites.
`data/projects/governance-system` and `data/workspaces` remained absent.

```text
PHASE_K_6C_COMPLETE=YES

AUTHENTICATION_AUTHORITY_PRESERVED=YES
SERVICE_PRINCIPAL_BACKEND_RESOLVED=YES
AUTHORITY_CONTEXT_HAS_EXPLICIT_PERMISSIONS=YES
PERMISSIONS_CALLER_CONTROLLED=NO
PERMISSION_SET_IMMUTABLE=YES

REQUIRED_PERMISSION=governance.workspace_creation.prepare
ROUTE_PERMISSION_CATALOGUED=YES
ROUTE_PERMISSION_ENFORCED=YES
AUTHORIZATION_FAIL_CLOSED=YES
DENIED_REQUEST_REACHES_APPROVAL_READER=NO
DENIED_REQUEST_REACHES_COMPOSITION=NO

MISSING_CREDENTIAL_STATUS=401
INVALID_CREDENTIAL_STATUS=403
MISSING_PERMISSION_STATUS=403
WRONG_PERMISSION_STATUS=403
EXACT_PERMISSION_ALLOWED=YES

HUMAN_RBAC_IMPLEMENTED=NO
SYSTEM_WIDE_RBAC_CERTIFIED=NO
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

NEXT_GATE=PHASE_K_6A_R_PRODUCTION_READINESS_RECERTIFICATION
```
