# PHASE 3N.3 — Library Required Asset Actions + Header Clarity Patch

## Files Changed
- public/control-center/pages/library.js

## Behavior Changed
- Required Asset action buttons (Classify/Review):
  - Now set the upload category to the corresponding type.
  - If a matching lower workspace category/folder/filter exists, it is activated and the Asset Workspace is scrolled/focused.
  - Clear feedback is shown (e.g., "Showing Product Data assets. Upload category set to Product Data.").
  - If no matching workspace filter exists, only the upload type is set and a message is shown ("Upload category set to Product Data. Matching workspace filter is not available yet.").
- Upload category dropdown is now English-only (no mixed German/English labels).
- Asset Overview header now displays KPI summary chips if data is available (total assets, source-of-truth count, needs-review count, archived count, readiness gaps).
- Refresh Library scan remains visible and unchanged.

## Protected Behavior Preserved
- No backend changes.
- No api.js changes.
- No destructive handler changes.
- No changes to delete/archive/rename/status/source-of-truth API calls.
- No removal of confirmations.
- No broad CSS or redesign.
- All existing IDs/data attributes preserved.
- Only page-scoped, minimal patch.

## Validation Results
- [x] git status --short: Only expected files changed.
- [x] node --check public/control-center/pages/library.js: Pass
- [x] node --check public/control-center/app.js: Pass
- [x] node --check public/control-center/router.js: Pass
- [x] node --check public/control-center/api.js: Pass
- [x] node --check public/control-center/shared-context.js: Pass

## Limitations
- No new backend or API features added.
- If a required asset group does not map to a workspace filter, only the upload type is set and a message is shown.
- Header KPIs only use data already available in library.js scope.
- No CSS overhaul or visual redesign.

## Browser QA Notes
- Header KPI summary should render as compact helper text, not unstyled KPI chips.
- Grid-card inline "Use as Source in AI Command" action was removed to prevent card overflow; the action remains available in Preview/Action Panel.
- Upload category labels use explicit English mapping and preserve backend asset type keys.
- Required Asset actions update the current Library session and re-render the workspace to show the matching folder/filter when available.
- Repeated Classify/Review clicks should be checked in browser to ensure no duplicate listener symptoms occur.

## Follow-up Risk
- The current implementation re-invokes Library workspace binding after changing Required Asset filters. This is acceptable only if browser QA confirms no duplicate listener symptoms. If duplication appears, replace this with a safer single render/update pathway.
