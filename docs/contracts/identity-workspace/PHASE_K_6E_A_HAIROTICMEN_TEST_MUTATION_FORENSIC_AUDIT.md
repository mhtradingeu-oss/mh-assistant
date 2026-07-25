# PHASE K-6E-A — HairoticMen Test-Mutation Forensic Audit

## 1. Executive finding

K-6E-A is complete as an audit-only phase. All seven affected files are
identified and their write producers are mapped. The earlier attribution to the
optional general `npm test` was too strong.

The general test logged its campaign-finalization failure at approximately
`2026-07-24T09:44:14Z`. The seven-file write sequence began at
`09:44:19.715Z`. A separate `node server.js` process had been running against
the repository production root since `2026-07-23T02:17:13+0200`. The evidence
strongly maps the later writes to Control Center startup and optional
insights/learning GET requests handled by that process.

The exact HTTP client or user action is not recorded, so the triggering client
is unknown. The producer functions and target derivations are known.

Only the telemetry log has a CERTAIN byte-exact pre-incident candidate. Six JSON
files lack captured baseline bytes. Automatic full recovery is unsafe and owner
review is required.

## 2. Incident timeline

| Time | Evidence |
| --- | --- |
| `2026-07-24T09:40:31Z` | K-6D baseline: `data/` hash `b6b6cf...e77ef`; HairoticMen hash `006a73...49e5` |
| `09:44:13.837Z` | General test output begins its final read-only fixture checks |
| `09:44:14.047Z` | Launch-wave verifier reads HairoticMen |
| `09:44:14.255Z` | Campaign-finalization verifier performs telemetry-disabled reads and fails readiness |
| `09:44:19.715Z` | First post-baseline mismatch entry appears |
| `09:44:20.336Z–09:44:20.337Z` | First publishing/execution-results telemetry pair |
| `09:44:21.517Z–09:44:21.779Z` | Latest migration report rotations |
| `09:44:21.916Z–09:44:21.917Z` | Second telemetry pair |
| `09:44:25.905Z–09:44:25.973Z` | Final mismatch/registry rotations, consistent with delayed optional insights/learning loads |
| K-6D final | `data/` hash `a58a4a...58181`; HairoticMen hash `eb9e1e...cfe06` |

The long-running server was confirmed read-only through process inspection:

```text
PID 78305
command: node server.js
cwd: runtime/orchestrator-service
started: 2026-07-23T02:17:13+0200
listener: TCP port 3000
```

No server access log preserving the requesting client was found.

## 3. Triggering command

The K-6D command was:

```text
npm --prefix runtime/orchestrator-service test
```

Its script chain was:

```text
npm test
  -> npm run verify:read-only
  -> node --check server.js
  -> verify-ai-marketing-engine.js
  -> verify-control-center-ui.js
  -> verify-launch-wave-selection.js
  -> verify-campaign-finalization-readiness.js
  -> verify-semi-auto-dry-run-readiness.js
```

The chain stopped at campaign-finalization. Both server-importing verification
scripts set `MH_DISABLE_READ_TELEMETRY=1`, and the logged test process emitted
its final relevant event before the seven-file write sequence began. No test in
that chain calls `reviewProjectReadiness` or
`reviewProjectCanonicalParity`.

Therefore the exact triggering *test* is **not identified because repository
evidence does not show a test as the writer**. The strongly supported trigger
is two GET startup loads on the already-running server, followed by delayed
optional GETs. The precise browser tab, client process, or manual action remains
unknown.

## 4. Exact seven affected paths

All are files, Git-ignored by `data/`, and not tracked by Git.

| # | Repository-relative path | Current SHA-256 | Bytes | Current mtime |
| --- | --- | --- | ---: | --- |
| 1 | `data/execution/projects/hairoticmen/telemetry/read-redirection-log.jsonl` | `0b821b5b3acfa2a6e4fa2f1af7677a30d3324963739992b9407b4ad27bbdb4a8` | 935572 | `2026-07-24T11:44:21+0200` |
| 2 | `data/projects/hairoticmen/integrations-registry.json` | `da53ba8b5a7633de377d176edb71b1e3b385c79f6a5db4507991e65fd3b6269f` | 2572 | `2026-07-24T11:44:25+0200` |
| 3 | `data/projects/hairoticmen/integrations-registry.json.backup` | `da53ba8b5a7633de377d176edb71b1e3b385c79f6a5db4507991e65fd3b6269f` | 2572 | `2026-07-24T11:44:25+0200` |
| 4 | `data/projects/hairoticmen/ops/data-mismatches.json` | `58cd3f5d7bfacd31506785eb7393c2d72713bbf0b286b7743385f51ae8647c6a` | 121002 | `2026-07-24T11:44:25+0200` |
| 5 | `data/projects/hairoticmen/ops/data-mismatches.json.backup` | `a417b01f20951bd83c209654bca65e804c4328a6de3f72e5ab6588a19a526310` | 121002 | `2026-07-24T11:44:25+0200` |
| 6 | `data/projects/hairoticmen/reports/canonical-migration-report.json` | `ac7942faa2886b1e840b19535c3d354eaea8b107c239a811ff3ef2a15aa9eca3` | 1648 | `2026-07-24T11:44:21+0200` |
| 7 | `data/projects/hairoticmen/reports/canonical-migration-report.json.backup` | `213b405e348b76afd80172802352444a9971bbfe6e14d0f1777b2b6c28653641` | 1648 | `2026-07-24T11:44:21+0200` |

