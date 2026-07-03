# Phase 7A.0 Patch Strategy Draft

## If truth gate confirms settings.js stale hooks have no consumers:
Patch target:
- public/control-center/pages/settings.js only

Action:
- Neutralize stale global hooks so they no longer call missing endpoints.
- Prefer safe diagnostic objects/functions that return structured unavailable/legacy-neutralized responses.
- Do not introduce backend routes.
- Do not delete files.
- Do not change active governance.js.
- Do not touch CSS.

## If global hook consumers exist:
Patch target still likely settings.js, but preserve API shape:
- window.__AI_CONTROL_CENTER__.load()
- window.__AI_CONTROL_CENTER__.update(payload)
- window.__GOVERNANCE_CENTER__.loadAudit()
- window.__GOVERNANCE_CENTER__.process(action)
- window.__GOVERNANCE_CENTER__.live()

Return safe objects explaining canonical route requirement instead of calling missing endpoints.

## If ai-backend-connector.js is loaded by index.html or imported:
Do not patch in Phase 7A unless explicitly approved.
Create Phase 7B for AI bridge neutralization.

## First code patch recommendation:
Frontend-only settings.js stale hook neutralization.
