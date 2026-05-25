# Source-of-Truth Migration Implementation Plan

## 1. Executive Summary

Status: implementation plan only. No production code, frontend code, backend code, service configuration, existing source-of-truth files, or `data/projects` files were modified for this document.

Recommendation: implement Option A, canonical-first migration plus legacy regeneration. Treat the backend canonical registry as the authority and treat the legacy flat registry as a compatibility projection. Keep `sources-registry.json`; do not delete it.

The evidence shows active backend reads and writes still touch both files. A data-only rewrite is not sufficient, because one warning path compares source-of-truth values after calling `buildSourceOfTruthRegistry()`, which stamps `updated_at` with the current time. The safe resolution needs both:

- deterministic backend comparison/write logic
- a backed-up Hairoticmen data migration that regenerates legacy from canonical

Operational rule: Backend = Authority, Frontend = Projection.

## 2. Current Mismatch Truth

Canonical file:

- `data/projects/hairoticmen/source-of-truth-registry.json`
- wrapper schema with top-level `updated_at`, `statuses`, `sources`, and `required_sources`
- `sources` keys: `email`, `facebook`, `instagram`, `tiktok`, `website`, `youtube`
- canonical source entry timestamps are `2026-05-14T20:57:39.831Z`
- `required_sources` includes connected `website` and `social_links`, with product, brand, legal, pricing, and campaign documents still missing

Legacy file:

- `data/projects/hairoticmen/sources-registry.json`
- flat source map keyed by `email`, `facebook`, `instagram`, `tiktok`, `website`, `youtube`
- legacy source entry timestamps are `2026-05-06T12:39:17.952Z`

Truth classification:

- The two files agree on the six connected channel names and values.
- They do not agree structurally: canonical is wrapped, legacy is flat.
- They do not agree exactly at source-entry level because `updated_at` differs.
- Release proof reported 162 recent warning samples.
- Release docs classify this as a P1 release blocker unless accepted as known migration debt with owner and date.

Warning reasons observed:

- `canonical_legacy_value_mismatch` for domain `source-of-truth`
- `canonical_legacy_parity_check_mismatch` for domain `source_of_truth_registry`

## 3. Read/Write Ownership Map

### Who Reads Canonical

| Owner/path | Current behavior |
| --- | --- |
| `runtime/orchestrator-service/server.js` `ensureProjectBaselineFiles()` | Reads `source-of-truth-registry.json` through `readCanonicalJsonWithLegacyFallback()` with legacy fallback. |
| `runtime/orchestrator-service/server.js` `reviewProjectSources()` | Returns `source_of_truth_registry` by reading canonical directly. |
| `runtime/orchestrator-service/server.js` control center connectors/overview builders | Indirectly expose canonical through `reviewProjectSources()`. |
| `scripts/verify-multi-project-readiness.js` | Uses exported `reviewProjectSources()` and parity helpers in smoke proof. |

Important caveat: canonical is not yet the only read authority. Some readiness paths still derive truth from the legacy flat file.

### Who Writes Canonical

| Owner/path | Current behavior |
| --- | --- |
| `readCanonicalJsonWithLegacyFallback()` | Writes canonical if canonical is missing and a legacy candidate exists, or writes fallback if both are missing. |
| `persistProjectSetupArtifacts()` | Writes canonical from `buildSourceOfTruthRegistry(nextSources)` after setup save. |
| `setProjectSourceOfTruth()` | Writes canonical after mutating legacy sources. |
| `removeProjectSourceOfTruth()` | Writes canonical after deleting from legacy sources. |
| `createProject()` and `updateProjectSetup()` | Write canonical indirectly through `persistProjectSetupArtifacts()`. |
| Integration connection/sync flow | Can call `setProjectSourceOfTruth()` when `sync_source_registry` is enabled. |

### Who Reads Legacy

