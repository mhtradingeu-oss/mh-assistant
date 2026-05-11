# Remaining Pages Authority Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Scope: Documentation-only
Status: Terminal scan based

## Summary

After explicitly assigning Custom Layout Authority to System pages and heavy workspace pages, the remaining Page Standard candidates are:

- Home
- Setup
- Integrations
- Ads Manager
- Insights
- Research

These pages still have local roots and local rendering, but that does not automatically mean they must become Custom Surface Model pages.

The purpose of this audit is to classify them before any further runtime patch.

## Current confirmed state

### Already Custom Layout Authority

- System:
  - Task Center
  - Queue Center
  - Job Monitor
  - Notification Center
  - Governance
  - Settings

- Heavy workspaces:
  - Library
  - AI Command
  - Workflows
  - Publishing
  - Content Studio
  - Media Studio
  - Campaign Studio

### Remaining candidates

- Home
- Setup
- Integrations
- Ads Manager
- Insights
- Research

## Findings by page

### Home

Signals:

- homeExecRoot
- root.innerHTML
- render helpers

Risk:

- Medium transition risk.
- Home is an executive dashboard and may still fit Standard Page Model if Page Standard owns the header/context layer.

Current recommendation:

- Keep Standard Page Model for now.
- Visual QA required.

### Setup

Signals:

- setupRoot
- setup-wizard-shell
- setup wizard behavior
- legacy comments around focus behavior

Risk:

- Medium.
- Setup has a full wizard shell, but it may still benefit from Page Standard context and progression.

Current recommendation:

- Audit before patch.
- Do not change authority yet.

### Integrations

Signals:

- integrationsRoot
- integration-system-workspace
- integration-system-workspace-main
- integration-system-workspace-side

Risk:

- Medium-high.
- Integrations has workspace semantics and may become Custom Surface Model.

Current recommendation:

- Dedicated Integrations Authority Audit before patch.

### Ads Manager

Signals:

- adsManagerRoot
- ad-ops workspace language

Risk:

- Medium.
- Needs classification based on whether it has full action/AI/right rail behavior or mainly cards inside standard context.

Current recommendation:

- Keep Standard for now.
- QA / audit later.

### Insights

Signals:

- insightsRoot
- insights-wrapper
- insights-workspace
- insights-workspace-grid

Risk:

- Medium-high.
- Insights looks like a full analytics workspace, but may still work as standard-wrapped if header/context belongs to Page Standard.

Current recommendation:

- Dedicated Insights Authority Audit before patch.

### Research

Signals:

- researchRoot
- research-workspace-grid

Risk:

- Medium.
- Research is workspace-like, but not yet confirmed as a full custom operating surface.

Current recommendation:

- Keep Standard pending audit.

## Current recommended classification

| Route | Current recommendation | Priority |
|---|---|---:|
| home | Keep Standard Page Model, QA only | Medium |
| setup | Needs dedicated audit before decision | Medium |
| integrations | Custom candidate, audit next | High |
| ads-manager | Keep Standard Page Model pending QA | Medium |
| insights | Custom candidate, audit later | Medium-high |
| research | Keep Standard pending audit | Medium |

## Recommended next order

1. Integrations Authority Audit
2. Setup Authority Audit
3. Insights Authority Audit
4. Home visual transition QA
5. Ads Manager QA
6. Research QA
7. Final Layout Authority Verification Report

## Safety rules

- Do not patch all remaining pages at once.
- Do not remove REQUIRED_ROUTES entries yet.
- Do not edit Page Standard yet.
- Do not change CSS in authority-only steps.
- Patch one route only after dedicated audit.

## No-change confirmation

This audit is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