## 5. Before/after hash evidence

| Scope | K-6D baseline | Post-incident / K-6E-A start |
| --- | --- | --- |
| `data/` | `b6b6cf0284858a704733d95fac26f2acb6c3b0ae7e613a1d7999f026902e77ef` | `a58a4a3c1357dc0c529f6f41a610db205c415f0e77020b877d5bf63009458181` |
| HairoticMen subtree | `006a7342dedf65d09cced27d34465d625e62c1e3e563ac063701148cf04549e5` | `eb9e1ea27493852b93f64ee1ba5f827307e9aa0ab53525297313da4b9e7cfe06` |
| `.mh-audit/` | `04aff2303cc0ad4c7a449bb5a7ff932ef79485a5cab0a80b2a9b6716a1cdba40` | identical |
| tracked diff | `9b73a93f25b3301390e21e6f5b10801b223bd8722c5c55977bec7f178d9be75f` | identical |

K-6D retained only whole-tree hashes and Git/untracked manifests. Because
`data/` is ignored, those Git manifests do not contain per-file baseline
hashes.

## 6. Path-by-path mutation classification

| Path | Classification | Write mode | Content effect |
| --- | --- | --- | --- |
| telemetry log | B + E: existing ignored/untracked generated telemetry | `appendFileSync` | Four complete JSONL records appended |
| integrations registry | B + F: existing ignored/untracked generated registry | temporary file, backup copy, atomic rename | Rewritten from integration-control-center snapshot; current and backup bytes are equal |
| integrations backup | B + F | `copyFileSync` overwrite | Replaced by immediately preceding primary |
| mismatch report | B + G: existing ignored/untracked generated mismatch history | read, append, `slice(-200)`, backup copy, atomic rename | 80 post-baseline entries retained; an equal number of oldest entries were discarded by the 200-item cap |
| mismatch backup | B + G | `copyFileSync` overwrite on every primary write | Contains only the penultimate capped state |
| migration report | B + H: existing ignored/untracked generated migration report | backup copy, atomic rename | Generated timestamp changed; current structure reports zero mismatches/fallbacks |
| migration backup | B + H | `copyFileSync` overwrite | Contains only the penultimate generated report |

No affected path is a directory. These were semantic content writes, not
timestamp-only touches, although the registry's current bytes happen to equal
its current backup and the two latest migration reports differ only by
`generated_at`.

## 7. Producer/caller chains

### Telemetry log

```text
GET /media-manager/project/hairoticmen/startup
  -> buildMediaManagerProjectStartupPayload
  -> buildMediaManagerProjectPayload
  -> buildProjectControlCenterActivity
  -> reviewScheduledJobs / listExecutionResults
  -> resolveExecutionReadCandidate
  -> writeReadRedirectionTelemetry
  -> fs.appendFileSync(read-redirection-log.jsonl)
```

The four appended records form two exact publishing/execution-results pairs,
strong evidence for two startup payload builds.

### Registry and mismatch files

```text
GET startup/readiness/insights/learning path
  -> reviewProjectReadiness or getProjectIntegrationPaths
  -> ensureProjectBaselineFiles
  -> readCanonicalJsonWithLegacyFallback
  -> logProjectDataMismatch
  -> writeJsonFile(data-mismatches.json)
  -> writeJsonFile(integrations-registry.json)
  -> write temp
  -> copy current to .backup
  -> atomic rename temp to primary
```

`data-mismatches.json` contains 80 retained entries after the K-6D baseline,
all for `source-of-truth` with
`canonical_legacy_value_mismatch`. The primary has 200 entries and the backup
has the immediately preceding 200-entry window.

### Migration reports

```text
GET /media-manager/project/hairoticmen/startup
  -> buildMediaManagerProjectPayload
  -> buildProjectControlCenterOverview / Readiness
  -> reviewProjectDashboard
  -> reviewProjectReadiness
  -> reviewProjectCanonicalParity
  -> writeJsonFile(canonical-migration-report.json)
  -> backup copy + atomic rename
```

