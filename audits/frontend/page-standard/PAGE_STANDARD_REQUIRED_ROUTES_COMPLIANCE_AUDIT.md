# Page Standard Required Routes Compliance Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## 1. Executive Summary

After Operations, Governance, Settings, and standard CSS ownership cleanup, the system frontend is much cleaner.

Confirmed clean:

- old Governance numbered labels removed
- old Settings labels and settings-shell/settings-workspace removed
- old Operations scaffold labels removed
- std-page-shell ownership consolidated in 14-page-standard.css
- std-main-content-slot ownership consolidated in 14-page-standard.css
- no direct legacy runtime load detected
- JS validation passed
- data/projects clean

Remaining work is no longer obvious old labels. The remaining concern is REQUIRED_ROUTES pages that still perform custom/local render inside Page Standard wrapping.

This is acceptable only if each page does not create:
- duplicate header/context
- nested shell feel
- visual shift during load
- conflicting action/AI surfaces

## 2. Required Routes

Page Standard REQUIRED_ROUTES includes:

- home
- setup
- library
- integrations
- ai-command
- workflows
- campaign-studio
- content-studio
- media-studio
- publishing
- ads-manager
- insights
- research
- settings

## 3. Cleaned System Pages

### Settings

Status: cleaned.

Completed:

- Settings UX Contract committed
- Settings layout-only operating surface committed
- settings-shell removed
- settings-workspace removed
- settings-page-surface introduced
- old labels removed:
  - Settings Overview
  - Control Actions
  - Settings AI Assistant
  - Settings Summary

Behavior preserved:

- data-settings-action
- data-settings-open-ai
- data-settings-ai-prompt
- data-setting-path
- loadDurableSettings
- fetchProjectTeam
- fetchProjectGovernancePolicy
- saveProjectTeam
- navigateTo("ai-command")

### Governance

Status: cleaned as custom excluded page.

Completed:

- Governance UX Contract committed
- Governance layout-only patch committed
- old numbered labels removed
- governance remains intentionally excluded from REQUIRED_ROUTES
- behavior preserved

### Operations Centers

Status: cleaned as custom excluded pages.

Completed:

- Task Center
- Queue Center
- Job Monitor
- Notification Center
- legacy shared scaffold removed
- old Operations labels removed
- renderOperationsScaffold removed

## 4. Standard-Wrapped Custom Render Pages

These pages are in REQUIRED_ROUTES but still render local/custom surfaces inside Page Standard wrapping.

They are not automatically broken, but require transition QA.

| Page | Local mount / shell | Risk | Next action |
|---|---|---:|---|
| home | homeExecRoot | Medium | Visual transition QA |
| library | libraryRoot + library-smart-shell | Medium-high | Prioritized visual/layout QA |
| integrations | integrationsRoot + integration-system-workspace | Medium | QA after Library |
| ai-command | ctrlRoomRoot + aicmd-shell | Medium-high | AI Command surface audit |
| workflows | workflowsRoot + wfexec-shell | Medium-high | Workflow surface audit |
| campaign-studio | campaignStudioRoot | Medium | Studio surface audit |
| content-studio | contentStudioRoot + content-smart-root | Medium-high | Studio surface audit |
| media-studio | mediaStudioRoot | Medium-high | Studio surface audit |
| publishing | publishing root/surface | Medium | Publishing audit |
| setup | setup root/surface | Low-medium | Standard compliance check |
| ads-manager | ads root/surface | Low-medium | Standard compliance check |
| insights | insights root/surface | Low-medium | Standard compliance check |
| research | research root/surface | Low-medium | Standard compliance check |

## 5. Old Label Final Check

Latest scan found no visible old System labels in:

- governance.js
- settings.js
- operations-centers.js

The only remaining phrase was:

- Home Executive Runtime Render Sections

This is a comment in:

- public/control-center/pages/home/render-sections.js

It is not runtime UI and should not be changed now.

## 6. Current CSS Ownership Status

Confirmed:

- std-page-shell appears only in:
  - 14-page-standard.css
  - page-standard.js runtime creation/query logic

- std-main-content-slot appears only in:
  - 14-page-standard.css
  - page-standard.js runtime creation/query logic

No duplicate ownership remains in:

- 08-components-foundation.css
- 12-pages.css

## 7. Risk Classification

### High Priority QA

1. Library
   - large renderer
   - library-smart-shell
   - many rerender paths
   - upload/preview/action/AI surfaces

2. AI Command
   - aicmd-shell
   - command/AI-heavy page
   - likely has its own operating model

3. Workflows
   - wfexec-shell
   - execution-oriented page
   - action-heavy

4. Media Studio / Content Studio / Campaign Studio
   - large renderers
   - local smart roots
   - complex AI/action flows

### Medium Priority QA

- Home
- Integrations
- Publishing

### Lower Priority QA

- Setup
- Ads Manager
- Insights
- Research

## 8. Recommended Cleanup Order

1. Library visual/layout QA
2. AI Command surface audit
3. Workflows surface audit
4. Studio group audit:
   - Media Studio
   - Content Studio
   - Campaign Studio
   - Publishing
5. Home transition QA
6. Integrations transition QA
7. Remaining standard compliance checks
8. Global CSS bleed audit
9. Legacy archive plan
10. Final frontend readiness report

## 9. No-Change Confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No routes changed.
No files deleted.
No data/projects changed.
