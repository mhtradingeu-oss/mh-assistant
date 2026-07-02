# Frontend UX Master Plan 2026

Date: 2026-05-11
Branch: architecture/frontend-consolidation-v1
Status: Canonical frontend UX roadmap — documentation-only
Doctrine: Backend owns operational authority. Frontend projects operational authority.

---

## 1. Executive Vision

MH-OS is not a traditional dashboard.

MH-OS must become an international, powerful, smart AI Business Operating System. The system must feel premium, calm, intelligent, and safe. Every page a user visits must convey operational clarity, guided authority, and actionable focus — without cognitive overload, clutter, or accidental consequence.

The user experience is the final projection surface of a secured, authority-conscious backend. The UI must never duplicate authority, never invent backend state, and never create uncontrolled side effects. It must project what the backend owns — clearly, beautifully, and responsibly.

This document is the canonical UX roadmap. All future frontend redesign, layout work, and CSS changes must trace back to this plan before execution begins.

---

## 2. Confirmed Current Status

### 2.1 Backend Security — Closed

Track: Backend Security Middleware Completion
Status: Closeout documentation complete as of 2026-05-11.

- All identified security gaps are closed or formally reclassified.
- Write-key protection applied to all AI/media/publishing/execution/scheduler routes.
- Read-key protection applied to insights, learning, and operational read surfaces.
- Upload filename sanitization hardened.
- Integration summary defensive redaction applied.
- Project isolation guardrails (slug validation, path normalization) preserved and unchanged.
- Publishing authority checks (`assertPublishingMutationAllowed`) preserved and unchanged.

No unresolved immediate security patch remains. Backend authority surfaces are stable.

### 2.2 Library — Stable Checkpoint

Track: Library Operating Surface
Status: Stable checkpoint as of 2026-05-11.

- Route-owned listener lifecycle in place via `listener-lifecycle.js`.
- Command-router shadow envelopes in place for: `select-asset`, `set-filter`, `set-page`, `set-view-mode`, `upload-type-change`, `open-preview`.
- Action Panel present with one safe non-destructive command wired (`copy-path`).
- AI Panel mounted and contextual; read-only metadata path only.
- Mutation commands (rename, archive, delete, upload-mutation, status-update, set-source-of-truth) remain deferred; must be handled in a dedicated mutation safety pass.
- Inspector remains broader than final target ownership; reduction deferred.

Library can pause. Mutation safety consolidation is a future explicit pass.

### 2.3 Media Studio — Planning Closed Through Step 2C

Track: Media Studio Operating Surface
Status: Step 2B and Step 2C documentation closed as of 2026-05-11.

- Step 2B: Full extraction readiness audit complete. Source file is 3215 lines. Classified helpers as safe-now, safe-later, defer, and do-not-extract-yet.
- Step 2C: Formatter extraction plan defined. Fifteen pure/near-pure helper candidates identified with documented contracts and risk assessments.
- No runtime extraction has occurred. All work is documentation-only.
- Step 2D (formatter extraction execution) is deferred until CSS foundation and operating surface standard are established.
- Orchestration surfaces (`bindMediaStudio`, `sendPublishingHandoff`, `mediaStudioRoute.render`, `loadMediaWorkspace`) remain do-not-touch until explicit dedicated pass.

### 2.4 Frontend UX — Not Yet Final

The global operating surface standard has not yet been applied across all pages. CSS layer organization has not been formally audited for duplication, token gaps, or deprecated strata. No page has been formally validated against the four-zone standard (Header + Main View + Action Panel + AI Panel).

This plan establishes the canonical path forward.

---

## 3. Core Doctrine

### 3.1 Backend Owns Operational Authority

The backend is the single source of truth for:
- Project state, project data, and project isolation.
- Publishing decisions and guardrails.
- Task, queue, job, and notification state.
- AI/media generation orchestration.
- Approval workflows and handoff contracts.
- Route-level access key enforcement.
- Execution scheduling and campaign execution packages.

No frontend page, component, or action panel may create, mutate, or infer backend state on its own authority.

### 3.2 Frontend Projects Operational Authority

The frontend renders what the backend owns:
- Projecting current state clearly and readably.
- Projecting available actions safely as intent signals.
- Projecting AI context as read-surfacing suggestions, not autonomous commands.
- Projecting operational status without duplicating it.

