# Source-of-Truth Migration Backup Manifest

Generated: 2026-05-25T16:12:48Z
Branch: architecture/frontend-consolidation-v1
Head: 464e90c

## Purpose
Pre-migration backup before canonical-first source-of-truth implementation.

## Files backed up
- BACKUP_MANIFEST.md (246 bytes)
- data-mismatches.json.before (105930 bytes)
- source-of-truth-registry.json.before (2157 bytes)
- sources-registry.json.before (836 bytes)

## Restore commands
```bash
cp audits/release/source-of-truth-mismatch/backups/20260525T161248Z/source-of-truth-registry.json.before data/projects/hairoticmen/source-of-truth-registry.json
cp audits/release/source-of-truth-mismatch/backups/20260525T161248Z/sources-registry.json.before data/projects/hairoticmen/sources-registry.json
test ! -f audits/release/source-of-truth-mismatch/backups/20260525T161248Z/data-mismatches.json.before || cp audits/release/source-of-truth-mismatch/backups/20260525T161248Z/data-mismatches.json.before data/projects/hairoticmen/ops/data-mismatches.json
```
