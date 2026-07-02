# Layout Authority Decision Matrix

Date UTC: Mon May 11 07:30:27 PM UTC 2026
Branch: architecture/frontend-consolidation-v1
Commit: 6ff2852

## Purpose

This matrix defines the target layout authority for every major frontend route before final cleanup.

The goal is to guarantee that every page has exactly one layout authority:

1. Standard Page Model
2. Custom Surface Model
3. Legacy / Archive Candidate

No page should be controlled by both Page Standard and a full local shell at the same time.

## Current Doctrine

Backend owns operational authority.
Frontend projects operational authority.
Each route must have one visual/layout authority.

## Model Definitions

### Standard Page Model

Use when:

- Page Standard owns the route header, context ribbon, smart strip, and main slot.
- Page file renders content inside the standard slot.
- The page should not render a second full shell.

Requirements:

- route remains in REQUIRED_ROUTES
- no disableStandardLayout
- page file should avoid full competing page shell semantics

### Custom Surface Model

Use when:

- Page is a full operating room / console / workspace.
- Page owns its complete surface, including header, signal area, main view, right rail, actions, and AI panel.
- Page should not be wrapped by Page Standard.

Requirements:

- route sets disableStandardLayout: true
- CSS must be scoped by data-page
- no backend/API/data behavior change

### Legacy / Archive Candidate

Use when:

- File is not runtime loaded.
- It is preserved only for reference or archive.

Requirements:

- prove no runtime load
- archive only with dedicated plan

## Authority Matrix

| Route | Page file | Current signals | Current issue | Target model | Priority | Patch needed |
|---|---|---|---|---|---:|---|
| home | pages/home.js | homeExecRoot, local render helpers, Page Standard REQUIRED_ROUTES | custom render inside standard route, transition QA risk | Standard Page Model, with QA | Medium | QA first |
| setup | pages/setup.js | setup wizard, local panels, Page Standard REQUIRED_ROUTES | large local form but likely compatible | Standard Page Model | Low-medium | QA |
| library | pages/library.js | libraryRoot, library-smart-shell, action panel, AI panel, many rerenders | full workspace inside Page Standard | Custom Surface Model candidate | High | Yes, after audit |
| integrations | pages/integrations.js | integrationsRoot, integration-system-workspace | local workspace inside Page Standard | Standard or Custom decision needed | Medium | Audit first |
| ai-command | pages/ai-command.js | ctrlRoomRoot, aicmd-shell | full AI room inside Page Standard | Custom Surface Model candidate | High | Yes, after audit |
| workflows | pages/workflows.js | workflowsRoot, wfexec-shell | full execution room inside Page Standard | Custom Surface Model candidate | High | Yes, after audit |
| campaign-studio | pages/campaign-studio.js | campaignStudioRoot, studio workspace | full studio surface inside Page Standard | Custom Surface Model candidate | High | Yes, after audit |
| content-studio | pages/content-studio-workspace.js | contentStudioRoot, content-smart-root | full studio surface inside Page Standard | Custom Surface Model candidate | High | Yes, after audit |
| media-studio | pages/media-studio-workspace.js | mediaStudioRoot, media workspace | full studio surface inside Page Standard | Custom Surface Model candidate | High | Yes, after audit |
| publishing | pages/publishing.js | publishing workspace/actions | operational workspace inside Page Standard | Custom Surface Model candidate | Medium-high | Audit first |
| ads-manager | pages/ads-manager.js | ads cards and route actions | likely compatible but needs QA | Standard Page Model | Low-medium | QA |
| insights | pages/insights.js | insights cards | likely compatible but needs QA | Standard Page Model | Low-medium | QA |
| research | pages/research.js | research actions, data stacks | large page but likely compatible | Standard Page Model or Custom later | Medium | Audit first |
| settings | pages/settings.js | settings-page-surface, settings actions, durable behavior | cleaned labels but authority currently ambiguous if standard-wrapped | Custom Surface Model | High | Yes |
| governance | pages/governance.js | governance-shell, governance-workspace | already custom excluded from REQUIRED_ROUTES | Custom Surface Model | Done | Visual CSS QA |
| task-center | pages/operations-centers.js | ops-shell | already custom operations surface | Custom Surface Model | Done | QA |
| queue-center | pages/operations-centers.js | ops-shell | already custom operations surface | Custom Surface Model | Done | QA |
| job-monitor | pages/operations-centers.js | ops-shell | already custom operations surface | Custom Surface Model | Done | QA |
| notification-center | pages/operations-centers.js | ops-shell | already custom operations surface | Custom Surface Model | Done | QA |

## Immediate Findings

### Cleaned / Stable Custom Surfaces

- Task Center
- Queue Center
- Job Monitor
- Notification Center
- Governance

### Needs Authority Patch

The following pages likely should set disableStandardLayout: true, but only after page-specific audit:

1. Settings
2. Library
3. AI Command
4. Workflows
5. Media Studio
6. Content Studio
7. Campaign Studio
8. Publishing

### Keep Standard For Now

The following pages should remain standard-wrapped unless QA proves otherwise:

1. Home
2. Setup
3. Ads Manager
4. Insights
5. Research
6. Integrations, pending audit

## Recommended Cleanup Order

1. Restore WIP and keep repo clean.
2. Commit layout-authority deep scan and this matrix.
3. Settings Authority Patch:
   - set disableStandardLayout: true
   - scoped CSS only if needed
4. Library Authority Audit:
   - decide Custom Surface
   - patch route authority only after audit
5. AI Command Authority Audit and patch
6. Workflows Authority Audit and patch
7. Studio Group Authority Audit:
   - Media Studio
   - Content Studio
   - Campaign Studio
   - Publishing
8. Keep Standard Model QA:
   - Home
   - Setup
   - Ads Manager
   - Insights
   - Research
   - Integrations
9. Global CSS bleed audit.
10. Legacy archive plan.
11. Final frontend readiness report.

## Safety Rules

- One route, one layout authority.
- Do not rename route IDs.
- Do not change API contracts.
- Do not modify backend.
- Do not modify data/projects.
- Do not remove event/action data attributes.
- Do not apply broad CSS globally.
- Use scoped data-page CSS for custom surfaces.
- Patch one page at a time.

## No-Change Confirmation

This matrix is documentation-only.

No runtime JS changed.
No CSS changed.
No backend changed.
No API changed.
No data/projects changed.
