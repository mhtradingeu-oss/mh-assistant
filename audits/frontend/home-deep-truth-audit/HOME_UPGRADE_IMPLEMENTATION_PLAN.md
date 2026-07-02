# HOME UPGRADE IMPLEMENTATION PLAN — MH-OS / MH Assistant

## 1. Executive Summary

The Home upgrade will transform the Home page into a powerful, executive operating surface for MH-OS, focused on clarity, truth, and safe handoff. The goal is to surface system readiness, AI Team, Customer Operations, and key governance signals without crowding the interface or making unsupported claims. Home must always reflect backend authority and never project fake CRM, IVR, or autonomous execution. 

**What must not be done:**
- No fake data, live CRM, live IVR, or autonomous agent claims
- No direct write controls or live customer operations on Home
- No crowded dashboard or dense tables
- No backend/data changes unless required for new projections

## 2. Current Home Structure Map

- **Sections:** Executive status strip, Next Best Action, Operations Pulse, Source of Truth/Library, Media/Publishing, AI Guidance, Quick Actions, AI Team role cards
- **Actions:** Handoff to AI Command, Operations Centers, Library, Publishing, Governance, Media Studio, Setup, Integrations, Campaign Studio
- **Data dependencies:** Project overview, readiness, integrations, activity, assets, operations, notifications, tasks, approvals, media jobs, publishing queue, learning/insights, campaign state
- **Connected routes:** ai-command, operations-centers, library, publishing, governance, media-studio, setup, integrations, campaign-studio

## 3. Target Home Model

- Executive status strip (system health, readiness, escalations)
- Next Best Action (AI-driven, always visible)
- AI Team Command Center (compact card, 3–5 role chips)
- Operations Pulse (tasks, blockers, failed jobs, approvals)
- Customer Operations Pulse (compact card, handoff only)
- Source of Truth Confidence
- Launch Readiness (campaign + publishing + media)
- Release/Governance Readiness
- Research/Learning/Recommendations pulse
- Connected page handoff cards (one per major surface)
- Use “summary + handoff”, not detailed operational tables

## 3A. P1 Home Layout Order

| Order | Section | Purpose | Shows | Must Not Show | Route / Handoff |
|---|---|---|---|---|---|
| 1 | Executive System Authority Strip | Prove the system is healthy and controlled | backend health, readiness, blockers, protected mode | raw logs, backend controls, fake authority | Settings / Governance |
| 2 | Next Best Action | Give the user one clear priority | recommended action, reason, owning surface | long task lists, fake autonomous execution | AI Command / target page |
| 3 | AI Team Command Center | Show the power of the AI Team without clutter | 3-5 role chips, full team handoff, specialist entry | full agent list, fake active agents | AI Command |
| 4 | Operations Pulse | Show operational movement | tasks, blockers, approvals, failed jobs if available | dense tables, direct write controls | Operations Centers |
| 5 | Customer Operations Pulse | Show customer-side readiness safely | partial/readiness state, handoff | live CRM dashboard, inbox table, call controls | Operations Centers / AI Command |
| 6 | Source of Truth Confidence | Show content/data trust | library/source status, coverage, review handoff | raw file lists, unsupported live claims | Library |
| 7 | Launch Readiness | Combine campaign, publishing, and media readiness | campaign/publishing/media state | detailed campaign management | Publishing / Media Studio / Campaign Studio |
| 8 | Release / Governance Readiness | Show launch safety and approval state | governance summary, release blockers | admin controls, legal/approval execution | Governance |
| 9 | Research / Learning / Recommendations | Surface intelligence signals | insights/readiness if available, ask AI fallback | advanced research claims without backend proof | AI Command / Research surface later |
| 10 | Connected Page Handoff Row | Give fast navigation | cards to main operating surfaces | duplicate dashboard content | Connected pages |

P1 Home should use this order to feel powerful, calm, and executive. Each section should summarize and hand off, not become a second version of the target page.

## 4. P0 Safety Rules

- No fake data
- No live CRM claim
- No live IVR claim
- No autonomous execution claim
- No direct write controls on Home
- Backend = Authority, Home = Executive Projection

## 5. Data Contract Plan

Classification rules:

- **Available now / use existing projection:** safe for P1 if already present in Home/backend state.
- **P1 fallback only:** may be shown as a safe status or handoff, but must not claim live capability.
- **P2 backend projection needed:** should wait for backend projection before showing live metrics.
- **P3 future/live feature:** should not be presented as active until backend, auth, privacy, and QA proof exist.

P1 should not require backend work unless existing Home data is missing or unreliable.

