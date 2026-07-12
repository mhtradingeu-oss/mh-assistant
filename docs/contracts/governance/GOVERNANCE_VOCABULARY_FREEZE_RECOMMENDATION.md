# Governance / Approval Vocabulary Freeze Recommendation (Phase 1A-6)

“This Phase 1A-6 inventory freezes observed governance, approval, policy, permission, reviewer, risk, confirmation, decision, execution-gate, mutation-gate, escalation, authorization, and audit vocabulary and records recommendations only. It does not approve IDs, state machines, authority models, expiration or freshness rules, migrations, schemas, registries, or runtime changes.”

## Freeze Position

Do not create a universal Governance Contract, Approval Contract, Policy Contract, Reviewer Contract, Risk Contract, Decision Contract, Permission Contract, Execution Authorization Contract, Approval State Machine, Governance Root, or Governance Aggregate in Phase 1A-6.

The current system has multiple implemented and partial authority paths with different subjects, proofs, scopes, persistence, and enforcement. A vocabulary freeze must preserve those differences.

## Freeze Current Runtime Terms Without Renaming

| Frozen observed term | Meaning at current HEAD | Required qualifier |
| --- | --- | --- |
| `governance policy` | Project `governance.json` document normalized and merged by backbone | `PROJECT_GOVERNANCE_POLICY` |
| `policy_rules` | Durable project rule flags merged with code defaults | `PROJECT_POLICY_RULES` |
| `ACTION_RULES` | Code-owned governance mutation action catalog | `GOVERNANCE_ACTION_RULES` |
| `approval` | Durable project approval record | `DURABLE_APPROVAL_RECORD` |
| `approval.id` | ID of that durable record only; not a decision, authorization, execution, result, route-proof, or provider-approval ID | `DURABLE_APPROVAL_RECORD_ID` / `APPROVAL_RECORD_ID` |
| `status` | Approval decision/status string on the same record | `APPROVAL_STATUS` |
| `reviewer_role` | Stored/inferred review routing metadata | `REVIEWER_ROLE_METADATA` |
| `decided_by` | Caller-supplied actor string | `DECISION_ACTOR_LABEL` |
| `approval_fingerprint` | Hash link for one project/action/entity/route/method/payload context | `MUTATION_APPROVAL_FINGERPRINT` |
| `intended_action_id` | Fingerprint-derived intended action linkage | `INTENDED_ACTION_LINK` |
| `linked_execution_id` | Caller value or fingerprint default; not consumption, idempotency, successful execution, or universal correlation proof | `PROVISIONAL_EXECUTION_LINK` |
| `approval_required` | Gate outcome or frontend authority label depending on source | Always source-qualify |
| `requiredAccess` / `requiredScope` | Route classification metadata | `ROUTE_ACCESS_CLASSIFICATION` / `ROUTE_SCOPE_CLASSIFICATION`, not principal permission resolution |
| `write_key` | Shared backend mutation authorization | `CONTROL_WRITE_AUTHORIZATION` |
| protected-route `approvalId` | Presence proof read from request | `APPROVAL_PROOF_FLAG` |
| `manual_execution`, `owner_workspace`, `review_output` | Presence-pattern request proofs | `REQUEST_PROOF_FLAG` |
| `risk_level` | Approval record string | `APPROVAL_RISK_LABEL` |
| route/provider risk | Code-catalog classification | Namespace as `ROUTE_RISK` or `PROVIDER_RISK` |
| browser confirmation | `window.confirm` operator interaction | `OPERATOR_UI_CONFIRMATION` |
| escalation | Approval decision plus optional generated task | `EXPLICIT_APPROVAL_ESCALATION` |
| override | `overridden` APPROVAL_STATUS plus active override stored in project policy; no expiry, revocation, consumption, or universal consumer effect proved | `GOVERNANCE_OVERRIDE_RECORD` |
| audit | Approval history, governance events, notifications, approval queue entries, linked history, active overrides, application logs, scheduler logs, execution results, and route denial evidence | `FRAGMENTED_AUDIT_EVIDENCE`; name the exact stream |