The frontend is not a controller. It is a projection surface.

### 3.3 No Duplicate Authority

A page that renders a list of tasks does not own those tasks.
A button that submits a publishing request does not own the publishing decision.
An AI panel that suggests a next step does not own command execution.

Authority duplication — where frontend state diverges from backend state, or where frontend logic makes decisions the backend should own — is a defect, not a feature.

---

## 4. Global Operating Surface Standard

Every page must move toward the following four-zone layout:

```
┌──────────────────────────────────────────────┐
│  HEADER                                       │
│  Page title · Context ribbon · Project scope  │
├──────────────────────────────────────────────┤
│  MAIN VIEW                                    │
│  Structured data display (list/grid/table)   │
│  Filter / search / sort controls inline       │
│  Empty state and loading state handled         │
├──────────────────────┬───────────────────────┤
│  ACTION PANEL        │  AI PANEL             │
│  Safe intent actions │  Contextual AI prompts│
│  Deferred if not     │  Read-only metadata   │
│  yet safe            │  Deferred if not ready│
└──────────────────────┴───────────────────────┘
```

### Zone Definitions

**Header:**
- Page title, eyebrow label, project context ribbon.
- Status badges (if applicable).
- Top-level navigation back-context.
- No heavy render logic. No data mutation.

**Main View:**
- Structured data display appropriate to the page.
- Inline filter, search, sort, and pagination controls.
- Explicit empty state (not blank).
- Explicit loading state (not frozen).
- Read-only by default; action dispatch goes through Action Panel or command-router.

**Action Panel:**
- Right-rail surface for user-initiated safe actions.
- Commands must be non-destructive or explicitly guarded.
- Mutation commands must be audited and explicitly wired — not assumed.
- May be present-but-deferred (rendered as disabled/read-only) if mutation safety pass has not yet occurred for that page.
- Must not duplicate backend authority.

**AI Panel:**
- Right-rail or secondary surface for contextual AI suggestions.
- Read-only metadata-first in all early passes.
- No autonomous command execution from the panel.
- May be present-but-deferred if AI routing contract is not yet formally defined.
- Must not infer backend state.

### Zone Completion Criteria

A page zone is complete when:
- It renders correctly in all data states (loaded, empty, error, loading).
- It has no uncontrolled event listeners.
- It has no random CSS overrides outside the token and layer system.
- It has no authority duplication.
- It has no `data/projects` mutation during UX work.
- Its completion has been documented in a final page audit and committed.

---

## 5. UX Principles

### Premium
The system must look and feel like a professional, international AI operating platform. No amateur spacing. No inconsistent font sizes. No unthought color use.

### Calm
Interactions must feel deliberate and quiet. No jarring transitions. No excessive animation. No aggressive popups. The UI should be as calm as the intelligence behind it is powerful.

### Focused
Every page shows what the user needs to act on. No noisy secondary panels. No unrelated UI fragments. No accidental overflow of information that doesn't belong on that page.

### Smart
The system should feel aware of context. The AI Panel should surface relevant metadata. The Action Panel should surface what is actually actionable at that moment. Empty states should explain what is absent and why.

### Guided
The user should always know where they are, what they are looking at, and what safe action they can take next. Header context ribbons are mandatory. Action Panel labels must be clear.

### No Clutter
No orphaned components. No placeholder buttons that do nothing and are not labeled as deferred. No debug output in production surfaces. No duplicate control surfaces for the same action.

### No Heavy Render Logic
Main View render functions must not run synchronous blocking operations. State hydration belongs in route lifecycle, not in render functions.

### No Uncontrolled Listeners
All event listeners must be owned by the route lifecycle or explicitly cleaned up in route teardown. Global listeners not registered through the lifecycle system are a defect.

### No Random CSS Overrides
All styling must trace to the token system (`00-tokens.css`), layer system (`02-layer-system.css`), or named component layers (`08-components-foundation.css`, `14-page-standard.css`). Inline styles and ad-hoc class overrides that circumvent the layer system are a defect.

---

## 6. Page Completion Definition

A page is complete when all of the following are true:

