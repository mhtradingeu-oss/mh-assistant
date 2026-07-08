# Phase 2A — Safe Staging Plan

## Status

This is a commit scope audit only.

No commit has been made.
No push has been made.
No staging has been made by this report.

## Candidate include list

Only if explicitly approved, use targeted add:

    git add \
      public/control-center/runtime/ai-team/ai-team-operating-contract.js \
      scripts/audit/validate-ai-team-operating-contract.mjs \
      scripts/audit/ai-team-contract-conformance-check.mjs \
      public/control-center/pages/ai-command.js \
      public/control-center/pages/home.js \
      public/control-center/styles/13-home-executive.css \
      public/control-center/pages/home/render-sections.js \
      audits/product-readiness/

## Do not stage automatically

    runtime/orchestrator-service/server.js
    runtime/orchestrator-service/lib/media/
    public/control-center/pages/media-studio.js
    public/control-center/pages/media-studio.BACKUP.js
    public/control-center/pages/media-studio.BACKUP_FLOW_LOCK.js
    public/control-center/pages/media-studio.BACKUP_FINAL_FLOW_LOCK.js
    public/control-center/state/
    infra/
    data/projects/hairoticmen/ops/
    audits/system-truth/

## Required after targeted staging

    git diff --cached --stat
    git diff --cached --name-only

Then manually confirm no excluded backend/media/data/system-truth files were staged.

## Expected validation

    AI Team Operating Contract validation: PASS
    Failures: 0
    Handoff drift pairs: 0

## Suggested commit message after staged review

    git commit -m "Lock AI team operating contract and Home bridge"

## Current classification result

    Counts: include=8, hold=31, unknown=0
    VERDICT: READY FOR TARGETED STAGING PLAN REVIEW
