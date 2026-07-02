# Terminal Remaining Work Plan

## Rule
Continue without Codex using terminal evidence, targeted diffs, and page-by-page implementation. No broad patches.

## Phase 0 — Clean State
Goal: keep repository clean before each phase.
Commands:
```bash
git status --short
git branch --show-current
git log --oneline -8
```
Completion:
- Working tree clean or only intentional audit files.

## Phase 1 — Authority and Runtime Safety
Scope:
- P0/P1 pages from Terminal audit.
- AutoMode references.
- document/window listeners.
- timers.
- frontend-owned authority assumptions.

Do not touch:
- Backend authority.
- data/projects.
- CSS redesign.

Validation:
```bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check runtime/orchestrator-service/server.js
```

Completion:
- Risk source documented.
- Any fix is isolated and committed separately.

## Phase 2 — Global UI Contract and CSS Consolidation
Scope:
- CSS scan results.
- Global shell/header/action panel primitives.
- Repeated page-specific CSS blocks.

Do not:
- Add random CSS overrides.
- Fix one page by damaging global layout.

Completion:
- Global UI rules documented.
- One page at a time adopts clean primitives.

## Phase 3 — Page-by-Page Finalization
Order:
1. Home
2. Setup
3. Library
4. Integrations
5. AI Command
6. Workflows
7. Publishing
8. Operations Centers
9. Governance
10. Settings
11. Campaign Studio
12. Content Studio
13. Media Studio
14. Ads Manager
15. Insights
16. Research

For each page:
- Page truth audit
- API relationship audit
- UX final blueprint
- Safe implementation
- Browser QA
- Closeout

## Phase 4 — Missing Capability Closure
Use capability matrix to find backend-present but frontend-hidden capabilities and frontend-present but backend-missing features.

Rule:
- If backend does not exist, document missing backend.
- Do not fake execution in frontend.

## Phase 5 — Browser QA and Regression Proof
Required:
- Desktop
- Tablet
- Mobile
- Navigation
- Empty states
- Loading states
- Action confirmation
- AI handoff clarity

## Phase 6 — Release Readiness
Required:
- node checks
- route checks
- smoke tests if available
- browser QA proof
- clean git status
- release checklist

## Phase 7 — Production Operations
Required:
- service health
- logs
- backups
- rollback plan
- monitoring evidence

## Immediate Next Step
Review:
```bash
cat audits/system-truth/terminal-audit/TERMINAL_FULL_APP_DEEP_TRUTH_AUDIT.md
cat audits/system-truth/terminal-audit/TERMINAL_CAPABILITY_MATRIX.md
cat audits/system-truth/terminal-audit/TERMINAL_REMAINING_WORK_PLAN.md
```

Then choose the highest P0/P1 page for a targeted audit.