| Owner/path | Current behavior |
| --- | --- |
| `readCanonicalJsonWithLegacyFallback()` | Reads `sources-registry.json` as legacy fallback and compares it to canonical. |
| `ensureProjectBaselineFiles()` | Ensures the legacy file exists from normalized source data if missing. |
| `persistProjectSetupArtifacts()` | Reads current sources from `sources-registry.json` before merging setup values. |
| `reviewProjectReadiness()` | Builds source-of-truth completeness from legacy data. |
| `reviewProjectConnectorReadiness()` | Builds connector checks from legacy data. |
| `reviewProjectSources()` | Returns `sources` by reading legacy directly. |
| `reviewProjectCanonicalParity()` | Compares canonical sources against legacy sources and logs mismatch when they differ. |
| Control Center Home and Publishing | Consume backend readiness/check projections that currently depend on legacy reads. |

### Who Writes Legacy

| Owner/path | Current behavior |
| --- | --- |
| `ensureProjectBaselineFiles()` | Creates `sources-registry.json` if missing from normalized canonical/fallback data. It does not overwrite an existing legacy file. |
| `persistProjectSetupArtifacts()` | Writes `sources-registry.json` after setup save. |
| `setProjectSourceOfTruth()` | Writes `sources-registry.json` for source add/update. |
| `removeProjectSourceOfTruth()` | Writes `sources-registry.json` for source delete. |

### What Triggers The Mismatch Warning

There are two warning paths.

1. `readCanonicalJsonWithLegacyFallback()`
   - Trigger: canonical exists, legacy exists, and `stableJsonHash(normalize(canonical)) !== stableJsonHash(normalize(legacy))`.
   - For source-of-truth, current `normalize` is `buildSourceOfTruthRegistry`.
   - Risk: `buildSourceOfTruthRegistry()` currently creates a fresh top-level `updated_at` value. That makes comparison volatile and means data-only regeneration may not fully suppress warnings.

2. `reviewProjectCanonicalParity()`
   - Trigger: canonical exists, legacy exists, and normalized canonical source map hash differs from normalized legacy source map hash.
   - For Hairoticmen, this is currently true because the six source entries have different `updated_at` values.

## 4. Frontend Expectations

### Setup Page

Frontend files:

- `public/control-center/pages/setup.js`
- `public/control-center/api.js`

Observed expectation:

- Setup renders from backend-projected `overview`, `readiness`, `integrations`, and `assets` state.
- Setup does not directly read either JSON registry file.
- Save Setup calls `saveProjectSetup()` in `api.js`, which POSTs to `/media-manager/project/:project/setup`.
- Backend `updateProjectSetup()` persists the project record, then `persistProjectSetupArtifacts()` updates source-of-truth artifacts.
- Setup expects backend reload to update readiness, connector gaps, and source truth state after save.

Migration implication:

- Do not change Setup page API shape.
- Keep setup save behavior compatible.
- Backend should write canonical first and expose frontend-friendly projections after reload.

### Home Readiness

Frontend file:

- `public/control-center/pages/home.js`

Observed expectation:

- Home uses `integrations.readiness.checks` for connector coverage.
- Home source-of-truth system health counts asset records with `source_of_truth` or `use_as_source_of_truth`.
- Home does not directly consume `source-of-truth-registry.json`.

Migration implication:

- Preserve backend readiness projection fields.
- Because connector readiness currently reads legacy, backend must not remove legacy read/projection until all readiness consumers are canonicalized.

### Publishing Readiness

Frontend file:

- `public/control-center/pages/publishing.js`

Observed expectation:

- Publishing builds channels from `state.data.integrations.readiness.checks`, queue channels, and defaults.
- Channel readiness labels are based on those backend-projected checks.
- Publishing does not directly read either registry file.

Migration implication:

- Preserve `integrations.readiness.checks`.
- Canonicalization must not regress channel readiness for `instagram`, `facebook`, `tiktok`, `youtube`, `email`, or `website`.

