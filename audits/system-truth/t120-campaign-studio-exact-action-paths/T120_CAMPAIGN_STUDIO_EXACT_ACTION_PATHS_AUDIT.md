# T120 — Campaign Studio Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact Campaign Studio runtime authority paths in:

- `public/control-center/pages/campaign-studio.js`

This follows T119, which confirmed Campaign Studio contains campaign save, handoff, AI, publishing routing, and shared-state signals.

## Paths to classify

### 1. Form input changes
Expected classification:
- Local/session state only.
- Shared Campaign Studio bridge may update local/shared context.
- Must not write backend campaign records silently.

### 2. `scheduleCampaignPersistence`
Expected classification:
- Must be local/shared-state only.
- Must not call `saveProjectCampaign` automatically.
- Backend persistence must remain explicit through Save campaign draft or Save campaign plan.

### 3. Save campaign draft
Expected classification:
- Calls `saveProjectCampaign`.
- Must be confirmation-gated.

### 4. Save campaign plan
Expected classification:
- Calls `saveProjectCampaign`.
- Must be confirmation-gated.

### 5. Send campaign context to AI
Expected classification:
- Shared AI Command context plus optional durable handoff.
- Durable backend handoff creation must be confirmation-gated.
- Must not run AI execution or backend campaign mutation beyond handoff.

### 6. Route handoffs to Publishing / Content Studio / Media Studio / Ads Manager
Expected classification:
- Shared handoff plus optional durable handoff.
- Durable backend handoff creation must be confirmation-gated.
- Must not publish, schedule, send externally, approve, or execute ads.

### 7. Review Assets / Dependencies / Refresh Intelligence
Expected classification:
- Navigation/read-only/refresh only.
- No campaign mutation unless explicitly confirmed.

### 8. AI campaign handoff intake
Expected classification:
- Applying AI handoff should update local/session/shared campaign context only.
- Must not save backend campaign record automatically.

### 9. Generate Package
Expected classification:
- Session/local package only unless backend mutation exists.
- If backend export exists, must be confirmation-gated.

## Decision Rule
- If backend campaign save/update exists without confirmation, patch.
- If backend handoff creation exists without confirmation, patch.
- If autosave calls backend persistence silently, patch.
- If publishing/ads execution exists, it must route to owning authority or be disabled/confirmed.
- If AI intake mutates backend silently, patch.
- If all durable paths are confirmed and other paths are local/shared/navigation/read-only, close without patch.
- Do not redesign Campaign Studio.
