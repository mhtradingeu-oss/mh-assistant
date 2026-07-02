# Library Step 4A - Action Panel Wiring Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Current Action Panel markup
Current Action Panel renders:
- `data-library-command="set-source-of-truth"`
- `data-library-command="update-status" data-status="approved"`
- `data-library-command="update-status" data-status="needs_review"`
- `data-library-command="archive-asset"`

## 2. Current disabled/read-only behavior
- Panel is mounted from `library.js` with `disabled: true`.
- Mutation command buttons render disabled (`disabled` + `aria-disabled="true"`).
- Panel badge displays `Read-only`.
- No runtime click wiring exists for these command metadata buttons.

## 3. Mutation-sensitive actions
Mutation-sensitive and operationally authoritative actions:
- source-of-truth
- status/approval updates
- archive
- rename
- delete

## 4. Actions that must remain deferred
Deferred in this consolidation pass:
- source-of-truth
- approve/status
- archive
- delete
- rename

## 5. Candidate first non-destructive Action Panel command
- Candidate: `copy-path`.
- Reason: non-destructive utility, no backend/API call, no project data mutation.

## 6. Should Action Panel receive open-preview/copy-path/select-asset context
- `open-preview`: safe candidate later, but not required for first action if parity is uncertain.
- `copy-path`: clear first safe candidate.
- `select-asset` context: should remain context only (selected asset info) without making panel authoritative for selection logic.

## 7. Recommendation for Step 4B
- Proceed with exactly one safe non-destructive command: `copy-path`.
- Keep all mutation-sensitive action buttons disabled/deferred.
- Do not change backend authority or mutation routing.