### AI Command Source/Tool Usage

Frontend files:

- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

Observed expectation:

- The tool dock references source types such as `source_of_truth_assets`.
- It formats asset-level `source_of_truth` flags.
- No direct registry file read was found in the frontend evidence reviewed.

Migration implication:

- Preserve asset-level source-of-truth flags and library payloads.
- No frontend migration is recommended unless browser QA finds a projected payload regression.

## 5. Recommended Solution

Choose Option A: canonical-first migration plus legacy regeneration.

Recommended target state:

- `source-of-truth-registry.json` is the backend authority.
- `sources-registry.json` remains as a generated compatibility projection.
- All backend reads for source completeness and connector readiness should use canonical first, with legacy fallback only when canonical is absent or invalid.
- All backend writes should write canonical first, then regenerate legacy from canonical `sources`.
- Parity checks should compare canonical `sources` to the flat legacy projection, not compare volatile wrapper metadata.

Why not Option B, deprecate legacy read:

- Evidence proves active backend readiness paths still read `sources-registry.json`.
- Home and Publishing consume projections that depend on those readiness paths.
- Removing legacy reads now risks frontend readiness regressions.

Why not Option C, formal migration debt acceptance:

- Release docs classify the warning as blocking unless accepted.
- The warning is repeated, release-visible operational noise.
- The implementation path is narrow and can preserve backward compatibility.

Option C is acceptable only if a release owner explicitly records owner, date, reason, and rollback criteria.

## 6. Exact Implementation Plan

### Files To Modify

Backend:

- `runtime/orchestrator-service/server.js`

Recommended helper changes:

- Add a deterministic source registry extractor, for example `extractSourceRegistryEntries(value)`, that returns only the flat source map.
- Add a deterministic canonical builder, for example `buildSourceOfTruthRegistry(sources, options = {})`, where `updated_at` can be supplied or preserved from existing canonical data instead of always using `new Date().toISOString()` during comparisons.
- Add a source registry read helper, for example `readProjectSourceOfTruthRegistry(projectName)`, that reads canonical first and falls back to legacy.
- Add a source registry write helper, for example `writeProjectSourceOfTruthRegistries(projectName, canonicalRegistry)`, that writes canonical and then writes legacy as `canonicalRegistry.sources`.

Recommended behavior changes:

- In `ensureProjectBaselineFiles()`, stop using a volatile builder as the comparison normalizer for source-of-truth. Compare canonical `sources` to legacy flat sources.
- In `persistProjectSetupArtifacts()`, read current sources from canonical first, merge setup payload additions, write canonical, then regenerate legacy from canonical.
- In `setProjectSourceOfTruth()` and `removeProjectSourceOfTruth()`, mutate canonical source entries first and regenerate legacy.
- In `reviewProjectReadiness()` and `reviewProjectConnectorReadiness()`, read canonical source entries first, with legacy fallback.
- In `reviewProjectSources()`, keep the existing response shape, but populate `sources` from the canonical projection and `source_of_truth_registry` from canonical.
- In `reviewProjectCanonicalParity()`, compare only canonical source entries to legacy source entries for `source_of_truth_registry`.

Migration/verification script:

- Add `scripts/migrate-source-of-truth-registry.js` or an equivalent reviewed migration command.
- The script should support dry-run by default and require an explicit flag such as `--write`.
- It should emit a conflict report and exit nonzero if canonical and legacy disagree on non-empty source values.

Tests/proof:

- Extend `scripts/verify-multi-project-readiness.js` or add `scripts/verify-source-of-truth-migration.js` to assert canonical-first read behavior, regenerated legacy parity, and no new parity warning for a smoke project.

### Files To Not Modify

Do not modify these unless later evidence proves a frontend projection bug:

- `public/control-center/pages/setup.js`
- `public/control-center/api.js`
- `public/control-center/pages/home.js`
- `public/control-center/pages/publishing.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/ai-command/tool-dock.js`

