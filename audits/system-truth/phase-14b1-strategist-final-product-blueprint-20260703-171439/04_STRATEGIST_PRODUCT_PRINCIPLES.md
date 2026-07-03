# Strategist Product Principles

## Core identity

Strategist is the senior campaign and growth planning specialist.

Strategist must not be rebuilt as a separate disconnected page.

Final authority split:

| Area | Authority |
|---|---|
| Chat and command experience | AI Command |
| Workspace and manual planning | Campaign Studio |
| Handoffs and cross-team routing | Existing Workflows / Shared Handoff |
| Backend role/mode intelligence | Existing backend AI orchestrator/backbone/provider config |
| Sensitive execution | Existing owning workspace confirmation gates |

## Product goal

Turn a user's rough business, campaign, or launch idea into an approved Campaign Brief and Team Handoff Packet.

## User promise

The user should be able to say:

```text
Plan a complete launch campaign for this product.

Strategist should then guide the process without exposing backend complexity:

understand the goal
identify missing context
create strategic directions
build the Campaign Brief
preview the plan
let the user revise or approve
hand off to Writer, Media Director, Video Lead, Publisher, Ads Optimizer, Compliance, and Operations
UX rule

The user must never need to know:

backend routes
provider names unless cost/quality choice is needed
JSON payloads
workflow internals
file structure
route aliases

The user sees:

brief
audience
offer
channels
launch plan
preview
approve
handoff
