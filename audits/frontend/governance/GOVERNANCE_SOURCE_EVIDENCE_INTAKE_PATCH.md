## GOVERNANCE SOURCE / EVIDENCE / INTAKE PATCH

### What changed
- Added a compact Evidence Summary and Incoming Review Context panel to the Governance selected decision area.
- Evidence summary surfaces source-of-truth, legal, pricing, certificate/proof, brand, and product asset states for the selected decision.
- Intake panel surfaces AI Team, Publishing, Content Studio, Media Studio, Workflows, Operations, Notifications, and Insights handoff context if available.
- Missing evidence is explicitly shown with a warning.
- Safety guidance is displayed for high-risk decisions.
- Minimal, governance-specific CSS for evidence and intake panels.

### Files changed
- public/control-center/pages/governance.js
- public/control-center/styles/12-pages.css
- audits/frontend/governance/GOVERNANCE_SOURCE_EVIDENCE_INTAKE_PATCH.md (this file)

### Data/source limitations
- Only uses data available in selectedItem, projectData, and governanceData.
- Intake context uses shared-context helpers if present, otherwise is empty.
- No backend or data mutation occurs.

### Safety boundary
- No backend, API, or data mutation.
- No changes to decision APIs, backend, or project data.
- No changes to app.js, router.js, api.js, or runtime/orchestrator-service.
- No changes to data/projects.

### What was intentionally not changed
- No redesign of the Governance page.
- No changes to backend behavior, APIs, or data shape.
- No new durable intake or evidence mutation.
- No changes to decision action labels or authority boundaries.

### Validation summary
- Evidence and intake panels appear near the selected decision and actions.
- Missing evidence is explicit.
- No backend/data mutation.
- No change to existing decision APIs.
  
#### Validation commands
```
git status --short
git diff --stat
node --check public/control-center/pages/governance.js
node --check public/control-center/shared-context.js
node --check public/control-center/app.js
node --check public/control-center/router.js
node --check public/control-center/api.js
grep -n "renderGovernanceEvidenceSummary\|collectGovernanceEvidence\|Incoming Review Context\|Missing source evidence\|governance-evidence-summary\|governance-intake-panel\|source-of-truth evidence\|getSharedHandoff\|getSharedAiDraft\|getSharedAiSource" \
  public/control-center/pages/governance.js \
  public/control-center/styles/12-pages.css \
  public/control-center/shared-context.js \
  audits/frontend/governance/GOVERNANCE_SOURCE_EVIDENCE_INTAKE_PATCH.md | sed -n '1,920p'
grep -n "Approve</button>\|Override</button>\|approve now\|execute now\|publish now\|send now\|style=\"\|data/projects" \
  public/control-center/pages/governance.js \
  public/control-center/styles/12-pages.css || true
git status --short | grep "data/projects" || true
```
