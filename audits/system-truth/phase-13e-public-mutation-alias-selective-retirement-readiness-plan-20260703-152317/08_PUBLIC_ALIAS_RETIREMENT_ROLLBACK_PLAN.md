# Phase 13E — Public Alias Retirement Rollback Plan

## Goal

Any future retirement patch must be reversible quickly if an external compatibility caller is discovered.

## Rollback options

### Option A — Git revert

Use if the retirement patch was committed cleanly:

```bash
git revert <retirement_commit>
git push origin main
Option B — Feature flag restore

Preferred future design:

Maintain an environment flag such as:
MH_PUBLIC_ALIAS_COMPATIBILITY=true
MH_BLOCK_CRITICAL_PUBLIC_MUTATION_ALIASES=false

If selected public alias retirement becomes configurable, rollback can happen by env change.

Option C — Temporary compatibility allowlist

If one external caller is found:

keep retirement for all others
allowlist only the specific alias temporarily
log caller
set deadline for migration
Required rollback evidence

Before any future retirement patch:

list selected aliases
list canonical equivalents
list expected 410 responses
list rollback command
list env flags if available
list owner decision
Do not retire without rollback

If rollback cannot be performed within one commit revert, do not proceed.
