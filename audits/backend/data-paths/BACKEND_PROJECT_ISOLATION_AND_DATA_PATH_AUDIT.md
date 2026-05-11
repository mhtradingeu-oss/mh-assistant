# Backend Project Isolation and Data Path Audit

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Phase: Backend Phase 3 - Project Isolation and Data Path Authority
Mode: audit-only

## 1. Executive Summary

Compatibility verdict: compatible with current backend doctrine and security closeout baseline.

High-level outcome:
- Project slug and path containment guardrails are centralized and actively used.
- Core backend filesystem writes are project-scoped for runtime surfaces inspected.
- Canonical/legacy dual-root migration logic is present and mostly bounded by resolver controls.
- No obvious, unambiguous path traversal bug was found that warrants an immediate runtime patch in this pass.
- A small set of authority surfaces should remain flagged as needs_review (see Section 12).

Classification totals (function-level inventory):
- safe_project_scoped: 22
- safe_static: 6
- legacy_but_safe: 8
- needs_review: 4
- unsafe: 0

## 2. Path Authority Model

Authority model observed:
- Project identity authority: normalizeProjectSlug() in runtime/orchestrator-service/lib/security/project-isolation.js.
- Root containment authority: resolvePathWithinRoot(), resolveProjectPath(), isPathWithinRoot() in runtime/orchestrator-service/lib/security/project-isolation.js.
- Runtime storage domain authority: UnifiedDataPathResolver in runtime/orchestrator-service/lib/data/unified-data-path-resolver.js.
- Route boundary normalization: app.param('project'), raw path project segment validation, and optional body/query project normalization in runtime/orchestrator-service/server.js.

Data root tiers:
- Canonical project root: data/projects/<project>
- Canonical execution root: data/execution/projects/<project>
- Legacy root (migration compatibility): data/brand-assets/<project>

## 3. Project Slug Validation Summary

Validated guardrail behavior:
- normalizeProjectSlug rejects empty input, overlength values, traversal patterns, separators, and decoded traversal forms.
- resolveProjectPath and resolvePathWithinRoot enforce containment via path.resolve + path.relative checks.
- Route middleware validates both raw route project segments and normalized req.params.project / req.body.project / req.query.project.

Assessment:
- classification: safe_project_scoped
- risk: low
- recommendation: preserve current project-isolation module as canonical authority layer; continue requiring all new path code to route through it.

## 4. Resolver Usage Summary

UnifiedDataPathResolver usage is consistent for:
- generated, publishing, email, channels, campaign execution/finalization, execution config/results, german-launch, optimization domains.
- canonical-read and legacy-fallback behavior controlled by feature flags.
- root-kind telemetry tracks whether read/write selected project/execution/legacy roots.

Assessment:
- classification: legacy_but_safe
- risk: low
- recommendation: keep migration flags and telemetry until legacy mirror/fallback retirement is complete.

## 5. Filesystem Operation Inventory

