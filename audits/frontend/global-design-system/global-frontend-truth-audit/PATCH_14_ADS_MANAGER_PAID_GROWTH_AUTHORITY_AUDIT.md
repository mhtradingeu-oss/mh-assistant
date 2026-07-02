# Patch 14 — Ads Manager / Paid Growth Authority Follow-up Audit

## Status

Audit-only / no production change.

Ads Manager previously received a safe copy/hierarchy patch. This follow-up audit maps its paid-growth authority boundary, local budget/session state, AI prompt behavior, source/readiness projection, and route destinations before any additional Ads Manager production patch is considered.

## Production Decision

No production code was changed.

Reason:

- Ads Manager does not currently call backend mutation APIs.
- Ads Manager does not directly create campaigns, publish, approve, send, or execute paid media changes.
- Ads Manager stores working budget and metric inputs in page session state.
- Ads Manager calculates budget, pacing, platform readiness, recommended budget allocation, and creative readiness locally.
- Ads Manager routes AI prompts to AI Command only.
- Ads Manager routes operators to Library and Publishing only.
- Paid spend changes, publishing, and campaign launch remain manual or governance-controlled in the current copy.
- Future changes must preserve this boundary unless a dedicated backend implementation is explicitly approved.

## Current Active File

- `public/control-center/pages/ads-manager.js`

## Existing Strengths

Confirmed current Ads Manager capabilities:

- Paid Media Operations hero.
- Budget Overview.
- Spend and Pacing.
- Platform Performance.
- Creative Mapping.
- Core Metrics.
- Paid Growth Next Actions.
- AI prompt buttons.
- Library navigation.
- Publishing navigation.
- Session-local budget and metric inputs.
- Platform connection readiness projection.
- Creative readiness projection.
- Recommended budget allocation projection.

## Local Session Contract

Ads Manager stores form state in:

- `adsManagerSessions`

The session contains:

- `totalBudget`
- `dailyBudget`
- `spendToDate`
- `ctr`
- `cpc`
- `cpa`
- `roas`

These values are local working inputs only.

They are not persisted to backend in the current page.

## Budget / Pacing Contract

Ads Manager calculates:

- total budget
- daily budget
- spend to date
- planned spend to date
- remaining budget
- pacing delta
- pacing status
- platform recommended budget

These are planning calculations, not paid media execution.

## Platform Readiness Contract

Ads Manager builds platform readiness from project state:

- integrations readiness checks
- integration sources
- project assets
- scheduled jobs / waves

Platforms include:

- Meta Ads
- Google Ads
- TikTok Ads
- Amazon Ads

Statuses include:

- Operational
- Partial
- Planning
- Blocked

This is readiness projection only and does not connect providers.

## Creative Mapping Contract

Ads Manager maps creative readiness from project assets and scheduled jobs.

It can show:

- Ready
- Partial
- Missing

This is creative planning guidance only and does not generate or upload ad creative.

## AI Prompt Contract

Ads Manager builds AI prompts through:

- `buildActionPrompts`

Prompt actions use:

- `data-ads-prompt`

The handler:

- writes prompt text into `quickCommandInput`
- navigates to `ai-command`
- shows a message

AI prompt topics include:

- Scale winners
- Pause weak spend
- Fix pacing
- Creative refresh

AI does not change budgets, publish, launch campaigns, approve, or execute backend actions.

## Route Navigation Contract

Ads Manager has two direct route buttons:

- `adsManagerOpenLibraryBtn` → `library`
- `adsManagerOpenPublishingBtn` → `publishing`

These are navigation-only actions.

They do not create durable handoffs in the current page and do not execute publishing.

## Input / Button Inventory

Required input IDs:

- `adsTotalBudgetInput`
- `adsDailyBudgetInput`
- `adsSpendInput`
- `adsCtrInput`
- `adsCpcInput`
- `adsCpaInput`
- `adsRoasInput`

Key button/data attributes:

- `data-ads-prompt`
- `adsManagerOpenLibraryBtn`
- `adsManagerOpenPublishingBtn`

These IDs and attributes should not be changed without browser QA.

## Backend / Durable Authority Boundary

Ads Manager currently has no direct backend mutation path.

It does not call:

- save campaign APIs
- publishing APIs
- approval APIs
- governance APIs
- paid provider APIs
- budget write APIs
- ad launch APIs

## Frontend Projection Boundary

Frontend/local paths include:

- local budget form state
- metric inputs
- pacing calculations
- platform readiness projection
- creative readiness projection
- AI prompt preparation
- Library navigation
- Publishing navigation

## High-Risk Areas For Future Changes

Do not change without dedicated implementation approval:

1. `adsManagerSessions`
2. `getBudgetDefaults`
3. `buildPlatformCards`
4. `buildCreativeMappings`
5. `buildActionPrompts`
6. `bindAdsManager`
7. `data-ads-prompt`
8. `adsManagerOpenLibraryBtn`
9. `adsManagerOpenPublishingBtn`
10. required input IDs
11. budget/pacing calculations
12. recommended budget allocation
13. platform readiness mapping
14. creative readiness mapping
15. AI prompt wording that might imply execution
16. any future backend paid media mutation

## Recommended Future Patch

### Patch 14B — Ads Manager Copy Guard Or Handoff Contract

Only if needed, a future safe patch may clarify visible wording around:

- local working budget versus actual ad-platform spend
- recommended budget versus approved budget
- AI prompt versus paid media execution
- Publishing navigation versus publishing execution
- Library navigation versus creative/source readiness
- manual/governance-controlled launch boundary

Allowed:

- copy-only changes
- closeout documentation

Forbidden:

- backend/API changes
- budget mutation behavior
- provider execution behavior
- publishing execution behavior
- approval/governance behavior
- route ID changes
- handler changes
- CSS
- project data

## Preserved Contracts

Because this was audit-only, the following remain unchanged:

- `public/control-center/pages/ads-manager.js`
- route ID: `ads-manager`
- `data-page="ads-manager"`
- `#adsManagerRoot`
- all required input IDs
- all `data-ads-prompt` behavior
- Library navigation
- Publishing navigation
- AI Command prompt routing
- budget calculations
- pacing calculations
- platform readiness calculations
- creative mapping calculations
- backend/API behavior
- project data behavior

## Validation Commands

```bash
node --check public/control-center/pages/ads-manager.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist For Future Patch

Before any future Ads Manager production patch:

- Open Ads Manager.
- Confirm budget form renders.
- Enter total budget, daily budget, spend to date, CTR, CPC, CPA, and ROAS.
- Confirm calculated cards update.
- Confirm platform readiness cards still render.
- Confirm creative mapping cards still render.
- Confirm AI prompt buttons route to AI Command and prefill prompt text.
- Confirm Library button navigates to Library.
- Confirm Publishing button navigates to Publishing.
- Confirm no budget save, ad launch, publish, approve, or provider execution action appears.
- Confirm no console errors.

## Rollback Path

Delete this audit file.

No production rollback is required.
