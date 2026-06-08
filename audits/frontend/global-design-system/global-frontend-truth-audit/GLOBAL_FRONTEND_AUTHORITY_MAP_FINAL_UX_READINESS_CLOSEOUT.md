# Global Frontend Authority Map / Final UX Readiness Closeout

## Status

Closed and pushed.

This closeout summarizes the full frontend authority mapping sequence completed after the Global Frontend Truth Audit and the page-by-page authority audits.

## Branch

- `architecture/frontend-consolidation-v1`

## Purpose

This document establishes the current safe operating map for MH-OS / MH Assistant frontend development.

It confirms:

- which pages are projection-only
- which pages are local/session-only
- which pages can write durable records
- which pages are backend-authoritative
- which pages are governance-sensitive
- which pages are publishing/execution-sensitive
- which pages are source/evidence-sensitive
- which pages are safe for narrow copy polish
- which pages require browser QA before any production patch

## Completed Audit Groups

### 1. Global Frontend Truth Audit

Completed baseline:

- `df65bb9 Add global frontend truth audit and upgrade plan`

Result:

- Established global navigation/page map.
- Established design-system authority map.
- Established page readiness matrix.
- Established safe global upgrade opportunities.
- Established first five patch plan.

---

### 2. First Five Global UX Patches

Closeout:

- `ec9edaf Close first five global frontend UX patches`

Covered:

- Sidebar platform reframe.
- Ads Manager operating language.
- Integrations control center hierarchy.
- Workflows operating path.
- Customer Center read-only AI handoff audit.

Result:

- Navigation and selected low-risk pages were clarified without introducing new execution authority.

---

### 3. Production Studio + Intelligence

Closeout:

- `96c2538 Close production studio and intelligence UX patches`

Covered:

- Content Studio authority/convergence audit.
- Media Studio authority/creative readiness audit.
- Insights intelligence action hierarchy.
- Research evidence handoff clarity.

Result:

- Content/Media were kept audit-only due to authority-sensitive save/approval/generation/handoff behavior.
- Insights/Research were safely clarified with copy/hierarchy-only changes.

---

### 4. Settings + Governance Authority

Closeout:

- `4388786 Close Settings and Governance authority audits`

Covered:

- Settings control plane authority.
- Settings/Governance contract.
- Governance authority/policy surface.
- Governance backend contract.

Result:

- Settings and Governance are documented as high-authority surfaces.
- Durable Team/Governance writes and approval decisions remain backend-authoritative and confirmation-gated.

---

### 5. Publishing Authority

Closeout:

- `89f9930 Close Publishing authority audits`

Covered:

- Publishing execution/gate authority.
- Publishing backend contract.

Result:

- Publishing is documented as a high-authority execution/gate surface.
- Schedule/reschedule/approval/manual completion/fail behavior must remain backend/gate controlled.

---

### 6. Build / Grow Authority

Closeout:

- `00a420c Close Build and Grow authority audits`

Covered:

- Campaign Studio authority/handoff.
- Campaign Studio save/handoff contract.
- Ads Manager paid growth authority.
- Publishing group already covered above.

Result:

- Campaign Studio is planning/save/handoff/intelligence.
- Ads Manager is local planning/projection only.
- No autonomous campaign/publish/paid execution introduced.

---

### 7. Setup Foundation Authority

Closeout:

- `28b8b03 Close Setup foundation authority audits`

Covered:

- Setup foundation/project defaults.
- Setup persistence/template contract.

Result:

- Setup is documented as a high-impact foundation surface.
- Backend setup save, local drafts, business templates, AI local fill, and route continuation are clearly separated.

---

### 8. Library Source Authority

Closeout:

- `6c2878f Close Library source authority audits`

Covered:

- Library source-of-truth authority.
- Library upload/source/handoff contract.

Result:

- Library is documented as the source/evidence authority.
- Upload, protected preview, source marking, status, rename/archive/delete, AI extraction, and AI source handoff are high-impact and require caution.

---

### 9. AI Command Authority

Closeout:

- `add0082 Close AI Command authority audits`

Covered:

- AI Command / AI Team / Tool Drawer authority.
- AI Command execution/source/tool drawer contract.

Result:

- AI Command is documented as the central AI operating room.
- AI Team, composer, session, Tool Drawer, Library source bridge, output routing, and AI execution-adjacent behavior are mapped.
- AI Command prepares/reviews/handoffs; it must not silently approve, publish, send, mutate, or execute destination-owned actions.

---

### 10. Operations Authority

Closeout:

- `d669442 Close Operations authority audits`

Covered:

- Operations / Task / Queue / Job / Notifications authority.
- Operations read-state / Governance decision / mutation boundary contract.

Result:

- Operations is documented as operational projection plus limited control.
- Task/Queue/Job mutations remain disabled.
- Notification Mark Read is read-state only.
- Governance decisions are durable and confirmation-gated.

## Global Authority Map

### Projection / Readiness Surfaces

These pages primarily project state, readiness, guidance, or intelligence:

- Home
- Insights
- Research
- Ads Manager
- Operations Overview
- Job Monitor
- Queue Center
- Task Center

