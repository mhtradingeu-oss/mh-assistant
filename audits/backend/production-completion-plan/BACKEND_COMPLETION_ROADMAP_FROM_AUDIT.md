# Backend Completion Roadmap From Deep Audit

## Current backend verdict
The backend is strong for internal controlled operation, but it is not yet 100% production-ready for multi-user SaaS or customer-data production.

## Correct order of backend completion

### BACKEND-P1B — Permission Matrix Enforcement Plan
Plan the route permission model:
- route
- method
- domain
- required scope
- actor type
- audit event
- compatibility status

### BACKEND-P1C — Public Alias Retirement Plan
Plan removal or compatibility gating for `/public/...` aliases:
- remove public mutation aliases first
- then remove sensitive public read aliases
- add deprecation headers only if compatibility is needed

### BACKEND-P2 — Immutable Audit + Actor Identity Plan
Define a standard mutation audit contract:
- actor id
- request id
- project id
- route
- method
- scope
- before/after
- result
- error code

### BACKEND-P3 — Durable State / Database Decision Plan
Decide final state strategy:
- database model
- migrations
- JSON import fallback
- transaction boundaries
- idempotency
- backup/restore

### BACKEND-P4 — Queue / Worker Execution Hardening Plan
Move long-running or provider-executing routes to durable workers:
- publishing
- AI workflows
- media generation
- integration sync
- email/provider send
- scheduler jobs

### BACKEND-P5 — Provider + Customer Data Compliance Plan
Define provider and customer-data production rules:
- CRM
- messages
- calls/IVR
- email
- WooCommerce
- Meta/Google/TikTok
- PII access
- consent
- retention
- export/delete

### BACKEND-P6 — Verification and Release Gate
Add backend tests and release proof:
- route authorization tests
- mutation safety tests
- public alias tests
- audit log assertion tests
- provider mock tests
- smoke tests
