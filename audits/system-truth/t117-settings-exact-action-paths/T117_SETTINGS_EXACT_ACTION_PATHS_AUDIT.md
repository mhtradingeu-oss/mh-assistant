# T117 — Settings Exact Action Paths Audit

## Status
Audit-only. No production files changed.

## Scope
Classify exact Settings runtime authority paths in:

- `public/control-center/pages/settings.js`

This follows T116, which confirmed Settings can affect durable team and governance records.

## Paths to classify

### 1. Durable Settings Save
Expected classification:
- Calls `saveProjectTeam`.
- Calls `updateProjectGovernancePolicy`.
- May create Governance handoff.
- Must be explicit and confirmation-gated.

### 2. Governance Handoff Created After Save
Expected classification:
- If created only after confirmed save, document as included in the save action.
- If created independently, must be confirmation-gated.

### 3. Restore Defaults
Expected classification:
- Local/session form reset only.
- Must not write backend until Save Settings is clicked.

### 4. Reset Section
Expected classification:
- Local/session section reset only.
- Must not write backend until Save Settings is clicked.

### 5. Focus Section / Review Critical
Expected classification:
- UI-only navigation/scroll/review.
- No backend mutation.

### 6. Open Governance
Expected classification:
- Route/navigation only.
- No backend mutation.

### 7. Settings AI Assistant
Expected classification:
- Prompt/context only.
- Must not save settings, update governance policy, create handoff, or mutate backend.

### 8. Field Changes
Expected classification:
- Local/session dirty state only.
- No backend mutation until explicit save.

## Decision Rule
- If durable save is confirmation-gated and all other actions are local/navigation/prompt-only, close without patch.
- If Governance handoff is created outside confirmed save, patch.
- If reset/default actions write backend without confirmation, patch.
- If AI path writes backend or overclaims authority, patch.
- Do not redesign Settings.
