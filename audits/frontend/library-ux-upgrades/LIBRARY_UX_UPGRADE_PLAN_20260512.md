# Library UX Upgrade Plan — 2026-05-12

## Branch
`architecture/frontend-consolidation-v1`

## HEAD at audit time
`78dd12b` — Improve Library grid accessibility and path hints

## Files reviewed
- `public/control-center/pages/library.js` (primary — only file modified)

## Current state before this task
- Control Center loading successfully; server health OK.
- Git was clean before work began (branch in sync with remote).
- Soft Delete label, button titles, and confirm text had already been partially applied in the working tree from a prior session; those were absorbed into this commit.

## Changes implemented

### A — Safer destructive actions (already in working tree, confirmed)
| Item | Before | After |
|------|--------|-------|
| Delete button label | `Delete` | `Soft Delete` |
| Delete button title | _(none)_ | `Soft-delete this asset after confirmation` |
| Archive button title | _(none)_ | `Archive this asset after confirmation` |
| Archive confirm text | `Archive this asset?` | `Archive this asset?\n\nThis keeps the file registered but moves it out of active Library views.` |
| Soft-delete confirm text | `Soft-delete this asset? It will be archived in the registry.` | `Soft-delete this asset?\n\nThis is a registry-level soft delete. The asset will be removed from active Library views.` |

### B — Better empty states
| Location | Before | After |
|----------|--------|-------|
| `renderPreview()` no-asset | `Select an asset to preview.` | `Select an asset to preview details, open files, copy paths, or prepare review actions.` |
| Grid body no-results | `No assets match this view. Adjust folder/filter/search.` | `No assets match this view. Try clearing filters, switching folders, or uploading a required asset.` |
| Preview meta no-asset | `Select an asset to view details.` | `Select an asset to preview details, open files, copy paths, or prepare review actions.` |
| Recent activity empty | `No recent uploaded or updated assets yet.` | `Recent uploads and updates will appear here after you add or refresh assets.` |
| Upload summary empty | `No uploads in this session yet.` | `No uploads in this session yet. Choose files and upload them to start building the asset library.` |

### C / D — Overview labels and action clarity
- No label changes required; existing labels (`Total assets`, `Approved assets`, `Needs review`, `Missing required assets`, `Source-of-truth coverage`, `Next action`) are already business-readable.
- No action buttons removed; no data attributes changed; no handler logic changed.

## What was NOT changed
- Authentication, .env, API keys, server code, backend routes
- Route IDs, sidebar navigation, project data
- Control Center startup / loading logic
- Upload flow, filter/sort/search behavior
- Approve/review/rename/source-of-truth behavior
- AI prompt navigation, protected media preview logic
- `app.js`, `router.js`, `api.js`, `server.js`
- Any global CSS file

## Validation checklist
- [x] `node --check public/control-center/pages/library.js` — PASS
- [x] `node --check public/control-center/app.js` — PASS
- [x] `node --check public/control-center/router.js` — PASS
- [x] `git diff --stat` shows only `library.js` modified (18 lines, 9+/9-)
- [x] No global CSS changes
- [x] No app/router/api/server changes

## Manual QA (to be done by operator)
Open: `/control-center/?v=library-ux-upgrade-20260512`

- [ ] Control Center loads
- [ ] Library opens
- [ ] Grid assets show
- [ ] Selecting asset works
- [ ] Preview panel updates
- [ ] Filters still work
- [ ] Search still works
- [ ] Upload area still displays
- [ ] "Soft Delete" label appears instead of "Delete"
- [ ] Archive confirm dialog shows extended text
- [ ] Soft Delete confirm dialog shows extended text
- [ ] Empty grid message is clearer
- [ ] No stuck loading
- [ ] No layout break

## Rollback note
**Before commit:** `git restore public/control-center/pages/library.js && rm -rf audits/frontend/library-ux-upgrades`

**After commit:** `git revert HEAD && git push origin architecture/frontend-consolidation-v1`
