# 03 — Click / Listener / PreventDefault Signals

Generated: Sat Jun  6 14:49:03 CEST 2026

## library.js click/listener signals
public/control-center/pages/library.js:490:          if (!button || !button.closest(".library-workspace")) return;
public/control-center/pages/library.js:492:          event.preventDefault();
public/control-center/pages/library.js:506:          if (!link || !link.closest(".library-workspace")) return;
public/control-center/pages/library.js:511:          event.preventDefault();
public/control-center/pages/library.js:1111:    return `<div class="empty-box">Select an asset to preview details, open files, copy paths, or prepare review actions.</div>`;
public/control-center/pages/library.js:1128:        <img src="${escapeHtml(asString(asset.image_url || previewUrl))}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1168:        <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(asset.name)}" class="library-preview-image" onerror="this.closest('.library-preview-frame')?.replaceWith(Object.assign(document.createElement('div'), { className: 'library-preview-fallback', textContent: 'Preview unavailable for this image.' }))">
public/control-center/pages/library.js:1196:      ? `<button class="btn btn-primary" type="button" data-library-open="${escapeHtml(asset.id)}">Open document</button>`
public/control-center/pages/library.js:1445:    cancelBtn.onclick = () => {
public/control-center/pages/library.js:1450:    submitBtn.onclick = () => {
public/control-center/pages/library.js:1456:    overlay.onclick = (event) => {
public/control-center/pages/library.js:1465:        event.preventDefault();
public/control-center/pages/library.js:1471:        event.preventDefault();
public/control-center/pages/library.js:1959:        <details class="library-inspector-more">
public/control-center/pages/library.js:1960:          <summary>Technical details</summary>
public/control-center/pages/library.js:1970:        </details>
public/control-center/pages/library.js:1984:      useBtn.onclick = () => {
public/control-center/pages/library.js:2062:    button.onclick = () => {
public/control-center/pages/library.js:2167:    button.onclick = (event) => {
public/control-center/pages/library.js:2168:      event.preventDefault();
public/control-center/pages/library.js:2169:      event.stopPropagation();
public/control-center/pages/library.js:2200:    row.onclick = (event) => {
public/control-center/pages/library.js:2234:      event.preventDefault();
public/control-center/pages/library.js:2264:    card.onclick = (event) => {
public/control-center/pages/library.js:2280:      event.preventDefault();
public/control-center/pages/library.js:2296:    button.onclick = () => {
public/control-center/pages/library.js:2319:  button.onclick = () => {
public/control-center/pages/library.js:2343:    toolbarUpload.onclick = () => $("libraryUploadInput")?.click();
public/control-center/pages/library.js:2346:  const openButtons = Array.from(document.querySelectorAll("[data-library-open]"));
public/control-center/pages/library.js:2348:    button.onclick = async () => {
public/control-center/pages/library.js:2349:      const id = button.getAttribute("data-library-open") || "";
public/control-center/pages/library.js:2376:    button.onclick = async () => {
public/control-center/pages/library.js:2407:    button.onclick = async () => {
public/control-center/pages/library.js:2444:  const reclassifyButtons = Array.from(document.querySelectorAll("[data-library-reclassify]"));
public/control-center/pages/library.js:2446:    button.onclick = async () => {
public/control-center/pages/library.js:2447:      const id = button.getAttribute("data-library-reclassify") || "";
public/control-center/pages/library.js:2512:    button.onclick = async () => {
public/control-center/pages/library.js:2546:    button.onclick = async () => {
public/control-center/pages/library.js:2587:    button.onclick = async () => {
public/control-center/pages/library.js:2623:    button.onclick = (event) => {
public/control-center/pages/library.js:2624:      event.preventDefault();
public/control-center/pages/library.js:2625:      event.stopPropagation();
public/control-center/pages/library.js:2627:      const menu = button.closest(".library-action-menu");
public/control-center/pages/library.js:2643:    button.onclick = () => {
public/control-center/pages/library.js:2656:    button.onclick = (event) => {
public/control-center/pages/library.js:2657:      event.preventDefault();
public/control-center/pages/library.js:2658:      event.stopPropagation();
public/control-center/pages/library.js:2753:    dropZone.onclick = (event) => {
public/control-center/pages/library.js:2754:      event.preventDefault();
public/control-center/pages/library.js:2760:        event.preventDefault();
public/control-center/pages/library.js:2776:          event.preventDefault();
public/control-center/pages/library.js:2783:          event.preventDefault();
public/control-center/pages/library.js:2820:      chooseFilesBtn.onclick = (event) => {
public/control-center/pages/library.js:2821:        event.preventDefault();
public/control-center/pages/library.js:2822:        event.stopPropagation();
public/control-center/pages/library.js:2833:    uploadBtn.onclick = async () => {
public/control-center/pages/library.js:2933:    refreshBtn.onclick = async () => {
public/control-center/pages/library.js:2953:    classifyBtn.onclick = () => {
public/control-center/pages/library.js:2963:    missingBtn.onclick = () => {
public/control-center/pages/library.js:2973:    extractSelectedDocBtn.onclick = () => {
public/control-center/pages/library.js:2988:    extractBtn.onclick = () => {
public/control-center/pages/library.js:3000:  const sendToAiBtn = document.querySelector("[data-library-command=\"send-to-ai\"]");
public/control-center/pages/library.js:3002:    sendToAiBtn.onclick = () => {
public/control-center/pages/library.js:3069:          backBtn.onclick = () => {
public/control-center/pages/library.js:3077:          dismissBtn.onclick = () => {
public/control-center/pages/library.js:3187:          <div id="libraryUploadSummary" class="library-upload-summary"></div>
public/control-center/pages/library/action-panel.js:68:          <button class="btn btn-primary" type="button" data-library-open="${selectedAssetId}"${disabledAttr}>Open asset</button>
public/control-center/pages/library/action-panel.js:69:          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI to review asset</button>
public/control-center/pages/library/action-panel.js:92:          <details class="library-panel-move-details">
public/control-center/pages/library/action-panel.js:93:            <summary>Move to group</summary>
public/control-center/pages/library/action-panel.js:99:                  data-library-reclassify="${selectedAssetId}"
public/control-center/pages/library/action-panel.js:107:          </details>
public/control-center/app.js:512:    saveBtn.addEventListener("click", async () => {
public/control-center/app.js:549:    diagBtn.addEventListener("click", async () => {
public/control-center/app.js:557:    testBtn.addEventListener("click", async () => {
public/control-center/app.js:610:    clearBtn.addEventListener("click", () => {
public/control-center/app.js:623:    clearReloadBtn.addEventListener("click", () => {
public/control-center/app.js:634:    closeBtn.addEventListener("click", hideAccessKeyModal);
public/control-center/app.js:637:  modal.addEventListener("click", (e) => {
public/control-center/app.js:1005:function boundedTracePush(stage, details = {}) {
public/control-center/app.js:1009:    token: String(details.token || startupRuntimeState.currentToken || ""),
public/control-center/app.js:1010:    detail: String(details.detail || details.message || ""),
public/control-center/app.js:1011:    endpoint: String(details.endpoint || "")
public/control-center/app.js:1158:function recordRuntimeTrace(stage, details = {}) {
public/control-center/app.js:1159:  boundedTracePush(stage, details);
public/control-center/app.js:1199:  document.addEventListener("click", (event) => {
public/control-center/app.js:1201:      ? event.target.closest("button, a, [data-route], [data-page], [data-action], input, select, textarea") || event.target
public/control-center/app.js:1295:function recordStartupStep(step, details = {}) {
public/control-center/app.js:1299:    token: String(details.token || ""),
public/control-center/app.js:1300:    detail: String(details.detail || "")
public/control-center/app.js:1312:function recordLoadingTransition(action, details = {}) {
public/control-center/app.js:1317:    token: String(details.token || ""),
public/control-center/app.js:1318:    reason: String(details.reason || ""),
public/control-center/app.js:1335:function recordLastProjectLoad(summary) {
public/control-center/app.js:1338:    ...summary
public/control-center/app.js:1529:    button.addEventListener("click", () => {
public/control-center/app.js:1607:    retryBtn.addEventListener("click", () => {
public/control-center/app.js:1614:    accessKeyBtn.addEventListener("click", () => {
public/control-center/app.js:1621:    clearSavedKeyReloadBtn.addEventListener("click", () => {
public/control-center/app.js:1631:function showFatalErrorPanel(message, details = "") {
public/control-center/app.js:1639:  const detailsBox = $("fatalErrorDetails");
public/control-center/app.js:1644:  if (detailsBox) {
public/control-center/app.js:1645:    detailsBox.textContent = details || "No additional diagnostics available.";
public/control-center/app.js:2443:  const summary = {
public/control-center/app.js:2452:  recordLastProjectLoad(summary);
public/control-center/app.js:2493:        warning: "Project details are still syncing."
public/control-center/app.js:2501:        warning: "Project details are still syncing.",
public/control-center/app.js:2528:  setError("Project details are still syncing.");
public/control-center/app.js:2529:  showError("Project details are still syncing.");
public/control-center/app.js:2530:  showMessage("Project details are still syncing.");
public/control-center/app.js:3113:  document.addEventListener("click", (event) => {
public/control-center/app.js:3115:      ? event.target.closest("button, a, [data-route], [data-page], [data-action]")
public/control-center/app.js:3123:    const clickedNavItem = Boolean(candidate.closest(".nav-item[data-route], [data-shell-route], [data-global-route]"));
public/control-center/app.js:3127:      event.preventDefault();
public/control-center/app.js:3134:      (candidate.closest("#refreshAllBtn") ? "refresh-project" : "") ||
public/control-center/app.js:3135:      (candidate.closest("#openAiBtn") ? "open-ai-command" : "") ||
public/control-center/app.js:3136:      (candidate.closest("#runSearchBtn") ? "search" : "") ||
public/control-center/app.js:3137:      (candidate.closest("#runQuickCommandBtn") ? "send-ai-command" : "") ||
public/control-center/app.js:3138:      (candidate.closest("#newCampaignBtn") ? "open-campaign-studio" : "") ||
public/control-center/app.js:3139:      (candidate.closest("#scheduleBtn") ? "open-publishing" : "");
public/control-center/app.js:3145:    event.preventDefault();
public/control-center/app.js:3334:    toggleBtn.onclick = (event) => {
public/control-center/app.js:3335:      event.preventDefault();
public/control-center/app.js:3336:      event.stopPropagation();
public/control-center/app.js:3347:    backdrop.onclick = closeSidebar;
public/control-center/app.js:3351:    commandToggleBtn.onclick = (event) => {
public/control-center/app.js:3352:      event.preventDefault();
public/control-center/app.js:3368:    commandBackdrop.onclick = () => {
public/control-center/app.js:3374:  document.addEventListener("click", (event) => {
public/control-center/app.js:3375:    const clickedNavItem = event.target.closest(".nav-item[data-route]");
public/control-center/app.js:3384:    const clickedCommandToggle = event.target.closest("#commandToggleBtn");
public/control-center/app.js:3385:    const clickedInsideCommand = event.target.closest("#globalCommandBar");
public/control-center/app.js:3646:  document.addEventListener("click", (event) => {
public/control-center/app.js:3650:    const clickedInsideCommand = event.target.closest("#globalCommandBar");
public/control-center/app.js:3651:    const clickedCommandToggle = event.target.closest("#commandToggleBtn");
public/control-center/app.js:3652:    const clickedAiButton = event.target.closest("#execAskAiBtn, #openAiBtn, [data-action='open-ai-command']");
public/control-center/app.js:3653:    const clickedDock = event.target.closest("#aiDock");
public/control-center/app.js:3667:    commandBar.addEventListener("click", (event) => event.stopPropagation());
public/control-center/app.js:3690:        event.preventDefault();
public/control-center/app.js:3700:        event.preventDefault();
public/control-center/app.js:3739:  toggle.onclick = (event) => {
public/control-center/app.js:3740:    event.preventDefault();
public/control-center/app.js:3741:    event.stopPropagation();
public/control-center/app.js:3752:  closeBtn?.addEventListener("click", () => setOpen(false));
public/control-center/app.js:3754:  document.addEventListener("click", (event) => {
public/control-center/app.js:3756:    if (event.target.closest("#aiDock")) return;
public/control-center/app.js:3765:    button.addEventListener("click", () => {
public/control-center/app.js:3780:    button.addEventListener("click", () => {
public/control-center/app.js:3948:    modal.addEventListener("click", (event) => {
public/control-center/app.js:3952:    modal.querySelector("#executiveNewCloseBtn")?.addEventListener("click", hideExecutiveNewLauncher);
public/control-center/app.js:3963:    modal.querySelector("[data-new-project-cancel]")?.addEventListener("click", () => {
public/control-center/app.js:3969:      event.preventDefault();
public/control-center/app.js:4010:      button.addEventListener("click", () => {
public/control-center/app.js:4064:    execNewBtn.onclick = showExecutiveNewLauncher;
public/control-center/app.js:4068:    execAskAiBtn.onclick = () => {
