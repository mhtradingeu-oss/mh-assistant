# PHASE 3O — AI Command Deep Truth Audit

## 1. Executive Summary
This audit investigates the current state, operating model, and future vision for the AI Command module as the MH-OS AI Team Command Center. The goal is to clarify runtime responsibilities, team/specialist models, context and handoff flows, authority boundaries, and UX surface, without making any code or data changes. Findings are classified by risk and mapped to a recommended roadmap.

## 2. Current Runtime Responsibility
- **Primary Function:** AI Command acts as a multi-role AI Team interface for campaign, content, media, publishing, operations, and more.
- **Modes:** Supports both chat/guidance and workflow/command center behaviors.
- **UI Sections:**
  - Specialist/team selector
  - Prompt composer (with quick actions)
  - Output tabs (draft, task, workflow, handoff, export)
  - Context panels (project, asset, source)
  - Team chain/role display
  - Handoff and routing controls
- **Data/Context Consumed:**
  - Project context
  - Source/asset context (from Library)
  - Team/specialist definitions
  - Local drafts, outputs, and chat sessions

## 3. AI Team / Specialist Model Assessment
- **Specialists Defined:** 11+ roles (Strategist, Writer, Media Director, Video Lead, Publisher, Ads Optimizer, Analyst, Compliance Reviewer, Operations Lead, Customer Ops, Sales/CRM Lead)
- **Definition Location:** Frontend static arrays (MODE_DEFS, SPECIALIST_DEFS)
- **Role Model:** Frontend projection; no backend authority for team/role logic
- **UI Clarity:** Team and specialist power is visible, but “full team” vs “solo” is not always explicit
- **Missing for Smart Team:**
  - Dynamic backend-driven team membership
  - Specialist status/availability
  - Clear “full team” vs “ask one” toggle
  - Specialist handoff/ownership chain

## 4. Context and Source Handling Map
- **Library → AI Command:**
  - Uses shared context bridge (setSharedLibrarySourceBridge, getSharedLibrarySourceBridge)
  - Asset/source selection flows via explicit user action
- **Project Context:**
  - Consumed from state selectors (selectCurrentProject, selectProjectPayload)
- **Page/Asset Context:**
  - Asset context is cached and mapped per project
  - Context is visible in UI, but may be subtle
- **Risks:**
  - Stale or mismatched source context if user switches assets without clear UI feedback
  - No explicit context mismatch warnings

## 5. Library → AI Command Source Flow Verification
- **Mechanism:**
  - Library asset selection triggers setSharedLibrarySourceBridge
  - AI Command reads bridge on load or context switch
- **Evidence:**
  - Functions: setSharedLibrarySourceBridge, getSharedLibrarySourceBridge (shared-context.js)
  - Library page: buildAiSourcePayloadFromAsset, setSharedAiSource
- **Result:**
  - Source handoff is explicit, but not always persistent or visible after navigation

## 6. Handoff and Workflow Map
- **Supported Handoffs:**
  - Workflows, Library, Publishing, Governance, Media Studio, Campaign Studio, Content Studio
- **Type:**
  - Mostly navigation and context routing; some prompt-based handoff
  - No direct execution or backend workflow start from AI Command
- **Risks:**
  - No fake execution claims detected
  - All execution is gated or routed to backend-owned surfaces

## 7. Backend/API Contract Map
- **API Functions Used:**
  - executeProjectAiChat (read/guidance)
  - executeProjectAiGuidance (read/guidance)
  - No direct write/mutation/execution from AI Command
- **Authority Level:**
  - All backend authority actions are routed/gated
  - No direct publish/approve/delete/archive
- **Confirmation Needs:**
  - All dangerous actions require explicit confirmation in destination surface

## 8. Authority and Safety Boundary Assessment
- **Backend Execution:**
  - No direct backend execution from AI Command
  - All workflow/task/publish actions routed to backend-owned modules
- **Safe Projection Actions:**
  - Guidance, draft, preview, handoff, context routing
- **Dangerous Actions:**
  - None detected in AI Command