| Criterion | Description |
|---|---|
| Header clear | Page title, context ribbon, and project scope are rendered correctly |
| Main View structured | Data display, filter/sort/search/pagination are functional and styled consistently |
| Action Panel present or deferred | Either wired with at least one safe action, or explicitly documented as deferred with reason |
| AI Panel present or deferred | Either mounted with contextual read-only metadata, or explicitly documented as deferred with reason |
| Safe actions only | No mutation commands wired without explicit mutation safety audit |
| No authority duplication | Page does not own, shadow, or replicate backend state decisions |
| No data/projects mutation during UX work | No changes to `data/projects` in the course of UX layout or style work |
| Validation passed | `node --check` passes on all page JS; no console errors in expected operating states |
| Final page audit committed | Audit document committed to `audits/frontend/` before the page is considered done |

---

## 7. Priority Roadmap

### P0 — Foundation (Must complete before any page redesign)

| Item | Rationale |
|---|---|
| CSS Foundation Audit | Identify duplication, deprecated strata, missing tokens, and unowned overrides across all 12+ style files |
| UX Operating Surface Standard | Document canonical four-zone layout rules, per-zone completion criteria, and zone-deferred policy |
| App Shell Layer Audit | Confirm `app.js`, `router.js`, `state.js`, `ui/page-standard.js` layer boundaries are clean and no page-level logic leaks into shell |

No page redesign, layout change, or CSS refactor begins until P0 is documented.

### P1 — Operations Centers (Highest safe starting point after foundation)

| Page | Rationale |
|---|---|
| Task Center | Backend endpoint confirmed active; `fetchProjectTaskCenter` wired; read-safe starting point |
| Queue Center | Backend endpoint confirmed active; `fetchProjectQueueCenter` wired; read-safe starting point |
| Job Monitor | Backend endpoint confirmed active; `fetchProjectJobMonitor` wired; read-safe starting point |
| Notification Center | Backend endpoint confirmed active; `fetchProjectNotificationCenter` wired; read-safe starting point |

Operations Centers are the safest early redesign surface: backend endpoints are read-capable, helper utilities already exist in `operations-centers.js`, and the pages have lower mutation risk than Media Studio, Publishing, or AI Command.

### P2 — Authority-Adjacent Pages (After Operations Centers complete)

| Page | Rationale |
|---|---|
| Media Studio — controlled extraction and layout | Step 2C planning is closed; Step 2D execution deferred until foundation is established |
| Publishing | Authority-heavy; must be fully audited before any redesign |
| AI Command | Authority-heavy; must become projection-first before any redesign |

### P3 — Full System Pages (After P2 complete)

| Page | Rationale |
|---|---|
| Content Studio | Complex composition surface; defer until P2 learnings are applied |
| Campaign Studio | Campaign orchestration surface; authority-adjacent; defer |
| Workflows | Execution-adjacent; defer until authority model is stable |
| Ads Manager | Execution-adjacent; defer |
| Insights | Read-heavy; lower risk; can move sooner if foundation is ready |
| Research | Read-heavy; lower risk; can move sooner if foundation is ready |
| Governance | Policy surface; requires explicit authority review before redesign |
| Settings | System configuration; mutation-sensitive; requires safety audit |

---

## 8. Per-Page Strategy Table

