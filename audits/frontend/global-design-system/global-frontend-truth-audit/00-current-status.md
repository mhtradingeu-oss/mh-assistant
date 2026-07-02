# 00 Current Status

## Scope

Audit-only pass for MH-OS / MH Assistant Control Center on branch `architecture/frontend-consolidation-v1`.

No frontend implementation, backend/API behavior change, command execution change, project data change, commit, or push was performed.

## Required Baseline

Initial commands requested by the audit:

```bash
git status --short
git diff --stat
git --no-pager log --oneline -20
```

Result:

- `git status --short`: clean before audit work.
- `git diff --stat`: no diff before audit work.
- Recent history is heavily focused on AI Command and Library final composition, including source handoff, empty state, selected Library source indicator, and Library asset UI polish.

Recent top commits observed:

- `9542cb8 Show AI Command selected Library source indicator`
- `658dc28 Clarify AI Command empty state next action`
- `475582f Audit AI Command main surface UX`
- `aad1056 Close AI Command tool drawer source handoff QA`
- `edf0878 Polish Library asset section titles and microcopy`

## Active Frontend Truth

The active frontend is a modular vanilla JavaScript Control Center loaded from `public/control-center/index.html`.

Key active files:

- `public/control-center/index.html` owns shell markup, stylesheet load order, sidebar navigation, topbar, command bar, workspace root, startup fallback, and floating AI dock markup.
- `public/control-center/router.js` imports page route modules, builds `routeRegistry`, writes route templates into `#pageRoot`, updates topbar metadata, updates active nav, enforces role access fallback, and emits route-change events.
- `public/control-center/app.js` owns startup, global state hydration, project loading, access-key handling, protected write fetch wrapping, route lifecycle, and injection of API functions into page render contexts.
- `public/control-center/shared-context.js` owns transient cross-page bridges for campaign records, AI drafts, handoffs, AI source selection, and Library source type guidance.
- `public/control-center/api.js` owns API base URL, access-key resolution, request diagnostics, project data fetches, and frontend API clients.
- `public/control-center/pages/**` owns page templates, page render functions, session state, and page-specific handlers.
- `public/control-center/styles/**` owns the active layered CSS system.

## Active CSS Load Order

`index.html` loads:

1. `00-tokens.css`
2. `01-reset.css`
3. `02-layer-system.css`
4. `03-app-shell.css`
5. `07-sidebar.css`
6. `10-topbar-canonical.css`
7. `04-command-layer.css`
8. `05-ai-layer.css`
9. `08-components-foundation.css`
10. `mhos-action-primitives.css`
11. `09-operations-centers.css`
12. `12-pages.css`
13. `13-home-executive.css`
14. `14-page-standard.css`
15. `15-clean-operating-layer.css`
16. `mhos-workflow-primitives.css`
17. `mhos-context-primitives.css`
18. `mhos-executive-surface-primitives.css`

The active CSS architecture is layered but not yet fully clean. Multiple surface families still coexist: `.card`, `.panel`, `.data-card`, `.quick-action-btn`, `.std-*`, `.mhos-clean-*`, `.mhos-os-*`, page-local class families, and route-specific scoped styles.

## Strong Existing Work

These areas are already strong enough to avoid heavy rewrites:

- Home: strong executive command framing and next-best-action surface.
- AI Command: mature AI Team, chat/composer, output workspace, Tool Drawer, Library source handoff, and safety language.
- Library: strong source-of-truth model, asset readiness, upload/classify, asset workspace, action panel, AI panel, and source bridge.
- Operations Overview plus Task/Queue/Job/Notifications: newer operating center language and explicit mutation boundaries.
- Governance: strong authority framing, approval boundary language, backend policy safety, and AI review-only framing.
- Publishing: strong execution, review, queue, gate, and schedule concept.
- Campaign Studio: comparatively strong command-board framing.

## Main Current Risks

- CSS authority remains fragmented across large shared files, page-specific files, late clean layers, and page-injected scoped styles.
- Some pages use older dashboard/card language that weakens the AI Business Operating System identity.
- Multiple pages repeat AI guidance, action prompts, provenance, readiness, and handoff patterns with different class families and hierarchy.
- The sidebar groups are functional but do not yet fully communicate the international platform architecture: Command, Source of Truth, Build, Publish/Grow, Intelligence, Customers, Operations, Governance, Settings.
- Several pages are dense because they stack cards, helper text, badges, and action rows before the operator can identify one next action.

## Current Audit Output

Created folder:

`audits/frontend/global-design-system/global-frontend-truth-audit/`

This pack documents current architecture, navigation/page map, platform vision, design-system authority, readiness matrix, global UX findings, safe global opportunities, page-by-page plan, first five patches, and validation checklist.
