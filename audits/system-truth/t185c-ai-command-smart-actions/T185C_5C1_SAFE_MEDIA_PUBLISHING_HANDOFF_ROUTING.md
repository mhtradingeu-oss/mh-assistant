# T185C.5C1 — Campaign Wizard Safe Media/Publishing Handoff Routing

## Status
Implemented as safe frontend handoff routing.

## Scope
This phase connects only the two safest Campaign Builder review actions:
- Send to Media Studio
- Prepare Publishing Handoff

## Behavior
When a Campaign Builder preview exists:
- Media action prepares a local AI Command campaign handoff and routes to Media Studio.
- Publishing action prepares a local AI Command campaign handoff and routes to Publishing.

## Storage Contract
The handoff is stored locally under:
- `mh_ai_command_campaign_handoff`
- `mh_ai_command_handoff_media-studio`
- `mh_ai_command_handoff_publishing`

This phase does not require the destination pages to consume the payload yet. Destination intake can be connected in the next safe phase after verifying each page contract.

## Safety Boundary
This phase does not:
- write backend records
- save Library assets
- create Governance approvals
- create Operations tasks
- publish
- send messages
- mutate CRM
- execute providers
- run workflows

## Deferred Actions
The following buttons remain staged only:
- Save to Library
- Request Governance Review
- Create Operations Follow-up

They require backend/route contract verification before durable writes or mutations.

## Product Decision
AI Command remains the brain/planner. Media Studio and Publishing remain the owning execution/review surfaces.
