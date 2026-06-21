# T124 — Integrations Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact Integrations runtime authority paths in:

- `public/control-center/pages/integrations.js`

This follows T123, which confirmed Integrations contains provider credentials, connect/reconnect, test, sync, import, disconnect, provider execution, and Governance/approval signals.

## Paths to classify

### 1. Drawer open / select integration
Expected classification:
- UI-only.
- No backend mutation.

### 2. Field input changes
Expected classification:
- Local/session draft only.
- Secret values must not be exposed.
- No credential/backend mutation until explicit connect/save action.

### 3. Build connection payload
Expected classification:
- Builds payload from local draft + safe server credential state.
- Must not log or expose secrets.

### 4. Connect integration
Expected classification:
- Calls `connectProjectIntegration`.
- Must be confirmation-gated.
- Must respect unsupported/backend provider guard.

### 5. Reconnect / repair integration
Expected classification:
- Calls `reconnectProjectIntegration`.
- Must be confirmation-gated.
- If backend returns governance approval required, UI should route/show approval clearly.

### 6. Test connection
Expected classification:
- Calls `testProjectIntegration`.
- Must use saved server-side config.
- Should not expose credentials.
- If high-impact provider test exists, classify whether confirmation is required.

### 7. Backend sync / refresh
Expected classification:
- Calls `syncProjectIntegration`.
- Must be confirmation-gated or approval-gated.
- Must not silently import/write external data.

### 8. Import history
Expected classification:
- Calls `importProjectIntegrationHistory`.
- Must be confirmation-gated or approval-gated.
- Must clarify durable import impact.

### 9. Disconnect
Expected classification:
- Calls `disconnectProjectIntegration`.
- Must be confirmation-gated.
- Must clarify it can disable provider sync/import.

### 10. AI / diagnostics actions
Expected classification:
- AI prompt/guidance only unless backend mutation exists.
- Diagnostics should be read-only or clearly confirmed if backend test/action occurs.

### 11. Credentials display
Expected classification:
- Existing secrets must be masked / shown as saved state only.
- No raw tokens in UI output.

## Decision Rule
- If connect/reconnect/sync/import/disconnect exists without confirmation, patch.
- If credential save/update exists without confirmation, patch.
- If credentials/tokens are exposed in UI or logs, patch.
- If protected provider actions bypass Governance approval lifecycle, patch.
- If AI is prompt/navigation only, document and close.
- If all durable/provider actions are confirmed or approval-gated, close without patch.
- Do not redesign Integrations.
