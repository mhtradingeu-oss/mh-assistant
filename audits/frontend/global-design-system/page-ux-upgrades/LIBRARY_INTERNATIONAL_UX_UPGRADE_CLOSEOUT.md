# Library International UX Upgrade Closeout

## Status

Implemented safely on branch `architecture/frontend-consolidation-v1`.

## Target Page / Files

- Target page: Library / Source Authority Workspace
- Updated:
  - `public/control-center/pages/library.js`
  - `public/control-center/pages/library/action-panel.js`
  - `public/control-center/pages/library/session-store.js`
  - `public/control-center/styles/12-pages.css`

## Audit Basis

- `LIBRARY_SOURCE_AUTHORITY_CLOSEOUT.md`
- `GLOBAL_FRONTEND_AUTHORITY_MAP_FINAL_UX_READINESS_CLOSEOUT.md`
- `FINAL_FRONTEND_BROWSER_QA_PLAN.md`
- `LIBRARY_PRE_CODEX_EVIDENCE.md`
- `LIBRARY_FINDER_INTERACTION_EVIDENCE.md`

## User-Reported Issues

- Filter behavior was not fully reliable.
- There was no Select All / multi-select affordance.
- Selecting an asset from page 2, page 3, or later pages could return the view to page 1.
- Pagination text such as `Showing 31-40 of 128` needed to match the actual filtered assets and stay stable after selection.
- The Action Panel was too far away and required scrolling, so selected asset context and actions were not always visible.
- The Move to group panel and asset cards needed stronger visual hierarchy.
- Asset Readiness Review/Classify actions needed to open the right finder view immediately.

## UX Issues Found

- Source filtering did not expose clear Library-upload or source-of-truth filter modes.
- Selection state could point to an asset that was no longer in the filtered result set.
- Multi-selection state did not exist, so operators had no safe way to select the current visible page.
- AI review controls shared one selector, but only the first matching button was bound.
- The existing side stack was present but not sticky, so preview/actions could move out of view.
- Action panel copy did not clearly distinguish Library metadata from Governance approval or publishing approval.
- Asset Readiness `Classify` could follow the upload-intake path instead of showing the matching assets.
- Asset cards did not provide enough scan hierarchy for name, filename, source context, type, and status.
- Move to group controls did not have dedicated layout, alignment, or current-state styling.

## Interaction Bugs Fixed

- Type, status, source, search, and sort filters now combine predictably with explicit Library upload and source-of-truth source modes.
- Filtered result pagination clamps to the actual filtered asset count.
- `Showing X-Y of N` uses the actual filtered result count and current clamped page.
- Primary selection is preserved when selecting an asset and only cleared when the selected asset is no longer in the filtered result set.
- Selecting an asset on later pages no longer resets pagination to page 1.
- Hidden selected assets now show a clear filtered-out summary instead of silently losing context.
- Multi-selection is filtered to visible filtered results so stale hidden selections are removed.
- All visible `data-library-command="send-to-ai"` controls now bind to the existing AI handoff behavior.
- Asset Readiness Review/Classify actions now apply a finder preset for the matching folder/group, reset search/source/status intentionally, and focus the Asset Workspace.

## Changes Implemented

- Added local `selectedAssetIds` session state.
- Added per-card local selection checkboxes.
- Added Select current page / Unselect current page and Clear selection controls.
- Added disabled “Batch actions unavailable” affordance to make unsupported batch mutation boundaries explicit.
- Added a selected asset summary strip above the finder grid.
- Added source filter options for Library uploads and source-of-truth assets.
- Made the preview/action/AI side stack sticky on desktop and normal-flow on smaller screens.
- Improved asset card hierarchy with clearer title, filename, source context, readable type labels, and hover/focus states.
- Improved Move to group layout with current group labeling, aligned choices, wrapped labels, and current-state treatment.
- Routed Asset Readiness Review/Classify actions to the relevant finder view; Upload actions still focus the upload/intake path.
- Clarified action panel language:
  - AI action prepares review context only.
  - Source marks and ready states are Library metadata only.
  - Library metadata does not equal Governance approval or publishing approval.

