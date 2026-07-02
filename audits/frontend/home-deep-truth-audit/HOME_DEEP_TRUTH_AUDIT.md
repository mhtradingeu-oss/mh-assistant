# HOME DEEP TRUTH AUDIT — MH-OS / MH Assistant

## 1. Executive Summary

**Current Home Status:**
- The Home page is **partially complete** and **not overloaded**, but is **incomplete** as an executive operating surface. It projects system power through summary, handoff, and AI guidance, but some system capabilities are weakly surfaced or missing.
- Home does not feel crowded, but some critical system truths and backend authority signals are not clearly visible.
- The Home page shows the intended power of MH-OS in terms of readiness, next best action, and AI handoff, but does not fully reflect all backend authority or system health dimensions.
- All claims below are based on static evidence, not full functional QA.

## 2. Current Home Truth

**Sections/Cards/Actions Present:**
- Executive status strip (system health, readiness, blockers, escalations)
- Next Best Action (AI-driven, with handoff to AI Command or other pages)
- Operations pulse (tasks, blockers, failed jobs, approvals, notifications)
- Source of Truth / Library status
- Media readiness
- Campaign/Publishing readiness
- AI Guidance panel (explains blockers, readiness, and next actions)
- Quick action buttons (Operations, AI Team, Campaign Studio, Library, Integrations, Setup)
- AI Team role cards (specialist handoff)

**Data Used:**
- Evidence indicates Home references project overview, readiness, integrations, activity, assets, operations, notifications, tasks, approvals, media jobs, publishing queue, learning/insights, and campaign state.
- Data appears to be sourced from backend APIs and project data contracts, but full implementation and coverage require verification.

**Connected Pages Reachable:**
- Evidence indicates Home appears to route to AI Command, Operations Centers, Library, Publishing, Governance, Media Studio, Setup, Integrations, and Campaign Studio.
- Handoff and routing logic appears present for all major operating surfaces, but requires functional QA before being considered fully proven.

**Browser Accessibility:**
- Home loads successfully (`status=200`), renders as intended, and connects to backend orchestrator-service (browser accessibility proven).

**Functional Behavior:**
- Functional behavior of all actions, forms, and backend data flows is **not fully proven** by evidence; implementation verification is required for data contract coverage and protected flows.

## 3. System Capability Coverage Matrix

| Capability                        | Home Visibility         |
|-----------------------------------|------------------------|
| Backend authority / system health | Weakly visible         |
| Setup readiness                   | Clearly visible        |
| AI Team / AI Command              | Linked, not explained  |
| AI Team individual roles          | Weakly visible / linked|
| Smart Tool Drawer                 | Linked, not explained  |
| Library / Source of Truth         | Clearly visible        |
| Operations / Task Center / Queue  | Clearly visible        |
| Customer Operations               | Linked, not explained  |
| CRM / Sales                       | Linked, not explained  |
| Support / Tickets / Inbox         | Linked, not explained  |
| Publishing                        | Clearly visible        |
| Governance                        | Linked, not explained  |
| Media Studio / Video Generator    | Linked, not explained  |
| Content / Campaign / Ads          | Linked, not explained  |
| Research / Learning / Recommendations | Weakly visible    |
| Integrations                      | Clearly visible        |
| Release readiness                 | Weakly visible         |
| Voice / IVR                       | Missing / planned only |
| Communications: Calls / WhatsApp / SMS | Missing / planned only |
| Next Best Action                  | Clearly visible        |

## 3A. AI Team / Agent Coverage on Home

| AI Team Role / Agent      | Home Visibility           | Notes / Recommendation                |
|--------------------------|---------------------------|---------------------------------------|
| Strategist               | Linked, not explained     | Should be a chip, not a full card     |
| Writer                   | Linked, not explained     | Should be a chip, not a full card     |
| Media                    | Linked, not explained     | Should be a chip, not a full card     |
| Video Lead               | Linked, not explained     | Should be a chip, not a full card     |
| Publisher                | Linked, not explained     | Should be a chip, not a full card     |
| Ads                      | Linked, not explained     | Should be a chip, not a full card     |
| Analyst                  | Linked, not explained     | Should be a chip, not a full card     |
| Researcher               | Missing / planned only    | Should stay inside AI Command         |
| Compliance Reviewer      | Linked, not explained     | Should be a chip, not a full card     |
| Operations               | Linked, not explained     | Should be a chip, not a full card     |
| Customer Operations      | Linked, not explained     | Should be a chip, not a full card     |
| Sales / CRM              | Missing / planned only    | Should stay inside AI Command         |
| Smart Tool Drawer        | Linked, not explained     | Should stay inside AI Command         |
| Full Team Mode           | Linked, not explained     | "Open Full Team" handoff only         |
| Solo Specialist Mode     | Linked, not explained     | Next Best Action connection only      |

