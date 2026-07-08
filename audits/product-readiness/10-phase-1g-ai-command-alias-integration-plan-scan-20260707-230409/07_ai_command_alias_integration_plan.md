# Phase 1G — AI Command Alias Integration Plan Scan

## Current truth

The canonical contract is valid and handoff-aligned.

The refined conformance audit says:
- Failures: 0
- Handoff drift pairs: 0
- Contract pages are visible in runtime
- AI Command covers all canonical roles or aliases
- Remaining issue: alias drift

## Runtime alias drift

AI Command still uses local aliases such as:
- admin
- media
- ads
- copywriter
- designer
- customer_operations
- crm

This is not a bug by itself. It is compatibility debt.

## Do not do

- Do not replace MODE_ID_ALIASES wholesale.
- Do not replace SPECIALIST_DEFS.
- Do not change classifyIntent routing in one large patch.
- Do not integrate Home yet.
- Do not touch route-role-fallback yet.
- Do not enforce handoff rules in runtime yet.

## Safest integration candidate

Add a narrow AI Command helper:

```js
function normalizeAiCommandSpecialistId(id, fallback = "operations") {
  const localResolved = MODE_ID_ALIASES[id] || id;
  return normalizeAiTeamRoleId(localResolved, fallback);
}

Then use it only in the bridge detector return path, not everywhere.

Why this is safe

The Home -> AI Command bridge already calls detectSpecialistFromBridgePrompt.
The detector currently returns aliases such as admin/copywriter in some cases, then relies on MODE_ID_ALIASES.
A helper can normalize final output to canonical IDs while preserving local compatibility.

Proposed next phase

Phase 1H — AI Command Alias Integration Patch

Scope:

Import normalizeAiTeamRoleId from the contract.
Add normalizeAiCommandSpecialistId helper.
Use it only inside detectSpecialistFromBridgePrompt.
Do not touch SPECIALIST_DEFS.
Do not touch classifyIntent internals.
Do not touch Home.
Validate with syntax + conformance + targeted bridge simulation.