## Authority Boundaries Preserved

- Upload remains backend/durable through `uploadProjectAsset`.
- Protected preview remains through `getProtectedAssetObjectUrl`.
- Source-of-truth behavior remains through `setProjectAssetSourceOfTruth`.
- Status behavior remains through `updateProjectAssetStatus`.
- Reclassify behavior remains through `reclassifyProjectAsset`.
- Rename/archive/delete behavior remains through `renameProjectAsset`, `archiveProjectAsset`, and `deleteProjectAsset`.
- AI source handoff remains through `setSharedAiSource`, `data-library-use-ai-source`, `data-library-command="send-to-ai"`, `quickCommandInput`, and route handoff to AI Command.
- Multi-select is local/UI-only and does not mutate backend records.

## Sensitive Items Not Touched

- No backend/API calls changed.
- No upload behavior changed.
- No protected preview behavior changed.
- No source-of-truth mutation behavior changed.
- No asset status mutation behavior changed.
- No reclassify behavior changed.
- No rename/archive/delete behavior changed.
- No AI source handoff behavior changed.
- No route id change.
- No app/router behavior change.
- No `data/projects` changes.
- No batch destructive or batch metadata mutation behavior added.

## Preview Capability Coverage

Implemented as a safe frontend-only preview capability patch after the finder reliability upgrade.

### Supported Inline Preview Types

- Images continue to use the existing image preview path, including protected object URL hydration where required.
- Videos continue to use the existing video preview path, including protected object URL hydration where required.
- Audio continues to render through the browser audio element.
- PDFs continue to render inline when the browser can safely render them:
  - direct non-protected PDF URL through iframe
  - protected PDF through the existing protected object URL hydration path
- Text-like files now have safer handling:
  - `txt`
  - `md`
  - `csv`
  - `json`
  - existing `asset.text_preview` renders immediately
  - protected preview URLs can hydrate a capped inline text preview through the existing protected media fetch helper

### Fallback Preview Types

Office files now show a polished inline fallback instead of a broken preview:

- `doc`
- `docx`
- `xls`
- `xlsx`
- `ppt`
- `pptx`

The fallback card shows:

- file name
- file type
- source/source-of-truth status
- review status
- safe actions:
  - Open asset
  - Copy path when available
  - Prepare AI review

Unknown or unsupported files now show the same clear fallback pattern and explain:

- Preview shows what the browser can safely render.
- Unsupported files can still be opened or sent to AI review context.

No external document viewer was added. No frontend Office parsing was added. The AI action remains the existing AI review context handoff and does not claim extraction or backend parsing.

### Known Future Backend Opportunities

- Add a backend document preview/conversion service for Office documents if inline Office preview becomes a product requirement.
- Add a backend text extraction service for large text, CSV, JSON, PDF, and Office files if AI review needs durable extracted context.
- Add backend-generated safe preview thumbnails for documents and spreadsheets.
- Add provider-side document metadata extraction with audit logs, source attribution, and size limits.

## Browser QA Corrective Pass — Preview / Side Panel Visibility

A terminal-only corrective pass was added after browser QA showed the first Library patch still did not visibly expose the selected asset preview clearly enough.

Corrected frontend-only UI behavior:

- The Library right panel now reserves a visible preview area at the top.
- Preview frame, image, video, audio, PDF, text, Office fallback, and unknown fallback containers have explicit minimum height and safe overflow handling.
- The side stack remains sticky on desktop but has internal scroll and bottom padding so lower actions are less likely to be covered by the floating assistant.
- Selected asset metadata remains below the preview instead of replacing the preview.
- Move to group received a stronger scoped layout, clearer current state, aligned choices, and safer spacing.
- No backend/API, protected preview, upload, source-of-truth, status, reclassify, rename, archive, delete, or AI handoff behavior was changed.

## Browser QA Corrective Pass 2 — Force Visible Preview

Browser QA showed the preview DOM existed but remained visually hidden or compressed by CSS. A terminal-only CSS correction was added.

Corrected:

