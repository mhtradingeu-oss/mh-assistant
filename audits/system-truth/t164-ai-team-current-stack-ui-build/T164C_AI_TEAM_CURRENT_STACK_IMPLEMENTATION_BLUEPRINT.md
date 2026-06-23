# T164-C — AI Team Current-Stack Implementation Blueprint

## Status
Implementation blueprint only. No production code change.

## Purpose
Convert the AI Team product vision into a safe implementation plan for the current MH-OS frontend stack.

This project currently uses the Control Center vanilla JS/module runtime, not a React/Next frontend. Therefore T164 must be implemented inside the existing stack first.

## Final Target
AI Command must become:

Chat Interface + AI Team Control Room + Workflow Panels

The page must show the real power of the AI Team already present in the backend and Tool Dock.

## Current Truth
The system already has:
- AI Team role model
- service domain model
- route targets
- handoff model
- governance approvals
- AI command records
- AI artifacts
- AI recommendations
- AI memory
- shared transient handoff context
- Tool Dock preparation/source/destination/output system

## Current Gap
The user experience does not yet clearly expose:
- selected specialist
- team mode vs single specialist mode
- authority mode
- risk level
- governance requirement
- source grounding
- output type
- destination route
- workflow/handoff chain
- next best action

## Required Page Shape

### 1. AI Team State Header
Must show:
- selected specialist
- current mode
- output type
- risk level
- governance status
- source grounding
- execution lock state

### 2. AI Team Directory
Must show:
- current specialists
- active specialist
- suggested specialist
- governance/compliance role state
- destination ownership

### 3. Conversation / Chat Workspace
Must show:
- user intent
- AI interpretation
- selected specialist
- structured response
- output type
- destination
- next action

### 4. Workflow / Output Panel
Must show:
- workflow chain
- draft/output preview
- handoff destination
- governance package status
- missing evidence
- next best action

### 5. Tool Dock Integration
Tool Dock remains preparation-first.
It must not publish, send, save externally, mutate CRM, run workflow, or execute providers.

## Implementation Rules
Do not rewrite AI Command.
Do not create React/Next files.
Do not duplicate Tool Dock.
Do not duplicate backend team authority.
Do not add new backend execution.
Do not create new governance authority in frontend.
Do not change route behavior.
Do not change provider execution.
Do not touch data/projects.

## Safe First Implementation Target
T164-D should be a UI-only visibility patch:

Add or improve an AI Team State / Control summary inside AI Command using existing data only.

It should expose:
- selected specialist
- mode
- output type
- risk/governance status
- destination/handoff preview
- source grounding state

It must not add execution behavior.

## Browser QA Required After First Patch
Verify:
- AI Command route loads
- no crash
- AI Team visibility appears
- Tool Dock remains preparation-only
- no direct publish/send/CRM/workflow execution appears
- handoff wording is clear
- governance wording is clear
- existing prompt chips and source bridge still work

## Decision
T164 implementation must begin with visibility and clarity, not new execution.
The AI Team already exists structurally; the next work is to surface it as a real operating team experience.