| Page | Current Status | Risk | Backend Capability Available | UX Target | Next Audit / Action |
|---|---|---|---|---|---|
| Home | Partially styled (executive layout) | Low | Project list; insights summary | Header + Main View (executive dashboard) | CSS foundation audit first |
| Operations Centers — Task Center | Functional; helper utilities in `operations-centers.js` | Low | `fetchProjectTaskCenter` | Header + Main View + Action Panel (deferred) + AI Panel (deferred) | P1 — after CSS foundation |
| Operations Centers — Queue Center | Functional | Low | `fetchProjectQueueCenter` | Header + Main View + Action Panel (deferred) + AI Panel (deferred) | P1 — after CSS foundation |
| Operations Centers — Job Monitor | Functional | Low | `fetchProjectJobMonitor` | Header + Main View + Action Panel (deferred) + AI Panel (deferred) | P1 — after CSS foundation |
| Operations Centers — Notification Center | Functional | Low | `fetchProjectNotificationCenter` | Header + Main View + Action Panel (deferred) + AI Panel (deferred) | P1 — after CSS foundation |
| Library | Stable checkpoint | Medium | Asset list, preview, upload; mutation endpoints exist but deferred | Header + Main View + Action Panel (one safe command) + AI Panel (metadata-only) | Mutation safety pass (future) |
| Media Studio | Planning closed through Step 2C | High | Full AI/media/generation/publishing/approval surface | Header + Main View + Action Panel + AI Panel (all phased) | Step 2D formatter extraction after foundation |
| Publishing | Unaudited for redesign | High | Full publishing authority; approval; scheduling; execution | Header + Main View + Action Panel (authority-guarded) + AI Panel (deferred) | Publish operating surface audit (P2) |
| AI Command | Unaudited for redesign | High | `executeProjectAiCommand`; AI orchestration surface | Header + Main View + Action Panel (projection-first only) + AI Panel | AI command operating surface audit (P2) |
| Content Studio | Unaudited | Medium | Content composition endpoints | Header + Main View + Action Panel + AI Panel | Defer to P3 |
| Campaign Studio | Unaudited | High | Campaign orchestration; execution endpoints | Header + Main View + Action Panel + AI Panel | Defer to P3 |
| Workflows | Unaudited | High | `runProjectWorkflow`, `runProjectAiWorkflow` | Header + Main View + Action Panel + AI Panel | Defer to P3 |
| Ads Manager | Unaudited | High | `build_ad_execution_package` (write-key protected) | Header + Main View + Action Panel + AI Panel | Defer to P3 |
| Insights | Unaudited | Low-Medium | `fetchProjectInsights` (read-key) | Header + Main View + AI Panel | P3 early candidate |
| Research | Unaudited | Low | Research read endpoints | Header + Main View + AI Panel | P3 early candidate |
| Governance | Unaudited | Medium | Policy/approval surfaces | Header + Main View + Action Panel | Defer to P3; requires authority review |
| Settings | Unaudited | Medium | System configuration; `saveProjectSetup` | Header + Main View + Action Panel (guarded) | Defer to P3; requires mutation safety audit |
| Integrations | Unaudited | Medium | Full integration lifecycle endpoints | Header + Main View + Action Panel | Defer to P3 |
| Setup | Onboarding flow | Low-Medium | `createMediaManagerProject` | Guided flow; not four-zone; special case | Defer to P3 |

---

## 9. CSS / Foundation Strategy

### 9.1 Current CSS Layer Inventory

Files loaded in `index.html`:
- `00-tokens.css` — Design tokens (colors, spacing, radius, shadow, typography scale).
- `01-reset.css` — Browser normalization.
- `02-layer-system.css` — Loading overlay and z-index strata.
- `03-app-shell.css` — App shell grid layout.
- `04-command-layer.css` — Quick command input layer.
- `05-ai-layer.css` — AI panel layer.
- `07-sidebar.css` — Sidebar navigation.
- `08-components-foundation.css` — Shared component primitives.
- `10-topbar-canonical.css` — Top bar.
- `12-pages.css` — Page-level layout foundations.
- `13-home-executive.css` — Home page executive layout.
- `14-page-standard.css` — Standard page compact shell (`std-page-shell`, `std-context-ribbon`).
- `styles/integrations/` — Integration page specific styles.

### 9.2 Foundation Audit Scope

The CSS Foundation Audit (P0) must:
- Identify any duplicate class definitions across files.
- Identify any classes that exist in multiple files with conflicting rules.
- Identify any inline styles or hardcoded values that bypass the token system.
- Identify deprecated or unused layers that can be formally retired.
- Map which files own which component responsibility (card, panel, button, table, badge, empty state, loading state).
- Confirm token coverage: are all spacing, color, and radius values in `00-tokens.css` used consistently, or are raw values scattered?

### 9.3 Canonical Component Standard (To Be Defined in P0 Audit)

The audit must define, or confirm the existing definition of, the following canonical states:
- **Card** — standard content card, elevated card, flat card.
- **Panel** — right-rail panel (Action Panel, AI Panel), inline panel.
- **Button** — primary, secondary, danger, disabled, deferred.
- **Table** — standard data table; responsive considerations.
- **Badge** — status badge (success, warning, danger, neutral); count badge.
- **Empty state** — no-data state with message and optional action.
- **Loading state** — skeleton or spinner; no blank-freeze allowed.