### Delayed optional callers

The Control Center's `fetchAllCoreProjectData` calls the startup endpoint and,
after a 750 ms delay, calls:

```text
GET /api/insights/hairoticmen
GET /api/learning/hairoticmen
  -> getProjectInsightsEnginePayload / getProjectLearningEnginePayload
  -> getProjectIntegrationPaths
  -> ensureProjectBaselineFiles
```

This matches the final registry/mismatch writes at `09:44:25Z`, after the
startup telemetry/report writes.

## 8. Baseline evidence

| Path | Existed before incident | Exact baseline source | Exact bytes recoverable | Confidence |
| --- | --- | --- | --- | --- |
| telemetry log | YES | Current prefix through line 964; all later lines timestamp after K-6D baseline | YES: 931706 bytes, SHA-256 `70661efca875c5804111e2c57fbd6f0674180a65d58decf7ac5cdbca61614b08` | CERTAIN |
| integrations registry | YES | No captured K-6D bytes; current equals current backup and durable source has old July 6 timestamps | NO | STRONG existence; PARTIAL bytes |
| integrations backup | YES | Birth time July 3; no captured K-6D bytes | NO | CERTAIN existence; UNKNOWN bytes |
| mismatch report | YES | K-6D whole-tree hash only; current rolling window has already discarded old entries | NO | STRONG existence; UNKNOWN bytes |
| mismatch backup | YES | Birth time July 3; current is only penultimate post-incident state | NO | CERTAIN existence; UNKNOWN bytes |
| migration report | YES | K-6D whole-tree hash only; current generated timestamp is post-incident | NO | STRONG existence; UNKNOWN bytes |
| migration backup | YES | Birth time July 3; current is only penultimate post-incident state | NO | CERTAIN existence; UNKNOWN bytes |

No matching HairoticMen copies were found in Git, `.mh-audit/`, repository
snapshots, prior phase temporary directories, or local Time Machine snapshots.
Git HEAD is not a source because all seven paths are ignored and untracked.

## 9. Pre-existing work assessment

All seven paths predate the incident or are backed by pre-incident filesystem
existence evidence. None may be deleted as a newly created artifact.

The telemetry prefix is recoverable. For the remaining files, the lack of
baseline bytes means:

- deletion could lose pre-existing operational state;
- Git restoration is unavailable and unsafe;
- current `.backup` files are rotating penultimate states, not K-6D baselines;
- regeneration would produce new timestamps and/or new rolling windows;
- accepting current content would be a policy decision, not restoration.

Whether any of the generated records constitute user-owned operational work is
unknown. Automatic full recovery is unsafe.

## 10. Content differences

### Telemetry

Four JSONL records totaling 3866 bytes were appended:

- publishing and execution-results at `09:44:20.336Z/337Z`;
- publishing and execution-results at `09:44:21.916Z/917Z`.

### Registry

The current registry and current backup are byte-identical. Both retain July 6
semantic timestamps. This proves the latest rewrite was idempotent relative to
its immediately preceding state, but does not prove equality to the K-6D
baseline.

### Mismatch history

The current primary contains 200 records, including 80 post-baseline
source-of-truth mismatch entries. The backup contains 79 such entries. Because
the writer applies `slice(-200)` after every append, older pre-incident entries
were irreversibly shifted out of both live files.

### Migration report

Current and backup both report zero canonical mismatches and zero fallback
dependencies. Their only raw difference is:

```text
backup generated_at = 2026-07-24T09:44:21.517Z
current generated_at = 2026-07-24T09:44:21.779Z
```

Neither timestamp is the K-6D baseline.

Read-only raw and parsed comparisons were stored only in the external K-6E-A
temporary evidence directory.

## 11. Recovery feasibility matrix

| Path | Exact baseline | Pre-existing work risk | Safe K-6E-B action | Risk | Confidence |
| --- | --- | --- | --- | --- | --- |
| telemetry log | YES | Low for the four proven incident lines; prefix preserved | Restore exact 964-line candidate after quiescing writers | Concurrent append or wrong current hash | CERTAIN |
| integrations registry | NO | UNKNOWN | No automatic write; owner decision | May discard unknown baseline bytes | PARTIAL |
| integrations backup | NO | UNKNOWN | No automatic write; owner decision | Rotating backup is not baseline | UNKNOWN |
| mismatch report | NO | UNKNOWN/HIGH | No automatic write; owner decision | Old capped records are missing | UNKNOWN |
| mismatch backup | NO | UNKNOWN/HIGH | No automatic write; owner decision | Penultimate incident state only | UNKNOWN |
| migration report | NO | UNKNOWN | No automatic write; owner decision | Regeneration is non-identical | UNKNOWN |
| migration backup | NO | UNKNOWN | No automatic write; owner decision | Penultimate incident state only | UNKNOWN |

