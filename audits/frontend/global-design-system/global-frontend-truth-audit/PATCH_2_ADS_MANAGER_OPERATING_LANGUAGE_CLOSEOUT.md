# Patch 2 — Ads Manager Operating Language Closeout

## Status

Implemented as a narrow terminal-only frontend copy and hierarchy patch.

No CSS, backend/API, router, app runtime, command execution, calculations, project data, or route behavior changes were made.

## Touched Files

- `public/control-center/pages/ads-manager.js`
- `audits/frontend/global-design-system/global-frontend-truth-audit/PATCH_2_ADS_MANAGER_OPERATING_LANGUAGE_CLOSEOUT.md`

## Exact Labels Changed

- `Section 1` → `Budget Control`
- `Section 5` → `Creative Readiness`
- `Section 4` → `Performance Signals`
- `Section 6` → `Paid Growth AI`
- `Action Prompts` → `Paid Growth Next Actions`

## Added Operating Guidance

Added one visible Next Best Action card before the paid growth prompt list:

- Review pacing, creative readiness, and source coverage.
- AI can prepare a paid growth brief and route context to AI Command.
- Spend changes, publishing, and campaign launch remain manual or governance-controlled.

## Preserved Contracts

The patch preserved:

- Existing calculations for budget, pacing, CTR, CPC, CPA, ROAS, platform readiness, and recommended budget.
- Existing input IDs:
  - `adsTotalBudgetInput`
  - `adsDailyBudgetInput`
  - `adsSpendInput`
  - `adsCtrInput`
  - `adsCpcInput`
  - `adsCpaInput`
  - `adsRoasInput`
- Existing `data-ads-prompt` prompt behavior.
- Existing navigation to AI Command, Publishing, and Library.
- Existing route ID and page data attribute.
- Existing handlers and route targets.
- Existing API behavior.

## CSS Decision

No CSS changes were made.

The patch reused existing card, badge, data-card, data-label, and home-action-meta classes already present in the page.

## Validation Commands

```bash
node --check public/control-center/pages/ads-manager.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist

Manual QA recommended:

- Open Ads Manager.
- Confirm old Section labels are gone.
- Confirm Budget Control, Creative Readiness, Performance Signals, and Paid Growth AI appear.
- Confirm Paid Growth Next Actions appears instead of Action Prompts.
- Confirm Next Best Action copy is visible.
- Enter budget, daily budget, spend, CTR, CPC, CPA, and ROAS.
- Confirm recalculated UI still updates.
- Click AI prompt buttons and confirm they still route/fill AI Command.
- Click Publishing and Library buttons.
- Confirm no console errors.

## Risks

- Low functional risk because the patch changes visible copy and adds a static guidance card only.
- Low visual risk because it reuses existing page classes.
- No execution authority is added.

## Rollback Path

Revert `public/control-center/pages/ads-manager.js` and delete this closeout file.

No backend, API, router, app, CSS, or project data rollback is required.
