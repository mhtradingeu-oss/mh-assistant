# M4-1 — Route Role Fallback / Authority Projection Patch Design

## 0. Status

Status: PATCH DESIGN RECORDED
Phase: M4 — Route Role Fallback Alias Normalization / Authority Projection Narrow Review
Mode: design only
Runtime changes in M4-1: none
Server changes in M4-1: none
UI source changes in M4-1: none
Execution authority expansion in M4-1: none

## 1. Current Head

`7b11c82 (HEAD -> main, origin/main, origin/HEAD) Record route role fallback alias truth scan`

Git sync:

`0	0`

## 2. M4-0 Gate

M4-0 status: TRUTH_SCAN_RECORDED

M4-0 can patch now: false

Blind global normalization safe: false

## 3. Observed Truth

| Item | Value |
|---|---:|
| route-role-fallback file present at expected path | false |
| authority-projection file present at expected path | false |
| conformance failures | 0 |
| conformance warnings | 10 |
| unknown route candidates | 6 |
| alias drift signals | 53 |
| target alias hit count | 164 |

## 4. Design Decision

Direct runtime patch safe now: false

Conformance checker patch may be required: true

Reason:

M4-0 found no physical route-role-fallback.js or authority-projection.js at expected paths while conformance warnings are produced by the conformance checker. M4 must first design a checker/classifier refinement or locate the real source anchors before runtime patching.

## 5. Prohibited Actions

- Do not globally replace alias tokens.
- Do not normalize page IDs, route IDs, outputTargets, primaryPages, supportPages, or handoff destinations as role IDs.
- Do not touch runtime/orchestrator-service.
- Do not expand execution authority.
- Do not edit AI Command again unless a new truth scan proves a direct M4 dependency.

## 6. Safe Patch Candidate

Scope:

`scripts/audit/ai-team-contract-conformance-check.mjs only, unless M4-2 proves another exact file`

Intent:

separate true role alias warnings from page/route/domain vocabulary and align warning text with M3-normalized AI Command boundary

Expected effect:

reduce misleading route-role-fallback alias warning only if the checker proves aliases are no longer runtime authority risk

Must not change runtime behavior: true

## 7. M4-2 Patch Requirements

- Before patching, prove exact lines in conformance checker that classify route-role-fallback aliases.
- Separate role aliases from contract page IDs and handoff route IDs.
- Preserve unknown route candidate warnings unless separately proven safe.
- Preserve AI Command alias drift warnings unless M4-2 explicitly targets checker wording after M3.
- Run validate-ai-team-operating-contract and ai-team-contract-conformance-check after any patch.
- Diff scope must be limited to the designed checker/artifact files.

## 8. Closeout Decision

M4-1 can patch now: false

M4-1 design ready for review: true

Next step:

`M4-2 — Narrow Conformance Classifier Patch / Exact Anchor Patch`

Reason:

M4-1 is design only. A patch can only happen after the exact checker anchors are reviewed and the scope is limited to classifier/warning logic or another proven narrow file.


