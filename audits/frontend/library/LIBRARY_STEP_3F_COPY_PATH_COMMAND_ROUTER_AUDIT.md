# Library Step 3F - Copy Path Command Router Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Current copy-path behavior
- Copy-path is triggered by click on `[data-copy-asset-path]`.
- The current handler is route-owned and delegated from the Library listener lifecycle mount.
- Current invocation points:
  - Inspector action area copy button in `library.js`.
  - Action Panel copy button candidate was not part of Step 3F scope and is handled in Step 4B.

## 2. Current listener ownership
- Ownership is route-scoped through `mountLibraryListeners(...)` in `listener-lifecycle.js`.
- In `library.js`, copy-path is implemented inside `onDocumentClickHandlers` passed to `mountLibraryListeners(...)`.
- No ad-hoc global listener creation is used outside the route-owned lifecycle.

## 3. Clipboard/fallback behavior
- Primary path: `navigator.clipboard.writeText(value)`.
- User feedback on success: `alert("Asset path copied.")`.
- Fallback path on clipboard failure: `window.prompt("Copy asset path:", value)`.
- This fallback preserves usability in browsers/environments with clipboard restrictions.

## 4. Whether command-router shadow wiring is safe
- Assessment: `safe_shadow_later`.
- Reasoning:
  - Copy-path is non-destructive.
  - It does not call backend APIs.
  - It does not mutate project data.
  - Existing behavior is already centralized in a single delegated route-owned handler.
- Shadow wiring should remain parity-only and must keep clipboard-then-prompt fallback unchanged.

## 5. Risks
- Clipboard permissions and browser policies can fail unpredictably.
- A router shadow wrapper must not suppress current success/fallback feedback behavior.
- Any refactor that moves handling from delegated listener to per-element handlers could regress parity.

## 6. Recommendation
- Recommendation: `safe_shadow_later`.
- Keep current behavior as source of parity truth.
- If shadow envelope is added later, emit envelope before existing copy logic and keep fallback exactly unchanged.

## 7. Confirmation
- Phase 3F is audit-only.
- No runtime behavior changed by Step 3F itself.
- No backend, API contract, or `data/projects` changes.