| Section | Current Data Source | Missing Backend Projection | Fallback Display | Priority / Classification |
|---|---|---|---|---|
| Executive status strip | overview, readiness | - | "Partial"/"Unknown" | P1 — Available now / use existing projection |
| Next Best Action | readiness, recommendations | - | "Ask Executive AI" | P1 — Available now / use existing projection |
| AI Team Command Center | AI Team handoff / role references | ai_team_status, role_statuses | "Open Full Team" handoff only | P1 — fallback only; live status later |
| Operations Pulse | operations, tasks, blockers | - | "No active blockers" | P1 — Available now if existing projection is present |
| Customer Operations Pulse | customer_ops partial signals | customer_ops_status | "Planned/Partial" | P1 — fallback only; no live CRM claim |
| Source of Truth Confidence | assets, library | - | "Review in Library" | P1 — Available now / use existing projection |
| Launch Readiness | campaign, publishing, media | - | "Prepare in Campaign Studio" | P1 — Available now if existing projection is present |
| Release/Governance Readiness | governance, approvals | - | "See Governance" | P1 — Available now if existing projection is present |
| Research/Learning/Recommendations pulse | insights, learning | advanced recommendation projection | "Ask Executive AI" | P2 — backend projection should mature |
| CRM/Inbox/Tickets | not live | crm_readiness, ticket_summary | "Planned/Partial" | P2 — backend projection needed |
| Voice/IVR/Comms | not live | voice_ivr_status, comms_ready | "Planned/Not Ready" | P3 — future/live feature |
| Native Video/Advanced Metrics | not live | native_video_status | "Planned" | P3 — future/live feature |

## 6. UI/UX Plan

- **Add:** AI Team Command Center card, Customer Operations Pulse card, Communication Readiness badge (if data exists)
- **Rename:** "AI Guidance" → "Executive AI Guidance"
- **Merge:** Campaign/Publishing/Media into "Launch Readiness"
- **Move behind details:** Advanced research, CRM, governance
- **Keep as handoff only:** Customer Operations, CRM, IVR, Tickets, Inbox, Voice/Comms

## 7. AI Team Command Center Design

- Show only 3–5 most relevant role chips
- "Open Full Team" handoff button
- Connect to Next Best Action
- No full agent list or fake active status on Home
- All advanced agent actions remain in AI Command

## 8. Customer Operations / CRM / IVR Design

- Customer Operations Pulse card (status + handoff only)
- CRM as partial/readiness only unless backend proves live
- IVR/Voice as planned/not-ready communication readiness only unless backend proves live
- No live controls, inbox, or ticket tables on Home
- Handoff to Operations Centers or AI Command for all advanced actions

## 9. Implementation Sequence

- **P0:** Data contract verification (no fake data, no unsupported claims)
- **P1:** Visual/UX Home upgrade (add cards, badges, handoff logic)
- **P2:** Backend-projected CRM, research, video metrics (when available)
- **P3:** Live IVR/customer operations only after backend implementation and QA proof

## 9A. Minimum Viable P1 Scope

Implement first:

- Add or clarify System Authority / Backend Health.
- Add AI Team Command Center card with 3-5 contextual role chips.
- Add Customer Operations Pulse as readiness/handoff only.
- Merge campaign, publishing, and media into Launch Readiness.
- Strengthen Source of Truth Confidence.
- Strengthen Release / Governance summary.
- Show Communication Readiness only as planned/not-ready unless backend data proves otherwise.

Do not implement in P1:

- No live CRM dashboard.
- No IVR controls.
- No ticket inbox table.
- No autonomous execution.
- No native video claims.
- No advanced ad performance widgets.
- No direct write controls from Home.

P1 should be one controlled Home projection upgrade, not a full system rebuild.

## 10. Exact Files Expected To Change Later

- Likely: public/control-center/pages/home.js
- Likely: public/control-center/styles/12-pages.css, 14-page-standard.css
- Maybe: backend API/data contracts (only if new projections needed)
- Must not change: core backend authority, data/projects, system governance, or any non-Home page without audit

## 11. Browser QA Checklist After Implementation

- Home page loads without error
- No console or network errors
- All handoff cards route to correct pages
- No fake data or unsupported claims
- Layout is not crowded
- Mobile/responsive layout works
- Accessibility and keyboard navigation pass

## 11A. Success Criteria

The P1 Home upgrade is successful only if:

- Home loads with no console errors.
- No stuck loading state appears.
- No fake data or unsupported live capability appears.
- All new cards route correctly.
- Layout remains clean and not crowded.
- Only 3-5 AI role chips are visible.
- Customer Operations / CRM / IVR are shown only as safe readiness or handoff.
- Browser QA passes after implementation.
- Git diff is limited to Home and CSS files unless a backend need is explicitly proven.

## 12. Risk Register

- Clutter risk if too many cards/details are added
- Duplicate authority risk if backend controls are surfaced on Home
- Fake CRM/IVR/agent risk if unsupported claims are made
- User trust risk if Home claims unproven automation
- Privacy/security risk for customer data
- Performance risk if Home tries to load all data at once
- Layout density risk if too many sections are visible by default

## 13. Final Recommendation

- Implement P1 Home upgrade now, but only as a small controlled Home projection and UX patch.
- Do not add P2/P3 backend projections yet.
- The first implementation should be one limited patch for Home page projection, card structure, labels, and handoff clarity.
- Backend work is only needed if P1 data contract verification proves an existing projection is missing or unreliable.
- Defer live CRM, IVR, tickets, native video, and advanced campaign metrics until backend implementation, auth, privacy, and QA proof exist.
- Keep Home powerful, executive, and clean — not crowded.
- Always preserve: Backend = Authority, Home = Executive Projection.
