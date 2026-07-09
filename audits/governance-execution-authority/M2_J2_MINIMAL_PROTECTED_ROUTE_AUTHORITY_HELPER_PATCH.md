# M2-J2 — Minimal Protected Route Authority Helper Patch

## 0. Status

Status: PATCH APPLIED FOR REVIEW
Phase: M2-J — Narrow Backend Guard Enforcement Patch
Scope: minimal backend security helper plus narrow Phase 1 middleware

## 1. Files Changed

- `runtime/orchestrator-service/lib/security/protected-route-authority.js`
- `runtime/orchestrator-service/server.js`
- `audits/governance-execution-authority/M2_J2_MINIMAL_PROTECTED_ROUTE_AUTHORITY_HELPER_PATCH.md`

## 2. Intent

This patch adds a small backend route authority helper and applies it to selected Phase 1 high-risk protected backend routes.

The helper only decides whether a route may proceed.

It does not mutate data.

It does not call providers.

It does not publish, send customer replies, launch ads, sync providers, approve, or execute jobs.

## 3. Guard Proof Signals

The helper recognizes explicit proof only:

- `x-mh-approval-id`
- `x-mh-manual-execution`
- `x-mh-owner-workspace`
- `x-mh-review-output`

Equivalent body/query fields are also recognized for controlled internal tests.

Frontend UI state alone is not proof.

## 4. Protected Groups

The initial middleware covers:

- destructive asset delete routes
- integration connect/reconnect/test/sync/import-history/disconnect routes
- AI command/chat/guidance/workflow run routes
- workflow run/scheduler/execution feedback routes
- publishing clone/blog/rollback/package execution routes
- provider/review-output media generation routes

## 5. Safety Notes

No frontend files were changed.

No provider files were changed.

No publishing implementation was rewritten.

No ads implementation was changed.

No CRM/customer send behavior was added.

No forbidden action was relaxed.

## 6. Review Requirement

M2-J2 must be validated before commit.

M2 is not closed by this patch.

