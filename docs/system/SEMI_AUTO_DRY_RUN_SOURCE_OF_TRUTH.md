# Semi-Auto Dry Run Source of Truth

This note documents the current stabilization contract for one controlled HAIROTICMEN semi-auto campaign dry run. It does not authorize migration, deletion, or full-auto publishing.

## Current Behavior

- Campaign execution packages are built/read through the `campaign-execution` domain in `runtime/orchestrator-service/server.js`.
- Campaign finalization artifacts are built/read through the `campaign-finalization` domain in `runtime/orchestrator-service/server.js`.
- Existing HAIROTICMEN dry-run artifacts currently live under `data/projects/hairoticmen/brand-assets/...` and are mirrored in `data/brand-assets/hairoticmen/...`.
- Canonical execution storage under `data/execution/projects/hairoticmen/...` is not yet populated for these artifacts, so reads must keep legacy fallback active.
- Operational records under `data/projects/hairoticmen/ops/*.json` are a separate Control Center operations layer and should not be treated as the only source of campaign/finalization truth yet.

## Dry Run Rule

For the next semi-auto campaign dry run, finalization readiness is valid when the resolver can find:

- `campaign-execution/packages/<campaign>.json`
- `campaign-finalization/media-jobs/<campaign>_<channel>.json`
- `campaign-finalization/email/<campaign>.json`
- `campaign-finalization/publish-packages/<campaign>_<channel>.json`
- `execution/config/mode.json` with `semi_auto`

Do not migrate or remove legacy artifacts until canonical execution storage and Control Center ops records are reconciled in a separate approved change.
