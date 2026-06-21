# T125 — Integrations Connect/Reconnect Confirmation Patch

## Status
Patched.

## Scope
Production file changed:

- `public/control-center/pages/integrations.js`

## Why patch was needed
T123/T124 confirmed that Integrations already has strong controls for:

- disconnect,
- test,
- sync,
- import,
- Governance approval handling,
- and credential masking.

However, the connect/reconnect path through `persistPrimary` called:

- `connectProjectIntegration`
- `reconnectProjectIntegration`

without an explicit frontend confirmation in the same path.

## Patch
Added explicit confirmation before connect/reconnect provider mutation.

The confirmation explains:

- the integration will be connected/reconnected or repaired,
- credentials may be saved or updated,
- backend sync/provider reads may become enabled,
- the action is backend-governed,
- Governance approval may be required,
- Cancel stops the action before provider mutation.

## Not changed
No redesign.
No CSS changes.
No backend changes.
No route changes.
No data/projects changes.
No credential display changes.
No provider execution behavior added.

## Validation
Use:

- `node --check public/control-center/pages/integrations.js`
- `node --check scripts/audit/integrations-runtime-authority-audit.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
