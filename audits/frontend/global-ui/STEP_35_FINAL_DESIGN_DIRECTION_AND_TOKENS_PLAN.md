# STEP 35 - Final Design Direction and Tokens Plan

Date: 2026-05-14  
Branch: architecture/frontend-consolidation-v1  
Mode: DOCUMENTATION ONLY

---

## Executive Summary

This step defines the final visual direction and token plan for MH-OS before implementing any clean global CSS layer.

This is a design-contract step, not an implementation step.

It establishes:
- final product feel
- operating page model
- token architecture
- component hierarchy expectations
- responsive strategy
- rollout and preservation constraints for STEP 36+

No production code, CSS, JS, backend, or data/projects behavior changes are made in this step.

---

## Final UX Vision

MH-OS should feel like an AI Business Operating System, not a crowded analytics dashboard.

Target feel:
- premium
- clear
- calm
- operational
- modern
- professional

Design intent:
- decision clarity over decorative density
- operational confidence over visual noise
- visible action intent over ambiguous controls
- stable hierarchy that scales across all core pages

---

## Design Principles

1. Authority clarity
- Backend is authority. Frontend expresses state, intent, and safe user execution pathways.

2. Operational readability
- Every surface should answer: what is happening, what is blocked, what is next.

3. Progressive focus
- Prioritize next-best-action and blockers first, details second.

4. Safety-first interaction
- Dangerous/durable/external actions remain explicit, grouped, and guarded.

5. Consistent primitives
- Reuse common tokens and component patterns before introducing new page-specific styling.

6. Controlled rollout
- No all-pages-at-once redesign. Page-by-page adoption with validation.

---

## Page Operating Model

All final pages should map to this operating structure:

1. Header / Overview
- page identity, project context, key status, immediate execution context

2. Main View
- primary workflow content and current operating state

3. Action Panel
- grouped actions by intent and risk (execute/review/navigate/danger)

4. AI / Context Panel
- context transfer, suggestions, reasoning prompts, controlled AI actions

5. Next Best Action
- a clear recommended next move with expected outcome

6. Readiness / Blockers
- visible blockers, dependencies, and readiness posture

---

## Token Categories

### 1) Color System

Core token groups:
- background
- surface
- text
- text-muted
- border
- primary
- success
- warning
- danger
- ai-accent

Recommended semantic structure:
- bg/base, bg/elevated, bg/overlay
- surface/default, surface/raised, surface/inset
- text/primary, text/secondary, text/muted, text/inverse
- border/subtle, border/default, border/strong
- intent/primary, intent/success, intent/warning, intent/danger, intent/ai

### 2) Radius System

Recommended scale:
- radius-sm: controls, chips
- radius-md: standard buttons/inputs/cards
- radius-lg: elevated cards/panels
- radius-xl: command/AI containers and key operating ribbons

### 3) Shadow System

Recommended shadow tiers:
- shadow-soft: default cards/panels
- shadow-medium: interactive elevated surfaces
- shadow-heavy: overlays, command surfaces, modal/fatal panels

### 4) Spacing Scale

Recommended spacing scale:
- 4, 8, 12, 16, 20, 24, 32, 40

Usage rule:
- internal component spacing should snap to this scale
- page-level composition should prefer 12/16/24/32 increments

### 5) Typography Scale

Recommended semantic scale:
- display: hero/major metric
- page-title
- section-title
- card-title
- body
- meta
- eyebrow/kicker

Usage rule:
- semantic naming over raw px values
- minimize ad-hoc per-page font-size overrides

### 6) Control and Surface Size Tokens

Button size tiers:
- button-sm
- button-md (default)
- button-lg (primary operating CTA)

Card/panel size tiers:
- panel-compact
- panel-standard
- panel-expanded

Density rule:
- default to panel-standard
- compact only for high-information rails/lists
- expanded only for primary operating surfaces

---

## Button Hierarchy

1. Primary
- single highest-priority action in a local action group

2. Secondary
- supporting actions that are still actionable and important

3. Ghost
- low-emphasis utility actions

4. AI / Context
- explicit context/send/suggest actions; never styled as destructive execution

5. Review
- readiness/review/approval-prep actions (non-terminal where applicable)

6. Navigation / Handoff
- route-forwarding and workspace transfer actions

