# Backend Route Inventory Summary

Date: 2026-05-11

Branch: `architecture/frontend-consolidation-v1`

## Baseline

This phase was audit-first and documentation-only. No route was removed, renamed, or changed.

Inspected:

- `runtime/orchestrator-service/server.js`
- `public/control-center/api.js`
- `public/control-center/pages/*.js`
- Relevant frontend shell probes in `public/control-center/app.js`
- `runtime/orchestrator-service/package.json`
- Relevant scripts in `scripts/*`

## Counts

Explicit Express route registrations counted: 196.

| Classification | Count |
| --- | ---: |
| `canonical_project_scoped` | 16 |
| `public_project_scoped` | 71 |
| `legacy_generic` | 5 |
| `execution_bridge` | 4 |
| `scheduler_runtime` | 3 |
| `product_legacy` | 10 |
| `media_legacy` | 5 |
| `integration_runtime` | 7 |
| `ai_runtime` | 13 |
| `operations_runtime` | 49 |
| `internal_or_script` | 13 |
| `unknown_usage` | 0 |

## Main Findings

- Current frontend usage is concentrated on canonical non-public `/media-manager/project/:project/...` routes plus `/api/insights/:project`, `/api/learning/:project`, `/api/media/*`, `/media/upload`, and `/media/file/:project/:type/:filename`.
- `/public/media-manager/...` and `/public/api/...` aliases are present and protected, but direct frontend usage was not found in this branch.
- Legacy generic, product, and media routes remain registered. Several are protected by legacy write/read key patterns, and product publishing mutations also call `assertPublishingMutationAllowed`.
- Scheduler and execution bridge routes are used by scheduler helpers or scripts, but they sit outside the protected read/write key middleware patterns and should be bridged carefully before any future consolidation.
- No `unknown_usage` classification was needed for route purpose, but many rows are marked `not found` for direct frontend usage and should be investigated before deprecation.

## Guardrails Confirmed

- Protected write middleware remains mounted at `runtime/orchestrator-service/server.js:252`.
- Protected read middleware remains mounted at `runtime/orchestrator-service/server.js:312`.
- Project slug validation remains mounted at `runtime/orchestrator-service/server.js:809`, `runtime/orchestrator-service/server.js:811`, and `runtime/orchestrator-service/server.js:842`.
- Publishing guardrail `assertPublishingMutationAllowed` remains defined at `runtime/orchestrator-service/server.js:13553` and is called by publishing/product publish paths.

## Risks

- High: publishing and product publish/replace/rollback routes carry operational authority.
- Medium: public aliases are currently compatibility surfaces, not directly observed frontend dependencies.
- Medium: scheduler/execution bridge and `/api/media/*` routes are active runtime surfaces but are not matched by the centralized key middleware patterns.
- Medium: unused detail-read routes need access-log or caller investigation before any deprecation decision.

## Suggested Next Step

Use this inventory as the baseline for Backend Phase 2: define canonical route ownership and bridge strategy without changing route behavior, response shapes, auth behavior, slug validation, publishing guardrails, or durable status models.
