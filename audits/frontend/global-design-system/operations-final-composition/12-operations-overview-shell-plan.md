# OPS-FINAL-1 — Operations Overview Shell Plan

## Status
Planned.

## Purpose
Improve the `operations-centers` overview shell as the main AI Operations execution entry point, without changing sub-page behavior.

## Product Goal
Operations Overview should answer:

1. What is happening operationally now?
2. Which center needs attention?
3. Are tasks, queues, jobs, or notifications the highest priority?
4. Where should the operator go next?
5. What can AI summarize safely?

## Current Runtime Authority
Runtime file:
- `public/control-center/pages/operations-centers.js`

Owned routes:
- `operations-centers`
- `task-center`
- `queue-center`
- `job-monitor`
- `notification-center`

## First Target
Only the `operations-centers` overview shell.

## Allowed Changes
- Improve overview header.
- Add GDS wrapper/classes to overview only.
- Improve card copy and hierarchy.
- Improve runtime signal wording.
- Preserve route buttons and data attributes.
- Preserve sub-page renderers.

## Forbidden Changes
- No backend changes.
- No API changes.
- No route changes.
- No handler removal.
- No changes to task-center behavior.
- No changes to queue-center behavior.
- No changes to job-monitor behavior.
- No changes to notification-center behavior.
- No governance decision behavior changes.
- No broad rewrite of `operations-centers.js`.

## Required Validation
- `node --check public/control-center/pages/operations-centers.js`
- Required route buttons remain present.
- Browser QA at:
  - `http://127.0.0.1:3000/control-center/#operations-centers`

## Decision
Proceed with a small Operations Overview Shell implementation only.
