# STEP 33B — Global UI/UX Preservation Contract

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: DOCUMENTATION ONLY

---

## 1) Purpose

This contract defines the non-negotiable preservation rules for all future Global UI/UX, CSS, and page-by-page final design work.

It exists to protect the current stabilized frontend while enabling a modern final launch-ready interface.

---

## 2) Canonical Doctrine

MH-OS is an AI Business Operating System.

Frontend role:
- project operational authority
- guide user experience
- organize views
- clarify action intent
- surface AI/context/workflow paths

Backend role:
- own operational authority
- own durable records
- own governance and approvals
- own execution authority
- own integrations and persistent state

Doctrine:
- Backend = Authority
- Frontend = Projection + Experience
- UI/UX work must never move authority from backend into frontend.

---

## 3) Mandatory Preservation Rules

All future UI/UX and CSS work must preserve:

1. Existing IDs.
2. Existing data attributes.
3. Existing handlers.
4. Existing API call paths.
5. Existing confirmations.
6. Existing backend behavior.
7. Existing route behavior.
8. Existing improved copy/provenance wording.
9. Existing safety gates.
10. Existing data/projects content and schema.

No page redesign may weaken or remove safety/provenance language.

---

## 4) Protected Safety Gates

The following confirmed safety gates must remain intact:

- Publishing publish confirmation.
- Publishing fail confirmation.
- Governance policy save confirmation.
- Settings critical save confirmation.
- Integrations disconnect confirmation.
- Library archive confirmation.
- Library soft-delete confirmation.
- Library non-approve status change confirmation.

Any UI redesign must explicitly verify these gates remain visible and functional.

---

## 5) Protected Copy / Provenance Language

The following wording improvements must not be shortened back into ambiguous labels:

Library:
- `Upload asset to Library`
- `Uploading to Library...`
- `Refresh Library scan`
- `Library backend scan refreshed.`
- clarified Action Panel and AI Panel labels

Publishing:
- `Save publishing draft`
- `Send publishing context to AI`
- `Auto-prepare publishing plan`
- `Approve automation step`
- `Skip automation step`
- `Publish to configured channels`
- `Mark item ready for publishing`
- `Mark publishing item as failed`

Campaign Studio:
- `Refresh campaign intelligence`
- `Save campaign draft`
- `Save campaign plan`
- `Send campaign context to AI`
- `Campaign context sent to AI Command.`
- `Campaign draft saved to the shared operating backbone.`
- `Campaign plan saved as a durable shared record.`
- `Review campaign dependencies`
- `Review campaign assets in Library`

---

## 6) Allowed UI/UX Work

Allowed:
- visual hierarchy improvements
- layout grouping
- button grouping
- spacing refinement
- responsive polish
- card/panel structure improvements
- typography consistency
- clean global CSS layer introduction
- existing shared class reuse
- page-specific CSS only when justified and documented

---

## 7) Forbidden UI/UX Work Without Separate Approval

Forbidden:
- changing IDs
- changing data attributes
- changing handlers
- changing API calls
- changing backend behavior
- changing route behavior
- changing data/projects
- deleting confirmations
- weakening copy/provenance labels
- adding frontend-only durable state
- moving authority into frontend
- broad rewrites
- all-pages-at-once redesign
- deleting old CSS before the clean layer has been validated

---

## 8) CSS Strategy

Global CSS work must follow this order:

1. Audit current CSS stack.
2. Define final design direction and tokens.
3. Add a clean global CSS layer in a clearly marked block/file.
4. Apply page-by-page.
5. Validate each page.
6. Only after stability, audit duplicated/legacy CSS.
7. Remove unused or repeated CSS safely.

Do not delete legacy/old CSS before the new clean layer has been proven.

---

## 9) Final Page Completion Criteria

A page is Final UI/UX Ready only when:

1. Header / overview is clear.
2. Main View is clear.
3. Action Panel or action area is clear.
4. AI / Context Panel is clear.
5. Buttons are grouped by risk and purpose.
6. Backend/durable actions are clearly labelled.
7. AI actions are clearly context/review/suggestion actions.
8. Dangerous actions remain protected.
9. Layout is responsive enough for desktop/tablet/mobile.
10. IDs, data attributes, handlers, API paths, and confirmations are preserved.
11. Syntax validation passes.
12. Browser QA checklist exists.
13. QA closeout exists.
14. Checkpoint exists.

---

## 10) Required Execution Pattern

Every final UI/UX page upgrade must follow:

1. Page UI/UX Audit
2. Design Plan
3. Small scoped UI/UX Patch
4. Validation
5. Browser QA checklist
6. Commit
7. QA Closeout
8. Page Checkpoint

No page may be marked complete without a closeout and checkpoint.

---

## 11) Global Design Readiness Gate

Before any final page redesign starts, the following must exist:

- STEP 33A final execution inventory
- missing patch docs completed
- this preservation contract
- Global UI System Audit
- Final Design Direction / Tokens Plan
- Clean Global CSS Layer plan

---

## 12) Explicit No-Code-Change Statement

This contract makes no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- API behavior
- routes
- handlers
- IDs/classes/data attributes