### 9.4 CSS Discipline Rules

- Do not rewrite CSS blindly. Audit first, then change.
- Do not add page-specific overrides outside of the responsible file for that page.
- Do not add `!important` to work around cascade issues; fix the cascade instead.
- Token variables (`--color-*`, `--space-*`, `--radius-*`) must be used; raw hex/pixel values are not acceptable in new work.
- Every CSS change in a UX pass must be traceable to a page audit or foundation audit decision.

---

## 10. Operations Centers Strategy

### 10.1 Why Operations Centers First

- Backend endpoints are already confirmed active and read-safe.
- `fetchProjectTaskCenter`, `fetchProjectQueueCenter`, `fetchProjectJobMonitor`, and `fetchProjectNotificationCenter` are all imported and available in `app.js`.
- Helper utilities in `operations-centers.js` already include safe patterns: `asArray`, `asObject`, `asString`, `titleCase`, `formatDateTime`, `formatCount`, `badgeTone`, `filterBySearch`, and session management via `Map`.
- Risk is lower than any authority-heavy surface.
- A successful Operations Centers pass establishes the four-zone pattern for the rest of the roadmap.

### 10.2 Available Backend Endpoints

| Page | Endpoint | Key Type |
|---|---|---|
| Task Center | `fetchProjectTaskCenter` | Read |
| Queue Center | `fetchProjectQueueCenter` | Read |
| Job Monitor | `fetchProjectJobMonitor` | Read |
| Notification Center | `fetchProjectNotificationCenter` | Read |

Mutation endpoints (mark notification, create task, create approval) exist but must remain deferred in the UX pass.

### 10.3 Desired UX

Each Operations Center page must reach:
- **Header**: Page title, eyebrow (e.g., "TASK CENTER"), project scope indicator.
- **Main View**: Data list or table with inline search/filter/sort; empty state; loading state.
- **Action Panel**: Present but deferred (read-only or disabled until mutation safety pass).
- **AI Panel**: Present but deferred (contextual metadata only; no command routing yet).

### 10.4 Safe Phased Execution

1. CSS foundation audit completes first (P0).
2. Confirm four-zone layout template from `14-page-standard.css` and `08-components-foundation.css`.
3. Apply layout to Task Center; audit; commit.
4. Apply layout to Queue Center; audit; commit.
5. Apply layout to Job Monitor; audit; commit.
6. Apply layout to Notification Center; audit; commit.
7. Mutation safety pass for Operations Centers (future explicit pass, separate from layout work).

---

## 11. Media Studio Strategy

### 11.1 Current Position

- Step 2B extraction readiness audit: complete.
- Step 2C formatter extraction plan: complete and committed.
- No runtime extraction has occurred.

### 11.2 Step 2D — Formatter Extraction Execution (Deferred)

Step 2D (actual code extraction of the 15 pure helper functions into `media-studio/media-formatters.js`) is deferred until:
- CSS foundation audit is complete (P0).
- Operating surface standard is formally documented and approved.
- At least one Operations Centers page has been completed as a pattern reference.

Rationale: Extracting formatters before the operating surface is stable risks re-touching the file during layout work. One clean pass is better than multiple interleaved passes.

### 11.3 Generation Orchestration — Do Not Extract Yet

The following surfaces must not be extracted or restructured in any UX pass:
- `bindMediaStudio` — operational sequencing authority.
- `sendPublishingHandoff` — publishing authority handoff.
- `mediaStudioRoute.render` — first-load lifecycle.
- `loadMediaWorkspace` — workspace initialization.
- All localStorage adapters, payload builders, approval/task/handoff action wiring, and role defaults.

These surfaces are deferred until an explicit Media Studio orchestration safety pass, which occurs after the layout and formatter passes are complete and validated.

---

## 12. Publishing Strategy

### 12.1 Authority Profile

Publishing is one of the highest-authority surfaces in the system:
- Routes `/execute_publish_package` and `/execute_email_package` are write-key protected.
- `approvePublishingItem` and `publishPublishingItem` are authority decisions.
- `assertPublishingMutationAllowed` is a backend guardrail that must not be bypassed or duplicated.

### 12.2 Required Pre-Redesign Work

