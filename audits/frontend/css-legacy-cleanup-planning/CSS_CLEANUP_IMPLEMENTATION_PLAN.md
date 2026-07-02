# CSS Cleanup Implementation Plan

## Doctrine and constraints
- Audit -> Confirm -> Decide -> Implement.
- Do not delete compatibility or legacy files without retirement plan + rollback.
- Do not relink legacy CSS.
- Do not redesign UI during cleanup planning.
- Active CSS authority must be documented before cleanup changes.

## 8) Phased retirement plan

### Phase A: Documentation only
Goal:
- Freeze current authority map and load order contract.

Actions:
- Publish canonical CSS ownership map (00..14 responsibilities).
- Publish selector duplication matrix with active-vs-legacy classification.
- Publish no-touch list for active stack and compatibility surfaces.

Exit criteria:
- Team agreement on canonical owners for shell/topbar/sidebar/command/AI/components/pages/page-standard.

Rollback:
- None (documentation phase).

### Phase B: Protect legacy from accidental load
Goal:
- Prevent accidental relink/reimport of legacy artifacts.

Actions:
- Add CI/lint or grep-based gate that fails if index.html adds public/control-center/legacy/*.css or *.js.
- Add guardrail note in frontend runbook: legacy assets are archive-only unless incident rollback is declared.
- Keep legacy folder path stable during protection phase.

Exit criteria:
- Automated check in place and passing.

Rollback:
- Disable guard only for incident-response branch with approval.

### Phase C: Archive/rename decision
Goal:
- Decide whether legacy files stay in-place with clear archive semantics or move to explicit archive namespace.

Actions:
- Evaluate naming standard for archived compatibility assets.
- Decide owner for legacy archive retention window.
- Approve rollback source-of-truth (commit hash + file set).

Exit criteria:
- Signed retention policy and rollback policy.

Rollback:
- Keep current paths untouched until policy is signed.

### Phase D: Remove 0-byte placeholders if approved
Goal:
- Remove noise from styles/integrations placeholders only after structure decision.

Actions:
- Confirm no planned near-term use for each placeholder file.
- Remove only zero-byte files, one commit, with explicit note.
- Keep or remove folder based on structure policy.

Exit criteria:
- No unresolved references and approved structure decision.

Rollback:
- Recreate empty files from commit history if needed.

### Phase E: Split page-specific CSS out of 14-page-standard.css
Goal:
- Reduce authority blur and route leakage risk.

Actions:
- Move library-heavy/page-specific blocks from styles/14-page-standard.css into page-owned CSS modules.
- Keep 14-page-standard.css focused on shared compatibility shell + interaction safety.
- Validate route-by-route parity (library, governance, settings, ops pages) after each extraction.

Exit criteria:
- 14-page-standard.css scope reduced to true shared compatibility concerns.

Rollback:
- Revert per-route extraction commit(s) only, preserving load order contract.

### Phase F: Remove legacy files only with rollback
Goal:
- Retire legacy CSS/JS snapshots safely.

Actions:
- Confirm legacy files remain unlinked/unimported.
- Confirm no incident rollback dependency remains.
- Remove in controlled batches with explicit manifest of deleted files.

Exit criteria:
- Retirement approval granted and rollback bundle recorded.

Rollback:
- Restore retired files from tagged rollback commit.

## 9) Must not be touched yet
Do not touch until after authority freeze and explicit approval:
- Active loaded CSS stack in public/control-center/index.html link order.
- index.html CSS link order itself.
- page-standard compatibility rules currently required for shared behavior.
- operations shell CSS in styles/09-operations-centers.css.
- Legacy files without approved rollback plan.
- Any CSS known to be shared by multiple pages without route impact analysis.

## Execution safeguards (mandatory for implementation phase)
1. Before each cleanup PR, run an authority diff checklist:
   - load order unchanged
   - route shell classes unchanged
   - no legacy relinks
2. Require visual smoke checks for:
   - sidebar/topbar
   - command bar
   - loading overlay
   - ai dock
   - library route
   - governance route
   - settings route
   - operations center routes
3. Keep changes small and phase-scoped (no mixed refactor + retirement in one PR).

## Decision summary
- Immediate deletion is not recommended.
- Priority is authority clarity and anti-relink guardrails.
- Retirement is feasible only after phased controls and rollback readiness are in place.
