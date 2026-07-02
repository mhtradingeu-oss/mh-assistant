# Setup Final UX Composition Plan

## Status
Planned.

## Purpose
Improve Setup as a Foundation Readiness Operating Surface without rewriting the wizard or breaking runtime contracts.

## Product Goal
Setup should help the operator understand:
1. Is the project foundation complete?
2. Which required fields are missing?
3. Which dependencies belong outside Setup?
4. What is the safest next action?
5. How can AI assist without executing automatically?

## Current State
Setup is functionally strong but visually dense. It contains:
- guided wizard
- required field tracking
- readiness scoring
- local draft
- backend save
- AI assistance
- handoffs to Library, Integrations, Campaign Studio

## Target Experience
Setup should feel like:
- foundation readiness cockpit
- guided source-of-truth builder
- safe setup wizard
- AI-assisted preparation surface

## Allowed Changes
- Add GDS wrapper classes.
- Improve top header copy.
- Add clearer operating chips / labels.
- Improve next best action wording.
- Reduce failure-like wording where possible.
- Keep wizard internals and form untouched.
- Preserve all IDs and data attributes.

## Forbidden Changes
- No backend changes.
- No API changes.
- No router changes.
- No save/draft behavior changes.
- No deleting required IDs.
- No changing `data-setup-*` contracts.
- No broad CSS rewrite.
- No moving field panels or wizard logic in this pass.

## Target Runtime File
- `public/control-center/pages/setup.js`

## Validation
- `node --check public/control-center/pages/setup.js`
- Required ID presence check
- Browser QA at `http://127.0.0.1:3000/control-center/#setup`

## Decision
Proceed with a small Setup shell/header composition pass only.