**What Home should show:**
- One compact “AI Team Command Center” card
- 3–5 role chips only (most relevant roles)
- “Open Full Team” handoff button
- Next Best Action connection
- No long list of agents on Home

**What should remain inside AI Command:**
- Full agent list, Smart Tool Drawer, advanced role details, and all review/approval flows

**Recommended UX model:**
- Compact “AI Team Command Center” card
- 3–5 role chips (contextual, not static)
- “Open Full Team” handoff
- Next Best Action always visible
- No autonomous agent claims unless backend state proves active

**Risk note:**
- Do not show fake active agents unless backend state proves they are active
- Do not imply autonomous execution unless action gates and approvals exist
- Keep review-only and approval boundaries clear

## 3B. Customer Operations / CRM / IVR Coverage on Home

| Customer Operations / CRM / IVR | Home Visibility           | Notes / Recommendation                |
|---------------------------------|---------------------------|---------------------------------------|
| Customer Operations             | Linked, not explained     | Pulse card only, handoff to Ops Center|
| CRM                             | Missing / partial         | Planned only, not live                |
| Sales / CRM Agent               | Missing / planned only    | Should stay inside AI Command         |
| Support / Inbox                 | Linked, not explained     | Handoff only, not live inbox          |
| Tickets                         | Linked, not explained     | Handoff only, not live table          |
| Customer follow-up              | Missing / planned only    | Should stay inside Ops Center         |
| Voice / IVR                     | Missing / planned only    | Show only as planned, not live        |
| Calls / Phone                   | Missing / planned only    | Show only as planned, not live        |
| WhatsApp / SMS                  | Missing / planned only    | Show only as planned, not live        |

**Important truth:**
- If CRM or Customer Operations are only partial, say partial.
- If IVR/Voice is not implemented end-to-end, say not implemented / planned only.
- Do not suggest Home should show live IVR, live calls, or active CRM metrics unless backend proof exists.
- Home may show a safe “Customer Operations Readiness” or “Communication Readiness” pulse, but only as status + handoff, not as a live control center.
- Details belong in Customer Operations / Operations Centers.

## 4. What Home Already Does Well
- Provides a clean executive summary without clutter
- Surfaces readiness, blockers, and next best action
- Appears to connect to all major operating surfaces via handoff (requires functional QA)
- Evidence indicates backend data is used for key metrics (not hardcoded, but requires implementation verification)
- AI Guidance panel explains operational context and blockers
- Quick actions and handoff logic appear robust, but require functional QA before being considered fully proven

## 5. What Home Is Missing
- Strong, explicit backend authority/system health signals
- Deeper release readiness and governance status
- Direct explanation of AI Team, Smart Tool Drawer, Customer Operations, Media Studio, and Research capabilities
- Contextual handoff for advanced research, campaign, and content/ads
- Live campaign/ad performance and advanced recommendations (not present; no evidence supports these as live features)
- Some metrics (e.g., CRM, native video generation, advanced research) are not surfaced and are not supported by current evidence
- Customer Operations / CRM needs clearer safe handoff (not live dashboard)
- IVR/Voice should be shown only as planned/not-ready communication readiness if needed
- Sales/CRM agent should be represented as part of AI Team but not shown as a fake live CRM

## 6. What Home Should NOT Add
- Do not add detailed campaign, content, or ad management (keep on specialized pages)
- Do not add direct workflow execution or approval controls
- Do not add CRM/live customer support actions (keep as handoff; no evidence supports live CRM or support on Home)
- Do not add live IVR controls
- Do not add call controls
- Do not add live CRM dashboards unless backend proves them
- Do not add customer inbox/ticket tables on Home
- Do not show autonomous agents executing actions without approvals
- Do not add dense tables or raw logs
- Avoid duplicating backend authority or governance controls

