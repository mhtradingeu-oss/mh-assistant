# AI Team Tooling Cleanup Plan

Phase: 2 - cleanup and implementation plan before code
Date: 2026-05-18
Scope: AI Command / AI Team tool dock, smart drawer, Library source bridge, and safe workspace routing

## 1. Current stable baseline

Latest stable app feature commit:

- `96a31ba Make smart tool drawer source ready`

Current documentation commits observed after Phase 0 and Phase 1:

- `655aae9 Audit AI Team page tooling architecture`
- `1447540 Plan AI specialist tool matrix`

Current completed phases:

- Phase 0: Deep audit created at `audits/frontend/ai-team-tools/AI_TEAM_PAGE_DEEP_AUDIT.md`.
- Phase 1: Specialist tool matrix created at `audits/frontend/ai-team-tools/AI_SPECIALIST_TOOL_MATRIX.md`.
- Phase 2: This cleanup plan is documentation only.

Current AI Team state:

- AI Command has the visible specialist rail from `SPECIALIST_DEFS`.
- The page still has older/parallel tool structures: `MODE_DEFS`, `PHASE35_SPECIALIST_TOOLS`, and the newer compact dock registry in `tool-dock.js`.
- Specialist selection is functional and updates `session.modeId`.
- Team mode is functional and currently combines a small set of strategist, writer, and operations tools.

Current Tool Dock state:

- `public/control-center/pages/ai-command/tool-dock.js` owns the compact dock under the composer.
- Content Writer already has real metadata.
- Non-writer specialists mostly rely on fallback metadata.
- Dock clicks are safe: drawer-first for non-prefill action types, composer prefill fallback otherwise.

Current Smart Drawer state:

- A generic drawer shell exists and is rendered by `renderSmartToolDrawerShell()`.
- It supports output type, source/input, destination, language, tone, source details, extra brief, safety text, setup summary, Open Library, Use in Composer, and Cancel.
- It does not yet show a selected Library source summary.
- It does not yet read shared source context.
- It still carries hidden chip rendering and CSS override debt.

Current Library relationship:

- Library remains the correct source selection workspace.
- Existing Library AI actions prepare generic prompts and navigate to AI Command.
- There is no shared AI source bridge yet.
- There is no "Use as AI Source" button yet.
- There must be no mini file picker inside the drawer.

Current safety status:

- The new dock/drawer path does not mutate backend data.
- The drawer does not publish, send, save, route, create CRM records, run workflows, delete files, or overwrite files.
- Some older AI Command preview/route flows set shared handoff context and navigate to owning workspaces. They should remain review-first and must not call backend mutation APIs from AI Command.

## 2. Files to change later

### `public/control-center/pages/ai-command/tool-dock.js`

Why:

- This is the correct owner for compact dock metadata, drawer setup behavior, and composer prompt construction.

Allowed later changes:

- Normalize metadata for every specialist.
- Keep all tool-specific dock logic here or in a small adjacent module under `public/control-center/pages/ai-command/`.
- Add selected source reading from shared context after Phase 5.
- Improve drawer prompt generation and Content Writer quality rules.
- Keep fallback behavior for missing metadata.
- Do not call backend APIs from this file.

### `public/control-center/pages/ai-command.js`

Why:

- This route owns specialist selection, session state, local previews, older Tools tab actions, inbound handoffs, and preview routing.

Allowed later changes:

- Minimal integration only when necessary.
- Reconcile or label overlap between the new dock and older Tools tab.
- Fix alias drift where `seo` should map to `analyst`.
- Fix fallback drift where `researcher` is referenced but not a visible specialist.
- Keep broad rewrites out of scope unless a later phase explicitly authorizes them.
- Do not add backend mutations or direct execution.

### `public/control-center/pages/library.js`

Why:

- Library owns asset selection and selected asset inspector UI.
- The Library Source Bridge needs a "Use as AI Source" control near the selected asset inspector.

