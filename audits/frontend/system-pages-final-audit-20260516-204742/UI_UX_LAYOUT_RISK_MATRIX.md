# UI / UX Layout Risk Matrix

| Area | Risk | Evidence | Severity | Recommendation |
|---|---|---|---|---|
| Route clarity | `operations-centers` appears real but is not registered | `home.js` and `ai-command.js` reference it; `router.js` does not register it | P0 Critical | Add registered overview route or update references to split Operations route |
| AI handoff clarity | Some Send/Open AI actions appear to transfer context but may not populate AI Command | Content, Media, Publishing use shared handoff/draft; AI Command render consumes `quickCommandInput` | P1 High | Standardize one AI bridge pattern |
| Library runtime | Pagination handler references undefined `nextId` | `library.js` grid page handler source-level read | P0 Critical | Remove stale selected-card message or define selected ID safely |
| Governance safety | Approval decision buttons mutate backend without confirm | `governance.js` calls `decideProjectApproval` directly | P1 High | Confirm approve/reject/change/escalate/override decisions |
| Workflows maintainability | Active surface is simplified while old execution loop helpers remain | `renderWorkflowExecutionLoop` is not mounted; stale automation render call shape remains | P1 High | Document, remove, or isolate legacy execution loop |
| Specialist naming | Research routes can use `researcher` but AI Command lacks that specialist | Workflows catalog and AI alias map | P1 High | Map to `analyst` or add Research specialist |
| Duplicate IDs | Conditional duplicate panel IDs exist in source scan | `mediaQueuePanel`, `mediaOutputPreviewPanel`, `contentHandoffPanel` | P2 Medium | Runtime screenshot/DOM uniqueness validation after route render |
| Dense layouts | Studios and operations pages include many panels/tables | Content, Media, Publishing, Governance, Operations | P2 Medium | Screenshot at desktop/tablet/mobile before production |
| CSS layering | Page styles concentrated in large shared files with many overrides | `12-pages.css` 6011 lines; `14-page-standard.css` 2452 lines | P2 Medium | Move page-specific blocks to scoped modules over time |
| Integrations CSS | Empty modular CSS files exist | `styles/integrations/*.css` are 0 bytes | P3 Later | Either populate modules or remove unused files in a style cleanup |
| Local vs durable state | Ads Manager metrics/budget look operational but are local-only | `ads-manager.js` session map only | P1 High | Save ad plan or label planning-only |
| Local vs backend action labels | Publishing local and backend actions can feel close together | Publishing has real publish/fail APIs and local queue state | P1 High | Separate draft/local and backend-governed controls visually |
| Generic Open AI buttons | Several pages open AI without preloading context | Operations, Governance, Settings, Insights, Research generic buttons | P2 Medium | Make generic buttons set a page summary prompt |
| Mobile tables | Operations/Governance/Insights tables may overflow | Tables with many columns, though CSS includes responsive rules | P2 Medium | Run Playwright screenshot/mobile scroll validation |
| Long forms | Setup/Settings are long and dense | Form-heavy sections | P2 Medium | Keep section anchors and next-action panels sticky/visible |

## Design Direction Fit

Best aligned with AI Team Command Center:
- AI Command
- Campaign Studio
- Media Studio
- Content Studio
- Publishing
- Operations split pages

Needs clearer AI Team design language:
- Integrations
- Ads Manager
- Settings
- Governance
- Library selected-asset AI panel

Needs route/product model decision:
- Operations Centers composite
- Customer Operations page

