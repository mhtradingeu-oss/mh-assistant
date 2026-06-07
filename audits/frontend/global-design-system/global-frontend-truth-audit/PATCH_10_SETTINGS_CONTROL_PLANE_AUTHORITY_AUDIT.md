# Patch 10 — Settings Control Plane Authority Audit

## Status

Audit-only / no production change.

Settings is a high-authority control plane, not a safe blind copy/hierarchy patch target. The page can write durable team and governance records, update approval/publishing/sync/AI defaults, restore defaults, reset sections, and create Governance handoffs.

## Production Decision

No production code was changed.

Reason:

- Settings already communicates that it controls durable defaults for Governance, Publishing, AI, Integrations, and Operations.
- Settings already states backend enforcement remains authoritative.
- Save Settings already uses an explicit confirmation dialog before durable writes.
- Save Settings writes both team and governance policy records.
- Restore Defaults and Reset Section change local form state and require review/save.
- AI prompt actions route to AI Command only.
- Governance page navigation already exists.
- The page contains high-risk authority controls and should not receive a blind wording or hierarchy patch before a dedicated Settings/Governance contract review.

## Current Active File

- `public/control-center/pages/settings.js`

## Existing Strengths

Confirmed current Settings capabilities and safety language:

- Settings operating surface overview.
- Launch configuration overview.
- Durable backbone / durable pending status.
- Approval mode summary.
- Publishing mode summary.
- Sync mode summary.
- Risk/readiness panel.
- Next best action panel.
- Settings AI assistant.
- Cross-page operating impact summary.
- Settings actions panel.
- Safe execution path guidance.
- Explicit backend-governed save confirmation.
- Settings to Governance handoff after save.
- Governance page navigation.
- Team role matrix.
- Permissions for approve, publish, integrations, and defaults.
- Project defaults, operating modes, AI settings, publishing, approval, sync, safety, and governance-related configuration.

## Authority / Risk Findings

The following require caution before any production change:

1. Durable save behavior

The save action maps Settings into:

- team payload
- governance policy payload

Then writes through:

- `saveProjectTeam`
- `updateProjectGovernancePolicy`

2. Governance authority bridge

After saving, the page creates a Governance handoff with:

- `source_page = settings`
- `destination_page = governance`
- linked entity type `governance_policy`

3. Role and permission matrix

The page can configure role authority, approval ability, publishing ability, integration management, and default-change authority.

4. Approval and publishing defaults

The page can influence approval behavior and publishing readiness. Any wording must not imply frontend-only changes are enforcement authority.

5. Restore/reset behavior

Restore Defaults and Reset Section change local form state and may later be persisted if the operator saves.

6. AI settings and automation posture

Operating mode, AI behavior, and automation posture can affect operator expectations. Any future copy change must keep human/backend governance boundaries explicit.

## Recommended Next Patch

Before any production patch, run:

### Patch 10B — Settings/Governance Contract Audit

Goal:

Map exact fields from Settings into Governance and Team payloads:

- which fields are persisted to team model
- which fields are persisted to governance policy
- which fields are UI-only/local
- which settings affect publishing
- which settings affect approvals
- which settings affect AI behavior
- which settings affect sync/integrations
- which settings are actually enforced by backend versus only projected in UI

Allowed scope:

- audit documentation only unless a very narrow copy guard is proven safe

Forbidden:

- no handler changes
- no API changes
- no save behavior changes
- no restore/reset behavior changes
- no role permission logic changes
- no approval logic changes
- no publishing defaults changes
- no sync defaults changes
- no CSS
- no backend
- no data/projects

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/settings.js`
- route ID: `settings`
- `data-page="settings"`
- all `data-settings-*` attributes
- all `data-setting-path` bindings
- all form handlers
- all save handlers
- all reset handlers
- all restore defaults behavior
- `saveProjectTeam`
- `updateProjectGovernancePolicy`
- `createProjectHandoff`
- `reloadProjectData`
- Settings to Governance handoff behavior
- AI Command routing behavior
- project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/settings.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Manual QA recommended before any production patch:

- Open Settings.
- Confirm current project loads.
- Change a non-critical field.
- Confirm unsaved state appears.
- Use Reset Section.
- Use Restore Defaults and confirm review/save is still required.
- Trigger Review Critical Settings.
- Open Governance page.
- Open AI Workspace guidance.
- Save Settings only in a safe test project.
- Confirm confirmation dialog appears before durable writes.
- Confirm Team and Governance saves remain backend-governed.
- Confirm no console errors.

## Risks

- No functional risk because no production code changed.
- High future-change risk because Settings is a durable authority bridge into Team and Governance records.

## Rollback Path

Delete this audit file.

No production rollback is required.