| file | approx line/function | path source | project input source | guardrail used | classification | risk | recommendation |
|---|---|---|---|---|---|---|---|
| runtime/orchestrator-service/lib/security/project-isolation.js | normalizeProjectSlug (46+), resolvePathWithinRoot (82+), resolveProjectPath (93+) | path.resolve, path.relative | explicit project slug | traversal+separator rejection; root containment | safe_project_scoped | low | keep as required entry point for project paths |
| runtime/orchestrator-service/lib/data/unified-data-path-resolver.js | buildProjectRoots/pickRoots (149+, 197+, 249+) | path.join + resolveProjectPath | function arg projectName | normalizeProjectSlug + resolveProjectPath | safe_project_scoped | low | keep; continue telemetry-driven migration |
| runtime/orchestrator-service/lib/data/execution-artifact-writer-adapter.js | resolvePaths/writeDual (84+, 167+) | legacy path + derived canonical path | params.project | normalizeProjectSlug + resolvePathWithinRoot | safe_project_scoped | low | keep; this is the strongest write-path control |
| runtime/orchestrator-service/lib/ops/backbone.js | getOperationsPaths (768+) | projectRoot/ops/*.json | function arg projectName | normalizeProjectSlug + resolveProjectPath | safe_project_scoped | low | keep |
| runtime/orchestrator-service/lib/execution/scheduler-storage.js | getSchedulerFilePath/writeSchedulerAuditLog (21+, 37+) | data/projects/<project>/execution/* | function arg projectName | normalizeProjectSlug + resolveProjectPath | safe_project_scoped | low | keep |
| runtime/orchestrator-service/lib/integrations/storage.js | ensureDir/readJsonFile/writeJsonFile | caller-provided path | upstream-provided | atomic write temp+rename; no project logic in module | safe_static | low | keep as utility only; ensure callers pass bounded paths |
| runtime/orchestrator-service/lib/integrations/token-manager.js | KEY_PATH in data/system | static system path | none | static root under MH_ASSISTANT_ROOT | safe_static | low | keep |
| runtime/orchestrator-service/lib/integrations/sync-history.js | snapshots/<integrationId>.json | projectPaths.integrationsDir + integrationId filename | upstream project + integration id | upstream sanitizeIntegrationId in server integration flow | safe_project_scoped | low | keep; maintain sanitizeIntegrationId call sites |
| runtime/orchestrator-service/lib/integrations/audit-log.js | integrations/audit-log.json | projectPaths.integrationsDir | upstream project | upstream project path resolver | safe_project_scoped | low | keep |
| runtime/orchestrator-service/server.js | getProjectBasePaths/getProjectBaselinePaths (6102+, 6137+) | resolveProjectPath(data/projects, project) | route/project helper | normalizeProjectSlug + resolveProjectPath | safe_project_scoped | low | keep |
| runtime/orchestrator-service/server.js | validateRawProjectSlugPathSegment + app.param + validateOptionalProjectSlugFields (809+, 847+, 856+) | request-derived project fields | params/body/query/path segment | normalizeProjectSlug + invalid slug response | safe_project_scoped | low | keep |
| runtime/orchestrator-service/server.js | /generated-output/:project/:filename (12131+) | generated outputs file path | req.params.project/filename | normalizeProjectSlug + basename equality + resolver read candidate | safe_project_scoped | low | keep |
| runtime/orchestrator-service/server.js | /media/file/:project/:type/:filename with query path/assetId (9926+) | query path, registry path, type+filename | req.params.project + query | normalizeProjectSlug + allowed root containment + stat file checks | safe_project_scoped | low | keep |
| runtime/orchestrator-service/server.js | writeEmailArtifactArray / queue/email helpers (1400+, 1440+, 1460+) | canonical+legacy dual paths | project helper / queue fallback | resolver domain paths + controlled relative contracts | legacy_but_safe | medium | keep during migration; continue shrinking legacy write surfaces |
| runtime/orchestrator-service/server.js | getRenderOutputPaths/getGenerationOutputPaths/buildGenerationJob (4680+, 4882+, 4990+) | generated jobs/renders/outputs under domain roots | normalized project | resolver + execution artifact dual writer | legacy_but_safe | low | keep |
| runtime/orchestrator-service/server.js | appendAudit(DATA_DIR/audit.json) (5571+) | static data/audit.json | none | static root under BASE_DIR | safe_static | low | keep |
| runtime/orchestrator-service/server.js | renameMediaManagerProject (10030+) | project directory rename | req.params.project + body.project_name | normalizeProjectSlug + target existence checks | safe_project_scoped | low | keep |
| runtime/orchestrator-service/server.js | routeProjectAsset (9057+) | source path copied into routed project folder | command args projectName/assetType/source path | normalizeProjectSlug for destination; source path only existence check | needs_review | medium | constrain source path roots for this command surface |
| runtime/orchestrator-service/server.js | /telegram-command /route_project_asset command (19929+) | raw sourceFilePath argument | parsed command args | write-key + rate limit + routeProjectAsset checks | needs_review | medium | add optional allowlist root gate for host source path |
| runtime/orchestrator-service/server.js | requireQueueProjectName fallback (1451+) | project resolution fallback | missing/invalid project from caller | normalizeOptionalProjectSlug + preferred project fallback | needs_review | medium | retain for compatibility; continue planned fallback tightening phases |
| scripts/verify-controlled-semi-auto-dry-run.js and scripts/phase39-smoke-runner.js | test/verification data writes | data/projects and legacy mirrors | script constants/args | script-local controlled paths | legacy_but_safe | low | treat as non-runtime; avoid running in production |
| scripts/* verification readers (broad) | read-only checks and static file scans | workspace-static paths | script-local constants | no external path input | safe_static | low | keep |

## 6. Media/Upload Path Review

Reviewed surfaces:
- /media/upload destination + filename sanitization
- /media/file/:project/:type/:filename + query path/assetId resolution
- registry and source-of-truth media lookups

Findings:
- Upload destination derives from project-scoped catalog/legacy mapping, with project slug normalization.
- Uploaded filename is basename + strict sanitation before persistence.
- Query path reads are constrained by allowed media roots and root-containment checks.

Assessment:
- classification: safe_project_scoped
- risk: low
- recommendation: keep current allowed-root checks; do not relax query path checks.

## 7. Generated-Output Path Review

Reviewed surfaces:
- generated job/render/output path builders
- /generated-output/:project/:filename serving route
- generation and render status record writes

Findings:
- Generated artifact writes are routed through ExecutionArtifactWriterAdapter dual-write controls.
- Public output route validates project slug and enforces safe filename basename equality.

Assessment:
- classification: legacy_but_safe
- risk: low
- recommendation: keep dual-write and telemetry until migration complete.

## 8. Operations Backbone Storage Review

Reviewed surface:
- runtime/orchestrator-service/lib/ops/backbone.js getOperationsPaths + ensureOperationsFiles/write flows.

Findings:
- All ops JSON paths are rooted under resolveProjectPath(PROJECTS_DIR, project)/ops.
- Durable write/read helper usage is consistent with project-root authority.

Assessment:
- classification: safe_project_scoped
- risk: low
- recommendation: keep as-is.

## 9. Scheduler/Execution Storage Review

Reviewed surfaces:
- runtime/orchestrator-service/lib/execution/scheduler-storage.js
- execution bridge logging helper in server.js

Findings:
- scheduler.json and execution logs are resolved from project root using normalizeProjectSlug + resolveProjectPath.
- log filename components are sanitized timestamp/action strings.

Assessment:
- classification: safe_project_scoped
- risk: low
- recommendation: keep as-is.

## 10. Integration Storage Review

Reviewed surfaces:
- integration registry/control-center paths in server.js
- lib/integrations storage/audit/sync-history/token manager modules

Findings:
- Project integration roots derive from getProjectIntegrationPaths(project) under project baseline.
- integrationId is sanitized in server integration workflow before provider execution/snapshot writes.
- system key material path is fixed under data/system.

Assessment:
- classification: safe_project_scoped (runtime flow), safe_static (system key path)
- risk: low
- recommendation: keep sanitizeIntegrationId mandatory in all integration entry points.

## 11. Legacy Path Compatibility Review

Legacy compatibility surfaces observed:
- UnifiedDataPathResolver legacy fallback/mirror behavior.
- Email/generated/publishing helpers writing canonical + legacy-compatible artifacts.
- requireQueueProjectName default-project compatibility fallback.

Assessment:
- classification: legacy_but_safe
- risk: medium (authority ambiguity from fallback, not traversal)
- recommendation: continue migration path from fallback audit; keep telemetry evidence until hardening cutover.

## 12. Unsafe / Needs_Review List

Unsafe findings:
- none identified in this pass.

Needs_review findings:
1) routeProjectAsset source file authority
- file: runtime/orchestrator-service/server.js (routeProjectAsset, /route_project_asset command surface)
- issue: source file path can be any existing host file path; destination is safe project-scoped, but source authority is broad.
- classification: needs_review
- risk: medium
- recommendation: optional allowlist for source roots (for example project uploads roots only) before copyFile.

2) Telegram command bridge as broad authority surface
- file: runtime/orchestrator-service/server.js (/telegram-command command handlers)
- issue: command parser allows operational path actions via authenticated command channel.
- classification: needs_review
- risk: medium
- recommendation: keep protected middleware/rate-limit; add command-level allowlist policy for file-moving commands.

3) Queue/default project fallback in write-capable helper flows
- file: runtime/orchestrator-service/server.js (requireQueueProjectName)
- issue: missing explicit project can resolve to default project.
- classification: needs_review
- risk: medium
- recommendation: continue staged migration from LEGACY_DEFAULT_PROJECT_FALLBACK_AUDIT toward explicit project requirements for mutating flows.

4) Library-level integration snapshot filename helper relies on upstream sanitation
- file: runtime/orchestrator-service/lib/integrations/sync-history.js
- issue: integrationId file naming is not sanitized in-module; current safety depends on server sanitizeIntegrationId.
- classification: needs_review
- risk: low
- recommendation: optional defensive sanitize in module to reduce coupling risk.

## 13. Recommended Migration/Fix Plan

Phase A (no behavior change):
- Add audit telemetry tag for routeProjectAsset source path origin class (allowed/disallowed candidate root) without blocking.
- Add periodic report for fallback-project usage in write-capable paths.

Phase B (safe hardening, behavior-stable for normal use):
- Introduce source path allowlist gate for /route_project_asset command flow.
- Add defensive sanitizeIntegrationId in sync-history helper (non-breaking, additive defense).

Phase C (policy tightening per existing migration doctrine):
- Move write-capable default-project fallback flows to explicit-project required, using existing legacy fallback migration plan and staged compatibility signals.

## 14. No-Data-Mutation Confirmation

Confirmed:
- This audit pass is documentation-only.
- No runtime behavior was changed.
- No route shape/path was changed.
- No data/projects mutation was performed by this audit task.