Allowed later changes:

- Import shared AI source functions.
- Build a small selected asset payload from `selectedAsset`.
- Add a "Use as AI Source" button near the selected asset inspector.
- Bind the button to store source context and navigate back to AI Command.
- Use robust line-based insertion near `.library-inspector-path`.
- Do not add a second picker or duplicate Library selection behavior.
- Do not mutate backend data for the source bridge.

### `public/control-center/shared-context.js`

Why:

- Existing shared context already holds campaign records, AI drafts, and handoffs.
- It is the correct lightweight location for in-memory AI source context.

Allowed later changes:

- Add `setSharedAiSource(projectName, source)`.
- Add `getSharedAiSource(projectName)`.
- Add `clearSharedAiSource(projectName)`.
- Keep functions in-memory and project-scoped.
- Do not persist selected source to backend.

### `public/control-center/styles/08-components-foundation.css`

Why:

- Current dock and drawer CSS live here.
- Drawer CSS has layered overrides and duplication from multiple passes.

Allowed later changes:

- Consolidate existing `.mhos-tool-drawer*` blocks.
- Remove unused local preview CSS if markup remains absent.
- Remove hidden chip styling if chips are removed from markup.
- Improve drawer hierarchy, sticky footer, responsive layout, and collision safety.
- Edit existing blocks in place where possible.
- Do not append broad duplicate CSS patches.

### `public/control-center/styles/12-pages.css`

Why:

- Page-level Library styles live here, including inspector and action surfaces.

Allowed later changes:

- Add or adjust a small Library source bridge button style only if existing button/card classes are insufficient.
- Avoid duplicate drawer or dock CSS here.
- Do not move global dock/drawer styles from foundation into page CSS.

### `public/control-center/pages/content-studio-workspace.js`

Why:

- Content Studio owns written draft saving, editing, versioning, Library save, Media Studio handoff, Publishing handoff, and AI context export.

Allowed later changes:

- Only touch during later routing phases if AI Command needs a reviewed handoff preview to Content Studio.
- Ensure Content Studio remains the owner of durable written draft saves.
- Do not move Content Studio save logic into AI Command.

### `public/control-center/pages/media-studio-workspace.js`

Why:

- Media Studio owns visual/media production drafts, selected asset dependencies, media review, Library save, and Publishing handoff.

Allowed later changes:

- Only touch during later routing phases if AI Command needs a reviewed media brief handoff.
- Ensure Media Studio remains the owner of media generation, media edits, and asset processing.
- Do not move media execution into AI Command.

## 3. Files not to touch unless explicitly approved

- `data/projects/*`
- Backend/API files such as `public/control-center/api.js` or server/runtime API implementations.
- Route files unrelated to AI Command, Library bridge, Content Studio handoff, or Media Studio handoff.
- App shell files unless validation proves it is necessary:
  - `public/control-center/app.js`
  - `public/control-center/router.js`
- Package metadata, lockfiles, generated assets, and environment files unless a later phase explicitly requires them.

## 4. Known cleanup targets

Duplicated drawer CSS:

- Multiple `.mhos-tool-drawer`, `.mhos-tool-drawer-card`, `.mhos-tool-drawer-head`, `.mhos-tool-drawer-actions`, and `.mhos-tool-drawer-summary span` blocks exist in `08-components-foundation.css`.
- Later cleanup should consolidate them without changing behavior first.

Unused local preview CSS:

- `.mhos-tool-drawer-local-preview` styles exist, but the drawer markup does not currently render a matching local preview block.
- Remove only after confirming no markup or planned Phase 4 UX depends on it.

Hidden drawer chips logic:

- `tool-dock.js` renders chip containers and calls `renderDrawerChips()`.
- CSS hides `.mhos-tool-drawer .mhos-tool-drawer-chips`.
- Later cleanup should remove chip markup/JS or repurpose it deliberately. Do not keep hidden duplicate UX.

