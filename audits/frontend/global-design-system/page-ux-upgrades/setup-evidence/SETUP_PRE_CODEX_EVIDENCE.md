# Setup International UX Upgrade — Pre-Codex Evidence

## Branch
architecture/frontend-consolidation-v1

## Current HEAD
7fa538c Upgrade Home international UX safely

## Git Status
?? audits/frontend/global-design-system/page-ux-upgrades/setup-evidence/

## Syntax Baseline
- node --check public/control-center/pages/setup.js: pass if command above had no output
- node --check app/router/api: pass if command above had no output

## Key Setup Contracts
- route id: setup
- data page root: data-page="setup"
- Setup owns project foundation and backend setup persistence
- Local draft is not backend save
- Template selection is not backend persistence until Save Setup succeeds
- AI helpers fill/prepare local guidance only
- Continue buttons route to owning pages

## Required Controls / Signals To Preserve
3:import { patchState } from "../state.js";
5:const REQUIRED_FIELDS = [
19:const STEP_DEFINITIONS = [
144:  const names = STEP_DEFINITIONS.flatMap((step) => step.fields);
201:function loadSetupDraft(projectName) {
214:function saveSetupDraft(projectName, data) {
225:function clearSetupDraft(projectName) {
277:  return REQUIRED_FIELDS.filter((field) => !asString(values[field.name]).trim());
282:  return Math.round(((REQUIRED_FIELDS.length - missing) / REQUIRED_FIELDS.length) * 100);
286:  const step = STEP_DEFINITIONS.find((item) => item.fields.includes(fieldName));
287:  return step ? step.id : STEP_DEFINITIONS[0].id;
291:  const requiredInStep = step.fields.filter((name) => REQUIRED_FIELDS.some((field) => field.name === name));
309:  const scored = STEP_DEFINITIONS.map((step) => {
316:  return scored[0]?.step || STEP_DEFINITIONS[0];
505:function readSetupFormValues(form) {
516:function buildSetupPersistencePayload(values) {
622:  const requiredNames = REQUIRED_FIELDS.map((field) => field.name);
789:  STEP_DEFINITIONS.forEach((step) => {
853:    const current = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId) + 1;
854:    stepCounter.textContent = `${current}/${STEP_DEFINITIONS.length}`;
862:  navigateTo,
867:  reloadProjectData,
868:  saveProjectSetup,
882:  let activeStepId = STEP_DEFINITIONS[0].id;
898:    const values = readSetupFormValues(form);
914:    button.onclick = () => activateStep(button.getAttribute("data-setup-step") || STEP_DEFINITIONS[0].id);
919:      const stepId = button.getAttribute("data-setup-open-step") || STEP_DEFINITIONS[0].id;
929:      const index = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId);
930:      if (index > 0) activateStep(STEP_DEFINITIONS[index - 1].id);
937:      const index = STEP_DEFINITIONS.findIndex((item) => item.id === activeStepId);
938:      if (index < STEP_DEFINITIONS.length - 1) activateStep(STEP_DEFINITIONS[index + 1].id);
943:    const values = readSetupFormValues(form);
961:    const saved = saveSetupDraft(projectName, values);
972:    patchState(
989:      saveSetupDraft(projectName, values);
1060:      const payload = buildSetupPersistencePayload(values);
1068:        await saveProjectSetup?.(projectName, payload);
1069:        clearSetupDraft(projectName);
1070:        await reloadProjectData?.(projectName);
1095:      clearSetupDraft(projectName);
1096:      navigateTo("setup");
1175:      const input = $("quickCommandInput");
1179:      navigateTo("ai-command");
1197:      navigateTo("library");
1204:      navigateTo("integrations");
1211:      navigateTo("campaign-studio");
1238:      navigateTo("home");
1268:  activateStep(STEP_DEFINITIONS[0].id);
1320:          <select id="setupBusinessTemplateSelect">
1341:        <button id="setupApplyTemplateBtn" class="btn btn-secondary" type="button">
1368:    navigateTo,
1371:    reloadProjectData,
1372:    saveProjectSetup
1382:    const draft = loadSetupDraft(projectName);
1411:    const requiredNames = REQUIRED_FIELDS.map((field) => field.name);
1498:              ${STEP_DEFINITIONS.map((step, index) => {
1517:                <strong id="setupStepCounter" class="setup-wizard-step-counter">1/${STEP_DEFINITIONS.length}</strong>
1707:      navigateTo,
1712:      reloadProjectData,
1713:      saveProjectSetup,
1722:    const templateSelect = $("setupBusinessTemplateSelect");
1723:    const templateApplyBtn = $("setupApplyTemplateBtn");
1754:          await reloadProjectData?.(projectName);
