# PHASE 3U.2 — Library Authority / Handoff / Destructive Action Browser QA Baseline

## Status
Browser QA baseline pending.

No production implementation is approved in this phase.

## Baseline
Previous phase:
`PHASE 3U.1 — Library Finalization Truth Audit`

Previous commit:
`1d6b7f6 Add Library finalization truth audit`

## Purpose
Create a manual browser QA baseline for Library before CSS, UX, or refactor work.

Library is confirmed as the source evidence / asset authority surface and includes real high-impact behaviors:
- selected asset state
- protected media preview
- upload/drop/file picker
- source_of_truth toggle
- status updates
- archive action
- soft-delete action
- AI Command source bridge
- Media Studio asset visibility
- Publishing/Governance evidence support

## Runtime URL
- `http://127.0.0.1:3000/control-center/#library`

## Browser QA Scope

### 1. Page load
- [ ] Library loads without blank page.
- [ ] No fatal overlay remains visible.
- [ ] Main Library workspace is visible.
- [ ] Page clearly communicates source/assets/evidence purpose.

### 2. Asset grid / selected asset
- [ ] Asset grid/list appears.
- [ ] Empty state is safe if no assets exist.
- [ ] Selecting an asset updates selected state.
- [ ] Selected asset details appear.
- [ ] Selection does not mutate backend state.

### 3. Preview behavior
- [ ] Image preview works when evidence exists.
- [ ] Video/audio/document preview works or fails gracefully.
- [ ] Protected media preview does not expose unsafe URL behavior.
- [ ] Missing preview state is clear and not misleading.

### 4. Upload / intake
- [ ] Upload/drop zone is visible or intentionally absent.
- [ ] File picker opens when requested.
- [ ] Upload type selection is visible if required.
- [ ] Upload failure state is clear.
- [ ] Upload success state does not falsely claim downstream approval/publishing.

### 5. Source of truth behavior
- [ ] Source of truth filter is visible.
- [ ] Source of truth toggle/action is visible only where appropriate.
- [ ] Toggling source_of_truth is understandable.
- [ ] It does not imply Governance approval or Publishing execution.

### 6. Status update behavior
- [ ] Status controls are visible where appropriate.
- [ ] Non-trivial status updates show confirmation.
- [ ] Status copy warns about downstream review/publishing impact.
- [ ] Status update does not imply publishing or approval occurred.

### 7. Archive behavior
- [ ] Archive action is visible only where appropriate.
- [ ] Archive action shows confirmation before mutation.
- [ ] Archive copy explains asset is removed from active views but remains in registry.
- [ ] Cancel keeps asset active.
- [ ] No silent archive occurs.

### 8. Soft-delete behavior
- [ ] Delete/soft-delete action is visible only where appropriate.
- [ ] Soft-delete action shows confirmation before mutation.
- [ ] Copy explains registry-level soft delete.
- [ ] Cancel keeps asset available.
- [ ] No silent delete occurs.

### 9. AI Command handoff
- [ ] Add/use as AI source action is visible when asset selected.
- [ ] Action routes to AI Command only after explicit user action.
- [ ] Handoff is source/context only.
- [ ] AI Command does not auto-execute.
- [ ] Return context is preserved or fails safely.

### 10. Media Studio / Publishing / Governance support
- [ ] Media Studio managed assets appear correctly if present.
- [ ] Publishing-ready status is clear but not execution.
- [ ] Governance/proof evidence language is clear.
- [ ] Library does not claim generation, publishing, or approval happened.

### 11. CSS / density observation
- [ ] Page is readable.
- [ ] Filters are usable.
- [ ] Preview/action panel is not confusing.
- [ ] Action dropdowns are clear.
- [ ] Any density/duplication issues are recorded.

## QA Result
Pending manual browser QA.

## Production Change Policy
- No production JS changes.
- No CSS changes.
- No backend/API changes.
- No route changes.
- No data/projects changes.
