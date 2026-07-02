# Patch 10B — Settings / Governance Contract Audit

## Status

Audit-only / no production change.

This audit maps the frontend Settings contract into durable Team and Governance authority boundaries before any Settings production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Settings is a durable authority bridge.
- Settings reads Team and Governance records.
- Settings writes Team and Governance records.
- Settings creates a Governance handoff after durable save.
- Settings controls project defaults, operating posture, AI posture, automation posture, publishing defaults, approval rules, role permissions, sync rules, alerts, and safety/governance rules.
- Any copy, field, handler, or status change must preserve the distinction between frontend projection and backend enforcement.

## Current Active File

- `public/control-center/pages/settings.js`

## Durable Read Contract

Settings loads durable records through:

- `fetchProjectTeam(projectName)`
- `fetchProjectGovernancePolicy(projectName)`

The loaded records populate:

- `session.teamModel`
- `session.governancePolicy`

Then Settings builds a local form state by merging:

- `buildDefaultSettings(state)`
- `extractDurableSettingsSnapshot(session.governancePolicy, session.teamModel)`

## Durable Save Contract

The `save-all` action builds:

- `governancePayload = mapSettingsToGovernancePolicy(session.form)`
- `teamPayload = mapSettingsToTeamPayload(session.form)`

Then requires explicit confirmation before durable writes.

After confirmation, it calls:

- `saveProjectTeam(session.projectName, teamPayload)`
- `updateProjectGovernancePolicy(session.projectName, { actor: "settings-page", ...governancePayload })`

Then it creates a Governance handoff using:

- `context.createProjectHandoff`

The handoff links to:

- `destination_page: governance`
- `linked_entity.entity_type: governance_policy`
- `linked_entity.entity_id: default`

## Governance Policy Payload Fields

The Governance payload is built from Settings form fields and includes:

### Execution policy

Derived from:

- `project.defaultCampaignMode`
- `operating.primaryMode`
- `operating.actionPolicy`

### Policy rules

Derived from:

- `publishing.approvalBeforePublish`
- `approval.requirements`
- `operating.actionPolicy`
- `operating.primaryMode`

Important policy effects:

- approval before publish
- human approval triggers
- auto-escalate critical risk
- freeze publishing in Emergency Safe Mode

### Approval owners

Derived from:

- `approval.contentOwner`
- `approval.mediaOwner`
- `approval.adsOwner`
- `team.publishAccess`

### Settings bridge metadata

Includes:

- `source: settings-durable-record`
- `synced_at`
- `approval_mode`
- `claim_safety_mode`
- `execution_mode`
- `action_policy`

## Team Payload Fields

The Team payload is built from Settings form fields and role matrix values.

It includes or is expected to include:

- team roles
- service coverage
- edit access
- approve access
- publish access
- integration access
- defaults access
- role matrix authority
- role-level approve permission
- role-level publish permission
- role-level integration management permission
- role-level default-change permission

## UI / Local Form Field Inventory

The Settings UI exposes these field families:

### Project

- `project.projectName`
- `project.brandName`
- `project.market`
- `project.language`
- `project.currency`
- `project.timezone`
- `project.website`
- `project.defaultCampaignMode`
- `project.businessType`

### Operating

- `operating.primaryMode`
- `operating.actionPolicy`
- `operating.emergencyOwner`
- `operating.modeNotes`

### AI

- `ai.tone`
- `ai.responseStyle`
- `ai.generationStrictness`
- `ai.approvalRequiredMode`
- `ai.creativitySafetyBalance`
- `ai.claimSafetyMode`
- `ai.contentGenerationDefaults`
- `ai.mediaGenerationDefaults`

### Automation

- `automation.enabledRules`
- `automation.readinessThreshold`
- `automation.failurePolicy`
- `automation.routingNotes`

### Publishing

