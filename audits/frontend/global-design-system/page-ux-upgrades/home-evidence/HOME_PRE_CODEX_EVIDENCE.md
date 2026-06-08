# Home International UX Upgrade — Pre-Codex Evidence

## Branch
architecture/frontend-consolidation-v1

## Current HEAD
621cde8 Start final frontend browser QA report

## Git Status
 M data/projects/hairoticmen/brand-assets/brand-profile.json
 M data/projects/hairoticmen/project.json
 M data/projects/hairoticmen/sources-registry.json
 M data/projects/registry.json
?? audits/frontend/global-design-system/page-ux-upgrades/

## Syntax Baseline
- node --check public/control-center/pages/home.js: pass if command above had no output
- node --check public/control-center/pages/home/render-sections.js: pass if command above had no output
- node --check app/router/api: pass if command above had no output

## Key Home Contracts
- route id: home
- data page root: data-page="home"
- Home is projection/routing surface
- Home may navigate and prepare AI prompts through quickCommandInput
- Home must not save, approve, publish, send, execute, upload, delete, archive, or mutate

## Required Controls To Preserve
public/control-center/pages/home.js:735:  const input = $("quickCommandInput");
public/control-center/pages/home.js:867:                <button id="homeAskNextActionBtn" class="mhos-next-action-btn is-ghost" type="button">
public/control-center/pages/home.js:870:                <button id="homeOpenOperationsBtn" class="btn btn-secondary btn-sm" type="button">
public/control-center/pages/home.js:980:              <button id="homeQuickReviewReadinessBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:992:              <button id="homeQuickStartCampaignBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:1014:              <button id="homeQuickOpenAiBtn" class="quick-action-btn" type="button">
public/control-center/pages/home.js:1019:              <button id="homeOpenAiTeamBtn" class="btn btn-ghost btn-sm" type="button">
public/control-center/pages/home.js:1022:              <button id="homeOpenFullAiTeamBtn" class="btn btn-ghost btn-sm" type="button">
public/control-center/pages/home.js:1033:              <button id="homePromptNextBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:1037:              <button id="homePromptReadinessBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:1041:              <button id="homePromptLaunchBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:1045:              <button id="homePromptPlanBtn" class="home-ai-prompt-card" type="button">
public/control-center/pages/home.js:1073:      navigateTo("ai-command");
public/control-center/pages/home.js:1107:    const askNextActionBtn = $("homeAskNextActionBtn");
public/control-center/pages/home.js:1112:    const operationsBtn = $("homeOpenOperationsBtn");
public/control-center/pages/home.js:1115:    const aiTeamBtn = $("homeOpenAiTeamBtn");
public/control-center/pages/home.js:1117:    const fullAiTeamBtn = $("homeOpenFullAiTeamBtn");
public/control-center/pages/home.js:1120:    const quickCampaignBtn = $("homeQuickStartCampaignBtn");
public/control-center/pages/home.js:1129:    const quickReadinessBtn = $("homeQuickReviewReadinessBtn");
public/control-center/pages/home.js:1132:    const quickAiBtn = $("homeQuickOpenAiBtn");
public/control-center/pages/home.js:1137:    const promptNextBtn = $("homePromptNextBtn");
public/control-center/pages/home.js:1142:    const promptReadinessBtn = $("homePromptReadinessBtn");
public/control-center/pages/home.js:1147:    const promptLaunchBtn = $("homePromptLaunchBtn");
public/control-center/pages/home.js:1152:    const promptPlanBtn = $("homePromptPlanBtn");
public/control-center/pages/home/render-sections.js:129:        <button id="homePrimaryActionBtn" class="btn btn-primary" type="button">