Before any UX layout work begins on Publishing:
- A full Publishing Operating Surface Audit must be committed.
- The audit must map every action the current UI exposes and classify each as: safe-read / safe-utility / mutation-guarded / authority-decision.
- The audit must confirm what `publishing.js` currently does vs. what the final four-zone layout should project.
- No auto-execution UI (auto-publish, auto-approve, scheduled trigger) may be surfaced without explicit safeguards confirmed in the audit.

### 12.3 Timeline

Publishing layout work begins only after P1 (Operations Centers) is complete. It is a P2 item.

---

## 13. AI Command Strategy

### 13.1 Authority Profile

AI Command is an authority-adjacent surface:
- `executeProjectAiCommand` dispatches to backend AI orchestration.
- The surface can trigger workflows, generate content, and initiate handoffs depending on command routing.

### 13.2 Projection-First Requirement

The AI Command page must become projection-first:
- The UI surfaces available commands from backend capability, not from frontend-inferred logic.
- No local command expansion (adding new AI commands in the frontend without backend confirmation).
- No autonomous command execution from the AI Panel on the AI Command page.

### 13.3 Required Pre-Redesign Work

Before any UX layout work on AI Command:
- An AI Command Operating Surface Audit must be committed.
- The audit must map current command routing, payload shapes, and authority checks.
- The audit must confirm the projection boundary between frontend input and backend dispatch.

### 13.4 Timeline

AI Command layout work begins only after P1 is complete. It is a P2 item alongside Publishing.

---

## 14. Rules for Future Implementation

Every implementation pass must follow this sequence:

```
Audit → Confirm → Decide → Implement
```

**Audit**: Document the current state of the target surface. No code changes during audit.
**Confirm**: Confirm the audit is accurate. Confirm backend authority boundaries. Confirm no unresolved blockers.
**Decide**: Explicitly decide what will change, what will be deferred, and what is off-limits.
**Implement**: Execute only the decided scope. No scope creep.

Additional rules:
- One page at a time. Do not parallelize page redesign work.
- Small commits. Each meaningful change gets its own commit with a clear message.
- Validation every pass. `node --check` on every modified JS file before commit.
- No destructive action without authority audit. Any action that could mutate `data/projects`, change route behavior, or alter response shapes requires an explicit authority audit first.
- No CSS changes without tracing to a token or layer system decision.
- No new event listeners outside the route lifecycle system.

---

## 15. Do-Not-Break List

The following must be preserved absolutely throughout all UX work:

| System | Constraint |
|---|---|
| Backend security | All route-level key protections remain in place; no frontend bypass |
| Project isolation | `normalizeProjectSlug`, `resolveProjectPath`, `resolvePathWithinRoot` must not be affected by frontend changes |
| Route behavior | No changes to `router.js` route definitions, navigation guards, or access resolvers |
| Response shapes | No changes to payload contracts expected by frontend API calls |
| data/projects | No mutation of project data files during UX work |
| Publishing guardrails | `assertPublishingMutationAllowed` and all backend publishing checks remain in force |
| Local draft behavior | `readDraftMap`/`writeDraftMap` and localStorage draft adapters must not be altered during layout work |
| Media Studio generation flows | `bindMediaStudio`, `sendPublishingHandoff`, generation orchestration surfaces must not be touched during layout or formatter work |
| Library mutation deferral | Deferred mutation commands (rename, archive, delete, set-source-of-truth) must remain deferred until explicit mutation safety pass |

---

## 16. Next Immediate Step

**P0 — CSS Foundation & Operating Surface Standard Audit**

Before any page receives a layout change, the CSS Foundation Audit must be completed and committed to `audits/frontend/`.

The audit must produce:
1. Inventory of all current CSS files and their confirmed responsibilities.
2. Duplication map: any class defined in more than one file.
3. Token gap map: any raw values that bypass `00-tokens.css`.
4. Deprecated layer identification: any file or class family that can be formally retired.
5. Canonical component state definitions for: card, panel, button, table, badge, empty state, loading state.
6. Confirmed scope of `14-page-standard.css` as the shared page shell.
7. Decision on whether additional `std-*` classes are needed or whether existing classes cover all four-zone regions.

Only after the CSS Foundation Audit is committed and approved does work move to P1 (Operations Centers).

---