Old prompt-preview logic if any remains:

- Drawer UX should not show raw prompt preview as the primary experience.
- Any old prompt preview surfaces should become debug-only or be removed if unused.
- Composer instruction generation should remain behind "Use in Composer".

`BASE_TOOL_DOCK_TOOLS` if unused:

- `BASE_TOOL_DOCK_TOOLS` exists in `tool-dock.js`.
- Phase 0 scan found no usage.
- Confirm with `rg` during cleanup before removing.

`PHASE35_SPECIALIST_TOOLS` overlap:

- `PHASE35_SPECIALIST_TOOLS` in `ai-command.js` is a second specialist tool registry.
- It powers the older Tools tab and route cards.
- Do not remove in Phase 3. First normalize the compact dock metadata. Later decide whether to migrate, label as advanced tools, or consolidate.

`MODE_DEFS` vs `SPECIALIST_DEFS` overlap:

- `MODE_DEFS` and `SPECIALIST_DEFS` both describe specialists.
- `MODE_DEFS` still appears used by older/classification flows.
- Do not remove until references are mapped and tested.

`seo` vs `analyst` alias drift:

- Current visible specialist id is `analyst`.
- Some inbound source mapping still uses `seo`.
- Later cleanup should map `seo` to `analyst` consistently.

`researcher` fallback drift:

- Some alias logic points `research` to `researcher`.
- No current visible `researcher` specialist exists.
- Later cleanup should route research-like inputs to `analyst` or a future explicit Researcher, but only after product decision.

Hardcoded Content Writer-only assumptions:

- Content Writer has real metadata; other specialists rely on fallback metadata.
- Drawer quality rules currently include SEO-specific rules, not full specialist-aware rules.
- Later prompt rules must not assume every tool is a writing tool.

Weak fallback metadata for non-writer specialists:

- Non-writer tools currently fall back to Chat Preview, Current Chat, and output equal to tool id.
- Phase 3 should replace fallback behavior with real specialist metadata while keeping a safe fallback for unknown future tools.

## 5. Tool metadata normalization plan

Exact runtime schema for Phase 3:

- `id`
- `label`
- `icon`
- `badge`
- `actionType`
- `safetyLevel`
- `frontendOwnerPage`
- `destinations`
- `sourceTypes`
- `outputTypes`
- `template`

Runtime rules:

- Every visible dock tool for every specialist must define all runtime schema fields.
- Existing visible tool labels should remain concise.
- `actionType` must be one of the drawer-safe action types already used or planned: `prefill`, `guided`, `source_required`, `asset_required`, `preview`, `route`.
- `safetyLevel` should be one of: `context_only`, `review_only`, `confirmation_required`.
- `frontendOwnerPage` should point to the owning/review workspace, not a backend API.
- `destinations`, `sourceTypes`, and `outputTypes` must be arrays.
- `template` must instruct review-only behavior and forbid direct execution.

Optional future fields:

- `specialistId`
- `description`
- `requiredInputs`
- `optionalInputs`
- `assetRequirements`
- `routeTarget`
- `backendCapability`
- `frontendOwnerPage`
- `ownerWorkspace`
- `previewTemplate`

Future field rules:

- Optional fields should not be required by the current drawer until a later phase intentionally supports them.
- `backendCapability` is descriptive only in AI Command. It must not trigger execution from AI Command.
- `routeTarget` must be treated as review-first navigation or handoff context, never direct action.

## 6. Drawer UX cleanup plan

The drawer must keep:

- Tool header
- Output Type
- Source / Input
- Selected Source summary
- Destination
- Language
- Tone
- Source Details
- Extra Brief
- Safety card
- Setup Summary
- Open Library
- Use in Composer
- Cancel

The drawer must remove or avoid:

