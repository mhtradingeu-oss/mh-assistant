# T162E — AI Router Engine + System Architecture Implementation Plan

## Status
Architecture plan. No implementation.

## Baseline
- `8de623a Wire Governance CSS owner file`

## Purpose
Define the system architecture for the AI Router Engine that powers the smart AI Team.

The router is responsible for scanning the user request, choosing specialists, determining risk, deciding output type, preparing handoff, and triggering Governance when needed.

## Router Responsibilities

### 1. Intent Classification
Detect request domain:
- strategy
- campaign
- content
- media
- video
- ads
- SEO
- insights
- customer operations
- sales / CRM
- operations
- workflows
- governance
- integrations
- pricing / finance
- product / e-commerce
- research
- QA / release

### 2. Specialist Selection
Select:
- lead specialist
- supporting specialists
- full team chain when needed

### 3. Risk Detection
Classify:
- low
- medium
- high
- critical

Governance is required for:
- publishing
- external sends
- customer commitments
- claims
- pricing/discount risk
- paid ads launch
- provider execution
- missing proof
- policy uncertainty

### 4. Flow Builder
Choose one of:
- direct answer
- single specialist response
- multi-specialist answer
- sequential team workflow
- draft generation
- task plan
- handoff package
- governance package
- blocked action explanation

### 5. Output Decision
Select output type:
- chat
- draft
- plan
- task
- workflow
- handoff
- approval package
- source checklist

### 6. Destination Routing
Suggest destination:
- Campaign Studio
- Content Studio
- Media Studio
- Publishing
- Ads Manager
- Governance
- Operations Centers
- Task Center
- Workflows
- Customer Center
- Library
- Sales / CRM draft

## Proposed Data Model

### AI Request Context
Fields:
- projectName
- userMessage
- activePage
- activeSpecialist
- selectedSources
- currentCampaign
- currentCustomer
- currentOutputType
- sessionHistory
- projectReadiness
- governanceStatus

### Router Decision
Fields:
- intent
- confidence
- riskLevel
- governanceRequired
- leadSpecialist
- supportingSpecialists
- flowType
- outputType
- destinationRoute
- sourceRequirements
- missingEvidence
- safetyNotes
- nextBestAction

### AI Team Message
Fields:
- id
- role
- specialistId
- messageType
- content
- outputRefs
- riskLevel
- createdAt

### Output Card
Fields:
- id
- type
- title
- content
- ownerSpecialist
- destination
- riskLevel
- governanceRequired
- status

## Frontend Component Architecture

### Main Components
- AICommandWorkspace
- AITeamDirectory
- SpecialistCard
- ActiveTeamBar
- ChatWorkspace
- ChatComposer
- AIMessage
- RouterSystemMessage
- OutputPanel
- OutputCard
- HandoffPanel
- GovernanceStatusPanel
- SourceContextStrip
- ToolDockDrawer

### State Areas
- team state
- chat state
- output state
- source context state
- governance state
- handoff state
- draft/session restore state

## Backend / API Direction
Do not add execution first.

First backend direction should support:
- chat/guidance response
- router decision preview
- source-aware prompt preparation
- handoff package creation
- governance package preparation

Execution APIs must remain separate and confirmation-gated.

## Safe Implementation Order

### Phase 1 — Audit Current AI Command UI
Browser QA current route.
Document:
- visible specialists
- chat room behavior
- prompt chips
- tool dock
- output panel
- handoff behavior
- safety messages

### Phase 2 — UX Contract vs Current UI Gap Map
Compare current UI against T162D/T162E.

### Phase 3 — Minimal UI Improvement Plan
Do not patch yet.
Choose one target:
- specialist directory clarity
- chat composer simplification
- output panel clarity
- governance status visibility

### Phase 4 — CSS Ownership / UI Ownership Decision
Decide whether AI Command needs dedicated CSS owner file or existing owner.

### Phase 5 — Small Implementation Patch
One focused change only.
Browser QA required.

## Forbidden
No unsafe execution.
No direct publish.
No direct send.
No direct CRM mutation.
No direct workflow run.
No provider execution without confirmation.
No Governance approval from AI.
No broad rewrite.
No random CSS patch.
No unreviewed backend mutation.

## Decision
The AI Router Engine should be introduced as a decision and preparation engine first.

It should not become an execution engine until Governance, permissions, backend validation, and owning workspace controls are complete.
