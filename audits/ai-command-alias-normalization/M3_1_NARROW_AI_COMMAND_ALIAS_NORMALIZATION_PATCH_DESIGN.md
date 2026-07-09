# M3-1 — Narrow AI Command Alias Normalization Patch Design

## 0. Status

Status: PATCH DESIGN RECORDED
Phase: M3 — AI Command Alias Normalization / Narrow Integration Candidate
Mode: design only
Runtime changes in M3-1: none
Server changes in M3-1: none
UI source changes in M3-1: none
Execution authority expansion in M3-1: none

## 1. Purpose

M3-1 records the safe patch design for a narrow AI Command alias normalization patch.

M3-1 does not modify AI Command.

M3-1 does not expand execution authority.

## 2. Prior Truth Summary

| Metric | Value |
|---|---:|
| M2 closed | true |
| Canonical role count | 12 |
| Aliases scanned | 51 |
| Alias signals total | 42 |
| AI Command alias signal count | 42 |
| Local MODE_ID_ALIASES present | true |
| Local SPECIALIST_DEFS present | true |
| M3 patch recommended | true |

## 3. Anchor Proof

| Anchor | Present |
|---|---|
| ai_command_has_mode_id_aliases | true |
| ai_command_has_specialist_defs | true |
| ai_command_has_get_ai_room_role_id | true |
| ai_command_uses_get_ai_team_role | false |
| ai_command_uses_contract_aliases_directly | false |
| contract_exports_get_ai_team_role | true |
| contract_exports_role_aliases | true |
| contract_has_canonical_operations | true |
| contract_has_canonical_media_director | true |
| contract_has_canonical_ads_operator | true |

## 4. Proposed Patch Scope

Patch type:

`narrow frontend AI Command alias normalization`

Primary file:

`public/control-center/pages/ai-command.js`

Desired behavior:

- AI Command should keep all visible specialist cards and routing behavior stable.
- Local legacy IDs such as admin, media, ads, designer, copywriter, seo should resolve through canonical AI Team role mapping.
- Canonical role IDs should become the internal final IDs wherever safe.
- Legacy IDs may remain as compatibility aliases for UI/session migration only.
- AI Command should use getAiTeamRole or AI_TEAM_ROLE_ALIASES from the canonical contract instead of duplicating alias truth locally.
- No live execution behavior should be added.

## 5. Exact Patch Strategy

- Add/import canonical role resolver from public/control-center/runtime/ai-team/ai-team-operating-contract.js into ai-command.js only if import pattern is already supported.
- If static import is risky for current bundling, add a local wrapper that reads from existing global/contract exports only after proving availability.
- Introduce a small normalizeAiCommandRoleId(rawId, fallback) helper near MODE_ID_ALIASES usage.
- The helper should first normalize raw input with getAiRoomRoleId/asString as currently done, then map aliases through canonical getAiTeamRole or AI_TEAM_ROLE_ALIASES, then fall back to existing MODE_ID_ALIASES only for compatibility.
- Replace repeated direct MODE_ID_ALIASES[rawId] || rawId patterns with normalizeAiCommandRoleId where the value is used as a role/specialist id.
- Do not replace text/domain keywords such as paid media, SEO, customer text, campaign copy, or route labels.
- Do not change SPECIALIST_DEFS content in M3-2 unless the design proof shows a single safe canonical-id update.

## 6. Candidate Replacements

| Current Pattern | Target | Risk | Note |
|---|---|---|---|
| `MODE_ID_ALIASES[id] || id` | `normalizeAiCommandRoleId(id)` | medium | Only replace when value is used as a specialist/role id. |
| `MODE_ID_ALIASES[rawId] || rawId` | `normalizeAiCommandRoleId(rawId)` | medium | Must preserve fallback behavior for unknown IDs. |
| `MODE_ID_ALIASES[getAiRoomRoleId(...)] || getAiRoomRoleId(...)` | `normalizeAiCommandRoleId(...)` | medium | Avoid double normalization and keep current fallback if SPECIALIST_DEFS lacks canonical id. |

## 7. Explicit Forbidden Replacements

- Do not replace every occurrence of media/ads/seo/content/customer as plain text.
- Do not rename routes such as media-studio or ads-manager.
- Do not remove local MODE_ID_ALIASES in first patch unless all references are safely migrated and validation proves no behavior change.
- Do not remove SPECIALIST_DEFS in first patch.
- Do not add execution actions.

## 8. Required No-Change Zones

- No backend/runtime/orchestrator files.
- No route authority changes.
- No provider execution changes.
- No publishing/send/ads/CRM/customer-send execution changes.
- No allowedOutputs or authority level expansion.
- No removal of current UI visible behavior unless alias-safe and validated.
- No large rewrite of AI Command.

## 9. Validation Plan

- `node --check public/control-center/runtime/ai-team/ai-team-operating-contract.js`
- `node --check public/control-center/pages/ai-command.js`
- `node --check scripts/audit/validate-ai-team-operating-contract.mjs`
- `node --check scripts/audit/ai-team-contract-conformance-check.mjs`
- `node scripts/audit/validate-ai-team-operating-contract.mjs`
- `node scripts/audit/ai-team-contract-conformance-check.mjs`
- `node --check public/control-center/app.js`
- `node --check public/control-center/router.js`
- `node --check public/control-center/api.js`
- `node --check public/control-center/automation-engine.js`
- `node --check public/control-center/pages/governance.js`
- `node --check public/control-center/pages/publishing.js`
- `node --check public/control-center/pages/ads-manager.js`
- `git diff --name-only must show only ai-command.js plus M3-2 artifacts if patch is applied later`
- `No runtime/orchestrator files may change in M3-2`

## 10. Success Criteria

- Conformance failures remain 0.
- Warnings should remain expected or reduce alias warnings without adding new warnings.
- AI Command still covers all canonical roles or aliases.
- No execution authority expansion.
- No provider execution, live publish, send, ads launch, CRM mutation, or budget mutation.
- Frontend syntax validation passes.
- Runtime/orchestrator diff remains empty.

## 11. Risk Register

| Risk | Mitigation |
|---|---|
| AI Command SPECIALIST_DEFS may still use legacy IDs for visible cards. | M3-2 should normalize final role IDs at usage boundaries first, not rewrite the whole definitions table. |
| Route ids and role ids are mixed in some places. | Only replace MODE_ID_ALIASES usage when the variable is role/specialist id, not destination route. |
| Plain words like media, ads, seo are content/domain vocabulary, not always aliases. | No global string replacement. Use targeted helper and exact anchors. |
| Static import may break if ai-command.js is loaded outside module context. | Inspect existing import/export style before M3-2 patch; if unsafe, use existing contract exposure pattern or keep local wrapper. |

## 12. Closeout Decision

M3-1 can patch now: false

Reason:

M3-1 is a patch design only. The actual narrow patch should be applied in M3-2 after reviewing these anchors and preserving AI Command handoff/review/approval-only authority.

Next step:

`M3-2 — Narrow AI Command Alias Normalization Patch`