Qualifiers are documentation labels only. They do not rename runtime fields.

## Freeze Required Separations

- Approval `!=` execution authorization `!=` execution attempt `!=` execution result.
- Permission classification `!=` authenticated permission resolution.
- Write-key authorization `!=` role authority `!=` governance approval.
- Reviewer routing metadata `!=` verified approver authority.
- Project policy `!=` code action rule `!=` route catalog `!=` provider catalog.
- DURABLE_APPROVAL_RECORD_ID `!=` APPROVAL_DECISION_ID `!=` EXECUTION_AUTHORIZATION_ID `!=` EXECUTION_ID `!=` RESULT_ID `!=` PROTECTED_ROUTE_PROOF_ID `!=` PROVIDER_APPROVAL_ID.
- Approval status `!=` universal final state.
- Browser confirmation `!=` backend authorization.
- Retry `!=` approval reuse `!=` execution replay.
- Cancellation `!=` revocation `!=` expiration.
- Timestamp recency `!=` enforced freshness.
- Escalation chain metadata `!=` automatic escalation execution.
- FRAGMENTED_AUDIT_EVIDENCE `!=` a universal audit ledger and does not prove completeness, immutability, universal retention/correlation, or legal/compliance certification.
- Project scope `!=` workspace scope `!=` organization scope.
- Frontend role projection `!=` backend role enforcement.

## Classification Freeze

Use the following classifications exactly for this phase:

| Classification | Meaning |
| --- | --- |
| `IMPLEMENTED_PATH` | Current backend code persists or enforces the described path. It does not imply universal coverage or certification. |
| `PARTIAL` | Some representation or behavior exists, but one or more required semantics are absent or fragmented. |
| `PROJECTION_ONLY` | Reads or presents backend authority without owning it. |
| `PROCESS_LIFETIME_ONLY` | Exists only in request/process state and is not a durable authority record. |
| `FRONTEND_ONLY` | Browser behavior or vocabulary with no backend ownership. |
| `NOT_CERTIFIED` | Validator, mock, historical evidence, or unexecuted proof source. |
| `AUDIT_ONLY` | Evidence or logging that does not itself authorize behavior. |
| `UNKNOWN_REQUIRES_PROOF` | Current inspected owners do not prove the semantic. |

## Current-Head Recommendations Only

1. Preserve the backbone approval record as the only proved durable approval vocabulary; do not treat request proof flags as equivalent.
2. Preserve project policy, action rules, route catalog, protected-route authority, runtime security, and provider classification as separate current sources.
3. Refer to approval decisions as status mutations on an approval record; do not invent a Decision Aggregate or Decision ID.
4. Refer to reviewer fields as routing/record metadata until authenticated identity and authority checks are separately proved.
5. Qualify all risk labels by their producing source.
6. Mark expiration, freshness, revocation, timeout, inheritance, replay prevention, one-time approval consumption, and organization/workspace scope as missing or unproved.
7. Treat fingerprint linkage as implemented for the lifecycle-gate path only. It is not universal lineage and does not prove execution.
8. Treat `linked_execution_id` as provisional linkage unless an execution-result owner proves the same correlation.
9. Treat browser confirmations as UX safety prompts only.
10. Treat validator files as test inventory, not current certification.
11. Use `FEDERATED_GOVERNANCE_RELATED_RECORDS=IMPLEMENTED_PATH`, `GOVERNANCE_AGGREGATE_ROOT=MISSING`, `GOVERNANCE_ROOT_ID=MISSING`, and `GOVERNANCE_AGGREGATE_INVARIANT=MISSING`. Project/entity links do not establish a Governance Aggregate.
12. Use `APPROVAL_STATUS_VOCABULARY_IMPLEMENTED`, `APPROVAL_STATUS_MUTATION_IMPLEMENTED`, `APPROVAL_STATE_MACHINE_NOT_PROVED`, `APPROVAL_TERMINALITY_NOT_PROVED`, and `APPROVAL_TRANSITION_GUARDS_NOT_PROVED`; do not create a state machine.
13. An action absent from GOVERNANCE_ACTION_RULES is not governed by that catalog's action rule. Other middleware, CONTROL_WRITE_AUTHORIZATION, route classification, or call-site-specific checks may still apply.
14. `overridden` is APPROVAL_STATUS. Active overrides are stored in PROJECT_GOVERNANCE_POLICY; no expiration rule, revocation route, one-time consumption, universal override authority model, or equal effect across all consumers was proved.