- `publishing.channels`
- `publishing.schedulingBehavior`
- `publishing.approvalBeforePublish`
- `publishing.namingConvention`
- `publishing.contentRouting`
- `publishing.campaignOutputs`

### Approval

- `approval.contentOwner`
- `approval.mediaOwner`
- `approval.adsOwner`
- `approval.requirements`
- `approval.revisionRules`
- `approval.escalationNotes`

### Team

- `team.roles`
- `team.serviceCoverage`
- `team.editAccess`
- `team.approveAccess`
- `team.publishAccess`
- `team.integrationAccess`
- `team.defaultsAccess`
- `team.roleMatrix.*`

### Presets

- `presets.campaignPreset`
- `presets.contentPreset`
- `presets.mediaPreset`
- `presets.seoPreset`
- `presets.adsPreset`
- `presets.approvalPreset`
- `presets.presetNotes`

### Sync

- `sync.autoSync`
- `sync.frequency`
- `sync.importHistoryPreference`
- `sync.retryFailedBehavior`
- `sync.healthCheckFrequency`
- `sync.refreshDefaults`

### Alerts

- `alerts.enabledRules`
- `alerts.alertCadence`
- `alerts.deliveryMode`
- `alerts.notificationNotes`

### Safety

- `safety.aiClaimCheck`
- `safety.productTruthRules`
- `safety.brandProtectionRules`
- `safety.prohibitedOutputs`
- `safety.complianceAlerts`
- `safety.legalNotes`

## Backend-Enforced Versus Frontend-Projected Boundary

### Backend / durable authority

These are treated as durable or backend-governed:

- Team save
- Governance policy update
- Settings save confirmation
- Settings-to-Governance handoff
- reload project data after save
- Governance policy bridge fields
- Team role and permission payloads

### Frontend projection / local state

These remain frontend-local until saved:

- dirty form state
- restored defaults
- reset section values
- unsaved field edits
- readiness/risk summaries
- AI prompt preparation
- UI focus-section actions

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `mapSettingsToGovernancePolicy`
2. `mapSettingsToTeamPayload`
3. `extractDurableSettingsSnapshot`
4. `loadDurableSettings`
5. `save-all` action
6. `restore-defaults` action
7. `reset-section` action
8. `data-setting-path` binding behavior
9. role matrix permissions
10. approval-before-publish mapping
11. Emergency Safe Mode / freeze publishing mapping
12. AI claim safety mapping
13. Settings-to-Governance handoff payload

## Recommended Future Patch

### Patch 10C — Settings Copy Guard Only

Only if needed, a future safe patch may clarify visible wording around:

- Settings control plane
- Backend enforcement authority
- Save affects Team and Governance records
- Restore/Reset are local until saved
- AI guidance does not change settings automatically
- Governance remains the review authority

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- handler changes
- API changes
- mapping changes
- status changes
- role permission logic changes
- save behavior changes
- reset/restore behavior changes
- CSS
- backend
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/settings.js`
- `fetchProjectTeam`
- `fetchProjectGovernancePolicy`
- `saveProjectTeam`
- `updateProjectGovernancePolicy`
- `mapSettingsToGovernancePolicy`
- `mapSettingsToTeamPayload`
- `extractDurableSettingsSnapshot`
- `loadDurableSettings`
- all `data-settings-*` attributes
- all `data-setting-path` bindings
- all save/reset/restore handlers
- all AI routing behavior
- all Governance handoff behavior
- all backend/API behavior
- all project data behavior

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

Before any future Settings production patch:

- Open Settings.
- Confirm current project loads.
- Confirm durable status appears.
- Change a field and confirm unsaved state appears.
- Reset a section and confirm local state changes only.
- Restore defaults and confirm review/save is still required.
- Open AI guidance and confirm only AI Command routing happens.
- Open Governance page.
- Save Settings only in a safe test project.
- Confirm confirmation dialog appears before save.
- Confirm Team and Governance records update only after confirmation.
- Confirm Governance handoff is created after save.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.