Byte-exact recovery is therefore **PARTIAL**.

## 12. Exact proposed recovery plan

No recovery operation is authorized by K-6E-A. A future K-6E-B may execute only
after explicit owner approval.

### Mandatory precondition

1. Quiesce the exact long-running server process or otherwise prove no process
   can write the seven paths.
2. Recheck every current hash against section 4.
3. If any hash differs, stop and create a new forensic baseline.

### Only evidence-backed file operation

For
`data/execution/projects/hairoticmen/telemetry/read-redirection-log.jsonl`:

- source: an external temporary candidate reconstructed as the exact first 964
  lines of the unchanged current file;
- destination: the exact telemetry path above;
- expected pre-operation SHA-256:
  `0b821b5b3acfa2a6e4fa2f1af7677a30d3324963739992b9407b4ad27bbdb4a8`;
- expected restored SHA-256:
  `70661efca875c5804111e2c57fbd6f0674180a65d58decf7ac5cdbca61614b08`;
- expected restored size: 931706 bytes;
- command type: exact single-file byte replacement from verified external
  evidence, never a wildcard or directory operation;
- rollback evidence: preserve the current 935572-byte file externally before
  replacement;
- verification: restored file hash/size, valid JSON per line, unchanged hashes
  for the other six files, no Workspace/Approval mutation.

### Six paths with no authorized automatic operation

For each registry, mismatch, and migration primary/backup path:

- expected pre-operation hash: the exact section 4 hash;
- proposed action: **none** until the owner either supplies an exact baseline or
  explicitly accepts current bytes as the new operational baseline;
- regeneration, Git restore, copying the current backup over the primary, or
  deletion are not valid restoration methods.

## 13. Paths requiring owner decision

Owner decision is required for:

1. `data/projects/hairoticmen/integrations-registry.json`
2. `data/projects/hairoticmen/integrations-registry.json.backup`
3. `data/projects/hairoticmen/ops/data-mismatches.json`
4. `data/projects/hairoticmen/ops/data-mismatches.json.backup`
5. `data/projects/hairoticmen/reports/canonical-migration-report.json`
6. `data/projects/hairoticmen/reports/canonical-migration-report.json.backup`

The missing information is the exact K-6D baseline content for each file.

The owner must also decide whether the telemetry-only exact restoration should
proceed independently or whether all seven current files should be accepted as
a new baseline after the test-isolation defect is fixed.

## 14. Test-isolation defect

There are two distinct safety defects:

1. Nominal read-only production GETs are not pure. The startup/readiness,
   insights, and learning paths call functions that create directories,
   rewrite the integration registry, append capped mismatch history, generate a
   migration report, and append telemetry.
2. `verify:read-only` reads the real HairoticMen root. It sets
   `MH_DISABLE_READ_TELEMETRY` for two scripts but does not inject a temporary
   data root. `getProductIntelligencePaths` also contains missing-file
   initialization. `NODE_ENV=test` alone does not isolate storage.

K-6D additionally did not detect or quiesce the already-running server before
comparing production hashes. That allowed concurrent Control Center reads to be
misattributed to the general test.

No relevant teardown exists. Teardown that deletes or rewrites production data
would itself be unsafe.

After recovery, a separate narrow phase should:

- make readiness/startup GET composition pure or route generated observations
  to an explicitly authorized writer boundary;
- inject a temporary data/execution root into every read-only verifier;
- fail a verifier that resolves a production-root write target;
- detect active repository server processes before production hash baselines;
- avoid cleanup as a substitute for isolation.

No test or production code was changed in K-6E-A.

## 15. Why K-6D remains incomplete

K-6D's response-contract implementation and targeted tests passed, but its
mandatory final production-data equality check failed. K-6E-A explains the
failure but does not restore or accept the changed state. K-6D remains
incomplete.

## 16. Why K-6A-R2 remains blocked

K-6A-R2 requires an evidence-stable production baseline. Six affected files
lack exact pre-incident bytes and the active GET/readiness writer remains
unremediated. Recertification would not have a reliable no-mutation boundary.

## 17. Why K-7 remains blocked

No real Approval may be requested while K-6D is incomplete and K-6A-R2 has not
certified the reconciled chain. The incident did not create or decide an
Approval, execute K-5C apply, or create a Workspace.

## 18. Exact next gate

**OWNER REVIEW REQUIRED.**

The owner must choose one of:

- authorize a partial K-6E-B exact telemetry restoration and provide/locate
  baselines for the other six paths; or
- explicitly accept specified current files as the new production baseline,
  understanding that this is acceptance rather than byte restoration.

Only then may PHASE K-6E-B perform exact path-scoped operations. A separate
test-isolation remediation must follow before K-6D is rerun.
