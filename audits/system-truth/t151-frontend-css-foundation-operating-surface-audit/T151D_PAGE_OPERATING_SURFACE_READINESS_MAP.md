# T151D — Page-by-Page Operating Surface Readiness Map

## Status
Audit only. No production changes.

## Baseline
- a036f3d Close Operations Centers runtime authority audit

## Purpose
Map every major Control Center page against the target MH-OS operating-surface standard before any CSS merge, archive, delete, or frontend redesign.

## Target Operating Surface Standard
Each page should converge toward:

1. Header / mission context
2. Main working view
3. Right-side Action Panel
4. Right-side or contextual AI Panel
5. Clear Next Best Action
6. Clear safe/disabled/destructive action states
7. Backend authority respected
8. No hidden mutation behind generic UI
9. Consistent empty/loading/error states
10. Page-specific CSS owner declared

## Current Page Readiness Map

| Page / Surface | Current Status | CSS Owner | Risk | Next Required Step |
|---|---|---|---|---|
| Home | Partially aligned | `13-home-executive.css` + legacy overlap | Medium/high CSS duplication | Home UX/CSS authority audit before final polish |
| Setup | Runtime authority closed | `12-pages.css` + shared foundation | Legacy override risk | Setup operating-surface cleanup later |
| Insights | Runtime authority closed | shared/page legacy | Medium | Insights UX contract later |
| Customer Center | Authority + Browser QA closed | page/shared styles | Medium | Customer UX polish only after CSS foundation |
| Operations Centers | Authority + Browser QA closed | `09-operations-centers.css` | Medium | First safe UX standardization candidate |
| Task Center | Authority classified under Operations | `09-operations-centers.css` | Medium | Operations UX pass |
| Queue Center | Authority classified under Operations | `09-operations-centers.css` | Medium | Operations UX pass |
| Job Monitor | Authority classified under Operations | `09-operations-centers.css` | Medium | Operations UX pass |
| Notification Center | Authority classified under Operations | `09-operations-centers.css` | Medium/high due limited mutation paths | Mutation-specific QA later if needed |
| Library | Partially aligned but CSS-heavy | `12-pages.css` + `14-page-standard.css` + library modules | High duplication | Separate Library CSS extraction/cleanup phase |
| Integrations | Partially aligned | `integrations/*.css` + shared | Medium | Integrations authority + UX audit |
| Governance | Runtime-sensitive | shared/page legacy | High due approval actions | Governance authority/UX audit before redesign |
| AI Command | Critical smart-core surface | `04-command-layer.css`, `05-ai-layer.css`, page CSS | High | Dedicated AI Command architecture + UX audit |
| Workflows | Execution-sensitive | shared/workflow primitives | High | Workflow execution authority audit before UX |
| Publishing | Publish-sensitive | shared/page legacy | High | Publishing authority audit before UX |
| Media Studio | Provider/media-sensitive | shared/page legacy | High | Media authority + provider boundary audit |
| Content Studio | Content generation-sensitive | shared/page legacy | High | Content authority + AI output safety audit |
| Campaign Studio | Marketing execution-sensitive | shared/page legacy | High | Campaign runtime authority + UX audit |
| Research | Intelligence surface | shared/page legacy | Medium | Research UX and source-return audit |
| Ads Manager | Spend/marketing-sensitive | shared/page legacy | High | Ads authority audit before UX |
| Settings | System config-sensitive | `12-pages.css` + shared | High | Settings authority/config safety audit |

## CSS Cleanup Decision
No global CSS deletion is approved yet.

The first safe cleanup direction is:
1. Freeze `12-pages.css` as do-not-expand.
2. Freeze `14-page-standard.css` as compatibility/do-not-expand.
3. Use MHOS primitives for future operating surfaces.
4. Use page-specific CSS for page-specific layout only.
5. Start implementation with one medium-risk page group after authority is already closed.

## Best First Implementation Candidate
Operations Centers is the best first candidate because:
- Runtime authority is closed.
- Browser QA passed.
- CSS owner is clear: `09-operations-centers.css`.
- Related routes are known.
- Dangerous actions are disabled or backend-owned and documented.

## Do Not Start Yet
Do not begin CSS deletion, merge, or archive until T151 is closed and committed.

## Required Next Step
T151E should close the CSS foundation audit and define the first implementation phase:
- T152 Operations Centers UX Contract
- T153 Operations Centers CSS cleanup/polish patch
- T154 Browser QA
- T155 Commit/closeout
