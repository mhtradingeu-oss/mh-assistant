# 04 — Library to AI Command Handoff Signals

Generated: Sat Jun  6 22:47:26 CEST 2026

## Library use-as-source contract
public/control-center/pages/library.js:34:import { createLibraryCommand, routeLibraryCommand } from "./library/command-router.js";
public/control-center/pages/library.js:1659:        <strong>Library is the source-of-truth workspace for assets, documents, brand files, product files, proof/legal files, and AI source context.</strong>
public/control-center/pages/library.js:1958:        <button type="button" class="btn btn-primary std-ai-btn" aria-label="Use this asset as an AI source" data-library-use-ai-source="${escapeHtml(selectedAsset.id)}">Use as AI Source</button>
public/control-center/pages/library.js:1961:          <span class="library-inspector-ai-source-guide-text">Select one Library item, then send it as review context to AI Command. This does not execute, approve, publish, or run workflows.</span>
public/control-center/pages/library.js:1965:    // Bind Use as AI Source button (inspector and grid quick action)
public/control-center/pages/library.js:1966:    let useBtns = Array.from(previewMeta.querySelectorAll("[data-library-use-ai-source]"));
public/control-center/pages/library.js:1969:      const gridBtn = gridBody.querySelector("[data-library-use-ai-source]");
public/control-center/pages/library.js:1974:      useBtn.textContent = "Use as AI Source";
public/control-center/pages/library.js:1975:      useBtn.setAttribute("aria-label", "Use this asset as an AI source");
public/control-center/pages/library.js:2992:  const sendToAiBtn = document.querySelector("[data-library-command=\"send-to-ai\"]");
public/control-center/pages/library.js:3041:          title: "Choose source for AI Command",
public/control-center/pages/library/action-panel.js:70:          <button class="btn btn-secondary" type="button" data-library-command="send-to-ai"${disabledAttr}>Ask AI to review asset</button>

