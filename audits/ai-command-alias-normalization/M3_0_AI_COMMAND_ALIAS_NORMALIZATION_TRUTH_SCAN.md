# M3-0 — AI Command Alias Normalization Truth Scan

## 0. Status

Status: TRUTH SCAN RECORDED
Phase: M3 — AI Command Alias Normalization / Narrow Integration Candidate
Mode: locate-first scan/design only
Runtime changes in M3-0: none
Server changes in M3-0: none
UI source changes in M3-0: none
Execution authority expansion in M3-0: none

## 1. Purpose

M3-0 checks AI Command local alias drift against the canonical AI Team Operating Contract.

This corrected scan does not assume route-role-fallback.js or authority-projection.js paths exist.

This phase does not patch runtime or UI source.

This phase does not expand AI Command execution authority.

## 2. M2 Closeout Gate

M2 closed: true

## 3. Summary

| Metric | Value |
|---|---:|
| Canonical role count | 12 |
| Aliases scanned | 51 |
| Alias signals total | 42 |
| AI Command alias signal count | 42 |
| Candidate fallback/authority files found | 40 |
| Local MODE_ID_ALIASES present | true |
| Local SPECIALIST_DEFS present | true |
| M3 patch recommended | true |

## 4. Local Structures

| Structure | Present |
|---|---|
| ai_command_has_mode_id_aliases | true |
| ai_command_has_specialist_defs | true |
| ai_command_uses_getAiTeamRole | false |
| ai_command_uses_contract_aliases_directly | false |
| conformance_mentions_route_role_fallback | true |
| conformance_mentions_authority_projection | true |
| actual_route_role_fallback_file_found | true |
| actual_authority_projection_file_found | true |

## 5. Candidate Fallback / Authority Files

- `public/control-center/app.js`
- `public/control-center/pages/ai-command.js`
- `public/control-center/pages/home.js`
- `public/control-center/pages/library/projection-adapter.js`
- `public/control-center/router.js`
- `public/control-center/runtime/authority/authority-projection.js`
- `public/control-center/runtime/authority/route-role-fallback.js`
- `runtime/orchestrator-service/lib/customer-operations/projections/customer-center-projection.js`
- `runtime/orchestrator-service/lib/security/protected-route-authority.js`
- `scripts/audit/ai-command-authority-audit.mjs`
- `scripts/audit/ai-command-core-authority-audit.mjs`
- `scripts/audit/ai-command-tool-dock-authority-audit.mjs`
- `scripts/audit/ai-team-contract-conformance-check.mjs`
- `scripts/audit/campaign-studio-authority-audit.mjs`
- `scripts/audit/campaign-studio-authority-patch-proof.mjs`
- `scripts/audit/campaign-studio-runtime-authority-audit.mjs`
- `scripts/audit/content-studio-authority-audit.mjs`
- `scripts/audit/content-studio-authority-patch-proof.mjs`
- `scripts/audit/content-studio-runtime-authority-audit.mjs`
- `scripts/audit/customer-center-runtime-authority-audit.mjs`
- `scripts/audit/governance-authority-audit.mjs`
- `scripts/audit/governance-authority-patch-proof.mjs`
- `scripts/audit/governance-runtime-authority-audit.mjs`
- `scripts/audit/home-runtime-authority-audit.mjs`
- `scripts/audit/insights-runtime-authority-audit.mjs`
- `scripts/audit/integrations-authority-audit.mjs`
- `scripts/audit/integrations-authority-patch-proof.mjs`
- `scripts/audit/integrations-runtime-authority-audit.mjs`
- `scripts/audit/library-runtime-authority-audit.mjs`
- `scripts/audit/media-studio-authority-audit.mjs`
- `scripts/audit/media-studio-authority-patch-proof.mjs`
- `scripts/audit/media-studio-runtime-authority-audit.mjs`
- `scripts/audit/operations-centers-authority-audit.mjs`
- `scripts/audit/operations-centers-runtime-authority-audit.mjs`
- `scripts/audit/publishing-runtime-authority-audit.mjs`
- `scripts/audit/research-runtime-authority-audit.mjs`
- `scripts/audit/settings-authority-audit.mjs`
- `scripts/audit/settings-runtime-authority-audit.mjs`
- `scripts/audit/setup-runtime-authority-audit.mjs`
- `scripts/audit/workflows-runtime-authority-audit.mjs`

## 6. Alias Signals

| Alias | Canonical Role | AI Command Count | Contract Count | Conformance Script Count |
|---|---|---:|---:|---:|
| data | analyst | 146 | 1 | 2 |
| campaign | strategist | 110 | 23 | 1 |
| content | writer | 89 | 29 | 2 |
| media | media_director | 62 | 26 | 3 |
| publishing | publisher | 64 | 25 | 0 |
| approval | compliance_reviewer | 47 | 2 | 2 |
| safety | compliance_reviewer | 43 | 3 | 1 |
| copy | writer | 41 | 1 | 0 |
| creative | media_director | 39 | 4 | 0 |
| insights | analyst | 39 | 13 | 0 |
| ads | ads_operator | 35 | 14 | 3 |
| customer | customer_ops | 36 | 12 | 0 |
| paid | ads_operator | 32 | 2 | 1 |
| publish | publisher | 30 | 33 | 1 |
| video | video_lead | 27 | 3 | 1 |
| sales | sales_crm | 26 | 3 | 2 |
| governance | compliance_reviewer | 25 | 25 | 0 |
| executive | operations | 21 | 1 | 1 |
| seo | analyst | 21 | 1 | 0 |
| strategy | strategist | 19 | 2 | 1 |
| lead | sales_crm | 17 | 2 | 3 |
| visual | media_director | 16 | 2 | 0 |
| ticket | customer_ops | 14 | 1 | 1 |
| research | researcher | 14 | 9 | 0 |
| compliance | compliance_reviewer | 14 | 1 | 0 |
| schedule | publisher | 13 | 2 | 0 |
| storyboard | video_lead | 11 | 1 | 0 |
| support | customer_ops | 10 | 1 | 0 |
| admin | operations | 6 | 1 | 2 |
| reel | video_lead | 8 | 1 | 0 |
| voiceover | video_lead | 8 | 1 | 0 |
| inbox | customer_ops | 7 | 2 | 0 |
| designer | media_director | 6 | 1 | 0 |
| crm | sales_crm | 5 | 1 | 1 |
| motion | video_lead | 5 | 3 | 0 |
| metrics | analyst | 5 | 1 | 0 |
| copywriter | writer | 3 | 1 | 0 |
| roas | ads_operator | 3 | 1 | 0 |
| reporting | analyst | 3 | 1 | 0 |
| content_writer | writer | 1 | 1 | 0 |
| customer_operations | customer_ops | 1 | 1 | 0 |
| retention | sales_crm | 1 | 1 | 0 |

## 7. Closeout Decision

M3-0 can patch now: false

Reason:

M3-0-R1 is a truth scan only. The next safe step is a narrow patch design that normalizes AI Command local role aliases while preserving handoff/review/approval-only behavior.

Next step:

`M3-1 — Narrow AI Command Alias Normalization Patch Design`

## 8. Forbidden Without New Authority Phase

- provider execution
- live publishing
- customer send
- CRM mutation
- ads launch
- budget mutation
- backend job execution from AI Command