Do not modify:

- service configuration
- existing source-of-truth audit files
- unrelated project data
- frontend visual/layout code

Do not delete:

- `data/projects/hairoticmen/sources-registry.json`

### Data Files To Backup

Before any write migration, back up:

- `data/projects/hairoticmen/source-of-truth-registry.json`
- `data/projects/hairoticmen/sources-registry.json`
- `data/projects/hairoticmen/ops/data-mismatches.json` if present

Recommended backup destination:

- `audits/release/source-of-truth-mismatch/backups/<UTC_TIMESTAMP>/`

### Migration Logic

Dry-run first:

1. Read canonical wrapper and legacy flat registry.
2. Extract `canonicalSources = canonical.sources`.
3. Extract `legacySources = legacy`.
4. For each source key:
   - If key exists only in canonical, keep canonical.
   - If key exists only in legacy, add it to canonical with its existing fields.
   - If key exists in both and values/statuses agree, keep canonical metadata unless canonical fields are blank.
   - If key exists in both and non-empty values conflict, stop and write a conflict report. Do not write data.
5. Rebuild `required_sources` from the merged source map.
6. Set canonical top-level `updated_at` to the migration timestamp only if the canonical payload actually changes.
7. Write canonical.
8. Regenerate legacy as the exact flat projection of canonical `sources`.
9. Re-run parity check and fail if canonical `sources` and legacy flat projection differ.

Expected Hairoticmen result:

- Keep canonical source timestamps from `2026-05-14T20:57:39.831Z` for the six existing channels.
- Regenerate legacy source entries from canonical so source-entry timestamps match.
- Preserve `required_sources`.
- Preserve backward-compatible flat legacy file.

### Validation Commands

Syntax:

