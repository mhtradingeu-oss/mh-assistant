# Library Step 3 - Duplicated Action Surfaces Audit

Date: 2026-05-11  
Branch: architecture/frontend-consolidation-v1  
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## 1. Executive summary

This pass audits duplicated Library action surfaces without changing behavior. Current behavior remains centered in `library.js`, while Action Panel and AI Panel are mounted read-only with command metadata only.

Key findings:
- Operational mutations are currently active from Inspector actions (and some Finder toolbar proxies), not from Action Panel.
- Multiple mutation commands exist in `command-router.js` but are not routed by active UI actions yet.
- A small set of handlers are latent (bound in JS, no rendered element currently targets them).
- Consolidation is safe to stage in phases, beginning with documentation and optional dead-handler cleanup only.

## 2. Current action surface map

### Finder toolbar actions
- Upload: `#libraryToolbarUploadBtn` triggers upload input click. Active.
- Rename: `#libraryToolbarRenameBtn` proxies to Inspector rename button if selected. Active proxy.
- Delete: handler exists for `#libraryToolbarDeleteBtn`, but button is not rendered in template. Latent.
- Approve: `#libraryToolbarApproveBtn` proxies to Inspector approve button if selected. Active proxy.
- Source of Truth: `#libraryToolbarSourceBtn` proxies to Inspector source button if selected. Active proxy.

### Inspector meta actions
- Open / Preview: `[data-library-open]` opens protected media/documents. Active.
- Download path support: for non-inline-openable files, open flow falls back to browser download anchor. Active.
- Source of truth: `[data-library-source-truth]` calls source-of-truth API mutation. Active.
- Status update (approved / needs_review): `[data-asset-status-action]` calls status mutation. Active.
- Archive: `[data-library-archive]` calls archive mutation. Active.
- Rename: `[data-library-rename]` prompts and calls rename mutation. Active.
- Delete: `[data-library-delete]` confirms and calls soft-delete mutation. Active.

### Action Panel
- Buttons render command metadata only:
  - `set-source-of-truth`
  - `update-status` (`approved` / `needs_review`)
  - `archive-asset`
- Panel is mounted with `disabled: true`. Read-only future command surface.

### AI Panel
- Button renders command metadata only:
  - `send-to-ai`
- Panel is mounted with `disabled: true`. Read-only future command surface.

### AI actions in main view
- Classify / Review Missing / Extract Docs buttons are active in main view and navigate to AI command route by writing prompt text.
- Document preview fallback includes active `Extract with AI` button for selected document.

### Command router
- Supported command envelopes:
  - `select-asset`, `set-filter`, `set-view-mode`, `set-page`
  - `open-upload`, `refresh-library`, `open-preview`
  - `set-source-of-truth`, `update-status`, `rename-asset`, `archive-asset`, `delete-asset`, `send-to-ai`
- Current live usage in `library.js` dispatches only:
  - `select-asset`, `set-filter`, `set-view-mode`, `set-page`
- Mutation/AI envelopes are defined but not yet wired as primary route behavior.

## 3. Duplicated actions table

