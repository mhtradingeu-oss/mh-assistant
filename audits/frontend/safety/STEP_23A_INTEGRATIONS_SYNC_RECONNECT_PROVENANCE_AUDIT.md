# STEP 23A — Integrations Sync/Reconnect Provenance Copy Audit

Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: AUDIT ONLY / documentation-only

---

## 1) Executive Summary

This audit reviewed Integrations Sync and Reconnect actions after protecting Disconnect.

Decision:
- Do not add confirmation gates to Sync or Reconnect yet.
- Use wording/provenance clarification first.
- Disconnect remains the only strong confirmation gate in Integrations.
- Sync and Reconnect should communicate backend/provider authority more clearly.
- No production code was modified in this step.

---

## 2) Current Protected Action

Disconnect is already protected by STEP 22B.

Protected flow:
- `disconnect(integrationId)`
- `window.confirm(...)`
- `disconnectProjectIntegration(...)`

This is correct because Disconnect can stop data flow, attribution, learning signals, and automation inputs.

---

## 3) Sync Evidence

Sync is executed through:
- `runServerAction(integrationId, type)`
- `type === "sync"`
- `syncProjectIntegration(projectName, integrationId, payload)`

Current visible label:
- `Sync`

Locations include:
- `public/control-center/pages/integrations.js`
- `public/control-center/pages/integrations/cards.js`
- `public/control-center/pages/integrations/drawer.js`

---

## 4) Reconnect Evidence

Reconnect is executed through:
- `persistPrimary(integrationId, true)`
- `reconnectProjectIntegration(projectName, integrationId, payload)`

Current visible labels:
- `Reconnect`
- `Fix connection`

Locations include:
- `public/control-center/pages/integrations.js`
- `public/control-center/pages/integrations/cards.js`
- `public/control-center/pages/integrations/drawer.js`

---

## 5) Risk Classification

### Sync

Classification:
- Review / Backend Controlled

Reason:
- Starts provider-backed sync.
- May update activity, snapshots, insights, and learning inputs.
- It is not destructive by itself.
- It is expected to be used repeatedly.

Decision:
- Do not add confirm yet.
- Prefer wording/provenance clarification.

Suggested wording:
- `Run backend sync`
- `Run connector sync`

Suggested feedback:
- `${integration.label} backend sync started.`

### Reconnect / Fix connection

Classification:
- Review Required

Reason:
- Can update provider connection state or token/config behavior.
- Requires valid connection inputs.
- Less destructive than disconnect.

Decision:
- Do not add confirm yet.
- Prefer clearer wording.

Suggested wording:
- `Reconnect integration`
- `Repair integration connection`

Suggested feedback:
- `${integration.label} integration reconnected.`
- `${integration.label} connection repair started.`

### Test connection

Classification:
- Safe / Inspect

Decision:
- Keep as-is.
- No confirm required.

### Diagnostics

Classification:
- Safe / Inspect

Decision:
- Keep as-is.
- No confirm required.

---

## 6) Recommended STEP 23B Candidate

Apply a copy-only patch.

Allowed:
- Change visible labels only.
- Change success feedback copy only.
- Add no new handlers.
- Add no confirmation gates.
- Change no data attributes.
- Change no API calls.
- Change no backend behavior.

Recommended label changes:
- `Sync` to `Run backend sync`
- `Reconnect` to `Reconnect integration`
- `Fix connection` to `Repair integration connection`

Do not patch:
- disconnect confirmation
- connect behavior
- sync behavior
- reconnect behavior
- test behavior
- diagnostics behavior
- backend code
- CSS
- data/projects

---

## 7) Validation Result

Validation commands were run before this audit document:
- `git status --short`
- grep for Sync/Reconnect/Test action areas
- grep for Integrations action label sources
- `node --check public/control-center/pages/integrations.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

Result:
- Working tree was clean before audit.
- Syntax checks passed.
- Sync/Reconnect label and handler anchors were identified.
- No production code was modified.

---

## 8) Explicit No-Code-Change Statement

This step made no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- routes
- API behavior
- handlers
- IDs/classes/data attributes