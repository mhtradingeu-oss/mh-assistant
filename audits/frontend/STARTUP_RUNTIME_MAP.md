# STARTUP_RUNTIME_MAP

## Scope
Frontend startup/load/render map for Control Center.

## Confirmed startup entrypoints
- DOMContentLoaded -> init()
- init() binds global systems, renders initial route, loads project list, then loads project data.

## Key functions
- renderGlobalUi(): updates global context UI such as project switcher and top context.
- safeRenderCurrentPage(): protected page render wrapper.
- showLoading(): explicit loading overlay activation.
- hideLoading(): protected loading overlay cleanup.
- fetchProjectWithTimeout(): required project payload fetch with timeout/watchdog.
- applyProjectPayload(): applies required payload into state.
- applyOptionalProjectPayload(): optional background payload path.
- initializeAiDock(): global AI dock binding.
- openGlobalCommandBar(): global command palette opener.

## Observed call counts
- renderGlobalUi(): 6 references.
- safeRenderCurrentPage(): 5 references.
- showLoading(): 3 references.
- hideLoading(): 9 references.
- initializeAiDock(): 2 references.
- openGlobalCommandBar(): 4 references.

## Startup render paths
1. Initial render before project payload.
2. Required payload success render.
3. Required fallback render.
4. Optional payload render.
5. Parse watchdog fallback render.
6. Error fallback render.

## Loading behavior
The system uses defensive cleanup:
- normal hide
- hard clear hide
- forced hide
- watchdog recovery
- fatal recovery

This protects against stuck loading overlays but increases startup complexity.

## Current risk
app.js owns too many responsibilities:
- bootstrap
- loading
- diagnostics
- routing
- overlays
- command
- AI dock
- startup recovery
- global UI
- project loading

## Decision
Do not rewrite startup now.

Next safe direction:
1. Keep current startup behavior.
2. Avoid adding more logic into app.js.
3. Extract only after mapping dependencies.
4. Prefer small safety patches over large refactors.
5. Ensure hidden overlays never block user input.

## Future module candidates
- startup/loading-runtime.js
- startup/project-loader.js
- diagnostics/startup-trace.js
- shell/global-ui.js
- command/global-command.js
- overlays/modal-manager.js
- ai/ai-dock.js
