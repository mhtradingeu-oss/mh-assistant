# State Ownership Table

| State | Current locations | Target owner | Decision |
|---|---|---|---|
| current project | state/context/pages | state.js | canonical |
| active route | router/app | router + state projection | consolidate later |
| active role | localStorage/app/backend projection | backend projection via helper | keep fallback temporary |
| route permissions | app/router/backend | backend projection | router switch later |
| AI drafts | shared-context/pages | transient bridge then backend | keep temporary |
| handoffs | shared-context/pages/backend ops | backend durable, shared transient | migrate later |
| setup drafts | setup localStorage | page-local draft | allowed |
| workflow drafts | workflows localStorage | page-local until backend draft store | allowed temporary |
| integration drafts | integrations session | page-local | allowed |
| library upload state | library session | page-local | allowed |
| loading overlay | app/runtime overlay | runtime overlay layer | canonical runtime |
| auto mode state | automation-engine/pages | backend orchestration later | compatibility debt |
