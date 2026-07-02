# AI Team Quick Actions Drawer Alignment Patch

## What changed

- Added a small exported drawer shell wrapper in `public/control-center/pages/ai-command/tool-dock.js` so AI Command can mount the existing Smart Tool Drawer shell without rendering a second dock list.
- Added `openAiToolDrawerFromMetadata` in `tool-dock.js`. The adapter converts Quick Action metadata into the same `data-aicmd-tool-dock-*` attribute contract consumed by the existing `openToolDrawer` path.
- Updated AI Command Quick Action clicks in `public/control-center/pages/ai-command.js` to open the Smart Tool Drawer instead of pre-filling the composer, creating a local preview, navigating, or stopping at a source toast.
- Removed the direct Quick Action source toast gate from `ai-command.js`; source validation now stays inside the drawer via the existing warning behavior.

## Why this reuses existing drawer authority

Quick Actions now call `openAiToolDrawerFromMetadata`, which delegates to the existing internal `openToolDrawer` function. That keeps drawer population, source requirement detection, selected source rendering, Change Source behavior, setup summary updates, and Use in Composer validation under `tool-dock.js` authority.

## Why no duplicate drawer was created

The patch does not add a new drawer implementation, CSS layer, or parallel source warning. AI Command mounts the existing `renderSmartToolDrawerShell` output through `renderAiToolDrawerShell`, and all interaction remains in `bindAiToolDock`, `openToolDrawer`, `applySharedAiSourceToDrawer`, and `validateDrawerSourceRequirement`.

## How source-required tools behave now

- Clicking a source-required Quick Action opens the Smart Tool Drawer immediately.
- The drawer marks the tool as source-required using existing action/source metadata.
- Missing source appears inside `[data-aicmd-tool-drawer-source-warning]` with the existing `This tool needs a source...` warning.
- Change Source remains available through the existing drawer button and shared Library source bridge.
- Use in Composer remains blocked by `validateDrawerSourceRequirement` until a valid source is available.

## Safety guarantees

- No backend files changed.
- No `data/projects` files changed.
- No CSS changed.
- No routing behavior was added to Quick Action clicks.
- No durable task creation, workflow run, publish/send/approve action, CRM mutation, or customer operation was added.
- Quick Actions remain composer-preparation tools: they open setup, then only `Use in Composer` writes a review-ready prompt to local composer state.

## Validation results

Passed:

- `node --check public/control-center/pages/ai-command.js`
- `node --check public/control-center/pages/ai-command/tool-dock.js`
- `node --check public/control-center/pages/operations-centers.js`
- `node --check public/control-center/pages/workflows.js`
- `node --check public/control-center/shared-context.js`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
