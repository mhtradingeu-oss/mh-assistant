# Library Step 4B - First Safe Action Panel Command

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Candidate chosen
- Chosen command: `copy-path`.

## 2. Why non-destructive
- Writes only to user clipboard (with fallback prompt).
- No backend API call.
- No project asset mutation.
- No `data/projects` write.

## 3. Exact wiring
- Updated `renderLibraryActionPanel(...)` in `action-panel.js` to render one utility button:
  - `<button ... data-copy-asset-path="...">Copy Path</button>`
- The button reuses existing route-owned delegated copy handler in `library.js` (`[data-copy-asset-path]` path).
- Existing clipboard and prompt fallback behavior is preserved exactly.

## 4. Safety guard
- Copy button is only enabled when:
  - an asset is selected, and
  - a copyable value exists (`file_path` or `preview_url`).
- Mutation-sensitive buttons remain disabled through existing `disabled` gating.

## 5. Confirmation no mutation command wired
- No Action Panel mutation command (`set-source-of-truth`, `update-status`, `archive-asset`) was wired.
- No destructive command was enabled.

## 6. Confirmation no backend/data change
- No backend files changed.
- No API contracts changed.
- No `data/projects` changes.

## 7. Defer notes
- Deferred: source-of-truth, status/approve, archive, rename, delete, upload, refresh.
- Deferred until explicit mutation safety pass and backend-authority-preserving command policy.
