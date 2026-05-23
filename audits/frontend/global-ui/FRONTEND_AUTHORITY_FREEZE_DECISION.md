# FRONTEND AUTHORITY FREEZE DECISION

## 1. Purpose

To establish a stable, enforceable baseline for the MH-OS frontend visual system prior to primitive extraction and page transformations. This freeze ensures all design authority is clear, prevents further CSS drift, and enables safe, professional modernization.

## 2. Current Stable Baseline

The following files are considered the stable baseline for global UI authority (see audit for details):
- 00-tokens.css
- 03-app-shell.css
- 08-components-foundation.css
- 10-topbar-canonical.css
- 12-pages.css
- 13-home-executive.css
- 14-page-standard.css
- 15-clean-operating-layer.css
- 09-operations-centers.css

## 3. Frozen Layers

- 00-tokens.css (tokens only, no new tokens without review)
- 15-clean-operating-layer.css (no new page-specific additions; only approved micro-passes)
- 12-pages.css (fully frozen; no new design work or selectors)
- 13-home-executive.css (frozen except for deduplication with foundation)
- 09-operations-centers.css (frozen except for migration to standard shell)

## 4. Editable Layers

- 03-app-shell.css (shell layout only)
- 10-topbar-canonical.css (topbar only)
- 14-page-standard.css (shared page headers/context only)
- 08-components-foundation.css (generic buttons/forms/cards, until primitives are extracted)

## 5. Do-Not-Touch Layers

- integrations/*.css (do not add or edit; remove only after migration)
- 12-pages.css (no edits except critical bugfixes)
- Any legacy CSS not listed as editable above

## 6. CSS Authority Rules

- 00-tokens.css is the **only** source of truth for tokens (color, typography, spacing, motion)
- 03-app-shell.css owns only shell layout and viewport
- 10-topbar-canonical.css owns only the topbar
- 14-page-standard.css owns only shared page headers/context
- 08-components-foundation.css owns generic buttons/forms/cards until primitive extraction
- 15-clean-operating-layer.css is frozen for new page-specific additions (micro-passes require explicit approval)
- 12-pages.css is frozen and must not receive new design work
- No new selectors or overrides in frozen layers
- No global CSS changes without explicit authority rationale

## 7. Page Transformation Rules

- All page transformations must use shared primitives, not ad hoc selectors
- DOM refactors must adopt shared primitives and tokens
- No page-specific CSS unless approved as a micro-pass
- No transformation may proceed without authority review

## 8. Primitive Extraction Rules

- Primitives must be extracted from 08-components-foundation.css and 15-clean-operating-layer.css only
- All new primitives must use tokens from 00-tokens.css
- No duplicate or page-specific primitives allowed
- Extraction must be reviewed and documented before adoption

## 9. Legacy CSS Policy

- Legacy CSS (12-pages.css, legacy selectors in other files) is frozen
- No new design work, selectors, or overrides in legacy files
- Legacy CSS may only be deleted after full migration and visual validation

## 10. Commit Policy

- One commit per page transformation or primitive extraction
- No batch commits spanning multiple authority layers
- All commits must reference the authority freeze decision
- No CSS deletion before replacement and validation

## 11. Validation Policy

- All changes must be visually validated on all target pages
- Use `git status --short` and `git diff --stat` to confirm scope
- Visual regression tools must be used if available
- No changes may be merged without review

## 12. Rollback Policy

- If a transformation or extraction causes regressions, revert to the last stable commit
- Authority freeze must be re-applied after rollback
- Document all rollbacks and rationale

## 13. Success Criteria

- No new CSS duplication or selector drift
- All pages use shared primitives and tokens
- No unauthorized changes to frozen layers
- Visual consistency and authority are maintained throughout transformation
- Safe, professional modernization of the MH-OS frontend
