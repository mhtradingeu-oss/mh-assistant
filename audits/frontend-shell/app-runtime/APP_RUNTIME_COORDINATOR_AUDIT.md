# App Runtime Coordinator Audit

## Current truth

public/control-center/app.js is still the main operational coordinator for the Control Center frontend.

It currently owns or coordinates:

- access key panel
- protected write fetch installation
- route access resolver
- global feedback
- loading overlay lifecycle
- startup diagnostics
- runtime trace
- fatal error panel
- startup recovery
- project selection
- top context rendering
- page render orchestration
- project data load lifecycle
- responsive shell
- sidebar behavior
- command bar behavior
- AI Dock behavior
- executive launcher
- global buttons
- init/bootstrap

## New diagnostic boundaries already added

- overlay runtime snapshot diagnostics
- command runtime snapshot diagnostics

## Current risk

app.js is still too large and owns too many runtime concerns.

The correct direction is to keep app.js as:

Bootstrap Coordinator
Route Coordinator
Runtime Initializer

And gradually move isolated runtime ownership into:

- runtime/overlay/
- runtime/command/
- runtime/shell/
- runtime/diagnostics/
- runtime/state/
- future runtime/ai/

## Important safety rule

No large extraction should happen from app.js until:

1. the target runtime helper exists
2. current behavior is snapshotted
3. the first connection is diagnostic-only
4. browser smoke check passes
5. only then mutating behavior can move one function at a time

## Next recommended runtime ownership targets

1. AI Dock diagnostics
2. Executive launcher diagnostics
3. Sidebar runtime diagnostics
4. Command runtime helper extraction
5. Overlay mutating helper replacement
6. App shell coordinator reduction

## Do not extract yet

- loadProjectData
- startup watchdog
- access key panel
- fatal error recovery
- project fetch lifecycle

These are high-risk and should remain in app.js until shell/runtime diagnostics are mature.
