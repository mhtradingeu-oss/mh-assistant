
Safe Commit Scope Candidate — Phase 1
Candidate include list

Only after final confirmation, the likely Phase 1 commit may include:

git add \
  public/control-center/runtime/ai-team/ai-team-operating-contract.js \
  scripts/audit/validate-ai-team-operating-contract.mjs \
  scripts/audit/ai-team-contract-conformance-check.mjs \
  public/control-center/pages/ai-command.js \
  public/control-center/pages/home.js \
  public/control-center/styles/13-home-executive.css \
  public/control-center/pages/home/render-sections.js \
  audits/product-readiness/
Do not include automatically
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
Suggested commit message
git commit -m "Lock AI team operating contract and Home bridge"
Required before commit

Run:

git diff --cached --stat
git diff --cached --name-only

Then manually confirm there are no unrelated backend/media/data files.
