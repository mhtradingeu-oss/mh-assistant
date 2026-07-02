# AI-COMMAND-GDS-2A — Tool Dock Selected Source UX Audit

Generated: Sat Jun  6 22:58:44 CEST 2026
Branch: architecture/frontend-consolidation-v1
HEAD: c01297d

## Current source drawer signals
public/control-center/pages/ai-command/tool-dock.js:50:  const drawer = document.querySelector("[data-aicmd-tool-drawer]");
public/control-center/pages/ai-command/tool-dock.js:67:  const activeDrawer = document.querySelector("[data-aicmd-tool-drawer]");
public/control-center/pages/ai-command/tool-dock.js:92:    const msg = activeDrawer.querySelector("[data-aicmd-tool-drawer-status]") || document.querySelector("[data-aicmd-tool-drawer-status]");
public/control-center/pages/ai-command/tool-dock.js:201:    "Selected Library source context:",
public/control-center/pages/ai-command/tool-dock.js:211:  lines.push("Use the selected Library source as context. Do not invent unsupported claims.");
public/control-center/pages/ai-command/tool-dock.js:216:  const warning = drawer?.querySelector?.("[data-aicmd-tool-drawer-source-warning]");
public/control-center/pages/ai-command/tool-dock.js:253:  const selectedNode = drawer.querySelector("[data-aicmd-tool-drawer-selected-source]");
public/control-center/pages/ai-command/tool-dock.js:254:  const sourceInput = drawer.querySelector("[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:255:  const sourceSelect = drawer.querySelector("[data-aicmd-tool-drawer-source-select]");
public/control-center/pages/ai-command/tool-dock.js:259:      selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:268:  // Render compact selected source card
public/control-center/pages/ai-command/tool-dock.js:272:      <div class=\"mhos-tool-drawer-source-card\">
public/control-center/pages/ai-command/tool-dock.js:273:        <div class=\"mhos-tool-drawer-source-eyebrow\">Selected Source</div>
public/control-center/pages/ai-command/tool-dock.js:274:        <div class=\"mhos-tool-drawer-source-main\">${escapeHtml(name)}</div>
public/control-center/pages/ai-command/tool-dock.js:275:        <div class=\"mhos-tool-drawer-source-meta\">${escapeHtml(type)} · Added from Library</div>
public/control-center/pages/ai-command/tool-dock.js:276:        ${path && path !== name ? `<div class=\"mhos-tool-drawer-source-path\" title=\"${escapeHtml(path)}\">${escapeHtml(path)}</div>` : ""}
public/control-center/pages/ai-command/tool-dock.js:277:        <div class=\"mhos-tool-drawer-source-actions\">
public/control-center/pages/ai-command/tool-dock.js:278:          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-change-source>Change Source</button>
public/control-center/pages/ai-command/tool-dock.js:279:          <button type=\"button\" class=\"btn btn-xs\" data-aicmd-tool-drawer-remove-source>Remove</button>
public/control-center/pages/ai-command/tool-dock.js:301:    const changeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-change-source]');
public/control-center/pages/ai-command/tool-dock.js:304:        drawer.querySelector('[data-aicmd-tool-drawer-open-library]')?.click();
public/control-center/pages/ai-command/tool-dock.js:307:    const removeBtn = selectedNode.querySelector('[data-aicmd-tool-drawer-remove-source]');
public/control-center/pages/ai-command/tool-dock.js:312:        if (selectedNode) selectedNode.innerHTML = `<span class=\"mhos-tool-drawer-selected-source-empty\">No Library source selected yet.</span>`;
public/control-center/pages/ai-command/tool-dock.js:505:      template: "Prepare source context for the next Content Writer task for {projectName}. Ask which source should be used: current chat, Library folder, brand profile, product data, legal/pricing documents, research/proof documents, source-of-truth assets, or manual input."
public/control-center/pages/ai-command/tool-dock.js:1193:    <aside class="mhos-tool-drawer" data-aicmd-tool-drawer hidden aria-hidden="true">
public/control-center/pages/ai-command/tool-dock.js:1194:      <div class="mhos-tool-drawer-backdrop" data-aicmd-tool-drawer-close></div>
public/control-center/pages/ai-command/tool-dock.js:1198:            <span class="mhos-tool-drawer-icon" data-aicmd-tool-drawer-icon>✦</span>
public/control-center/pages/ai-command/tool-dock.js:1200:              <p class="mhos-tool-drawer-kicker" data-aicmd-tool-drawer-action>Smart tool</p>
public/control-center/pages/ai-command/tool-dock.js:1201:              <h3 data-aicmd-tool-drawer-title>Tool setup</h3>
public/control-center/pages/ai-command/tool-dock.js:1204:          <button class="mhos-tool-drawer-close" type="button" data-aicmd-tool-drawer-close aria-label="Close tool drawer">×</button>
public/control-center/pages/ai-command/tool-dock.js:1207:        <p class="mhos-tool-drawer-description" data-aicmd-tool-drawer-description>
public/control-center/pages/ai-command/tool-dock.js:1214:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-output-select></select>
public/control-center/pages/ai-command/tool-dock.js:1219:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-source-select></select>
public/control-center/pages/ai-command/tool-dock.js:1220:            <div class="mhos-tool-drawer-selected-source" data-aicmd-tool-drawer-selected-source></div>
public/control-center/pages/ai-command/tool-dock.js:1221:            <div class="mhos-tool-drawer-warning" data-aicmd-tool-drawer-source-warning role="alert" hidden></div>
public/control-center/pages/ai-command/tool-dock.js:1226:            <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-destination-select></select>
public/control-center/pages/ai-command/tool-dock.js:1234:                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-language>
public/control-center/pages/ai-command/tool-dock.js:1243:                <select class="mhos-tool-drawer-select" data-aicmd-tool-drawer-tone>
public/control-center/pages/ai-command/tool-dock.js:1258:                data-aicmd-tool-drawer-source-details
public/control-center/pages/ai-command/tool-dock.js:1268:                data-aicmd-tool-drawer-extra-brief
public/control-center/pages/ai-command/tool-dock.js:1277:            <div class="mhos-tool-drawer-safety" data-aicmd-tool-drawer-safety>Review only</div>
public/control-center/pages/ai-command/tool-dock.js:1283:          <p data-aicmd-tool-drawer-summary>Choose output, source, destination, language, and tone.</p>
public/control-center/pages/ai-command/tool-dock.js:1291:          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-open-library>Change Source</button>
public/control-center/pages/ai-command/tool-dock.js:1292:          <button class="btn btn-primary" type="button" data-aicmd-tool-drawer-use>Use in Composer</button>
public/control-center/pages/ai-command/tool-dock.js:1293:          <button class="btn btn-secondary" type="button" data-aicmd-tool-drawer-close>Cancel</button>
public/control-center/pages/ai-command/tool-dock.js:1442:  const title = drawer?.querySelector?.("[data-aicmd-tool-drawer-title]")?.textContent || "Smart tool";
public/control-center/pages/ai-command/tool-dock.js:1443:  const action = drawer?.querySelector?.("[data-aicmd-tool-drawer-action]")?.textContent || "Guided";
public/control-center/pages/ai-command/tool-dock.js:1444:  const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto / infer from request");
public/control-center/pages/ai-command/tool-dock.js:1445:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Current chat or ask if source is needed");
public/control-center/pages/ai-command/tool-dock.js:1446:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
public/control-center/pages/ai-command/tool-dock.js:1447:  const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto / project language");
public/control-center/pages/ai-command/tool-dock.js:1448:  const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto / brand tone");
public/control-center/pages/ai-command/tool-dock.js:1449:  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:1450:  const extraBrief = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-extra-brief]");
public/control-center/pages/ai-command/tool-dock.js:1516:  const summary = drawer.querySelector("[data-aicmd-tool-drawer-summary]");
public/control-center/pages/ai-command/tool-dock.js:1519:  const output = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-output-select]", "Auto");
public/control-center/pages/ai-command/tool-dock.js:1520:  const source = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-source-select]", "Auto");
public/control-center/pages/ai-command/tool-dock.js:1521:  const destination = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-destination-select]", "Chat preview");
public/control-center/pages/ai-command/tool-dock.js:1522:  const language = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-language]", "Auto language");
public/control-center/pages/ai-command/tool-dock.js:1523:  const tone = getSelectedLabel(drawer, "[data-aicmd-tool-drawer-tone]", "Auto tone");
public/control-center/pages/ai-command/tool-dock.js:1524:  const sourceDetails = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-source-details]");
public/control-center/pages/ai-command/tool-dock.js:1525:  const extraBrief = getDrawerFieldValue(drawer, "[data-aicmd-tool-drawer-extra-brief]");
public/control-center/pages/ai-command/tool-dock.js:1562:  setDrawerText(drawer, "[data-aicmd-tool-drawer-icon]", btn.getAttribute("data-aicmd-tool-dock-icon") || "✦");
public/control-center/pages/ai-command/tool-dock.js:1563:  setDrawerText(drawer, "[data-aicmd-tool-drawer-title]", btn.getAttribute("data-aicmd-tool-dock-label") || "Smart tool");
public/control-center/pages/ai-command/tool-dock.js:1564:  setDrawerText(drawer, "[data-aicmd-tool-drawer-action]", `${humanizeMeta(actionType)} · ${humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-owner") || "ai-command")}`);
public/control-center/pages/ai-command/tool-dock.js:1567:    "[data-aicmd-tool-drawer-description]",
public/control-center/pages/ai-command/tool-dock.js:1570:  setDrawerText(drawer, "[data-aicmd-tool-drawer-safety]", humanizeMeta(btn.getAttribute("data-aicmd-tool-dock-safety") || "review_only"));
public/control-center/pages/ai-command/tool-dock.js:1578:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-output-select]"), rawOutputs, "Choose output type");
public/control-center/pages/ai-command/tool-dock.js:1579:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-source-select]"), rawSources, "Choose source / input");
public/control-center/pages/ai-command/tool-dock.js:1580:  populateDrawerSelect(drawer.querySelector("[data-aicmd-tool-drawer-destination-select]"), rawDestinations, "Choose destination");
public/control-center/pages/ai-command/tool-dock.js:1614:  const drawer = root?.querySelector?.("[data-aicmd-tool-drawer]");
public/control-center/pages/ai-command/tool-dock.js:1660:  const drawer = root.querySelector("[data-aicmd-tool-drawer]");
public/control-center/pages/ai-command/tool-dock.js:1662:  Array.from(root.querySelectorAll("[data-aicmd-tool-drawer-close]")).forEach((btn) => {
public/control-center/pages/ai-command/tool-dock.js:1666:  const openLibraryBtn = root.querySelector("[data-aicmd-tool-drawer-open-library]");
public/control-center/pages/ai-command/tool-dock.js:1671:      const drawerSourceSelect = root.querySelector("[data-aicmd-tool-drawer-source-select]");
public/control-center/pages/ai-command/tool-dock.js:1683:        outputType: drawer?.querySelector?.("[data-aicmd-tool-drawer-output-select]")?.value || ""
public/control-center/pages/ai-command/tool-dock.js:1713:  const useBtn = root.querySelector("[data-aicmd-tool-drawer-use]");
public/control-center/styles/08-components-foundation.css:1512:.mhos-tool-drawer-actions [data-aicmd-tool-drawer-open-library] {
public/control-center/styles/08-components-foundation.css:1517:/* Smart Tool Drawer Selected Source Card */
public/control-center/styles/08-components-foundation.css:1518:.mhos-tool-drawer-selected-source[data-aicmd-tool-drawer-selected-source] {
public/control-center/styles/08-components-foundation.css:1522:.mhos-tool-drawer-source-card {
public/control-center/styles/08-components-foundation.css:1534:.mhos-tool-drawer-source-eyebrow {
public/control-center/styles/08-components-foundation.css:1541:.mhos-tool-drawer-source-main {
public/control-center/styles/08-components-foundation.css:1548:.mhos-tool-drawer-source-meta {
public/control-center/styles/08-components-foundation.css:1552:.mhos-tool-drawer-source-path {
public/control-center/styles/08-components-foundation.css:1560:.mhos-tool-drawer-source-actions {