- Raw prompt preview as primary UX
- Duplicated chips under dropdowns
- Crowded long lists
- Direct save/publish/send/run buttons
- Backend mutation controls
- Repeated CSS patches

Drawer implementation approach:

- Keep the drawer generic and metadata-driven.
- Make header show tool icon, title, action type, safety, and owner workspace.
- Make selected source summary a compact card, not a second picker.
- Keep Open Library as the source selection entry point.
- Keep Use in Composer as the primary action.
- Keep Cancel/close behavior simple and safe.
- Avoid adding execution verbs such as Publish, Send Email, Save Draft, Run Workflow, Create CRM Record, or Approve.
- Consolidate CSS before adding visual polish.

## 7. Library Source Bridge plan

Shared-context functions:

- `setSharedAiSource(projectName, source)`
- `getSharedAiSource(projectName)`
- `clearSharedAiSource(projectName)`

Library selected asset payload:

- `id`
- `asset_id`
- `name`
- `filename`
- `file_path`
- `asset_type`
- `source_label`
- `source_of_truth`
- `text_preview` short slice
- `selected_at`

Library UI:

- Add "Use as AI Source" near the selected asset inspector.
- Preferred insertion area is the selected asset metadata block near `.library-inspector-path`.
- Do not add a mini file picker.
- Do not duplicate the existing asset grid, filters, or action panel.
- Existing selected asset behavior must remain intact.

AI Command behavior:

- Read selected source from shared context using current project scope.
- Show selected source summary in the drawer.
- Auto-fill Source Details with source name, type, and path.
- Include source reference in the composer prompt.
- Include only a short `text_preview` reference if available.
- Do not paste huge file contents into the composer.
- Offer clear source context while still keeping the final output review-only.

Safety:

- No backend mutation.
- No durable save.
- No direct Library state mutation.
- No publishing, email, CRM, workflow, file overwrite, file deletion, or approval action.

## 8. Step-by-step implementation phases

### Phase 3A metadata scan

- Re-scan `tool-dock.js` and confirm every specialist/tool block.
- Re-scan `ai-command.js` to understand active specialist ids and aliases.
- Confirm there are no uncommitted app changes before editing.

### Phase 3B normalize non-writer specialist metadata

- Edit `tool-dock.js` only unless a small adjacent module is clearly better.
- Add runtime schema fields for Strategist, Media Director, Video Lead, Publisher, Operations Lead, Compliance Reviewer, Ads Optimizer, SEO / Insights Analyst, Customer Ops, and Sales / CRM.
- Keep Content Writer metadata intact unless a small consistency edit is needed.
- Keep labels concise.
- Keep fallback metadata safe.

### Phase 3C validate/browser QA/commit

- Run validation commands.
- Browser QA at least Content Writer, Media Director, Sales / CRM, and Operations.
- Commit as `Normalize AI specialist tool metadata` only if clean.

### Phase 4A drawer CSS cleanup scan

- Re-scan `08-components-foundation.css` for `.mhos-tool-drawer`.
- Identify duplicate blocks before editing.
- Confirm no drawer CSS lives in unrelated page CSS.

### Phase 4B drawer UX cleanup

- Remove hidden chips from drawer UX or stop rendering them.
- Add selected source summary placeholder/card.
- Improve header, safety card, setup summary, spacing, sticky footer, and responsive behavior.
- Validate drawer still opens for all tested specialists.
- Commit as `Polish AI smart tool drawer UX`.

### Phase 5A library bridge exact anchor scan

- Re-scan `library.js` around selected asset inspector.
- Confirm exact line location of `.library-inspector-path`.
- Confirm exact location of `sendToAiBtn` binding.
- Do not rely on fragile multiline anchors.

### Phase 5B shared-context source functions

- Add `setSharedAiSource`, `getSharedAiSource`, and `clearSharedAiSource`.
- Keep them project-scoped and in-memory.
- Validate `shared-context.js` with `node --check`.

