# AI Team Phase 5 — Full UX Redesign Plan

## Why Phase 5 is needed
The current AI Team page is stable, but the experience is still too complex.
The user expects a modern AI team conversation room, not a collection of panels and buttons.

## Current UX problems
- Composer feels disconnected from Chat.
- Chat is not a real conversation room.
- Too many buttons are visible at once.
- Tools are shown as actions but not explained.
- Specialist identity is weak: no strong profile, position, status, or working style.
- Solo vs Team mode does not feel visually different enough.
- Output actions are not clearly grouped into review/export/route.
- Voice and attachment expectations are not clearly represented.
- Motion and micro-interactions are minimal.
- User does not clearly understand the workflow:
  write -> ask -> review -> output -> route/export.

## Redesign principle
Keep existing logic and wiring.
Redesign the interface only.

## Preserve
- executeProjectAiGuidance bridge
- specialist definitions
- specialist tools
- responseHistory
- outputPreview
- copy/use/preview/route/save/read actions
- safety guardrails
- local draft/output persistence
- language and market logic
- Team/Solo mode state

## Redesign target
The AI Team page should become a modern AI Team Room:

Left:
- Team member list
- clear active member
- Solo / Team switch

Center:
- real conversation room
- message bubbles
- specialist avatar/name/role
- composer attached to conversation room
- voice and attachment placeholders
- send action

Right:
- specialist profile
- role, strengths, limits
- tools as explained cards
- context and readiness summary

Bottom / Drawer:
- latest output preview
- copy
- export
- send to preview
- route next
- save
- read aloud

## Team mode behavior
Team mode should visually become a team workflow:
Strategist -> Writer -> Media -> Compliance -> Publisher -> Operations.

## Solo mode behavior
Solo mode should feel like speaking to one professional:
name, role, avatar, status, tools, and focused response.

## Implementation phases

### Phase 5.1 — New layout shell
Create the new three-column AI Team Room layout while preserving existing handlers.

### Phase 5.2 — Specialist identity
Add profile cards with avatar, name, role, position, strengths, tools, and safe limits.

### Phase 5.3 — Conversation room
Redesign chat into user/specialist bubbles and move the composer visually into the conversation area.

### Phase 5.4 — Tool drawer
Replace button clutter with explained tool cards.

### Phase 5.5 — Output drawer
Create a clear output review area with copy/export/preview/route/save/read actions.

### Phase 5.6 — Motion and micro-interactions
Add hover, active, selected, loading, and success states without changing backend logic.

## Safety
No backend changes.
No API changes.
No router changes.
No Customer Operations stashes.
No data changes.
No execution behavior changes.
