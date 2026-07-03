# Safe Implementation Order

## Rule
Never implement multiple risky domains in one patch.

## Recommended sequence

### Step 1 — Phase 11D lock
Lock this roadmap.

### Step 2 — Phase 11E naming and documentation alignment plan
Plan only:
- verify home/settings aliases
- verify active/planned language
- decide exact UI copy cleanup
- no code yet

### Step 3 — Phase 11E.1 small naming/documentation patch
Patch only copy/labels if proven safe.

No backend.
No route.
No provider.
No execution.

### Step 4 — Phase 12 Operations Office UX scan
Deep scan:
- Workflows
- Task Center
- Queue Center
- Job Monitor
- Operations Centers
- AI Command Operations handoff

### Step 5 — Phase 12A Operations Office UX patch
Improve UX only:
- execution checklist
- owner/dependency map
- blocker board
- review gates
- no workflow execution change

### Step 6 — Phase 13 Customer Operations Office UX scan
Deep scan:
- Customer Center
- Operations Centers
- customer read-only projections
- reply draft handoff
- ticket/SLA/escalation preview

### Step 7 — Phase 13A Customer Operations UX patch
Improve UX only:
- unified inbox board
- conversation review
- reply draft preview
- SLA risk board
- escalation draft
- no reply sending
- no ticket mutation
- no CRM mutation

### Step 8 — Phase 14 Sales / CRM Office UX scan
Deep scan:
- sales CRM tools
- lead/context sources
- customer-to-sales handoff
- workflows
- integrations

### Step 9 — Phase 14A Sales / CRM UX patch
Improve UX only:
- lead qualification board
- outreach draft board
- follow-up cadence board
- sales handoff viewer
- no outreach sending
- no CRM writes
- no pipeline mutation

### Step 10 — Phase 15 Compliance / Publisher UX alignment
Deep scan then patch:
- approval package
- compliance claims review
- publishing readiness
- schedule preview
- no live publishing

## Execution authority audits come later

Only after UX is clear:
- workflow run audit
- task mutation audit
- customer send audit
- CRM write audit
- publishing send audit
- ads launch audit
- provider execution audit
