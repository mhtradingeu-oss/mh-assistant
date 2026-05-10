# Frontend Authority Retirement Table

| Area | File | Current role | Future role | Retirement decision |
|---|---|---|---|---|
| Route roles | app.js | hybrid projection + fallback | projection reader | keep fallback until router switch |
| Route roles | router.js | local authority fallback | projection-aware router | shadow first, switch later |
| Active role | app.js | localStorage + backend projection | backend projection with dev fallback | keep localStorage only as temporary UX/dev fallback |
| AI specialists | ai-command.js | static cards + projection | backend projection with fallback | keep static AGENT_CARDS as compatibility |
| AI team cards | home.js | projection + fallback | backend projection | keep fallback only |
| Handoffs | shared-context.js | transient cache | transient UX bridge | document as non-authority |
| Workflows | workflows.js | frontend runtime compatibility | backend execution projection | migrate later |
| Publishing auto mode | publishing.js | frontend runtime compatibility | backend publishing runtime projection | migrate later |
| Automation engine | automation-engine.js | frontend runtime compatibility | backend orchestration runtime | migrate later |
| Governance warnings | governance/publishing pages | display + local assumptions | backend governance projection | display only |