## Project source/registry files
data/projects/hairoticmen/.DS_Store
data/projects/hairoticmen/ai/learning.json
data/projects/hairoticmen/ai/learning.json.backup
data/projects/hairoticmen/ai/recommendations.json
data/projects/hairoticmen/ai/recommendations.json.backup
data/projects/hairoticmen/analytics/performance.json
data/projects/hairoticmen/analytics/performance.json.backup
data/projects/hairoticmen/assets-registry.before-local-path-normalization.20260602-110307.json
data/projects/hairoticmen/assets-registry.before-preview-path-format-fix.20260602-111146.json
data/projects/hairoticmen/assets-registry.json
data/projects/hairoticmen/assets-registry.json.backup
data/projects/hairoticmen/assets-registry.json.bak-approve-20260501-233555
data/projects/hairoticmen/assets-registry.json.bak-deep-approve-20260501-233843
data/projects/hairoticmen/brand-assets/.DS_Store
data/projects/hairoticmen/brand-assets/1776024745231_hairoticlogo.png
data/projects/hairoticmen/brand-assets/brand-assets/.DS_Store
data/projects/hairoticmen/brand-assets/brand-assets/brand-guidelines.pdf
data/projects/hairoticmen/brand-assets/brand-profile.json
data/projects/hairoticmen/brand-assets/content/hairoticmen_required_files_manifest.md
data/projects/hairoticmen/brand-assets/content/offers.json
data/projects/hairoticmen/brand-assets/content/price_list.csv
data/projects/hairoticmen/brand-assets/content/pricing.md
data/projects/hairoticmen/brand-assets/email-prepare-package.json
data/projects/hairoticmen/brand-assets/execution-package.json
data/projects/hairoticmen/brand-assets/logo/1776024745231_hairoticlogo.png
data/projects/hairoticmen/brand-assets/logo/1776024918815_hairotic_logo.png
data/projects/hairoticmen/brand-assets/media-input-registry.json
data/projects/hairoticmen/brand-assets/packaging/1776028825380_019261_HAIROTIC_MONARCH_ORCHID_AFTER_SHAVE_175ML_64X115_(AL_KAMAL)_(1).jpg
data/projects/hairoticmen/brand-assets/product-intelligence/products-full.json
data/projects/hairoticmen/brand-assets/product-intelligence/products.json
data/projects/hairoticmen/brand-assets/product_csv/hairoticmen_product_master_FINAL.csv
data/projects/hairoticmen/brand-assets/products/hairoticmen_product_master_FINAL.csv
data/projects/hairoticmen/brand-assets/prompt-engine-context.json
data/projects/hairoticmen/brand-assets/reference/1776029585397_HAIROTICMEN_INTRODUCTION.docx
data/projects/hairoticmen/brand-assets/video/1776029330709_Shaving_Gel_(1).mp4
data/projects/hairoticmen/brand-assets/video/AlKamal.MP4
data/projects/hairoticmen/brand-assets/video/Barber 1.MOV
data/projects/hairoticmen/brand-assets/video/Generic 4.MP4
data/projects/hairoticmen/brand-assets/video/Hairotic Barber PR.MP4
data/projects/hairoticmen/campaigns/internal-review-beard-kit-oil-hair-wax-campaign-package.json
data/projects/hairoticmen/execution/logs/controlled-dry-run-2026-05-04T10-55-26-619Z.json
data/projects/hairoticmen/execution/logs/controlled-dry-run-2026-05-04T10-58-53-658Z.json
data/projects/hairoticmen/execution/logs/scheduler-2026-05-01T20-14-12-776Z.jsonl
data/projects/hairoticmen/execution/logs/scheduler-2026-05-01T20-14-12-784Z.jsonl
data/projects/hairoticmen/execution/logs/scheduler-2026-05-01T20-14-12-797Z.jsonl
data/projects/hairoticmen/execution/logs/scheduler-2026-05-01T20-14-12-801Z.jsonl
data/projects/hairoticmen/execution/logs/scheduler-2026-05-01T20-14-12-805Z.jsonl
data/projects/hairoticmen/execution/logs/scheduler-2026-05-04T10-49-18-691Z.jsonl
data/projects/hairoticmen/execution/logs/scheduler-2026-05-04T10-49-18-706Z.jsonl
data/projects/hairoticmen/execution/manual-publish/beard_launch_instagram_2026-05-04T11-06-32-115Z.json
data/projects/hairoticmen/execution/scheduler.json
data/projects/hairoticmen/execution/scheduler.json.backup
data/projects/hairoticmen/integrations-registry.json
data/projects/hairoticmen/integrations-registry.json.backup
data/projects/hairoticmen/integrations/audit-log.json
data/projects/hairoticmen/integrations/audit-log.json.backup
data/projects/hairoticmen/integrations/control-center.json
data/projects/hairoticmen/integrations/control-center.json.backup
data/projects/hairoticmen/integrations/snapshots/website.json
data/projects/hairoticmen/integrations/sync-history.json
data/projects/hairoticmen/ops/ai-artifacts.json
data/projects/hairoticmen/ops/ai-artifacts.json.backup
data/projects/hairoticmen/ops/ai-commands.json
data/projects/hairoticmen/ops/ai-commands.json.backup
data/projects/hairoticmen/ops/ai-memory.json
data/projects/hairoticmen/ops/ai-memory.json.backup
data/projects/hairoticmen/ops/ai-recommendations.json
data/projects/hairoticmen/ops/ai-recommendations.json.backup
data/projects/hairoticmen/ops/approvals.json
data/projects/hairoticmen/ops/approvals.json.backup
data/projects/hairoticmen/ops/campaigns.json
data/projects/hairoticmen/ops/content-items.json
data/projects/hairoticmen/ops/data-mismatches.json
data/projects/hairoticmen/ops/data-mismatches.json.backup
data/projects/hairoticmen/ops/events.json
data/projects/hairoticmen/ops/events.json.backup
data/projects/hairoticmen/ops/governance.json
data/projects/hairoticmen/ops/handoffs.json
data/projects/hairoticmen/ops/handoffs.json.backup
data/projects/hairoticmen/ops/media-jobs.json
data/projects/hairoticmen/ops/media-jobs.json.backup
data/projects/hairoticmen/ops/notifications.json
data/projects/hairoticmen/ops/notifications.json.backup
data/projects/hairoticmen/ops/queue.json
data/projects/hairoticmen/ops/queue.json.backup
data/projects/hairoticmen/ops/system.json
data/projects/hairoticmen/ops/system.json.backup
data/projects/hairoticmen/ops/tasks.json
data/projects/hairoticmen/ops/team.json
data/projects/hairoticmen/ops/workflow-runs.json
data/projects/hairoticmen/ops/workflow-runs.json.backup
data/projects/hairoticmen/products/hairoticmen_product_master_FINAL.csv
data/projects/hairoticmen/project.json
data/projects/hairoticmen/project.json.backup
data/projects/hairoticmen/reports/canonical-migration-report.json
data/projects/hairoticmen/reports/canonical-migration-report.json.backup
data/projects/hairoticmen/source-of-truth-registry.json
data/projects/hairoticmen/source-of-truth-registry.json.backup
data/projects/hairoticmen/sources-registry.json
data/projects/hairoticmen/sources-registry.json.backup
data/projects/registry.json
data/projects/testproject/assets-registry.json
data/projects/testproject/brand-assets/brand-profile.json
data/projects/testproject/brand-assets/media-input-registry.json
data/projects/testproject/integrations-registry.json
data/projects/testproject/integrations-registry.json.backup
data/projects/testproject/ops/ai-artifacts.json
data/projects/testproject/ops/ai-commands.json
data/projects/testproject/ops/ai-memory.json
data/projects/testproject/ops/ai-recommendations.json
data/projects/testproject/ops/campaigns.json
data/projects/testproject/source-of-truth-registry.json
data/projects/testproject/sources-registry.json
