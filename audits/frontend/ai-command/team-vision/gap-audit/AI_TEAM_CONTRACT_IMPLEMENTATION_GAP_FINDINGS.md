# AI Team Contract Implementation Gap Findings

## Summary

The implementation gap audit confirms that AI Command already has a strong AI Team foundation:

- specialist roster
- solo and team modes
- output workspace
- canonical tools
- tool drawer
- route logic
- shared handoff
- destination intake for key operating surfaces

The system is technically advanced, but the new AI Team Vision and Routing Contract requires a few alignment passes before AI Command can be considered fully complete.

## Confirmed strengths

### 1. AI Team foundation exists

AI Command includes specialist definitions, solo/team behavior, chat, output preview, route actions, and tool systems.

### 2. Routing foundation exists

The code includes route helpers and output route resolution such as:

- destinationRouteForSpecialist
- resolveAiResponseOutputRoute
- outputType
- destinationRoute

### 3. Canonical tools exist

The tool system includes many specialist-specific tools across:

- campaign
- content
- media
- publishing
- ads
- insights
- compliance
- operations
- customer operations
- sales / CRM

### 4. Source-required tool logic exists

The system can detect tools that require a selected source and blocks unsafe usage when no source is available.

### 5. Shared handoff exists

AI Command, Workflows, Task Center, Publishing, and shared-context contain handoff-related logic.

### 6. Review-only safety is preserved

The implementation continues to avoid automatic durable task creation, backend execution, publishing execution, and CRM/customer mutation from AI Command.

## Main gaps

### Gap 1: Routing contract alignment

The new contract requires route decisions by output type:

- task-like -> Task Center
- workflow/process-like -> Workflows
- content-like -> Content Studio
- media-like -> Media Studio
- publishing-like -> Publishing
- campaign-level -> Campaign Studio or Workflows
- governance/risk -> Governance
- research/insight -> Research or Insights
- unclear -> stay in AI Command and recommend next destination

Current routing exists, but needs a targeted audit/patch to ensure Full Team and all specialists follow this decision tree consistently.

Priority: High.

### Gap 2: Full Team routing clarity

Full Team should not always route to Workflows.

Full Team output should route based on detected output type:

- campaign operating plan -> Workflows
- task plan -> Task Center
- content package -> Content Studio or Publishing
- media direction -> Media Studio
- risk review -> Governance

Priority: High.

### Gap 3: Tools / Drawer grouping

The tool system is powerful but still appears as a large list of tools.

The contract requires grouping into:

- Recommended next action
- Primary tools
- Secondary tools
- Needs source tools
- Advanced tools

Priority: High.

### Gap 4: Source-required UX

The source-required logic exists, but repeated toast-style warnings can feel disruptive.

Preferred UX:

- tool cards show Needs source clearly
- drawer shows selected source state
- use button explains what is missing
- toast is used only as a secondary confirmation/error

Priority: Medium.

### Gap 5: Handoff payload normalization

Shared handoff exists, but routes should consistently carry:

- source_page
- destination_page
- project
- output_type
- title
- summary
- payload
- created_at
- review_status
- safety_note

Priority: High.

### Gap 6: Destination intake consistency

Task Center and Workflows visibly handle incoming handoffs.

Publishing also has handoff intake.

Content Studio and Media Studio need deeper review to confirm that they visibly explain incoming AI handoff context with the same clarity.

Priority: Medium.

### Gap 7: Specialist power visibility

Specialists exist, but the UI should make each specialist's power clearer:

- what they do
- best use
- likely destination
- recommended tools
- whether tools are source-required
- whether the specialist is active or planned

Priority: Medium.

### Gap 8: Home to AI Command structured handoff

Home currently has AI Command entry points, but the long-term contract prefers structured handoff instead of prompt-only handoff.

Priority: Later.

## Recommended implementation order

### Pass 1: Routing Contract Alignment

Goal:
Ensure output type classification sends results to the correct destination.

Scope:
Small JS patch only if mismatch is proven.

Do not change UI first.

### Pass 2: Tool Drawer Grouping

Goal:
Make tools easier to understand and expose system power without overwhelming the user.

Scope:
UI/UX grouping and labels.

### Pass 3: Handoff Payload Normalization

Goal:
Ensure every route carries the contract fields.

Scope:
Small shared handoff builder helper if needed.

### Pass 4: Destination Intake Consistency

Goal:
Make Content Studio and Media Studio show incoming AI context as clearly as Task Center/Workflows.

### Pass 5: Specialist Roster Power Visibility

Goal:
Show recommended action, destination, and tool capability per specialist.

### Pass 6: Home Structured AI Handoff

Goal:
Improve Home -> AI Command bridge.

## Safety decision

No backend execution should be added.

No durable task creation should be added from AI Command.

No workflow automation should be added from AI Command.

No publishing, CRM, customer, or governance mutation should happen from AI Command.

## Current acceptance

The AI Team foundation is strong enough to continue.

The next correct step is not broad redesign.

The next correct step is a targeted Routing Contract Alignment audit/patch.
