# C2-B1 - Content Capability Action Contract Foundation

## Status

Implemented as an additive contract foundation.

## Scope

This phase defines typed frontend action contracts for:

- `content.create`
- `content.translate`
- `content.improve`

## Architectural decision

This is not a new Capability Engine and not a parallel runtime.

The contracts reuse the existing governed Content Studio path:

1. Content Studio prepares the request.
2. `executeProjectAiCommand` uses the existing backend authority.
3. The existing flow handles versioning, review, and persistence.

## Contract responsibilities

Each action defines:

- canonical capability identity;
- legacy Tool Dock identity;
- required input vocabulary;
- prompt construction;
- expected output-handling mode;
- confirmation requirement;
- review status;
- governance mode.

## Authority boundary

This module:

- does not call providers;
- does not execute backend requests;
- does not save records;
- does not mutate Content Studio state;
- does not bypass confirmation or governance;
- does not alter Tool Drawer behavior.

## Current integration state

The contracts are not yet imported by Content Studio.

This is intentional. C2-B1 establishes typed definitions only and does not change current generation behavior.

## Next phase

C2-C1 may integrate only `content.create` into the existing Generate flow.

The integration must:

- preserve the existing `buildAiPrompt` output;
- preserve the existing backend call;
- preserve generated-answer extraction;
- preserve version creation;
- preserve review status;
- preserve persistence behavior;
- add capability metadata without changing user-visible behavior.

Translation and improvement integration remain blocked until their returned outputs are consumed as new versions rather than merely modifying the brief.