```bash
node --check runtime/orchestrator-service/server.js

Dry-run migration:

node scripts/migrate-source-of-truth-registry.js --project hairoticmen --dry-run

Write migration, only after backup and code review:

node scripts/migrate-source-of-truth-registry.js --project hairoticmen --write

Smoke proof:

ALLOW_MUTATING_TESTS=1 MH_KEEP_MULTI_PROJECT=0 node scripts/verify-multi-project-readiness.js

Health and readiness:

curl -fsS http://127.0.0.1:3000/health
curl -fsS http://127.0.0.1:3000/readyz

Setup/control-center read path:

curl -fsS http://127.0.0.1:3000/media-manager/project/hairoticmen >/tmp/hairoticmen-project-payload.json
node --input-type=module -e "import fs from 'node:fs'; const p=JSON.parse(fs.readFileSync('/tmp/hairoticmen-project-payload.json','utf8')); if (!p.overview || !p.readiness || !p.connectors) process.exit(1); console.log({project:p.project, overview:!!p.overview, readiness:!!p.readiness, connectors:!!p.connectors});"

Source parity:

node --input-type=module -e "import fs from 'node:fs'; const c=JSON.parse(fs.readFileSync('data/projects/hairoticmen/source-of-truth-registry.json','utf8')); const l=JSON.parse(fs.readFileSync('data/projects/hairoticmen/sources-registry.json','utf8')); const cs=JSON.stringify(c.sources||{}); const ls=JSON.stringify(l||{}); if (cs!==ls) { console.error('source projection mismatch'); process.exit(1); } console.log('source projection parity ok');"

Warning check after triggering setup/control-center read:

CHECK_TS="$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"
curl -fsS http://127.0.0.1:3000/media-manager/project/hairoticmen >/tmp/hairoticmen-project-payload.json
CHECK_TS="$CHECK_TS" node --input-type=module -e "import fs from 'node:fs'; const marker=process.env.CHECK_TS; const path='data/projects/hairoticmen/ops/data-mismatches.json'; const items=fs.existsSync(path)?JSON.parse(fs.readFileSync(path,'utf8')):[]; const recent=items.filter(x => String(x.timestamp||'') >= marker && String(x.project||'') === 'hairoticmen' && /source/.test(String(x.domain||''))); if (recent.length) { console.error(JSON.stringify(recent, null, 2)); process.exit(1); } console.log('no recent source mismatch warnings');"
7. Risk Analysis

Primary risks:

Legacy is still a live backend compatibility surface. Deleting or ignoring it can break connector readiness and publishing channel readiness.
Data-only migration may not stop warnings because buildSourceOfTruthRegistry() currently injects volatile top-level updated_at values.
Changing readiness to canonical-first can alter readiness scores if canonical and legacy diverge on required source groups.
Setup save, integration sync, and source add/remove must continue to write both representations.
Smoke tests that create projects are mutating and must run only with explicit ALLOW_MUTATING_TESTS=1.

Mitigations:

Preserve legacy as generated projection.
Make comparison deterministic before migration.
Stop on value conflicts.
Back up data before write migration.
Keep frontend API shape unchanged.
Validate Home, Setup, Publishing, and AI Command through browser QA.
8. Safety Gates

Do not proceed to write migration unless all gates pass:

Backup commit exists and contains the pre-migration canonical, legacy, and mismatch log backup.
Code review confirms canonical-first helpers preserve legacy fallback.
Dry-run reports no non-empty source value conflicts.
node --check runtime/orchestrator-service/server.js passes.
Smoke proof passes.
/health and /readyz pass.
/media-manager/project/hairoticmen returns overview, readiness, and connectors.
Source projection parity passes.
Recent warning check shows no new source mismatch warning after a setup/control-center read.
Rollback commands have been tested against the backup path in a non-production shell.
9. Post-Migration Checks

Required checks:

node --check runtime/orchestrator-service/server.js
/health
/readyz
setup/control-center endpoint read: GET /media-manager/project/hairoticmen
source mismatch warning check using data/projects/hairoticmen/ops/data-mismatches.json after a timestamp marker

Expected post-migration state:

Canonical file remains wrapped and contains sources plus required_sources.
Legacy file remains flat and exactly matches canonical sources.
No new project_data_mismatch entries for Hairoticmen source-of-truth after endpoint read.
Setup, Home, and Publishing consume unchanged backend projection shapes.
10. Browser QA Checklist

Use Hairoticmen in Control Center.

Home loads with no console errors.
Home system health still shows asset source-of-truth status from asset records.
Setup loads current project values.
Setup readiness summary, missing fields, missing assets, and missing connectors render.
Setup Save is tested only on staging or an approved QA window; after save, canonical and legacy remain in parity.
Integrations/Connectors readiness shows the same connected channels as before migration.
Publishing loads and channel readiness labels still mark connected channels as ready.
AI Command opens from Setup context.
AI Command tool dock still lists source options including source-of-truth assets.
No browser network request returns 4xx/5xx for project, readiness, assets, connectors, or operations payloads.
11. Commit Plan

Use separate commits.

Backup commit
Add backup copies under audits/release/source-of-truth-mismatch/backups/<UTC_TIMESTAMP>/.
No code changes.
No migrated data changes.
Code commit
Modify runtime/orchestrator-service/server.js.
Add or update migration/verification script.
Add deterministic comparison and canonical-first read/write helpers.
No Hairoticmen data changes.
Data migration commit
Update only data/projects/hairoticmen/source-of-truth-registry.json and data/projects/hairoticmen/sources-registry.json.
Regenerate legacy from canonical.
Do not delete legacy.
Proof commit, if release process requires committed evidence
Add post-migration command output under the release audit evidence directory.
No code or data changes.
12. Clear Recommendation

Implement now, before final release approval, using Option A.

Do not defer unless a release owner formally accepts the mismatch as migration debt with owner, date, and rollback criteria. More evidence is not required to choose the direction; the remaining work is implementation, backup, validation, and browser QA.
