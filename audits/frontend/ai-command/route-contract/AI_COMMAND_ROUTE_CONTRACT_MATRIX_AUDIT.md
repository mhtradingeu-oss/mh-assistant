# AI Command Route Contract Matrix Audit

## Purpose

Define the simple canonical route contract for AI Command before applying any route or preview patch.

## Required route contract

AI Command must not guess randomly and must not duplicate routing logic.

The route decision should follow this order:

1. Explicit selected output tab or tool intent.
2. Existing preview outputType.
3. Specialist default route.
4. Safe fallback to Workflows.

## Desired mapping

- Draft -> Content Studio / Publishing depending on specialist.
- Task -> Task Center.
- Draft Workflow -> Workflows.
- Prepare Handoff -> destination owner, review-only.
- Guidance -> Workflows or AI review destination.
- Operations Lead task/handoff -> Task Center.
- Customer Ops ticket/task -> Task Center.
- Full Team task/handoff -> Task Center.

## Safety contract

- Route never creates durable tasks automatically.
- Route writes review-only shared handoff.
- Durable task creation requires a separate explicit confirmed workflow.
- Task Center displays incoming handoff review-only.
- Mutation controls remain disabled/deferred.

## Preview density contract

Output Workspace should show:

- one short summary
- one main output block
- one next steps block
- one route/safety block

It should not repeat the same full AI response in multiple cards.

## Current suspected issue

Latest response Route currently falls back to guidance routing, which sends Operations Lead outputs to Workflows instead of Task Center.

## Recommendation

After reviewing evidence, apply one small patch that introduces a single route resolver or updates the existing route decision so all Route actions use the same contract.
