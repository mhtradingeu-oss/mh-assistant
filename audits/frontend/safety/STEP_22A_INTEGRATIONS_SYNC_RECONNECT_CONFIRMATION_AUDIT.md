# STEP 22A — Integrations Sync/Reconnect Confirmation Audit

Date: 2026-05-13  
Branch: architecture/frontend-consolidation-v1  
Mode: AUDIT ONLY / documentation-only

---

## 1) Executive Summary

This audit reviewed Integrations page actions before adding any confirmation or provenance UI.

Decision:
- Integrations contains several backend/provider-adjacent actions.
- `disconnect` is the highest-risk action.
- `reconnect` and `sync` are review-required actions.
- `test` and `diagnostics` are lower-risk inspection actions.
- The next safe implementation step should protect only the smallest high-risk action first.
- No production code was modified in this step.

---

## 2) Frontend Evidence

The Integrations page receives backend action functions:

```text
public/control-center/pages/integrations.js:1201 connectProjectIntegration
public/control-center/pages/integrations.js:1202 reconnectProjectIntegration
public/control-center/pages/integrations.js:1204 syncProjectIntegration
public/control-center/pages/integrations.js:1206 disconnectProjectIntegration

Primary action handling exists at:

public/control-center/pages/integrations.js:1221
[data-integration-primary]

Connector action handling exists at:

public/control-center/pages/integrations.js:1502
[data-integration-action]

Connect/reconnect persistence is handled by:

public/control-center/pages/integrations.js:1408
persistPrimary(integrationId, reconnect = false)

Disconnect is handled by:

public/control-center/pages/integrations.js:1448
disconnect(integrationId)

Sync is handled by:

public/control-center/pages/integrations.js:1469
runServerAction(integrationId, type)

public/control-center/pages/integrations.js:1483
type === "sync"

public/control-center/pages/integrations.js:1484
syncProjectIntegration(...)

There is no existing confirmation gate identified for these actions in the scan.

3) Risk Classification
Safe / Low Risk
Open setup
Run diagnostics
Test connection

Reason:

These actions are inspect/review oriented.
They should remain friction-light unless backend behavior changes.
Review Required
Connect
Reconnect / Fix connection
Sync

Reason:

These actions interact with provider-backed state or backend integration state.
Reconnect may change token/config behavior.
Sync may trigger data movement or update snapshots used by insights and learning.
Dangerous / Strong Confirmation
Disconnect

Reason:

Disconnect can break data flow.
It can affect learning, performance visibility, attribution, and automation readiness.
It is the safest first candidate for a confirmation gate because it is clearly high-risk and isolated.
4) Recommended STEP 22B Candidate

Add exactly one confirmation gate to:

public/control-center/pages/integrations.js
function: disconnect(integrationId)
before: disconnectProjectIntegration(...)

Do not patch yet:

connect
reconnect
sync
test
diagnostics
AI prompts
drawer open/close
filters/search
backend code
CSS
data/projects
5) Proposed Confirmation Copy
Confirm integration disconnect

Action: Disconnect this integration from the current project.
Risk: This can stop data sync, attribution, learning signals, and automation inputs for this connector.
Authority: This is a backend-governed integration state update.

Select Cancel to keep the integration connected.
6) Future Candidates

After disconnect is protected and verified:

Reconnect / Fix connection confirmation or provenance copy.
Sync confirmation or softer “backend sync started” provenance copy.
Optional label cleanup:
Sync → Run backend sync
Reconnect → Reconnect integration
Fix connection → Repair integration connection
7) Validation Result

Validation commands were run before this audit document:

git status --short
grep for Integrations action anchors
grep for Integrations functions
node --check public/control-center/pages/integrations.js
node --check public/control-center/api.js
node --check public/control-center/app.js
node --check public/control-center/router.js

Result:

Working tree was clean before audit.
Syntax checks passed.
Integrations action anchors were identified.
No production code was modified.
8) Explicit No-Code-Change Statement

This step made no production code changes.

No changes to:

frontend JS
CSS
backend
data/projects
routes
API behavior
handlers
IDs/classes/data attributes