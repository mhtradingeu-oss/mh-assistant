# T126 — Integrations Runtime Authority Closeout

## Status
Closed — one narrow production patch applied.

## Scope
Runtime authority review of:

- `public/control-center/pages/integrations.js`

## Prior audits
- T123 — Integrations Runtime Authority Audit
- T124 — Integrations Exact Action Paths Audit
- T125 — Integrations Connect/Reconnect Confirmation Patch

## Finding
Integrations is a high-authority provider and credential surface.

It includes:

- provider setup drawers,
- local credential drafts,
- masked credential state,
- connect/reconnect/repair,
- test connection,
- backend sync,
- history import,
- disconnect,
- diagnostics,
- AI prompt guidance,
- and Governance approval handling.

## Exact action classification

### Drawer open / select integration
Safe.

Opening a connector setup drawer is UI-only.

No backend mutation occurs.

### Field input changes
Safe.

Field input updates local/session draft state only.

Secret fields are not populated from saved server credentials.

### Credential display
Safe.

Existing saved secrets are represented through server-side credential state such as `is_set`.

The UI shows helper copy like "Saved securely on server. Leave blank to keep the current secret."

Raw tokens/secrets are not displayed back to the user.

### Build connection payload
Safe.

The connection payload is built only for explicit connect/reconnect actions.

Existing secret fields are not read back from the server as raw values.

### Connect integration
Safe after T125 patch.

`connectProjectIntegration` is called only after explicit confirmation.

The confirmation clarifies that the action may save or update provider credentials, enable backend sync, and activate provider-level reads.

### Reconnect / repair integration
Safe after T125 patch.

`reconnectProjectIntegration` is called only after explicit confirmation.

If the backend returns `governance_approval_required`, the UI shows the approval message, reloads project data, and routes to Governance.

### Test connection
Safe.

`testProjectIntegration` is confirmation-gated.

The UI clarifies that the test uses saved server-side configuration and does not expose credentials.

### Backend sync / refresh
Safe.

`syncProjectIntegration` is confirmation-gated.

The confirmation explains that it may start backend jobs, provider reads, imports, or data refresh operations and may require Governance approval.

### Import history
Safe.

`importProjectIntegrationHistory` is confirmation-gated.

The confirmation explains backend job/provider/import risk and Governance approval possibility.

### Disconnect
Safe.

`disconnectProjectIntegration` is confirmation-gated.

The confirmation explains this can stop sync, attribution, learning signals, and automation inputs.

### Governance approval handling
Safe.

Connector operations detect `governance_approval_required`, surface the approval message/id when available, reload project data, and route to Governance.

### AI / diagnostics
Safe.

AI/diagnostics actions are guidance, prompt, routing, or diagnostic review surfaces.

No unconfirmed provider mutation occurs through AI.

## T125 patch summary
T125 added explicit confirmation before:

- `connectProjectIntegration`
- `reconnectProjectIntegration`

Cancel now stops connect/reconnect before provider credential or connection mutation.

## Decision
`public/control-center/pages/integrations.js` is safe to close.

All sensitive provider actions are now confirmation-gated, approval-aware, credential-masked, read-only/local where appropriate, or routed to Governance.

## Changed
Production file changed:

- `public/control-center/pages/integrations.js`

Audit files added:

- `audits/system-truth/t123-integrations-runtime-authority/`
- `audits/system-truth/t124-integrations-exact-action-paths/`
- `audits/system-truth/t125-integrations-connect-reconnect-confirmation-patch/`
- `audits/system-truth/t126-integrations-runtime-authority-closeout/`

Script added:

- `scripts/audit/integrations-runtime-authority-audit.mjs`

## Not changed
No redesign.
No CSS changes.
No backend changes.
No route changes.
No data/projects changes.
No raw credential exposure.
No provider execution behavior added.

## Validation
Validated with:

- `node --check public/control-center/pages/integrations.js`
- `node --check scripts/audit/integrations-runtime-authority-audit.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`

## Next step
Run a fresh frontend runtime risk rebaseline to determine the true remaining open pages after closing:

- Workflows
- Settings
- Campaign Studio
- Integrations