## 7. Recommended Home Information Architecture
- Top executive status strip (system health, readiness, escalations)
- Next Best Action (AI-driven, always visible)
- AI Team Command Center as a compact card
- 3–5 role chips (contextual, not static)
- Operations pulse (tasks, blockers, failed jobs, approvals)
- Customer Operations Pulse as a compact card
- Communication Readiness / Voice-IVR status as a small badge only if status is backed by backend data
- Source of Truth / Library confidence (asset status, coverage)
- Release readiness / governance (summary, not detail)
- Media / Publishing pulse (readiness, handoff)
- Research / Learning / Recommendations pulse (signals, not detail)
- Connected page handoff cards (one per major surface)
- Use “summary + handoff”, not detailed operational tables

## 8. Recommended UI/UX Changes
**Rename:** Clarify "AI Guidance" as "Executive AI Guidance"
**Merge:** Combine campaign/publishing/media into a single "Launch Readiness" card
**Add:** Explicit "System Authority"/"Backend Health" summary
**Add:** “Customer Operations Pulse” card
**Add:** “AI Team Command Center” card
**Add:** “Communication Readiness” badge only if backed by data
**Remove:** Any redundant quick actions
**Move:** Advanced research, CRM, and governance behind expandable details
**Keep:** IVR and CRM detailed controls off Home
**Clickable:** All handoff cards and status strips should be clickable, routing to the correct page with context

## 9. Data Contract Requirements
Home must read all readiness, health, blockers, and next best action from backend APIs/data contracts (requires implementation verification)
No hardcoded status or fake live data
Metrics for campaign, media, integrations, and governance must be backend-projected
Needed backend projections (current or future):
  - customer_ops_status
  - crm_readiness
  - ticket_summary
  - communication_readiness
  - voice_ivr_status
  - ai_team_status
  - agent_role_statuses
Advanced metrics (CRM, IVR, ticket/inbox, agent activity) are future unless currently proven

## 10. Connected Page Handoff Model
Each Home card appears to route to its owning page:
  - Operations → Operations Centers
  - Customer Operations → Operations Centers or Customer Operations page if available
  - CRM / Sales → CRM or Operations Center / AI Command depending on current route reality
  - Voice / IVR → future communication settings/readiness, not live action
  - AI Team roles → AI Command with selected specialist context
  - Library → Library
  - Publishing → Publishing
  - Governance → Governance
  - Media → Media Studio
  - Setup → Setup
  - Integrations → Integrations
  - Campaign → Campaign Studio
Context: Home should pass current project, readiness, and blockers context when routing (requires functional QA)

## 11. Risk Register
Clutter risk if too many cards or details are added
Duplicate authority risk if backend controls are surfaced on Home
Frontend-only fake intelligence risk if Home claims live data not backed by backend
Fake CRM risk
Fake IVR risk
Unsupported live-agent risk
User trust risk if Home claims unproven automation
Privacy/security risk for customer data
Backend projection missing risk for advanced metrics
Performance risk if Home tries to load all data at once
Layout density risk if too many sections are visible by default

## 12. Implementation Plan
**P0:**
  - No fake data
  - Verify existing Home data contracts
  - Keep IVR/CRM claims truth-based
**P1:**
  - Add AI Team Command Center card
  - Add Customer Operations Pulse
  - Add Release/Governance/System Authority visibility
  - Add Source of Truth confidence
**P2:**
  - Add backend-projected CRM/customer/ticket summaries
  - Add communication readiness if backend supports it
  - Add Research/Learning/Recommendations pulse
**P3:**
  - Add live IVR/call/customer operations only after backend implementation, auth, privacy, and QA proof

## 13. Browser QA Plan After Implementation
- Verify Home loads and renders all sections/cards without error
- Confirm all metrics are live from backend (no hardcoded data)
- Test all handoff cards route to correct pages with context
- Check expandable details for advanced sections
- Validate performance and layout density
- Confirm accessibility and keyboard navigation

## 14. Final Recommendation
- Implement P1 Home upgrade now.
- Keep Home powerful but not crowded.
- Home should summarize and hand off.
- Do not show unproven CRM/IVR/live agent capabilities as active.
- Backend = Authority, Home = Executive Projection.

## Audit Confidence
**High confidence:**
  - Browser accessibility
  - Home page opens
  - Basic sections exist
**Medium confidence:**
  - Static evidence for routes and data dependencies
  - AI Team handoff exists
**Low/not proven:**
  - Live CRM
  - Live IVR
  - Live calls
  - Ticket/inbox workflows
  - Autonomous agents
  - Native video generation
  - Advanced campaign/ad performance
