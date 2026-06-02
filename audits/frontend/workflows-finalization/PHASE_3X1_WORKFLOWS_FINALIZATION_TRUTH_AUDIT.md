# PHASE 3X.1 — Workflows Finalization Truth Audit

## Status
Audit-only.

No production implementation is approved in this phase.

## Baseline
- Branch: `architecture/frontend-consolidation-v1`
- Previous completed phase: `PHASE 3W.5 — Governance Browser QA Closeout`
- Previous commit: `6a7599f Close Governance finalization wave`

## Purpose
Audit Workflows as the next high-risk operating surface after Governance.

Governance closeout confirmed:
- Governance is a backend-authoritative approvals/policy surface.
- Publishing may be hard-gated by Governance policy where backend rules apply.
- AI cannot approve, override, or change policy.
- Mutating QA must only happen in controlled test datasets.

Workflows must now be audited because it may connect:
- AI recommendations
- task execution
- automation
- publishing
- governance gates
- backend jobs
- action routing

## Core Questions
- What does Workflows actually own today?
- Does Workflows only display workflow states, or can it trigger backend jobs?
- Does it execute actions or only prepare/review them?
- Can it route to Publishing or Governance?
- Can it bypass Governance gates?
- Can AI recommendations become workflow actions without human confirmation?
- Are workflow actions confirmation-gated?
- Are automation actions clearly labeled as draft/review/manual/execute?

## Ownership Hypothesis
Workflows should own:
- workflow visibility
- workflow stage/status projection
- task orchestration visibility
- manual workflow preparation
- review handoffs
- safe action routing
- automation readiness display
- next-step guidance

Workflows should not silently own:
- external publishing execution
- Governance approval authority
- AI autonomous execution
- provider authentication
- CRM/customer mutation
- silent backend job execution
- policy bypass
- unconfirmed automation

## Required Evidence To Capture

### 1. File and route truth
- workflows page file size
- imports/exports
- render sections
- event handlers
- API calls
- automation engine usage

### 2. Execution/action markers
Search for:
- execute
- run
- start
- trigger
- automate
- automation
- workflow
- job
- task
- approve
- publish
- schedule
- handoff
- confirm
- ai

### 3. Backend/API authority
Determine whether Workflows:
- reads workflow data only
- creates workflow records
- starts jobs
- updates workflow states
- calls publishing/governance routes
- calls automation engine
- only routes users to other pages

### 4. Governance/Publishing boundary
Determine whether Workflows:
- respects Governance gates
- can send to Publishing
- can mark workflow complete
- can bypass approval-before-publish
- labels handoffs clearly as review/manual

### 5. AI boundary
Determine whether Workflows:
- only uses AI for guidance
- can turn AI suggestions into actions
- requires human confirmation for AI-suggested workflow actions

## Safety Rules
- No implementation in 3X.1.
- No workflows code changes.
- No API/backend changes.
- No CSS changes.
- No mutating workflow action testing.
- No data/projects commits.
- Do not claim Workflows execution is safe until evidence proves it.
