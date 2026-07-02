# AI Team Routing Contract Alignment Audit

## Purpose

Audit current AI Command routing logic against the AI Team Vision and Routing Contract.

## Contract routing target

Routing must classify outputs as:

- task-like -> Task Center
- workflow/process-like -> Workflows
- content-like -> Content Studio
- media-like -> Media Studio
- publishing-like -> Publishing
- campaign-level -> Campaign Studio or Workflows
- governance/risk -> Governance
- research/insight -> Research or Insights
- unclear -> stay in AI Command and recommend next destination

## Areas to inspect

### 1. destinationRouteForSpecialist

Check whether specialist default route is too broad or too narrow.

### 2. resolveAiResponseOutputRoute

Check whether response text/output type can correctly override default route.

### 3. Full Team behavior

Check whether Full Team always routes to Workflows or can classify by output type.

### 4. Route button behavior

Check whether the Route button uses latestResponse.destinationRoute / responseRoute correctly.

### 5. Handoff target

Check whether the destination from route resolution is passed to setSharedHandoff.

## Expected output

This audit should identify whether a small routing classification patch is needed.

## Safety

No backend execution should be added.
No durable task creation should be added.
No workflow automation should be added.
No publishing, CRM, customer, or governance mutation should be added.
