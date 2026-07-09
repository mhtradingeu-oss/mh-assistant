# M3-2 — Narrow AI Command Alias Normalization Patch

## 0. Status

Status: PATCH APPLIED FOR REVIEW - CLEANED
Phase: M3 — AI Command Alias Normalization / Narrow Integration Candidate
Mode: narrow patch
Runtime changes in M3-2: none
Server changes in M3-2: none
UI source changes in M3-2: yes - AI Command only
Execution authority expansion in M3-2: none

## 1. Changed Source Files

- `public/control-center/pages/ai-command.js`

## 2. Audit Artifacts

- `audits/ai-command-alias-normalization/M3_2_NARROW_AI_COMMAND_ALIAS_NORMALIZATION_PATCH.json`
- `audits/ai-command-alias-normalization/M3_2_NARROW_AI_COMMAND_ALIAS_NORMALIZATION_PATCH.md`

## 3. Helper Added

- `normalizeAiCommandCanonicalRoleId`
- `normalizeAiCommandSpecialistId`

## 4. Replacement Summary

| Label | Type | Count |
|---|---|---:|
| resolvedId from local MODE_ID_ALIASES | literal | 2 |
| rawId direct alias boundary | literal | 1 |
| fallbackId direct alias boundary | literal | 1 |
| legacy resolved direct alias boundary | regex | 1 |
| finalId direct alias boundary | literal | 1 |
| requestedId direct alias boundary | literal | 1 |
| toolModeId session alias boundary | literal | 1 |
| promptModeId session alias boundary | literal | 2 |
| normalizedSessionModeId session alias boundary | literal | 1 |

## 5. Preserved Boundaries

- MODE_ID_ALIASES object preserved for backward compatibility.
- SPECIALIST_DEFS preserved to avoid UI/card rewrite.
- localResolved legacy boundary preserved where the surrounding logic is not safely proven as a specialist final ID.
- Routes such as media-studio and ads-manager were not renamed.
- No provider execution, publishing, ads launch, customer send, CRM mutation, or budget mutation was added.

## 6. Cleanup

- Removed duplicate `normalizeAiCommandSpecialistId` helper using function-boundary cleanup.
- Preserved one `normalizeAiCommandCanonicalRoleId` helper.
- Upgraded the remaining `normalizeAiCommandSpecialistId` helper to use the canonical helper.
- Inserted missing blank line between `normalizeAiCommandSpecialistId` and `detectSpecialistFromBridgePrompt`.

## 7. Safety Statement

M3-2 normalizes AI Command role-like alias boundaries only.

M3-2 does not expand AI Command execution authority.

M3-2 does not add provider execution, live publishing, customer send, CRM mutation, ads launch, or budget mutation.

## 8. Closeout Decision

M3-2 ready for review: true

M3-2 can commit now: false

Reason:

Patch is applied locally for review only. Commit after syntax, conformance, diff scope, and no-runtime/server-change validation pass.

Next step:

`M3-2-2 - Commit Narrow AI Command Alias Normalization Patch`


