# Library Step 3D - Command Router Candidate Audit

Date: 2026-05-11  
Branch: architecture/frontend-consolidation-v1  
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Current command-router supported commands

From `public/control-center/pages/library/command-router.js`, current command set:
- `select-asset`
- `set-filter`
- `set-view-mode`
- `set-page`
- `open-upload`
- `refresh-library`
- `open-preview`
- `set-source-of-truth`
- `update-status`
- `rename-asset`
- `archive-asset`
- `delete-asset`
- `send-to-ai`

Notes:
- Mutation-classified commands in router helper: `refresh-library`, `set-source-of-truth`, `update-status`, `rename-asset`, `archive-asset`, `delete-asset`.
- AI-classified command in router helper: `send-to-ai`.

## 2. Current direct handler surfaces in library.js

Direct handler surfaces observed in `public/control-center/pages/library.js`:
- Selection:
  - grid card selection (`[data-library-grid-select]`) dispatches `select-asset`.
  - latent selectors (`[data-library-select]`, `[data-library-row-select]`) also dispatch `select-asset` when present.
- Filters and sort/search/folder:
  - type/status/source/search/folder/sort flow through `set-filter` dispatch.
- View mode:
  - `[data-library-view-mode]` dispatch exists, but no active rendered toggle in current template path.
- Pagination:
  - `[data-library-grid-page]` dispatches `set-page`.
- Open preview:
  - `[data-library-open]` now emits `open-preview` shadow envelope, then runs existing `openLibraryAsset(projectName, asset)` behavior.
- Copy path:
  - `[data-copy-asset-path]` handled by route-owned document click listener path, not through command-router.
- Upload type:
  - `libraryUploadTypeSelect.onchange` sets `session.uploadType` directly, not through command-router.

## 3. Candidate risk matrix

| Candidate | Current implementation | Classification | Rationale |
|---|---|---|---|
| `select-asset` | Already dispatched via `dispatchLibraryCommand` in active selection paths | `already_done` | Existing command-router parity seam is in place for active grid selection. |
| `copy-path` | Direct route-owned global click handler on `[data-copy-asset-path]` | `safe_later` | Non-destructive, but currently bound in global listener path with clipboard/prompt fallback; introducing router seam should be staged carefully. |
| `set-filter` | Already dispatched for type/status/source/search/folder/sort | `already_done` | Command-router already mediates these state changes. |
| `set-view-mode` | Dispatch exists for `[data-library-view-mode]` but control is latent/unrendered | `safe_later` | Mechanism exists, but no active control to validate parity in current rendered surface. |
| `page-change` | `[data-library-grid-page]` dispatches `set-page` | `already_done` | Active behavior already routed via command envelope. |
| `sort-change` | Sort uses `set-filter` with `filter: "sort"` | `already_done` | Shadow/parity path already exists through current filter command. |
| `upload-type-change` | Direct session assignment in `libraryUploadTypeSelect.onchange` | `safe_shadow_now` | Local non-destructive state update; can emit envelope before same assignment with low behavior risk. |
| `open-preview` | Shadow envelope now emitted before existing open behavior | `already_done` | Step 3C completed with parity seam and unchanged open behavior. |

Deferred set (explicit):
- approve/status changes: `defer_mutation`
- source-of-truth: `defer_mutation`
- rename: `defer_mutation`
- archive: `defer_mutation`
- delete: `defer_mutation`
- upload: `defer_mutation`
- refresh scan: `defer_mutation`
- AI classify/extract/missing prompts: `defer_due_to_behavior_risk`

Deferred rationale:
- Mutation candidates change authoritative project asset state and must remain outside Step 3D shadow expansion.
- AI prompt actions are non-mutation but couple quick-command input composition and route navigation; parity wiring should be staged after command payload contract is explicitly defined.

## 4. Recommended next one action only

Recommended next safe candidate: `upload-type-change`.

Why this one:
- It is local session state only (non-destructive).
- It does not call backend APIs or mutate project assets.
- It can follow the same shadow/parity pattern: emit command envelope first, then keep current direct `session.uploadType` assignment unchanged.

## 5. Non-negotiables for future wiring

- No backend changes.
- No `data/projects` changes.
- No API contract changes.
- Preserve user-visible behavior for existing surfaces during shadow phases.
- Do not wire Action Panel mutation buttons during shadow-only passes.
- Do not add global listeners.
- Keep heavy logic out of render paths.
- If parity cannot be preserved for a candidate, document and stop.

## 6. Confirmation: no runtime code changes

This Step 3D pass is audit-only.
- No runtime code changed.
- No behavior changed.
- No mutation commands were newly wired.

## Step 3E applied

- `upload-type-change` now emits a command-router shadow/parity envelope from `libraryUploadTypeSelect.onchange`.
- Selected upload type behavior is unchanged; existing direct assignment to `session.uploadType` is preserved.
- Upload execution behavior is unchanged.
- No mutation commands were wired.

## Pointer

- Final refresh audit for Steps 3F through 5: `audits/frontend/library/LIBRARY_FINAL_OPERATING_SURFACE_REFRESH_AUDIT.md`.
