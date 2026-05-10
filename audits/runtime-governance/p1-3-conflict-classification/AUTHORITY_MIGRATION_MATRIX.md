# Authority Migration Matrix

| Area | Current frontend owner | Backend authority exists | Risk | Decision |
|---|---|---:|---|---|
| AI roles | ai-team-model.js | yes | high | migrate to backend projection |
| Specialist page map | ai-team-model.js | partial/yes | medium | backend-derived or compatibility only |
| Route roles | app.js/router.js | yes | high | source switch to operations.team_service_model.route_permissions |
| Active role | app.js localStorage + operations | yes | medium | backend default, local only for dev/testing |
| Handoffs | shared-context.js cache | yes | high | local cache transient only |
| Approvals | workflows/automation-engine UI gates | yes | high | backend approval authority only |
| Workflow auto mode | automation-engine.js | partial/yes | high | keep explicit-only until backend runtime |
| Governance | frontend warnings | yes | critical | display only, never authority |
| Publishing guardrails | frontend controls | yes | critical | backend source of truth |
