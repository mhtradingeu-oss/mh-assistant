# PHASE 3T.7 — Page CSS Ownership Prioritization Matrix

## Status
Audit-only. No production changes.

## Baseline
- Previous commit: 63c3fd0 Close Customer Operations and operating intelligence placement

## Purpose
Classify each Control Center page by CSS ownership, visual readiness risk, and safe UI finalization order.

## Why This Exists
The project has completed execution authority closeouts, capability coverage decisions, Customer Operations placement, and Operating Intelligence placement.

Now UI finalization can proceed safely, but not through broad CSS patches. Each page must be classified first.

## Evidence Summary
The scan confirms the frontend is large and visually mature, but CSS ownership is complex.

Major risk signals:

- `public/control-center/styles/12-pages.css` is very large and likely owns many page-level rules.
- AI Command, Library, Media Studio, Content Studio, Workflows, Operations Centers, Settings, Publishing, Campaign Studio, and Integrations are large page files.
- Many prior visual/CSS audits exist, so the correct next step is consolidation and prioritization, not new design direction.
- Some pages use scoped or internal styling patterns.
- Future Customer Operations, IVR, and Audio Provider surfaces are planned/future and must not be treated as live UI surfaces.

## Classification Model
Each page is classified as one of:

- `global_css_owned`
- `scoped_css_owned`
- `hybrid_css_owned`
- `browser_qa_only`
- `needs_page_specific_css_ownership_audit`
- `do_not_touch_until_future_authority_phase`

## Page Matrix

| Page / Surface | Current CSS Ownership | Risk | Recommended Next Step | Priority |
|---|---|---|---|---|
| Home | hybrid_css_owned | Medium | Browser QA + small ownership confirmation only | P2 |
| Setup | hybrid_css_owned | Medium | Browser QA + verify existing Setup closeouts | P2 |
| Library | hybrid_css_owned | High | Do not add CSS; use existing Library canonical closeout and Browser QA only unless regression appears | P1 |
| Integrations | hybrid_css_owned | High | Page-specific CSS ownership audit before polish | P1 |
| AI Command | hybrid_css_owned | Very High | Browser QA / targeted ownership only; no broad CSS changes | P1 |
| Workflows | hybrid_css_owned | High | Preserve execution safety; page-specific visual ownership before polish | P1 |
| Campaign Studio | hybrid_css_owned | High | Page-specific ownership audit before UI finalization | P2 |
| Content Studio | scoped/hybrid_css_owned | High | Page-specific scoped CSS audit before polish | P2 |
| Media Studio | scoped_css_owned | Very High | Page-specific scoped CSS audit only; do not use broad global CSS | P1 |
| Publishing | scoped/hybrid_css_owned | Medium | Already safety + visual closed; Browser QA only unless regression | P1 |
| Ads Manager | global_css_owned | Medium | Browser QA + capability maturity audit later | P2 |
| Insights | global_css_owned | Medium | Browser QA + recommendations/power visibility review | P2 |
| Research | global_css_owned | Medium | Browser QA + decision-linking review | P2 |
| Governance | hybrid_css_owned | Medium | Browser QA + preserve authority/evidence model | P2 |
| Settings | hybrid_css_owned | High | Page-specific CSS ownership audit because Settings owns AI employees/policies/memory/provider configuration | P1 |
| Operations Centers | hybrid_css_owned | Medium | Already execution-authority closed; Browser QA only unless visual regression | P1 |
| Future Customer Operations sub-surface | Planned | P0 if implemented too early | Do not implement now; carry as future Operations sub-surface | Deferred |
| Future IVR / Call Center | Planned | P0 if claimed early | Do not implement now; future backend/provider authority phase | Deferred |
| Future Audio Provider Engine | Planned | P1 | Provider readiness audit later; keep scripts in Media/AI Command | Deferred |

## Priority Interpretation

### P1 — Protect and verify
These pages are important and risky. Do not redesign globally.

- AI Command
- Library
- Publishing
- Workflows
- Operations Centers
- Settings
- Media Studio
- Integrations

### P2 — Finalize after ownership is clear
These pages can be visually finalized after P1 ownership is stable.

- Home
- Setup
- Governance
- Campaign Studio
- Content Studio
- Insights
- Research
- Ads Manager

### Deferred
These must stay planned/future until implementation is explicitly approved.

- Customer Operations sub-surface
- IVR / Call Center
- Audio Provider Engine

## Decision
Start with **page-specific CSS ownership prioritization**, not implementation.

Do not edit production CSS yet.

Recommended next phase:

**PHASE 3T.8 — Settings CSS / AI Workforce Configuration Surface Ownership Audit**

Reason:
- Settings is now confirmed as the correct place for AI employees, policy, memory/data rules, approval owners, provider preferences, and agent setup defaults.
- It is a high-impact page but less risky than AI Command and Library.
- It prepares the system to show Operating Intelligence power without creating new pages.

## Protected Behavior
- No production changes.
- No CSS edits.
- No JS edits.
- No backend/API edits.
- No data/project edits.
- No route additions.
- No broad global CSS layer.
- Do not weaken execution authority closeouts.
- Do not undo Customer Operations placement.
- Do not undo Operating Intelligence placement.
- Do not claim future IVR/audio/customer ops pages as live.

## Recommended Next Step
Proceed to:

**PHASE 3T.8 — Settings CSS / AI Workforce Configuration Surface Ownership Audit**

Purpose:
- verify Settings CSS ownership
- verify Settings can support AI employee configuration, policies, memory/data rules, and provider preferences
- decide if Settings needs Browser QA only, small visual polish, or deeper ownership consolidation
