# Library Finder Interaction Evidence

## User-observed issues
- Filter is not working perfectly.
- No select all / multi-select affordance.
- Pagination text such as Showing 1-10 of 128 does not preserve expected page/selection behavior after choosing an asset.
- Action panel requires scrolling, so the operator cannot clearly see the selected asset and available actions.

## Safety boundary
- Fix filter/search/sort/pagination/selection UX if frontend-local and safe.
- Do not change upload, protected preview, source-of-truth, status, reclassify, rename, archive, delete, or AI source backend behavior.
- Do not add batch destructive actions without backend contract.

## Current HEAD
f586328 Upgrade Setup international UX safely

## Git status
?? audits/frontend/global-design-system/page-ux-upgrades/library-evidence/

## Additional Browser QA Notes From User

Observed in browser after inspecting Library:

- Selecting an asset from page 2, page 3, or later pages can return the workspace to page 1 instead of preserving the current page.
- Pagination state must stay stable after selecting an asset, unless filters change and the selected asset is no longer visible.
- Asset cards need better title treatment; current asset title/design is weak and hard to scan.
- Some panels are visually broken or not premium enough, especially the "Move to group" panel.
- The Action Panel/Preview area should stay usable while browsing assets; the operator should not have to scroll far or lose the selected asset context.
- Clicking Review/Classify from Asset Readiness should open the matching Library filter/view and show the relevant assets immediately, so the operator can take action without manually searching.
- Select All / Select Visible / Clear Selection should be considered, but batch destructive actions must remain disabled unless a backend contract already exists.
- Move to group should look professional, clear, and not crowded.
- Preview, selected asset summary, and available safe actions should be visible and understandable immediately after selecting an asset.