- **Confirmation Gates:**
  - Required for all publish/approve actions (enforced in destination modules)

## 9. Action Inventory Table
| Action                        | Type         | Backend Authority | Confirmation Needed | Notes                       |
|-------------------------------|--------------|-------------------|---------------------|-----------------------------|
| Guidance/Chat                 | Read         | No                | No                  | Pure projection             |
| Draft/Preview                 | Read         | No                | No                  | Pure projection             |
| Task/Workflow Proposal        | Read         | No                | No                  | Proposal only               |
| Handoff (to other modules)    | Route        | No                | Yes (in target)     | Context only                |
| Publish/Approve/Delete/Archive| Not allowed  | Yes (elsewhere)   | Yes                 | Not possible from AI Command|

## 10. Listener / Timer / Runtime Risk Inventory
- **Listeners:**
  - No global/document listeners in AI Command
  - Uses local event handlers only
- **Timers/Auto Mode:**
  - No implicit execution or auto mode
- **Duplicate Listener Risk:**
  - Low; uses session and context-local handlers
- **Heavy Runtime Risk:**
  - None detected

## 11. UX / Operating Surface Assessment
- **Strengths:**
  - Clear specialist/team model
  - Prompt chips and quick actions
  - Output tabs for draft/task/workflow/handoff
  - Context panels for project/source
- **Weaknesses:**
  - “Full Team” vs “Ask Specialist” toggle is subtle
  - Context/source visibility can be improved
  - Next best actions not always surfaced
  - Handoff chain not always explicit
  - Some crowding in dense panels

## 12. CSS / Layout Risk Assessment
- **CSS Files/Selectors:**
  - Not audited (per rules)
- **Density/Surface:**
  - Some risk of crowding in team/specialist panels
  - Header/panel consistency generally good
- **No broad CSS recommendations (ownership not clear)**

## 13. Protected Behavior List
- No backend execution, mutation, or publish actions allowed from AI Command
- All handoffs are context-only
- All dangerous actions require confirmation in backend/destination modules

## 14. Do Not Touch Without Approval List
- Specialist/team definitions (require governance)
- Context bridge logic (source handoff)
- API contract (executeProjectAiChat, executeProjectAiGuidance)
- Any backend authority or mutation logic
- CSS/layout (ownership unclear)

## 15. Final AI Team Command Center Vision
- **AI Team Command Center:**
  - Dynamic specialist/team selector
  - Full Team vs Specialist mode toggle
  - Source-aware workspace with visible context
  - Handoff panel with explicit routing
  - Workflow/task proposal and preview surface
  - Governance-safe action model (no direct execution)
  - Context memory and source display
  - Next best action suggestions
  - Clear user journey: idea → AI guidance → workflow/task/handoff → result

## 16. Recommended Implementation Roadmap
1. **Clarify Team/Full Team Toggle:**
   - Make “Full Team” vs “Ask Specialist” explicit in UI
2. **Context Visibility:**
   - Show current source/context more visibly
   - Warn on context mismatch or stale source
3. **Specialist Status:**
   - Add backend-driven specialist/team status
4. **Handoff Chain:**
   - Visualize handoff/ownership chain for tasks/workflows
5. **Next Best Actions:**
   - Surface recommended next actions based on context
6. **Governance Hooks:**
   - Ensure all dangerous actions are gated in backend

## 17. Recommended First Safe Patch
- Add a visible “Full Team” vs “Ask Specialist” toggle in the UI, with clear explanation of each mode. No backend or mutation changes.

## 18. Validation Results
- **git status --short:** Working tree clean
- **node --check public/control-center/pages/ai-command.js:** OK
- **node --check public/control-center/pages/library.js:** OK
- **node --check public/control-center/app.js:** OK
- **node --check public/control-center/router.js:** OK
- **node --check public/control-center/api.js:** OK
- **node --check public/control-center/shared-context.js:** OK
- **Production files changed:** None

## Recommended Next Step
- Confirm audit findings with stakeholders. Approve roadmap and first safe patch before implementation. No code or data changes until explicit approval.