| Action | Surfaces now | Classification | Recommendation |
|---|---|---|---|
| Upload | Finder toolbar, drop zone, choose-files button | `active_behavior`, `duplicate_surface`, `should_remain` | Keep all upload entry points (high-utility, low risk). |
| Open / Preview | Inspector open button, document preview open button | `active_behavior`, `duplicate_surface`, `should_remain` | Keep inline open from inspector/preview. |
| Source of Truth | Inspector action, Finder toolbar proxy, Action Panel placeholder | `active_behavior`, `duplicate_surface`, `read_only_future_command`, `should_move_to_action_panel_later`, `should_route_through_command_router_later` | Later make Action Panel primary, keep one minimal inspector affordance. |
| Status approve | Inspector action, Finder toolbar proxy, Action Panel placeholder | `active_behavior`, `duplicate_surface`, `read_only_future_command`, `should_move_to_action_panel_later`, `should_route_through_command_router_later` | Later move operational approval to Action Panel; keep compact status display in inspector. |
| Status needs_review | Inspector action, Action Panel placeholder | `active_behavior`, `duplicate_surface`, `read_only_future_command`, `should_move_to_action_panel_later`, `should_route_through_command_router_later` | Same target model as approve. |
| Archive | Inspector action, Action Panel placeholder | `active_behavior`, `duplicate_surface`, `read_only_future_command`, `should_move_to_action_panel_later`, `should_route_through_command_router_later` | Move mutation primary path to Action Panel later. |
| Rename | Inspector action, Finder toolbar proxy | `active_behavior`, `duplicate_surface`, `should_move_to_action_panel_later`, `should_route_through_command_router_later` | Consolidate later to Action Panel command route. |
| Delete (soft) | Inspector action, latent toolbar handler exists | `active_behavior`, `dead_or_latent_handler`, `should_move_to_action_panel_later`, `should_route_through_command_router_later` | Keep current inspector delete; only remove latent toolbar handler when confirmed unrendered. |
| Send to AI | Main view AI buttons + doc extract, AI Panel placeholder | `active_behavior`, `duplicate_surface`, `read_only_future_command`, `should_remain`, `should_route_through_command_router_later` | Keep active AI actions; later align command envelopes for panel parity. |
| Classify / Missing / Extract related | Main view AI action toolbar + selected-doc extract action | `active_behavior`, `should_remain` | Preserve current behavior until command-router shadow pass. |

## 4. Dead/latent handler findings

Confirmed latent or disconnected handlers in current render path:
- `libraryToolbarDeleteBtn` click handler exists, but no button with that id is rendered.
- `[data-library-select]` click binding exists, but no rendered element currently uses this attribute.
- `[data-library-row-select]` click/key binding exists, but no rendered element currently uses this attribute.
- `[data-library-view-mode]` binding exists, but no rendered view-mode toggle is currently rendered.

These are safe candidates for later cleanup only after re-verifying there is no dynamic/conditional render path introducing those selectors.

## 5. Command-router usage gap

Current state:
- Router is actively used as an envelope/dispatch pattern for selection, filters, view-mode, and pagination state updates.
- Operational mutations and AI actions bypass router and call direct handlers/API or route navigation.
- Action Panel and AI Panel emit `data-library-command` metadata but no active click wiring consumes these buttons yet.

Gap summary:
- Defined command envelopes are ahead of active behavior wiring.
- This is acceptable in Step 3, but creates split operational surfaces and duplicated intent.

## 6. Recommended future target model

Target model:
- Main View = selection + preview + upload.
- Action Panel = operational asset mutations.
- AI Panel = AI prompts/extraction/classification.
- Inspector = asset facts/preview, minimal inline actions only.

Implications:
- Reduce mutation duplication across Finder toolbar and Inspector.
- Keep only minimal inspector inline actions needed for rapid preview/open workflows.
- Route mutations and AI dispatch through a single command-routing seam for consistency and safety controls.

## 7. Safe migration plan

### Phase 3A (this pass): documentation only, no behavior change
- Complete duplicated action inventory and classifications.
- Record target model and routing gaps.

### Phase 3B: remove dead toolbar handler only if no rendered element exists
- Candidate: `libraryToolbarDeleteBtn` handler block in `library.js`.
- Guardrail: remove only after confirming no rendered template branch creates `#libraryToolbarDeleteBtn`.
- No mutation behavior change, because no live element currently triggers it.

### Phase 3C: command-router shadow wiring for one non-destructive action
- Pick one safe action (recommended: `open-preview` or `send-to-ai` prompt dispatch).
- Keep legacy path in place; log/observe parity in outcomes.
- No API contract changes.

### Phase 3D: Action Panel command wiring behind selected asset and disabled safety checks
- Enable one Action Panel command at a time behind strict selected-asset gating.
- Keep explicit confirmations where already required (archive/delete/status transitions as applicable).
- Migrate primary mutation entry points to Action Panel only after parity verification.

## 8. No-change confirmation

Confirmed in this audit pass:
- No backend changes.
- No `data/projects` changes.
- No API call contract changes.
- No Library behavior changes were introduced.
- No new global listeners were added.
- Route ids unchanged.
