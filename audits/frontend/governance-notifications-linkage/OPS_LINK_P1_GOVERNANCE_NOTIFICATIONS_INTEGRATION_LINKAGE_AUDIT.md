# OPS-LINK-P1 — Governance / Notifications / Integration Action Linkage Closeout Audit

## Status
Audit-only closeout.

No production code changed.
No data/projects files changed.
No commit created.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Latest relevant commit: `9a28716` — Route integration reconnect approval to Governance
- Previous relevant commit: `50006e6` — Clarify WooCommerce test preflight requirements

## Surfaces audited
- Integrations
- Governance
- Notification Center
- Customer Center
- Backend integration routes
- Backend customer-operations routes

## Confirmed working

### 1. Reconnect approval-required routes to Governance
The integration reconnect flow is governance-gated and the frontend now routes approval-required reconnect failures to Governance instead of faking success or continuing the action locally.

Evidence:
- Frontend reconnect flow recognizes `governance_approval_required` and navigates to Governance.
- Backend connect/reconnect/test/sync/import-history/disconnect integration routes exist and are guarded.

### 2. WooCommerce test preflight blocks missing saved config
The WooCommerce test flow checks for a saved Store URL before allowing a test request to proceed. Missing saved config is surfaced as guidance, not a crash.

### 3. Governance queue exists
Governance has queue/decision actions and supports reviewed approval, changes requested, escalation, approval request creation, and settings-derived rule sync.

### 4. Notification Center exists
Notification Center is present and surfaces operational alerts for approvals, sync failures, publish events, provider disconnects, claim risk, and workflow completion.

### 5. Customer ops read-only routes exist
Backend customer-operations routes exist for readiness, inbox, conversations, conversation detail, conversation messages, customer profile, tickets, channels, SLA, and escalations. These are read-only projections.

## Confirmed not yet complete

### 1. Test connection does not yet mirror reconnect governance handoff
The test flow is preflight-protected, but it does not yet mirror the reconnect behavior by handing approval-required cases through Governance in the same way.

### 2. No first-class Brand Update notification bucket found
Brand updates were not found as a dedicated notification category in the audited notification projection.

### 3. SMS is not clearly modeled as a customer channel
Instagram and WhatsApp are modeled in the customer-operations contract, but SMS is not clearly represented as a first-class customer channel in the audited backend projection.

### 4. CRM / Calls / IVR / customer write routes are not live
The customer-operations API remains read-only. No live customer mutation routes were found for CRM, calls, IVR, replies, assignment, ticket mutation, or auto-reply.

## Safety statement
- No governance bypass found.
- No secret logging found.
- No fake success path found for governed integration actions.
- No customer write routes are exposed in the audited customer-operations surface.

## Recommended next phases

### OPS-LINK-P2 — Test connection Governance handoff safe patch
Mirror the reconnect governance handoff for approval-required test connection cases so the test path and reconnect path behave consistently.

### OPS-LINK-P3 — Governance queue / approval visibility browser QA
Run browser QA on Governance decision actions, queue visibility, and approval state transitions after the linkage patch.

### OPS-LINK-P4 — Notification Center category coverage audit
Add or confirm first-class coverage for Brand Update notifications and verify all relevant operational event categories are routed into Notification Center.

### OPS-LINK-P5 — Customer write-action readiness plan
Define the future controlled path for CRM, Calls, IVR, ticket updates, reply/send actions, and other customer-write capabilities before exposing any mutation routes.

## Closeout truth
This branch is safe as a governed, read-only customer-operations and notification-control closeout.

The remaining work is to harden the test-connection approval handoff, expand notification category coverage, and define any future customer-write surface under explicit governance.