## Appendix A — Operating Surface File Map

| Surface | Primary File(s) |
|---|---|
| App shell | `public/control-center/app.js`, `public/control-center/index.html` |
| Router | `public/control-center/router.js` |
| State | `public/control-center/state.js` |
| API | `public/control-center/api.js` |
| Page standard layout | `public/control-center/ui/page-standard.js`, `styles/14-page-standard.css` |
| CSS tokens | `styles/00-tokens.css` |
| CSS layer system | `styles/02-layer-system.css` |
| CSS components foundation | `styles/08-components-foundation.css` |
| Operations Centers | `pages/operations-centers.js` |
| Library | `pages/library.js`, `pages/library/` |
| Media Studio | `pages/media-studio-workspace.js` |
| Publishing | `pages/publishing.js` |
| AI Command | `pages/ai-command.js` |
| Campaign Studio | `pages/campaign-studio.js` |
| Content Studio | `pages/content-studio-workspace.js` |
| Workflows | `pages/workflows.js` |
| Ads Manager | `pages/ads-manager.js` |
| Insights | `pages/insights.js` |
| Research | `pages/research.js` |
| Governance | `pages/governance.js` |
| Settings | `pages/settings.js` |
| Integrations | `pages/integrations.js`, `pages/integrations/` |
| Home | `pages/home.js`, `pages/home/` |

---

## Appendix B — Completed Track Summary

| Track | Status | Reference |
|---|---|---|
| Backend Security Middleware | Closed 2026-05-11 | `audits/backend/security/BACKEND_SECURITY_CLOSEOUT.md` |
| Library Operating Surface | Stable checkpoint 2026-05-11 | `audits/frontend/library/LIBRARY_FINAL_OPERATING_SURFACE_REFRESH_AUDIT.md` |
| Media Studio — Snapshot | Complete 2026-05-11 | `audits/frontend/media-studio/MEDIA_STUDIO_CURRENT_STATE_SNAPSHOT.md` |
| Media Studio — Operating Surface Authority | Complete 2026-05-11 | `audits/frontend/media-studio/MEDIA_STUDIO_OPERATING_SURFACE_AUTHORITY_AUDIT.md` |
| Media Studio — Step 2B Extraction Readiness | Complete 2026-05-11 | `audits/frontend/media-studio/MEDIA_STUDIO_STEP_2B_EXTRACTION_READINESS_AUDIT.md` |
| Media Studio — Step 2C Formatter Extraction Plan | Complete 2026-05-11 | `audits/frontend/media-studio/MEDIA_STUDIO_STEP_2C_FORMATTER_EXTRACTION_PLAN.md` |
| Frontend UX Master Plan | This document | `audits/frontend/FRONTEND_UX_MASTER_PLAN_2026.md` |
| P0 — CSS Foundation Audit | Complete 2026-05-11 | `audits/frontend/design-system/FRONTEND_CSS_FOUNDATION_AUDIT.md` |
| P0 — UX Operating Surface Standard | Complete 2026-05-11 | `audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md` |
| P0 — App Shell Layer Audit | Complete 2026-05-11 | `audits/frontend/design-system/APP_SHELL_LAYER_AUDIT.md` |

---

## Appendix C — Phase 0 CSS/Foundation Audit Artifacts

Phase 0 audit artifacts committed 2026-05-11. These three documents constitute the canonical P0 foundation audit and are prerequisites for all P1 page work.

| Document | Purpose |
|---|---|
| `audits/frontend/design-system/FRONTEND_CSS_FOUNDATION_AUDIT.md` | Full CSS file inventory, duplicate selectors, `!important` audit, token gap map, deprecated layer identification, risk classification per class/area |
| `audits/frontend/design-system/UX_OPERATING_SURFACE_STANDARD.md` | Canonical four-zone layout standard (Header + Main View + Action Panel + AI Panel), page completion definition, action safety levels, empty/loading/error state standard, upgrade workflow |
| `audits/frontend/design-system/APP_SHELL_LAYER_AUDIT.md` | Shell layer inventory (sidebar, topbar, workspace, command bar, AI dock, loading overlay, fatal recovery, startup diagnostics), z-index stack, interaction risk matrix |

**P0 status:** Complete. P1 (Operations Centers) may now begin.
