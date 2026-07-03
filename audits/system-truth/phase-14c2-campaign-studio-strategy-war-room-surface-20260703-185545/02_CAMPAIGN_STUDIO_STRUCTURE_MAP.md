# Campaign Studio Structure Map

## Main Render Authority
- render entry: public/control-center/pages/campaign-studio.js:1513
- root html composition: public/control-center/pages/campaign-studio.js:1602
- page shell: campaign-studio-wrapper and campaign-studio-layout in the same render block.

## Core Model / Computation
- campaign model builder: public/control-center/pages/campaign-studio.js:1024
- readiness computation input/output: public/control-center/pages/campaign-studio.js:1120
- strategist guidance computation: public/control-center/pages/campaign-studio.js:1130
- wave generation: public/control-center/pages/campaign-studio.js:1142

## Existing Top Strategist Surface
- strategist next move panel render: public/control-center/pages/campaign-studio.js:1621
- operating summary/readiness cards: public/control-center/pages/campaign-studio.js:1633

## Existing Campaign Brief-Relevant Inputs
- Campaign Basics section: public/control-center/pages/campaign-studio.js:1660
- Product/Audience/Channel section: public/control-center/pages/campaign-studio.js:1728
- Wave Planning section: public/control-center/pages/campaign-studio.js:1812
- Campaign Outputs/Readiness section: public/control-center/pages/campaign-studio.js:1882

## Existing Readiness / Blocker Signals
- readiness badge and status in header + outputs section.
- blocker groups rendered from executionReadiness fields:
  - missingAssets
  - missingIntegrations
  - publishing/ads/tracking/seo/approval blockers
  at public/control-center/pages/campaign-studio.js:1953 onward.

## Existing Handoff UX and Handlers
- side panel route actions to Content, Media, Publishing, Ads: public/control-center/pages/campaign-studio.js:2024
- AI Command handoff trigger: public/control-center/pages/campaign-studio.js:1368
- durable route handoff helper: public/control-center/pages/campaign-studio.js:479
- durable handoff persistence call: createProjectHandoff usage in bind handler block.

## Safety Gate Pattern Already Present
- confirmation dialogs before save/handoff actions in bindCampaignStudio.
- review-only navigation and handoff preparation wording already present.
