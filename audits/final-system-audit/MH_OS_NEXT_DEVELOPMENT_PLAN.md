# MH-OS / MH Assistant Next Development Plan
Date: 2026-05-11
Mode: Post-audit development plan
Doctrine: Backend owns operational authority. Frontend projects operational authority.

## Non-Negotiable Rules
1. Required UX pattern: Header + Main View + Action Panel + AI Panel.
2. Required AI pattern: contextual AI + AI Team + Next Best Action.
3. Required safety rule: no heavy runtime in render.
4. Required architecture rule: frontend projects backend authority.

## Before Any Page Work Starts
1. Accept the current reality.
- The backend is good enough to serve as the authority platform.
- The frontend is not yet fully projection-only.
- The shell is usable but high-risk because of listener density and mixed responsibilities.

2. Protect the backend rules.
- Do not weaken publishing guardrails.
- Do not weaken read/write key middleware.
- Do not weaken project isolation.

3. Protect the shell.
- Do not add new global listeners without explicit lifecycle ownership.
- Do not create more page-local authority fallbacks.

## Delivery Cycle For Every Page
For each page, always follow this sequence:
1. Audit: confirm the current page code, API usage, listeners, route ownership, and local authority duplication.
2. Confirm: validate the backend payloads and identify what the page should project rather than own.
3. Decide: lock the page contract around Header + Main View + Action Panel + AI Panel.
4. Implement plan: perform the scoped UI and architecture work for that page only.
5. Validate: run syntax and focused behavioral checks for the touched page and shell surface.

## Page-by-Page Development Order
### 1. Library
Why first:
- It is central to downstream page readiness.
- It is large, listener-heavy, and currently one of the highest regression risks.
What the page must become:
- Asset operating surface with durable readiness, source-of-truth visibility, action rail, and contextual AI rail.

### 2. Media Studio
Why second:
- It is the largest page and tightly coupled to approvals, publishing, and AI utilities.
What the page must become:
- Projection-first media production lane with clear review, handoff, and readiness rails.

### 3. Publishing
Why third:
- It is the safety-critical execution lane.
What the page must become:
- Backend-projected execution console that respects hybrid/manual states and surfaces publish guardrails directly.

### 4. Workflows
Why fourth:
- It currently carries too much orchestration and Auto Mode behavior in the frontend.
What the page must become:
- Operator workflow console that projects backend workflow state and only invokes allowed actions.

### 5. Governance
Why fifth:
- This page anchors approvals, violations, escalations, and policy visibility.
What the page must become:
- Canonical policy and review console with strong action and AI explanation lanes.

### 6. Settings
Why sixth:
- Team and policy configuration must stop duplicating canonical backend role definitions.
What the page must become:
- Configuration surface that edits backend truth rather than describing its own truth.

### 7. Operations Centers
Why seventh:
- These routes are close to the target operating-system concept and can set the standard for live queue/task/job/notification lanes.
What the page must become:
- Reference implementation of contextual action rail and contextual AI rail for selected operational items.

### 8. AI Command
Why eighth:
- The AI experience must be aligned after governance, settings, and workflows are stabilized.
What the page must become:
- Shell-consistent AI command surface driven by backend team projection, artifacts, recommendations, and memory.

### 9. Content Studio
Why ninth:
- It depends on stable media, publishing, governance, and AI patterns.
What the page must become:
- Projection-first content production and review lane with durable approvals and handoffs.

### 10. Campaign Studio
Why tenth:
- Campaign planning should inherit stabilized downstream routing semantics.
What the page must become:
- Planning lane that routes work through backend-owned roles and domains.

### 11. Integrations
Why eleventh:
- Better after the shell, action rails, and status semantics are already standardized.
What the page must become:
- Connector operating surface with clear support tiers, diagnostics, and recovery actions.

### 12. Insights
Why twelfth:
- Recommendation provenance and next-best-action can be shaped after upstream operational surfaces are stabilized.
What the page must become:
- Intelligence lane with backend-derived evidence, confidence, and recommended actions.

### 13. Research
Why thirteenth:
- Research-to-action routing should inherit final handoff and ownership patterns.
What the page must become:
- Research operating lane with durable routing and memory visibility.

### 14. Setup
Why fourteenth:
- Setup should align to the final operating model after the rest of the platform patterns settle.
What the page must become:
- Onboarding lane that feels like the same operating system, not a disconnected wizard.

### 15. Home
Why fifteenth:
- Home should be finalized after the rest of the lanes produce stable projected data and actions.
What the page must become:
- Executive operating surface, not a generic dashboard.

### 16. Ads Manager
Why last:
- It is less mature in durable backend execution terms than the other major lanes.
What the page must become:
- Backend-linked paid operations lane once the core operating model is already stable.

## Required UX Pattern Per Page
Every page implementation plan must explicitly define:
1. Header
- Role-aware title, status, key readiness markers, and route-specific next-best-action context.

2. Main View
- The primary work surface for the page's durable entities and operator tasks.

3. Action Panel
- Route-specific safe actions, approvals, handoffs, save states, and downstream routing options.

4. AI Panel
- Contextual AI assistance, AI Team visibility, AI memory/recommendations, and operator guidance tied to the selected page entity.

## Required AI Pattern Per Page
1. Contextual AI
- AI assistance must be page-aware and entity-aware.

2. AI Team
- Team roles shown in the page must come from backend-projected team/service model semantics wherever those semantics matter operationally.

3. Next Best Action
- Must be traceable to backend-derived readiness, operations, recommendations, or governance state whenever possible.

## Required Safety Rule
No heavy runtime in render.
What this means:
- No new large recommendation engines inside page render functions.
- No unbounded repeated DOM rebinding.
- No new global listeners without explicit ownership and route-safe behavior.

## Required Architecture Rule
Frontend projects backend authority.
What this means:
- Route permissions are not frontend-owned.
- Approval ownership is not frontend-owned.
- Governance rules are not frontend-owned.
- Workflow ownership semantics are not frontend-owned.
- Publishing authority is not frontend-owned.
- AI team semantics that affect routing or action authority are not frontend-owned.

## Ready-To-Start Gate
Page-by-page frontend development may start only under this interpretation:
- The system is not fully complete.
- The backend is sufficiently authoritative to support controlled page work.
- The team must treat current authority duplication and shell risk as active constraints.

## First Recommended Page
Library is the recommended first page to develop.
Reason:
- It is both a foundational dependency for downstream media/publishing work and one of the highest-risk current pages.
- Improving it first creates leverage for Media Studio, Publishing, and overall readiness UX.
