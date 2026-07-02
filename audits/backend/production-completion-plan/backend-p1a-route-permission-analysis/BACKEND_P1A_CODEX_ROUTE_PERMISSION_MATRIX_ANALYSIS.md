# BACKEND-P1A — Codex Route Permission Matrix Analysis

## Status
Closed as analysis-only.

No production code changed.

## Evidence basis
This analysis was produced from:

- audits/backend/production-completion-plan/backend-p1-route-permissions/
- audits/backend/deep-truth-final/
- runtime/orchestrator-service/server.js spot checks

## Main findings

### 1. Route protection
No clear evidence was found of fully open high-risk mutation endpoints in the current evidence pack.

Important caveat:
Protection is centralized through shared-key middleware, not user identity, RBAC, scoped permissions, tenant/project membership, or per-route authorization.

### 2. Public alias risk
Public-looking aliases remain the highest immediate risk.

Sensitive read and write capabilities are reachable through `/public/...` aliases, including:
- AI command / workflow execution
- integrations connect / disconnect / sync
- publishing schedule / publish
- governance policy / approval flows
- source deletion
- project and customer-operation reads

These aliases may be key-protected, but their production semantics are unsafe and should be retired or compatibility-gated.

### 3. Missing production authorization model
Current backend does not yet have a full production authorization model with:
- user identity
- role claims
- project membership
- route scopes
- service accounts
- scoped API keys
- immutable audit principal

### 4. Missing uniform audit guarantees
Audit logging exists in some areas, but not as a required cross-route contract for every mutation.

Every mutation route needs:
- actor id
- project id
- request id
- permission scope
- before/after summary
- result status
- error code if failed
- immutable audit event name

### 5. Highest-risk route groups
Highest-risk route groups are:
- `/public/...` mutation aliases
- publishing execution routes
- integration/provider execution routes
- legacy WooCommerce product mutation routes
- source deletion routes
- AI workflow execution routes
- scheduler / worker HTTP trigger routes
- customer-operation read routes containing PII-sensitive data

## Production recommendation
Do not add more backend features yet.

The next backend work should focus on:
1. permission matrix enforcement
2. public alias retirement
3. immutable audit logging
4. actor identity model
5. durable state and idempotency
6. queue/worker hardening
7. provider/customer-data compliance

## Next phase
BACKEND-P1B — Permission Matrix Enforcement Plan

Plan-only.
