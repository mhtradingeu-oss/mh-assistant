# P1 Runtime Governance Baseline

## Canonical Doctrine

Backend holds operational authority.
Frontend projects authority.

## Forbidden Patterns

- Duplicate role maps in frontend
- Duplicate governance ownership
- Local approval truth
- Local workflow authority
- Frontend-generated permissions
- Implicit auto execution
- Runtime orchestration inside render()

## Canonical Backend Sources

Primary authority source:
- runtime/orchestrator-service/lib/ops/backbone.js

Secondary operational sources:
- runtime/orchestrator-service/server.js
- runtime/orchestrator-service/lib/insights/*
- runtime/orchestrator-service/lib/integrations/*
- runtime/orchestrator-service/lib/security/*
- runtime/orchestrator-service/lib/ops/*

## Frontend Mission

Frontend responsibilities:
- visualize authority
- project operational state
- display workflows
- surface recommendations
- enable explicit actions
- render operating surfaces

Frontend is NOT responsible for:
- inventing authority
- owning governance truth
- generating approval chains
- enforcing business policy
- defining operational ownership

## Migration Rule

Audit -> confirm -> shadow compare -> source switch -> validate.

## Current Known Risks

- frontend role drift
- local orchestration remnants
- AI workspace authority overlap
- command/runtime overlap
- overlay runtime conflicts
- legacy auto mode remnants
