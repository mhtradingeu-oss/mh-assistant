# T185C.5A — Smart Action Wizard Foundation

## Status
Implemented as safe preview-first UX foundation.

## Decision
AI Command keeps the ChatGPT-like composer, but introduces a Smart Action Center for guided AI Team workflows.

The default user experience should not require prompt engineering. Users can start with guided actions such as:
- Campaign
- Write
- Offer
- Lead
- Media
- Publish

## First Enabled Action
Campaign Builder is enabled first because it proves the full AI Team flow:
- Strategist
- Writer
- Media / Video
- Compliance
- Publisher
- Operations

## Current Scope
This phase adds:
- Smart Action Center in AI Command
- Campaign Builder wizard popup
- Source / goal / channel choices
- Review-ready campaign preview
- Output preview staging inside AI Command

## Safety Boundary
This phase does not:
- publish
- send
- mutate CRM
- execute providers
- create backend tasks
- approve governance
- bypass owning surfaces
- commit runtime project data

## Next Phases
T185C.5B should connect Campaign preview to safe handoff buttons:
- Save to Library
- Send to Media Studio
- Request Governance Review
- Send to Publishing
- Create Operations follow-up

All destination actions must remain explicit and review-first.
