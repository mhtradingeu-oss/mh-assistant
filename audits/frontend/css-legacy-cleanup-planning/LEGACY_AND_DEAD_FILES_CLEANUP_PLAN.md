# Legacy and Dead Files Cleanup Plan

## Scope
Plan-only classification for:
- Not-loaded legacy CSS/JS
- Empty CSS placeholders
- Empty frontend directories
- Placeholder folders and deferred cleanup eligibility

Evidence source:
- audits/frontend/css-legacy-cleanup-planning/CSS_LEGACY_EVIDENCE.txt

## 2) CSS not loaded inventory
### Legacy CSS (not linked by index.html)
- public/control-center/legacy/06-topbar.legacy.css
- public/control-center/legacy/09-command-legacy-isolation.legacy.css
- public/control-center/legacy/11-runtime-safety-overrides.legacy.css
- public/control-center/legacy/99-legacy-compat.legacy.css
- public/control-center/legacy/styles.legacy-20260508.css
- public/control-center/legacy/styles.legacy-full.css

Disposition now:
- Keep in place.
- Mark as compatibility archive.
- Do not relink.

## 3) Legacy JS inventory
- public/control-center/legacy/integrations.monolith-20260508.js
- public/control-center/legacy/page-standard.legacy-20260508.js

Reference status:
- Not script-loaded by index.html.
- Not found in active import/reference scan for legacy monolith/page-standard.legacy markers.

Disposition now:
- Keep for rollback evidence.
- Add explicit retirement conditions before any removal proposal.

## 5) Empty/placeholder files and folders
### 0-byte CSS placeholders
- public/control-center/styles/integrations/cards.css
- public/control-center/styles/integrations/drawer.css
- public/control-center/styles/integrations/forms.css
- public/control-center/styles/integrations/grid.css
- public/control-center/styles/integrations/layout.css
- public/control-center/styles/integrations/responsive.css

Current decision:
- Keep for now as planned structure placeholders.
- Candidate for deletion only after approval (Phase D).

### Empty frontend directories
- public/control-center/layouts
- public/control-center/pages-core
- public/control-center/runtime/command
- public/control-center/runtime/diagnostics
- public/control-center/runtime/layout
- public/control-center/runtime/shell
- public/control-center/runtime/state

Current decision:
- Keep as structural placeholders unless architecture owners approve flattening.
- Document intent/owner to reduce confusion.

## 7) Risk classification

| Group | Risk | Deletion risk | Load-order risk | Accidental relink risk | Visual regression risk | Route-specific leakage risk |
|---|---|---|---|---|---|---|
| Active loaded layered CSS (styles/00..14) | High | High | High | Medium | High | High |
| Legacy CSS in public/control-center/legacy | Medium | Medium | Low (while not linked) | High | High if relinked | Medium |
| Legacy JS in public/control-center/legacy | Medium | Medium | Low | Medium | Medium | Medium |
| styles/integrations 0-byte placeholders | Low | Low | Low | Low | Low | Low |
| Empty frontend directories | Low | Low | Low | Low | Low | Low |
| page-standard compatibility rules in 14-page-standard.css | High | High | High | N/A | High | High |
| operations-centers route-scoped CSS | High | High | Medium | Low | High | Medium |

Risk guidance:
- Do not treat "not loaded" as "safe to delete".
- Highest latent risk is accidental relinking of legacy assets and authority drift in page-standard.css.

## Safe-to-leave-now vs later-retire
### Safe to leave now
- Entire legacy folder, as long as it remains unlinked/unimported.
- 0-byte integration placeholders.
- Empty structural directories.

### Later retirement candidates (approval required)
- Legacy CSS snapshots after rollback artifacts and ownership sign-off.
- Legacy JS snapshots after active compatibility confidence period.
- 0-byte integration placeholders once folder strategy is finalized.

## Guardrails to enforce before any removal
1. Confirm file is not linked/imported in index/app/router/pages/ui scans.
2. Confirm no emergency rollback procedure depends on file path.
3. Confirm route-level visual baseline pass for impacted shells/pages.
4. Confirm explicit rollback note (what to restore, from where, and trigger).
