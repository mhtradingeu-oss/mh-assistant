# Documentation Cleanup Plan

Generated: 20260517-132208 UTC
Mode: AUDIT-ONLY. No existing documentation or application source files were modified.
Audit folder: audits/documentation-canonicalization-20260517-132208

## Phase 1: Classify

Use this audit pack to review inventory classifications, confirm canonical candidates, and mark any human-review exceptions. No file movement.

## Phase 2: Approve Canonical Docs

Approve docs/mh-os/ or an alternate canonical location. Decide the owner and required evidence for each canonical doc.

## Phase 3: Create / Update Missing Canonical Docs

Create the missing canonical docs from approved source material only. Each doc should include source links, current safety status, and explicit planned/disabled labels.

## Phase 4: Archive Duplicates

After canonical docs exist and are approved, move older phase plans, duplicate audits, and stale vision docs to an approved archive location. This must be a separate cleanup pass.

## Phase 5: Validate Docs Against Source Code

Validate page, route, backend, runtime, and AI Team claims against source code before using the docs for implementation. Regenerate route and node-check evidence when needed.

## Phase 6: Use Canonical Docs For Page-By-Page Finalization

Resume page-by-page work only after the canonical operating model, page standard, page registry/workflow map, AI Team model, and safe upgrade protocol are approved.

## Safety Controls

- One page or one concern per commit.
- Search before creating pages/routes/files.
- Do not duplicate pages/routes/files.
- No backend mutation without confirmation.
- Planned actions remain planned/disabled until wired and verified.
- Customer Operations stashes remain untouched until that phase.