These can receive narrow copy/hierarchy polish after browser QA, but must not gain mutation behavior casually.

### Local / Session Surfaces

These pages contain local/session state that affects UX continuity:

- Ads Manager budget/session state
- Setup local draft state
- AI Command chat/session state
- Library selected asset/session state
- Campaign Studio campaign session state
- Operations selected item/filter state

These require interaction QA before even copy/layout changes if rerendering or bindings may be affected.

### Source / Evidence Authority

Source/evidence authority belongs to:

- Library
- Research
- Governance evidence intake
- AI Command selected Library source context

Library is the main source-of-truth surface. Source marking, asset status, protected preview, AI source handoff, and document extraction must remain explicit and non-governance unless Governance approves.

### Setup / Foundation Authority

Foundation authority belongs to:

- Setup
- Settings

Setup owns initial project foundation and backend setup persistence.
Settings owns durable defaults, team roles, governance policy, publishing posture, AI behavior, sync posture, and safety posture.

### AI Operations Authority

AI operations authority belongs to:

- AI Command
- AI Team / Tool Drawer
- Customer Center AI panel
- Operations AI prompts
- Workflows AI review path
- Content/Media/Publishing/Research/Insights AI handoffs

AI may draft, review, summarize, route, and prepare.
AI must not silently approve, publish, send, execute, mutate, or override governance.

### Build / Production Authority

Build and production planning authority belongs to:

- Campaign Studio
- Content Studio
- Media Studio
- Workflows

These surfaces can prepare packages, drafts, briefs, handoffs, and review context.
Execution remains destination-owned and backend/governance-controlled where applicable.

### Publishing / Execution Authority

Publishing/execution authority belongs to:

- Publishing
- Governance
- Operations/job worker paths
- backend services

Publishing remains schedule/gate/manual-completion/fail sensitive.
Governance remains approval/policy authority.
Operations worker controls remain disabled until explicitly implemented with safety gates.

### Governance Authority

Governance authority belongs to:

- Governance
- Settings-derived Governance Policy
- Notification Center linked approval decisions

Governance decisions must remain backend-authoritative and confirmation-gated.

## Safe Next Work

### Phase A — Final Browser QA

Run browser QA before additional production polish:

1. Sidebar / routing / active state.
2. Home overview.
3. Setup draft/save/template/AI helpers.
4. Library upload/preview/source/AI source handoff.
5. AI Command composer/Tool Drawer/Library source return flow.
6. Campaign Studio save/handoffs/intelligence.
7. Content Studio source/provenance/save/handoffs.
8. Media Studio output/library/publishing package.
9. Publishing queue/schedule/manual completion/asset blockers.
10. Settings save/restore/governance handoff.
11. Governance decisions/policy/evidence.
12. Operations Task/Queue/Job/Notification.
13. Insights/Research route handoffs.
14. Ads Manager budget/prompt/nav.
15. Mobile sidebar and scrolling.
16. Console errors.

### Phase B — Final UX Polish Candidates

Low-risk candidates after browser QA:

- Home executive hierarchy polish.
- Sidebar density/scroll polish.
- Ads Manager copy guard if needed.
- Insights/Research minor density polish.
- Operations disabled-action clarity copy.
- AI Command source-required warning copy.
- Library source/approval wording copy.
- Setup local-vs-backend save wording copy.

### Phase C — Design-System Consolidation Plan

Before broad CSS edits, create a dedicated design-system consolidation audit:

- list duplicate page-specific selectors
- identify authoritative global patterns
- identify selectors not safe to delete
- map page-specific override layers
- plan one CSS cleanup patch at a time
- run browser QA after each cleanup

### Phase D — Backend / Authority Implementation Work

Only after authority map + browser QA:

- enable task mutations if backend contract exists
- enable queue retry only with backend contract
- enable job retry/cancel/rerun only with worker safety
- strengthen notification lifecycle only with backend contract
- improve Publishing gates only with backend/governance contract
- improve Library asset mutation UX only with backend contract
- improve AI Command routing only with destination contracts

## Do Not Do Next

Avoid:

- broad CSS refactors
- deleting legacy selectors blindly
- changing route IDs
- changing handlers without contract
- touching data/projects during frontend polish
- changing backend/API during frontend UX pass
- enabling disabled mutations
- adding autonomous publish/send/approve/execute behavior
- claiming AI performs actions that remain destination/backend/governance-owned

## Final Validation Pattern

Use this baseline after any future frontend patch:

```bash
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
node --check <touched-page-file>
git status --short
git diff --stat
```

For multi-file surfaces, also check their modules, for example:

```bash
node --check public/control-center/pages/ai-command.js
node --check public/control-center/pages/ai-command/tool-dock.js
node --check public/control-center/pages/library.js
for f in public/control-center/pages/library/*.js; do
  [ -f "$f" ] && node --check "$f"
done
node --check public/control-center/pages/operations-centers.js
```

## Final State

The frontend authority map is complete enough to move into Browser QA and final UX polish planning.

No production behavior was changed by this closeout.