- Forced the Library workspace into a stable main/side grid on desktop.
- Moved sticky side panel below the topbar with a safer `top` value.
- Forced `#libraryPreviewVisual` to reserve visible height.
- Forced image/video/PDF/document/text/fallback preview containers to render visibly.
- Kept selected asset metadata and actions below the preview.
- Strengthened Move to group layout without changing reclassify behavior.
- Added extra bottom spacing to reduce overlap from floating assistant controls.

No backend/API/router/app/project data behavior changed.

## Browser QA Corrective Pass 3 — CSS Deduplication And Stable Preview Layout

Browser QA showed the preview DOM existed but duplicate corrective CSS blocks caused the preview to overlap metadata and appear visually broken.

Corrected:

- Removed duplicate force-preview corrective CSS blocks.
- Replaced them with one scoped final Library preview/action panel cleanup block.
- Kept preview visible without allowing images/videos to overflow over metadata.
- Kept the side panel sticky on desktop with safer dimensions and internal scrolling.
- Kept Move to group redesigned but less cramped.
- Preserved all backend/API and asset mutation behavior.

## Browser QA Corrective Pass 4 — Preview DOM Visibility Hard Fix

Browser QA confirmed the preview DOM existed but was still not visible before selected asset metadata. A small frontend-only hard fix was added:

- `#libraryPreviewVisual` now receives a stable ready class and inline layout guard during render.
- The preview card markup now has a clearer header and separates preview visual area from selected asset metadata.
- The preview visual area reserves visible height before metadata/actions.
- No protected preview, backend/API, upload, source-of-truth, status, reclassify, rename, archive, delete, or AI handoff behavior was changed.

## Browser QA Corrective Pass 5 — Side Panel Flow Fix

Live DOM inspection confirmed `#libraryPreviewVisual` existed and had size, but its bounding rectangle placed it far below the visible viewport. The problem was therefore layout/scroll positioning, not missing preview logic.

Corrected:

- Removed the internal sticky/scroll behavior from the Library side stack for this phase.
- Kept preview, metadata, action panel, and AI panel in normal visible order.
- Forced preview visual before metadata/actions.
- Preserved all asset authority and backend behavior.

## Validation Commands

```bash
node --check public/control-center/pages/library.js
for f in public/control-center/pages/library/*.js; do node --check "$f"; done
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
git diff --stat
git status --short
```

## Browser QA Checklist

- Open the Library route and confirm `data-page="library"` loads.
- Confirm filter combinations:
  - Type + Status
  - Type + Source
  - Source of truth + Search
  - Library uploads + Sort
  - Archived folder + Status
- Confirm pagination text matches the visible filtered asset count.
- Confirm selecting an asset does not change the current page.
- Confirm selecting an asset on page 2 or later keeps the operator on that page.
- Confirm changing filters clears selected asset context only when that asset is no longer in the filtered results.
- Confirm hidden selected assets show the filtered-out summary.
- Confirm Select current page selects only visible page items.
- Confirm Unselect current page and Clear selection update the local selection count.
- Confirm disabled batch action does not mutate anything.
- Confirm Preview, Action Panel, and AI Panel remain visible while scrolling the asset list on desktop.
- Confirm mobile/narrow layout falls back without sticky side overflow.
- Confirm `Prepare AI review` routes to AI Command using the existing handoff behavior.
- Confirm Asset Readiness Review/Classify opens the matching finder view and scrolls/focuses Asset Workspace.
- Confirm Move to group buttons are aligned, readable, and show the current group clearly.

## Known Remaining Issues

- Batch actions are intentionally unavailable because no explicit safe backend contract was added or found in scope.
- Browser QA was not run in this terminal pass; validation was syntax and diff based.
- Existing backend-sensitive commands should still receive final browser QA before production use.

## Rollback Path

Revert the scoped changes in:

- `public/control-center/pages/library.js`
- `public/control-center/pages/library/action-panel.js`
- `public/control-center/pages/library/session-store.js`
- `public/control-center/styles/12-pages.css`
- `audits/frontend/global-design-system/page-ux-upgrades/LIBRARY_INTERNATIONAL_UX_UPGRADE_CLOSEOUT.md`

No backend, route, app/router, or project data rollback is required.
