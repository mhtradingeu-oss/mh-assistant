# Source-of-Truth Mismatch Resolution Plan

## Status

Audit / plan only.

No data migration has been performed in this phase.

---

## Problem

The release proof found repeated `project_data_mismatch` warnings for the Hairoticmen source-of-truth registry.

The mismatch is between:

- canonical: `data/projects/hairoticmen/source-of-truth-registry.json`
- legacy: `data/projects/hairoticmen/sources-registry.json`

The mismatch is structural, not only value-level.

---

## Current Classification

P1 release blocker unless formally accepted as known migration debt.

---

## Goal

Resolve the warning without damaging project data or breaking frontend/backend compatibility.

---

## Technical Options

### Option A — Canonical-first migration

Use `source-of-truth-registry.json` as the authority.

Merge useful legacy channel data from `sources-registry.json` into canonical `sources` / `statuses` only where missing or stale.

Then either:

- regenerate legacy from canonical for backward compatibility, or
- update parity check logic so schema-version differences are not treated as value mismatch.

Recommended if current code still reads both files.

### Option B — Deprecate legacy file

Keep canonical file only.

Stop reading or parity-checking `sources-registry.json` for this project/domain after verifying no active frontend/backend path depends on it.

Recommended only if ownership evidence proves legacy reads are obsolete.

### Option C — Formal migration debt acceptance

Do not change data now.

Document the mismatch as known migration debt with owner, date, and release acceptance.

Recommended only if this warning is non-user-facing and low operational risk.

---

## Recommended Direction

Do not delete either file.

Do not overwrite canonical blindly.

Proceed with Option A unless the ownership audit proves legacy is unused.

Reason:

- canonical is the desired authority
- legacy still exists and is referenced by mismatch checks
- safe merge/regeneration preserves compatibility
- warning noise should be removed before final launch

---

## Required Before Implementation

1. Confirm every code path that reads/writes each file.
2. Confirm canonical schema expected by Setup, Library, AI Command, Governance, and Publishing.
3. Confirm whether legacy is still needed for backward compatibility.
4. Create backup copies before any data migration.
5. Run post-migration health checks.
6. Confirm warnings disappear after service restart or next setup read.
7. Commit data migration separately from code changes.

---

## Non-Goals

This phase does not:

- modify data files
- change backend code
- change frontend code
- delete legacy files
- suppress warnings without understanding ownership

---

## Next Phase

PHASE 3D should be either:

- Codex AUDIT-DOCUMENT-ONLY review of this plan and evidence, or
- Terminal-only ownership review if the evidence is already sufficient.