7. Danger
- destructive/terminal/high-risk actions only, visually distinct, preserve confirmations

Hierarchy rules:
- one clear primary per cluster
- avoid equal visual weight for all actions
- danger actions separated from routine controls

---

## Card and Panel Rules

1. Use cards/panels to separate operating intent, not to over-fragment content.
2. Panel headers must expose purpose, current state, and primary next action.
3. Keep action-heavy panels visibly grouped by risk and authority domain.
4. Preserve existing IDs/data attributes/handlers while re-skinning in future steps.
5. Prefer tokenized spacing/radius/shadow over hard-coded page-specific values.

---

## AI/Context Visual Language

AI/context surfaces should communicate assistance and transfer, not hidden execution.

Rules:
- use dedicated ai-accent tokens (not danger or destructive color language)
- reinforce context transfer language patterns from prior safety/operating-surface steps
- keep AI controls visually adjacent to explanation/provenance text
- ensure AI actions are distinguishable from durable backend mutation actions

---

## Danger and Safety Visual Language

Safety-critical visual language requirements:

1. Danger actions retain explicit high-contrast risk styling.
2. Confirmed gates remain visible and functionally unchanged.
3. Durable/external-impact actions remain text-explicit and provenance-clear.
4. Success/warning/danger badges remain semantically consistent across pages.
5. Do not visually downgrade protected confirmations.

Protected behaviors remain mandatory:
- existing confirmations
- protected copy/provenance wording
- backend and route behavior

---

## State Patterns

All pages should standardize these state patterns:

1. Loading
- clear non-blocking or blocking loading state by scope

2. Empty
- explicit no-data/ready-to-start guidance and next action

3. Error
- clear failure reason + safe retry or recovery path

4. Disabled
- visually obvious disabled controls with reason where feasible

5. Unavailable
- capability unavailable due to context/role/dependency

6. Needs setup
- setup dependency state with direct route/action to resolve

7. Backend sync / durable saved
- explicit status language for sync completion and durable save confirmation

---

## Responsive Strategy

Target breakpoints:

1. Desktop
- full operating layout with visible side/context panels

2. Laptop
- preserve information hierarchy; compress spacing before removing structure

3. Tablet
- stack secondary panels after main flow; keep primary CTA and blockers visible above fold

4. Mobile
- single-column priority flow: context -> main -> actions -> AI/context

Responsive rules:
- maintain action hierarchy across breakpoints
- avoid hidden critical confirmations/actions
- avoid text replacement patterns that reduce clarity for critical actions

---

## Clean CSS Layer Placement Recommendation

Implementation placement for STEP 36:

1. Tokens source of truth
- keep semantic tokens centralized in token layer
- add/normalize final semantic tokens first, before component rewrites

2. Clean layer structure
- add a dedicated clean layer file set for:
  - foundations (typography/spacing/intent semantics)
  - components (button/card/panel/state patterns)
  - layout utilities (shell/page primitives)

3. Cascade safety
- do not blanket-override legacy/global files
- scope clean-layer adoption by page route and agreed page-shell primitives

4. Adoption model
- opt-in by page checkpoint sequence
- verify no break in IDs/data attrs/handlers/API paths/confirmations

---

## Rollout Constraints

Mandatory constraints for STEP 36+:

1. No all-pages-at-once redesign.
2. No legacy CSS deletion before clean-layer validation.
3. Preserve IDs, data attributes, handlers, API paths.
4. Preserve confirmations, route behavior, backend behavior.
5. Preserve improved copy/provenance wording.
6. Validate page-by-page with audit -> patch -> QA closeout -> checkpoint.

---

## Explicit Non-Goals (This Step)

1. No CSS patch yet.
2. No production code change.
3. No page redesign yet.
4. No cleanup deletion yet.

---

## Recommended STEP 36

Next step:
- STEP 36 - Clean Global CSS Layer Plan and Controlled Introduction

Expected STEP 36 scope:
- introduce the clean semantic layer structure
- map existing primitives to tokenized equivalents
- define first rollout target page and validation checklist
- do not remove legacy/old CSS until post-validation checkpoints

---

## Explicit No-Code-Change Statement

This document makes no production code changes.

No changes to:
- frontend JS
- CSS
- backend
- data/projects
- API behavior
- routes
- handlers
- IDs/classes/data attributes
