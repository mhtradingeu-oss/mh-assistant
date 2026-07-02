# CSS Duplication Matrix

## Scope
Selector overlap classification across:
- Active stack: public/control-center/styles/*.css (linked by index.html)
- Legacy stack: public/control-center/legacy/*.css (not linked)

Classification vocabulary used:
- Active canonical: primary ownership file in active stack
- Active overlap: class appears in multiple active files
- Legacy-only duplicate: duplicate exists only in legacy files beyond active canonical
- Safe for now: can remain during planning without behavior change
- Cleanup candidate: where to reduce ambiguity later

## 4) Duplicate selector audit

| Selector | Active canonical | Active overlap | Legacy-only duplicate | Safe for now | Cleanup candidate |
|---|---|---|---|---|---|
| .topbar | styles/10-topbar-canonical.css | Minor active cross-use in states/descendants | Yes (legacy/06-topbar.legacy.css, legacy/styles.legacy-full.css) | Yes (legacy not loaded) | Retire legacy topbar snapshots after rollback path |
| .sidebar | styles/07-sidebar.css | Yes (active references in styles/08, styles/09, styles/14) | Yes (legacy/11-runtime-safety-overrides.legacy.css, legacy/styles.legacy-full.css) | Yes | Reduce active cross-layer sidebar coupling; then retire legacy copies |
| .workspace | styles/03-app-shell.css | Yes (styles/14 interaction safety + minor refs in active files) | Yes (legacy/99-legacy-compat.legacy.css, legacy/styles.legacy-full.css) | Yes | Keep canonical in app-shell; trim compatibility-only workspace rules later |
| .page | styles/03-app-shell.css (display/lifecycle baseline) | High overlap (styles/12 + styles/14 + page-scope touches) | Yes (legacy/06 + legacy/styles.legacy-20260508.css + legacy/styles.legacy-full.css) | Medium | Split baseline vs page-specific responsibilities; reduce multi-file ownership |
| .std-page-shell | styles/14-page-standard.css | Low | Yes (legacy/styles.legacy-20260508.css, legacy/styles.legacy-full.css) | Yes | Keep until page-standard decomposition is approved |
| .ops-shell | styles/09-operations-centers.css | Low (route-scoped) | Yes (legacy/styles.legacy-20260508.css, legacy/styles.legacy-full.css) | Yes | Retire legacy ops copies after route parity checkpoint |
| .governance-shell | Active usage in pages/governance.js templates | No exact selector definition match in current styles scan | No exact match found in legacy scan | Medium | Add explicit canonical CSS ownership doc before touching governance classes |
| .settings | Settings class family exists in pages/settings.js templates | No exact `.settings` selector match in current styles scan | No exact `.settings` selector match in legacy scan | Medium | Map settings-* family ownership before cleanup; avoid assumptions |
| .library | Mixed authority: styles/12-pages.css and styles/14-page-standard.css | High overlap | Yes (legacy/styles.legacy-20260508.css, legacy/styles.legacy-full.css) | Medium | Highest cleanup target: split page-standard library blocks into page-owned layer |
| .command | styles/04-command-layer.css | Moderate overlap in styles/09 and styles/14 contexts | Yes (legacy/09-command-legacy-isolation.legacy.css, legacy/11..., legacy/styles.legacy-full.css) | Medium | Tighten command ownership to command-layer + minimal scoped adapters |
| .ai-dock | styles/05-ai-layer.css | Low/moderate overlap via safety selectors in styles/14 | Yes (legacy/99..., legacy/styles.legacy-full.css) | Yes | Remove compatibility duplicates after regression test gate |
| .loading-overlay | styles/02-layer-system.css | Low overlap in styles/14 interaction safety | Yes (legacy/11..., legacy/styles.legacy-full.css) | Yes | Keep overlay authority in layer-system only; trim extra safety copies later |
| .card | styles/08-components-foundation.css | High overlap (styles/09, styles/12, styles/14) | Yes (legacy/99..., legacy/styles.legacy-20260508.css, legacy/styles.legacy-full.css) | Medium | Define card baseline vs page-specific card variants contract |
| .btn | styles/08-components-foundation.css | High overlap (styles/09, styles/12, styles/13, styles/14) | Yes (legacy/99..., legacy/styles.legacy-20260508.css, legacy/styles.legacy-full.css) | Medium | Consolidate button baseline and keep route/page modifiers scoped |
| .grid | styles/08-components-foundation.css (utility/grid family) | Low/moderate overlap in active layout files | Yes (legacy/styles.legacy-full.css) | Yes | Audit grid utility naming and reserve generic `.grid` semantics |

## Notes on exact-match gaps
- Exact selectors `.governance-shell` and `.settings` were requested for duplication audit.
- Template usage exists for governance/settings class families in pages JS, but exact CSS selector ownership is not explicit in the currently loaded CSS set from the scan patterns.
- This is an authority documentation gap, not an immediate deletion target.

## Matrix conclusion
- Legacy duplicates are extensive but currently isolated by not being linked.
- Active overlap is highest around `.page`, `.library`, `.card`, `.btn`, and `.command`.
- Cleanup should prioritize authority clarity, not deletion speed.