### Phase 5C Library Use as AI Source UI

- Add button near selected asset inspector.
- Build the source payload from `selectedAsset`.
- Store with `setSharedAiSource(projectName, payload)`.
- Navigate back to AI Command.
- No backend mutation.

### Phase 5D AI Command reads selected source

- Import/read shared source in the drawer path.
- Show source summary.
- Auto-fill Source Details.
- Include selected source reference in `buildSmartToolComposerPrompt()`.
- Validate the full bridge manually.
- Commit as `Add Library source bridge for AI tools`.

### Phase 6 Content Writer quality rules

- Add output-specific quality rules for Content Writer.
- Cover Blog Article, Contract Draft, Company Profile, Product Copy, Email, Landing Page, Presentation Outline, Speech, FAQ, Proposal, Social Post, and Ad Copy.
- Keep rules project-agnostic.
- Commit as `Improve Content Writer tool intelligence`.

### Phase 7 one specialist at a time

- Migrate one specialist per small phase.
- For each specialist: scan, document tool intelligence if needed, adjust metadata or drawer behavior, validate, browser QA, commit.
- Recommended order: Media Director, Video Lead, Publisher, Strategist, Operations Lead, Compliance Reviewer, Ads Optimizer, SEO / Insights Analyst, Customer Ops, Sales / CRM.

## 9. Validation checklist

Run after every code phase:

```bash
git status --short
git diff --stat
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/library.js
node --check public/control-center/shared-context.js
node --check public/control-center/app.js
node --check public/control-center/router.js
git status --short | grep "data/projects" || true
```

Commit only when:

- `node --check` passes for touched and required files.
- `git status --short | grep "data/projects" || true` shows no unexpected project data changes.
- The drawer opens.
- The tool dock does not duplicate tools.
- Library bridge behavior is complete when that phase is active.
- No broken literal `"\\n"` has been inserted into JS code.

## 10. Browser QA checklist

Run during relevant code phases:

- Content Writer all tools open drawer.
- Media Director tool opens drawer.
- Sales / CRM tool opens drawer.
- Operations tool opens drawer.
- Open Library navigates correctly.
- Library selected asset remains selectable.
- Use as AI Source later returns to AI Command.
- Source Details is filled later.
- Selected source summary appears later.
- Use in Composer still works.
- Composer prompt remains review-only.
- Drawer close/Cancel works.
- No direct execution.
- No publish, send email, CRM mutation, workflow run, file delete, file overwrite, or backend mutation from AI Command.
- No `data/projects` noise.
- Mobile drawer remains usable.
- Floating UI does not collide with drawer footer.

## 11. Rollback plan

If a code phase fails:

- Stop immediately and inspect `git diff`.
- Restore failed partial patches before continuing.
- Never commit a partial Library bridge.
- Never commit if exact anchors fail.
- Never commit if `node --check` fails.
- Never commit if broken literal `"\\n"` appears in JS.
- Never commit if the drawer stops opening.
- Never commit if the dock duplicates tools or loses specialist-specific tools.
- Never commit if `data/projects/*` changes unexpectedly.
- If app code was changed and the issue is unclear, revert only the changes from the current phase and preserve user-authored changes.

Rollback sequence:

- Identify files changed in the current phase with `git status --short`.
- Review each changed file with `git diff -- <file>`.
- Use a precise reverse patch for only the failed phase's edits.
- Re-run validation.
- Re-attempt with smaller anchors or split the phase further.

## 12. Final recommended next code phase

The next code phase should be metadata normalization for all specialists, not Library Bridge, unless the user explicitly chooses Library Bridge first.

Reason:

- Phase 0 showed only Content Writer has real metadata.
- Phase 1 defined the project-agnostic specialist matrix.
- Phase 3 metadata normalization makes the drawer consistently specialist-aware without touching Library, shared context, CSS, or backend behavior.
- This keeps the next code change small, reversible, and safe.