## Future Contract Candidate Vocabulary — Not Approved

The following may be investigated in a later approved design phase but must not be represented as implemented now:

- `GOVERNANCE_SUBJECT`
- `AUTHENTICATED_REVIEWER`
- `REVIEWER_AUTHORITY_GRANT`
- `APPROVAL_SUBJECT`
- `APPROVAL_ACTION`
- `APPROVAL_DECISION_RECORD`
- `DECISION_ID`
- `APPROVAL_EXPIRES_AT`
- `APPROVAL_FRESHNESS_POLICY`
- `APPROVAL_CONSUMPTION_RECORD`
- `APPROVAL_REVOCATION`
- `EXECUTION_AUTHORIZATION`
- `EXECUTION_RESULT_LINK`
- `POLICY_SCOPE`
- `POLICY_PRECEDENCE`
- `POLICY_VERSION`
- `ORGANIZATION_POLICY`, `WORKSPACE_POLICY`, `PROJECT_POLICY`
- `UNIFIED_AUDIT_ENVELOPE`

These are candidate vocabulary only. No schema, state machine, migration, ID, or runtime owner is approved.

## Proved and Disproved Freeze Summary

| Proposed universal | Freeze result |
| --- | --- |
| Governance Contract / Root / Aggregate / ID | `DISPROVED_AS_UNIVERSAL`; project policy path exists |
| Approval Contract / ID | `DISPROVED_AS_UNIVERSAL`; durable approval-record ID exists |
| Policy Contract / ID | `DISPROVED_AS_UNIVERSAL`; project policy document exists without required ID |
| Reviewer Contract / Authority | `DISPROVED_AS_UNIVERSAL`; routing metadata exists |
| Risk Contract / ID | `DISPROVED_AS_UNIVERSAL`; multiple risk namespaces exist |
| Decision Contract / ID | `DISPROVED_AS_UNIVERSAL`; embedded approval status and transient gate decisions exist |
| Permission Contract | `DISPROVED_AS_UNIVERSAL`; write-key enforcement and scope classification exist separately |
| Execution Authorization Contract | `DISPROVED_AS_UNIVERSAL`; several independent gates exist |
| Approval State Machine | `DISPROVED_AS_UNIVERSAL`; vocabulary exists without enforced transitions |
| Expiration / Freshness / Revocation Model | `NOT_IMPLEMENTED_OR_NOT_PROVED` |
| Escalation Model | `DISPROVED_AS_UNIVERSAL`; explicit approval escalation exists |
| Audit Model | `DISPROVED_AS_UNIVERSAL`; fragmented audit evidence exists |

## Phase 1A-6 Exit Criteria

- Exactly five documents exist under `docs/contracts/governance/`.
- All five contain the Phase 1A-6 documentation-only freeze boundary.
- Backend sources remain authoritative and frontend sources remain projection/UX classifications.
- Universal-contract claims are explicitly proved or disproved.
- Expiration, freshness, revocation, replay, reviewer authority, and cross-scope inheritance are not inferred.
- No runtime, schema, migration, test, commit, or push is included.

On these conditions, Phase 1A-6 may close as a source inventory and vocabulary recommendation only. It does not authorize contract implementation.
