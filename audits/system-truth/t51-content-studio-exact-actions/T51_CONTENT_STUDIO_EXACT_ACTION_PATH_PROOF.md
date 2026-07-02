# T51 — Content Studio Exact Action Path Proof

## Status
Audit-only. No production files changed.

## Target
- public/control-center/pages/content-studio-workspace.js

## Purpose
T50 found imported backend APIs and zero confirmation gates. T51 verifies exact action paths before any patch:
- saving content drafts
- AI generation command execution
- task creation
- handoff creation
- approval creation/decision
- publishing/send/schedule behavior
- local/shared state writes
- read-only APIs

## Exact Counts

| Area | First Line | Count |
|---|---:|---:|
| Imported API list | 2 | 12 |
| saveProjectContentItem calls | 694 | 1 |
| executeProjectAiCommand calls | 1887 | 2 |
| createProjectTask calls | n/a | 0 |
| createProjectHandoff calls | 1697 | 2 |
| createProjectApproval calls | n/a | 0 |
| decideProjectApproval calls | n/a | 0 |
| List/read-only API calls | 782 | 6 |
| Local storage writes | n/a | 0 |
| Shared context writes | 16 | 9 |
| Button/action handlers | 1147 | 70 |
| Publishing/send labels | 28 | 115 |
| Confirmation gates | n/a | 0 |
| Disabled/review-only safety copy | 3 | 127 |
| Copy defect candidates | n/a | 0 |

## Focused Evidence

### Imported API list

#### Match 1 — line 2

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
```

#### Match 2 — line 3

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
```

#### Match 3 — line 4

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
```

#### Match 4 — line 5

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
```

#### Match 5 — line 6

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
```

#### Match 6 — line 13

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
```

#### Match 7 — line 14

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
```

#### Match 8 — line 694

```js
  649:     approval_status: firstText(selected?.approval_status, "draft"),
  650:     destination: session.form.channel,
  651:     owner_role: CONTENT_ROLE_DEFAULTS.ownerRole,
  652:     review_role: CONTENT_ROLE_DEFAULTS.reviewRole,
  653:     service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
  654:     content_versions: asArray(versioning.versions).map((version) => ({
  655:       id: version.id,
  656:       mode: version.mode,
  657:       prompt: version.prompt,
  658:       output_content: version.output_content,
  659:       language: version.language,
  660:       tone: version.tone,
  661:       channel: version.channel,
  662:       readiness_status: version.readiness_status,
  663:       approval_status: version.approval_status,
  664:       notes: version.notes,
  665:       library_asset_ref: version.library_asset_ref || null,
  666:       timestamp: version.timestamp
  667:     })),
  668:     actor: "content-studio"
  669:   };
  670: }
  671: 
  672: function syncItemsWithLocalSave(session, projectName, payload) {
  673:   const saved = saveLocalDraft(projectName, payload);
  674:   const normalized = normalizeContentItem(saved);
  675:   session.items = mergeItems(
  676:     session.items.filter((item) => asString(item.id) !== asString(normalized.id)),
  677:     [normalized]
  678:   );
  679:   session.selectedId = normalized.id;
  680:   session.formSourceId = normalized.id;
  681:   return normalized;
  682: }
  683: 
  684: async function persistContentRecord({ projectName, state, session, status, showMessage }) {
  685:   const payload = buildContentPayload(session, status);
  686:   const localItem = syncItemsWithLocalSave(session, projectName, payload);
  687: 
  688:   if (!projectName) {
  689:     showMessage?.("Content draft saved locally.");
  690:     return localItem;
  691:   }
  692: 
  693:   try {
  694:     const result = await saveProjectContentItem(projectName, payload);
  695:     const backendItem = normalizeContentItem(result.content_item || payload);
  696:     session.items = mergeItems(
  697:       session.items.filter((item) => asString(item.id) !== asString(localItem.id)),
  698:       [backendItem]
  699:     );
  700:     session.selectedId = backendItem.id || localItem.id;
  701:     session.formSourceId = session.selectedId;
  702:     showMessage?.("Content draft saved.");
  703:     return backendItem;
  704:   } catch (_) {
  705:     showMessage?.("Backend content save unavailable; local draft kept.");
  706:     return localItem;
  707:   }
  708: }
  709: 
  710: function getVersionMetrics(session) {
  711:   const selected = selectedVersionEntry(session);
  712:   const previous = previousVersionEntry(session);
  713:   const promptChanged = Boolean(previous && clean(previous.prompt) !== clean(selected?.prompt));
  714:   const contentChanged = Boolean(previous && clean(previous.output_content) !== clean(selected?.output_content));
  715:   const statusChanged = Boolean(previous && clean(previous.readiness_status) !== clean(selected?.readiness_status));
  716:   return { selected, previous, promptChanged, contentChanged, statusChanged };
  717: }
  718: 
  719: function parseLines(text) {
  720:   return asString(text).split(/\n+/).map((line) => clean(line)).filter(Boolean);
  721: }
  722: 
  723: function computeSuggestedMediaBrief(mode, version, form) {
  724:   const content = firstText(version?.output_content, version?.prompt, form.brief);
  725:   return [
  726:     `Create media assets for ${modeLabel(mode)} content.`,
  727:     `Channel: ${form.channel || "not set"}`,
  728:     `Language/Tone: ${firstText(form.language, version?.language, "English")} / ${firstText(form.tone, version?.tone, "not set")}`,
  729:     `Core message: ${firstText(content, "No content body yet.")}`,
  730:     "Output target: product-visible, publishing-safe, and campaign-consistent creative."
  731:   ].join("\n");
  732: }
  733: 
  734: function buildInboundSummary(handoff) {
  735:   const payload = asObject(handoff?.payload);
  736:   const output = asObject(payload.output);
  737:   const selectedVersion = asObject(payload.selected_version);
  738:   return {
  739:     id: asString(handoff?.id || payload.id || payload.workflow_id || payload.content_item_id),
```

#### Match 9 — line 1697

```js
 1652:       content_output: selected.output_content,
 1653:       language: selected.language,
 1654:       tone: selected.tone,
 1655:       channel: selected.channel,
 1656:       mode: selected.mode
 1657:     },
 1658:     readiness_status: normalizeStatus(selected.readiness_status || "draft", "draft"),
 1659:     approval_status: firstText(selected.approval_status, "draft"),
 1660:     notes: firstText(selected.notes, selectedItem?.notes?.join("\n")),
 1661:     created_at: selected.timestamp || nowIso(),
 1662:     updated_at: nowIso()
 1663:   };
 1664: 
 1665:   const handoff = {
 1666:     id: asString(existing.backend?.id || ""),
 1667:     source_page: "content-studio",
 1668:     destination_page: "library",
 1669:     source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
 1670:     destination_role: CONTENT_ROLE_DEFAULTS.reviewRole,
 1671:     source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
 1672:     destination_service_domain: "library",
 1673:     linked_entity: {
 1674:       entity_type: "content_item",
 1675:       entity_id: firstText(selectedItem?.id, session.formSourceId),
 1676:       route: "content-studio",
 1677:       label: firstText(selectedItem?.title, session.form.title, "Content draft")
 1678:     },
 1679:     payload: {
 1680:       library_asset: libraryAsset,
 1681:       project: libraryAsset.project,
 1682:       campaign: libraryAsset.campaign,
 1683:       asset_type: libraryAsset.asset_type,
 1684:       content_type: libraryAsset.media_type
 1685:     },
 1686:     status: "available",
 1687:     actor: "content-studio"
 1688:   };
 1689: 
 1690:   setSharedHandoff(projectName || "__default__", "library", handoff);
 1691:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1692:     setSharedHandoff("__default__", "library", handoff);
 1693:   }
 1694: 
 1695:   if (projectName) {
 1696:     try {
 1697:       const result = await createProjectHandoff(projectName, handoff);
 1698:       const saved = asObject(result?.handoff);
 1699:       const handoffId = asString(saved.id || handoff.id);
 1700:       upsertLocalLibraryAsset(projectName, {
 1701:         ...libraryAsset,
 1702:         id: handoffId || libraryAsset.id,
 1703:         handoff_id: handoffId,
 1704:         local_only: false
 1705:       });
 1706:       selected.library_asset_ref = {
 1707:         handoff_id: handoffId,
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
 1738:     };
 1739:     showMessage?.("Content draft saved to Library (local handoff).");
 1740:   }
 1741: 
 1742:   session.validation = { ...session.validation, version: "" };
```

#### Match 10 — line 1753

```js
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
 1738:     };
 1739:     showMessage?.("Content draft saved to Library (local handoff).");
 1740:   }
 1741: 
 1742:   session.validation = { ...session.validation, version: "" };
 1743: }
 1744: 
 1745: async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
 1746:   setSharedHandoff(projectName || "__default__", handoff.destination_page, handoff);
 1747:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1748:     setSharedHandoff("__default__", handoff.destination_page, handoff);
 1749:   }
 1750: 
 1751:   if (projectName) {
 1752:     try {
 1753:       await createProjectHandoff(projectName, handoff);
 1754:       showMessage?.(successMessage);
 1755:       return true;
 1756:     } catch (_) {
 1757:       showMessage?.(failMessage);
 1758:       return false;
 1759:     }
 1760:   }
 1761: 
 1762:   showMessage?.(localMessage);
 1763:   return true;
 1764: }
 1765: 
 1766: function buildAssetGate(state, escapeHtml) {
 1767:   const keys = ["brand_guideline", "product_csv", "product_photos", "product_videos", "testimonials_reviews", "legal_doc"];
 1768:   const assetData = asObject(state.data?.assets);
 1769:   const nextAction = getAssetNextAction(assetData, keys);
 1770:   return `
 1771:     <section class="card content-card">
 1772:       <div class="card-head">
 1773:         <div>
 1774:           <div class="setup-kicker">Content Inputs</div>
 1775:           <h3>Library dependency gate</h3>
 1776:         </div>
 1777:         <span class="card-badge neutral">Assets</span>
 1778:       </div>
 1779:       ${renderAssetDependencyRows(assetData, keys, escapeHtml, "Content dependencies are covered.")}
 1780:       <div class="simple-banner" style="margin-top:12px;">${escapeHtml(nextAction)}</div>
 1781:     </section>
 1782:   `;
 1783: }
 1784: 
 1785: function bindPage({
 1786:   projectName,
 1787:   state,
 1788:   session,
 1789:   handoff,
 1790:   navigateTo,
 1791:   showMessage,
 1792:   showError,
 1793:   rerender
 1794: }) {
 1795:   const form = document.getElementById("contentComposerForm");
 1796: 
 1797:   function selected() {
 1798:     return getSelectedItem(session);
```
### saveProjectContentItem calls

#### Match 1 — line 694

```js
  649:     approval_status: firstText(selected?.approval_status, "draft"),
  650:     destination: session.form.channel,
  651:     owner_role: CONTENT_ROLE_DEFAULTS.ownerRole,
  652:     review_role: CONTENT_ROLE_DEFAULTS.reviewRole,
  653:     service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
  654:     content_versions: asArray(versioning.versions).map((version) => ({
  655:       id: version.id,
  656:       mode: version.mode,
  657:       prompt: version.prompt,
  658:       output_content: version.output_content,
  659:       language: version.language,
  660:       tone: version.tone,
  661:       channel: version.channel,
  662:       readiness_status: version.readiness_status,
  663:       approval_status: version.approval_status,
  664:       notes: version.notes,
  665:       library_asset_ref: version.library_asset_ref || null,
  666:       timestamp: version.timestamp
  667:     })),
  668:     actor: "content-studio"
  669:   };
  670: }
  671: 
  672: function syncItemsWithLocalSave(session, projectName, payload) {
  673:   const saved = saveLocalDraft(projectName, payload);
  674:   const normalized = normalizeContentItem(saved);
  675:   session.items = mergeItems(
  676:     session.items.filter((item) => asString(item.id) !== asString(normalized.id)),
  677:     [normalized]
  678:   );
  679:   session.selectedId = normalized.id;
  680:   session.formSourceId = normalized.id;
  681:   return normalized;
  682: }
  683: 
  684: async function persistContentRecord({ projectName, state, session, status, showMessage }) {
  685:   const payload = buildContentPayload(session, status);
  686:   const localItem = syncItemsWithLocalSave(session, projectName, payload);
  687: 
  688:   if (!projectName) {
  689:     showMessage?.("Content draft saved locally.");
  690:     return localItem;
  691:   }
  692: 
  693:   try {
  694:     const result = await saveProjectContentItem(projectName, payload);
  695:     const backendItem = normalizeContentItem(result.content_item || payload);
  696:     session.items = mergeItems(
  697:       session.items.filter((item) => asString(item.id) !== asString(localItem.id)),
  698:       [backendItem]
  699:     );
  700:     session.selectedId = backendItem.id || localItem.id;
  701:     session.formSourceId = session.selectedId;
  702:     showMessage?.("Content draft saved.");
  703:     return backendItem;
  704:   } catch (_) {
  705:     showMessage?.("Backend content save unavailable; local draft kept.");
  706:     return localItem;
  707:   }
  708: }
  709: 
  710: function getVersionMetrics(session) {
  711:   const selected = selectedVersionEntry(session);
  712:   const previous = previousVersionEntry(session);
  713:   const promptChanged = Boolean(previous && clean(previous.prompt) !== clean(selected?.prompt));
  714:   const contentChanged = Boolean(previous && clean(previous.output_content) !== clean(selected?.output_content));
  715:   const statusChanged = Boolean(previous && clean(previous.readiness_status) !== clean(selected?.readiness_status));
  716:   return { selected, previous, promptChanged, contentChanged, statusChanged };
  717: }
  718: 
  719: function parseLines(text) {
  720:   return asString(text).split(/\n+/).map((line) => clean(line)).filter(Boolean);
  721: }
  722: 
  723: function computeSuggestedMediaBrief(mode, version, form) {
  724:   const content = firstText(version?.output_content, version?.prompt, form.brief);
  725:   return [
  726:     `Create media assets for ${modeLabel(mode)} content.`,
  727:     `Channel: ${form.channel || "not set"}`,
  728:     `Language/Tone: ${firstText(form.language, version?.language, "English")} / ${firstText(form.tone, version?.tone, "not set")}`,
  729:     `Core message: ${firstText(content, "No content body yet.")}`,
  730:     "Output target: product-visible, publishing-safe, and campaign-consistent creative."
  731:   ].join("\n");
  732: }
  733: 
  734: function buildInboundSummary(handoff) {
  735:   const payload = asObject(handoff?.payload);
  736:   const output = asObject(payload.output);
  737:   const selectedVersion = asObject(payload.selected_version);
  738:   return {
  739:     id: asString(handoff?.id || payload.id || payload.workflow_id || payload.content_item_id),
```
### executeProjectAiCommand calls

#### Match 1 — line 1887

```js
 1842:       session.form = {
 1843:         ...session.form,
 1844:         mode: firstText(handoff.mode, session.form.mode, "social-post"),
 1845:         project: firstText(handoff.project, session.form.project, projectName),
 1846:         campaign: firstText(handoff.campaign, session.form.campaign),
 1847:         product: firstText(handoff.product, session.form.product),
 1848:         channel: firstText(handoff.channel, session.form.channel),
 1849:         language: firstText(handoff.language, session.form.language),
 1850:         tone: firstText(handoff.tone, session.form.tone),
 1851:         objective: firstText(handoff.objective, session.form.objective),
 1852:         brief: firstText(handoff.brief, handoff.contentBody, session.form.brief),
 1853:         title: firstText(handoff.title, session.form.title),
 1854:         status: normalizeStatus(handoff.readinessStatus || "draft", "draft")
 1855:       };
 1856:       appendVersion(session, {
 1857:         mode: session.form.mode,
 1858:         prompt: session.form.brief,
 1859:         outputContent: firstText(handoff.contentBody),
 1860:         language: session.form.language,
 1861:         tone: session.form.tone,
 1862:         channel: session.form.channel,
 1863:         readinessStatus: session.form.status,
 1864:         approvalStatus: firstText(handoff.approvalStatus, "draft"),
 1865:         notes: `Loaded from ${titleCase(handoff.sourcePage || "handoff")}.`
 1866:       });
 1867:       session.draftMessage = "Handoff loaded into composer.";
 1868:       rerender();
 1869:     };
 1870:   }
 1871: 
 1872:   const generateBtn = document.getElementById("contentGenerateDraftBtn");
 1873:   if (generateBtn) {
 1874:     generateBtn.onclick = async () => {
 1875:       sync();
 1876:       if (!validateComposer(session, "generate")) {
 1877:         rerender();
 1878:         return;
 1879:       }
 1880: 
 1881:       const promptUsed = clean(session.form.brief);
 1882:       session.form.status = "prompt_ready";
 1883:       session.draftMessage = "Draft is prompt-ready.";
 1884: 
 1885:       if (projectName) {
 1886:         try {
 1887:           const aiResult = await executeProjectAiCommand(projectName, {
 1888:             message: buildAiPrompt(projectName, session, selected()),
 1889:             route_target: "content-studio",
 1890:             actor: "content-studio"
 1891:           });
 1892:           const generatedText = firstText(
 1893:             aiResult?.response?.answer,
 1894:             aiResult?.response?.summary,
 1895:             aiResult?.response?.content,
 1896:             aiResult?.summary
 1897:           );
 1898: 
 1899:           if (clean(generatedText)) {
 1900:             appendVersion(session, {
 1901:               mode: session.form.mode,
 1902:               prompt: promptUsed,
 1903:               outputContent: generatedText,
 1904:               language: session.form.language,
 1905:               tone: session.form.tone,
 1906:               channel: session.form.channel,
 1907:               readinessStatus: "needs_review",
 1908:               approvalStatus: "needs_review",
 1909:               notes: "Generated via AI command backend."
 1910:             });
 1911:             session.form.status = "needs_review";
 1912:             session.draftMessage = "Draft generated and queued for review.";
 1913:           } else {
 1914:             appendVersion(session, {
 1915:               mode: session.form.mode,
 1916:               prompt: promptUsed,
 1917:               outputContent: "",
 1918:               language: session.form.language,
 1919:               tone: session.form.tone,
 1920:               channel: session.form.channel,
 1921:               readinessStatus: "prompt_ready",
 1922:               approvalStatus: "draft",
 1923:               notes: "No model output returned. Prompt-ready state kept."
 1924:             });
 1925:             session.draftMessage = "No generated output returned. Draft kept as prompt-ready.";
 1926:           }
 1927:         } catch (_) {
 1928:           appendVersion(session, {
 1929:             mode: session.form.mode,
 1930:             prompt: promptUsed,
 1931:             outputContent: "",
 1932:             language: session.form.language,
```

#### Match 2 — line 1997

```js
 1952:         });
 1953:         session.draftMessage = "No backend project selected. Draft is prompt-ready.";
 1954:       }
 1955: 
 1956:       await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
 1957:       rerender();
 1958:     };
 1959:   }
 1960: 
 1961:   const improveBtn = document.getElementById("contentImproveBtn");
 1962:   if (improveBtn) {
 1963:     improveBtn.onclick = () => {
 1964:       sync();
 1965:       if (!clean(session.form.brief)) {
 1966:         session.validation = { ...session.validation, brief: "Main prompt / brief is required." };
 1967:         rerender();
 1968:         return;
 1969:       }
 1970:       session.form.brief = `${clean(session.form.brief)}\n\nImprove for clarity: stronger opening hook, tighter value message, cleaner CTA, and channel-safe length.`;
 1971:       syncVersionFromForm(session);
 1972:       session.draftMessage = "Brief improved for stronger draft quality.";
 1973:       rerender();
 1974:     };
 1975:   }
 1976: 
 1977:   const translateBtn = document.getElementById("contentTranslateBtn");
 1978:   if (translateBtn) {
 1979:     translateBtn.onclick = async () => {
 1980:       sync();
 1981:       if (!clean(session.form.brief)) {
 1982:         session.validation = { ...session.validation, brief: "Main prompt / brief is required." };
 1983:         rerender();
 1984:         return;
 1985:       }
 1986: 
 1987:       const language = clean(session.form.language || "English");
 1988:       if (!projectName) {
 1989:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: Local mode only. Translate/adapt target language = ${language}.`;
 1990:         syncVersionFromForm(session);
 1991:         session.draftMessage = "Translate/adapt prepared in local mode.";
 1992:         rerender();
 1993:         return;
 1994:       }
 1995: 
 1996:       try {
 1997:         await executeProjectAiCommand(projectName, {
 1998:           message: `Adapt this content brief to ${language} while preserving brand tone and campaign intent:\n\n${session.form.brief}`,
 1999:           route_target: "content-studio",
 2000:           actor: "content-studio"
 2001:         });
 2002:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation request sent for ${language}.`;
 2003:         syncVersionFromForm(session);
 2004:         session.draftMessage = `Translate/adapt request sent for ${language}.`;
 2005:       } catch (_) {
 2006:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: backend unavailable for ${language}; prompt-ready adaptation added.`;
 2007:         syncVersionFromForm(session);
 2008:         session.draftMessage = "Translate/adapt backend unavailable. Prompt-ready adaptation saved.";
 2009:       }
 2010:       rerender();
 2011:     };
 2012:   }
 2013: 
 2014:   const saveBtn = document.getElementById("contentSaveDraftBtn");
 2015:   if (saveBtn) {
 2016:     saveBtn.onclick = async () => {
 2017:       sync();
 2018:       if (!validateComposer(session, "save")) {
 2019:         rerender();
 2020:         return;
 2021:       }
 2022:       session.form.status = normalizeStatus(session.form.status || "draft", "draft");
 2023:       await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
 2024:       rerender();
 2025:     };
 2026:   }
 2027: 
 2028:   const sendAiBtn = document.getElementById("contentSendAiBtn");
 2029:   if (sendAiBtn) {
 2030:     sendAiBtn.onclick = () => {
 2031:       sync();
 2032:       const selectedItem = selected();
 2033:       const prompt = buildAiPrompt(projectName, session, selectedItem);
 2034:       const aiDraft = {
 2035:         projectName,
 2036:         modeId: "content",
 2037:         lastCommand: prompt,
 2038:         lastResponseTitle: firstText(selectedItem?.title, session.form.title, "Content Draft"),
 2039:         routeSuggestions: []
 2040:       };
 2041:       setSharedAiDraft(projectName || "__default__", aiDraft);
 2042:       setSharedHandoff(projectName || "__default__", "ai-command", {
```
### createProjectTask calls

_No match found._

### createProjectHandoff calls

#### Match 1 — line 1697

```js
 1652:       content_output: selected.output_content,
 1653:       language: selected.language,
 1654:       tone: selected.tone,
 1655:       channel: selected.channel,
 1656:       mode: selected.mode
 1657:     },
 1658:     readiness_status: normalizeStatus(selected.readiness_status || "draft", "draft"),
 1659:     approval_status: firstText(selected.approval_status, "draft"),
 1660:     notes: firstText(selected.notes, selectedItem?.notes?.join("\n")),
 1661:     created_at: selected.timestamp || nowIso(),
 1662:     updated_at: nowIso()
 1663:   };
 1664: 
 1665:   const handoff = {
 1666:     id: asString(existing.backend?.id || ""),
 1667:     source_page: "content-studio",
 1668:     destination_page: "library",
 1669:     source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
 1670:     destination_role: CONTENT_ROLE_DEFAULTS.reviewRole,
 1671:     source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
 1672:     destination_service_domain: "library",
 1673:     linked_entity: {
 1674:       entity_type: "content_item",
 1675:       entity_id: firstText(selectedItem?.id, session.formSourceId),
 1676:       route: "content-studio",
 1677:       label: firstText(selectedItem?.title, session.form.title, "Content draft")
 1678:     },
 1679:     payload: {
 1680:       library_asset: libraryAsset,
 1681:       project: libraryAsset.project,
 1682:       campaign: libraryAsset.campaign,
 1683:       asset_type: libraryAsset.asset_type,
 1684:       content_type: libraryAsset.media_type
 1685:     },
 1686:     status: "available",
 1687:     actor: "content-studio"
 1688:   };
 1689: 
 1690:   setSharedHandoff(projectName || "__default__", "library", handoff);
 1691:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1692:     setSharedHandoff("__default__", "library", handoff);
 1693:   }
 1694: 
 1695:   if (projectName) {
 1696:     try {
 1697:       const result = await createProjectHandoff(projectName, handoff);
 1698:       const saved = asObject(result?.handoff);
 1699:       const handoffId = asString(saved.id || handoff.id);
 1700:       upsertLocalLibraryAsset(projectName, {
 1701:         ...libraryAsset,
 1702:         id: handoffId || libraryAsset.id,
 1703:         handoff_id: handoffId,
 1704:         local_only: false
 1705:       });
 1706:       selected.library_asset_ref = {
 1707:         handoff_id: handoffId,
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
 1738:     };
 1739:     showMessage?.("Content draft saved to Library (local handoff).");
 1740:   }
 1741: 
 1742:   session.validation = { ...session.validation, version: "" };
```

#### Match 2 — line 1753

```js
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
 1738:     };
 1739:     showMessage?.("Content draft saved to Library (local handoff).");
 1740:   }
 1741: 
 1742:   session.validation = { ...session.validation, version: "" };
 1743: }
 1744: 
 1745: async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
 1746:   setSharedHandoff(projectName || "__default__", handoff.destination_page, handoff);
 1747:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1748:     setSharedHandoff("__default__", handoff.destination_page, handoff);
 1749:   }
 1750: 
 1751:   if (projectName) {
 1752:     try {
 1753:       await createProjectHandoff(projectName, handoff);
 1754:       showMessage?.(successMessage);
 1755:       return true;
 1756:     } catch (_) {
 1757:       showMessage?.(failMessage);
 1758:       return false;
 1759:     }
 1760:   }
 1761: 
 1762:   showMessage?.(localMessage);
 1763:   return true;
 1764: }
 1765: 
 1766: function buildAssetGate(state, escapeHtml) {
 1767:   const keys = ["brand_guideline", "product_csv", "product_photos", "product_videos", "testimonials_reviews", "legal_doc"];
 1768:   const assetData = asObject(state.data?.assets);
 1769:   const nextAction = getAssetNextAction(assetData, keys);
 1770:   return `
 1771:     <section class="card content-card">
 1772:       <div class="card-head">
 1773:         <div>
 1774:           <div class="setup-kicker">Content Inputs</div>
 1775:           <h3>Library dependency gate</h3>
 1776:         </div>
 1777:         <span class="card-badge neutral">Assets</span>
 1778:       </div>
 1779:       ${renderAssetDependencyRows(assetData, keys, escapeHtml, "Content dependencies are covered.")}
 1780:       <div class="simple-banner" style="margin-top:12px;">${escapeHtml(nextAction)}</div>
 1781:     </section>
 1782:   `;
 1783: }
 1784: 
 1785: function bindPage({
 1786:   projectName,
 1787:   state,
 1788:   session,
 1789:   handoff,
 1790:   navigateTo,
 1791:   showMessage,
 1792:   showError,
 1793:   rerender
 1794: }) {
 1795:   const form = document.getElementById("contentComposerForm");
 1796: 
 1797:   function selected() {
 1798:     return getSelectedItem(session);
```
### createProjectApproval calls

_No match found._

### decideProjectApproval calls

_No match found._

### List/read-only API calls

#### Match 1 — line 782

```js
  737:   const selectedVersion = asObject(payload.selected_version);
  738:   return {
  739:     id: asString(handoff?.id || payload.id || payload.workflow_id || payload.content_item_id),
  740:     sourcePage: asString(handoff?.source_page || "workflows"),
  741:     title: firstText(payload.title, output.title, selectedVersion.title),
  742:     project: firstText(payload.project, output.project),
  743:     campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
  744:     product: firstText(payload.product, output.product),
  745:     channel: firstText(payload.channel, output.channel),
  746:     mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
  747:     language: firstText(payload.language, selectedVersion.language),
  748:     tone: firstText(payload.tone, selectedVersion.tone),
  749:     objective: firstText(payload.objective, output.goal, output.objective),
  750:     brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
  751:     contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
  752:     readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
  753:     approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  754:   };
  755: }
  756: 
  757: function getInboundHandoff(projectName, session) {
  758:   const operations = session.operations || {};
  759:   return (
  760:     getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
  761:     getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
  762:     getSharedHandoff(projectName, "content-studio", operations)
  763:   );
  764: }
  765: 
  766: function applyInboundHandoff(projectName, session) {
  767:   const handoff = getInboundHandoff(projectName, session);
  768:   if (!handoff) return;
  769:   const summary = buildInboundSummary(handoff);
  770:   if (!summary.id || summary.id === session.loadedHandoffId) return;
  771:   session.loadedHandoffId = summary.id;
  772: }
  773: 
  774: async function loadWorkspace(projectName, state, session, rerender) {
  775:   if (!projectName || session.loading || session.loaded) return;
  776:   session.loading = true;
  777:   session.error = "";
  778:   rerender();
  779: 
  780:   try {
  781:     const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
  782:       listProjectContentItems(projectName, { limit: 120 }),
  783:       listProjectTasks(projectName, 120),
  784:       listProjectApprovals(projectName, 120),
  785:       listProjectHandoffs(projectName, { limit: 120 }),
  786:       listProjectEvents(projectName, 120),
  787:       fetchProjectOperations(projectName)
  788:     ]);
  789: 
  790:     const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
  791:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
  792:     session.items = mergeItems(backendItems, localItems);
  793:     session.tasks = asArray(tasks.items);
  794:     session.approvals = asArray(approvals.items);
  795:     session.handoffs = asArray(handoffs.items);
  796:     session.events = asArray(events.items);
  797:     session.operations = operations || null;
  798:     session.loaded = true;
  799:     applyInboundHandoff(projectName, session);
  800:     if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  801:   } catch (error) {
  802:     session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
  803:     session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
  804:     session.loaded = true;
  805:     applyInboundHandoff(projectName, session);
  806:   } finally {
  807:     session.loading = false;
  808:     rerender();
  809:   }
  810: }
  811: 
  812: function getMetrics(session) {
  813:   const items = asArray(session.items);
  814:   return {
  815:     total: items.length,
  816:     ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
  817:     needsReview: items.filter((item) => item.status === "needs_review").length,
  818:     approved: items.filter((item) => item.status === "approved").length,
  819:     sentMedia: items.filter((item) => item.status === "sent_to_media").length,
  820:     sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  821:   };
  822: }
  823: 
  824: function buildRecommendation(metrics, selectedItem) {
  825:   if (!selectedItem) {
  826:     return {
  827:       action: "Start a draft from the main brief",
```

#### Match 2 — line 783

```js
  738:   return {
  739:     id: asString(handoff?.id || payload.id || payload.workflow_id || payload.content_item_id),
  740:     sourcePage: asString(handoff?.source_page || "workflows"),
  741:     title: firstText(payload.title, output.title, selectedVersion.title),
  742:     project: firstText(payload.project, output.project),
  743:     campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
  744:     product: firstText(payload.product, output.product),
  745:     channel: firstText(payload.channel, output.channel),
  746:     mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
  747:     language: firstText(payload.language, selectedVersion.language),
  748:     tone: firstText(payload.tone, selectedVersion.tone),
  749:     objective: firstText(payload.objective, output.goal, output.objective),
  750:     brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
  751:     contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
  752:     readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
  753:     approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  754:   };
  755: }
  756: 
  757: function getInboundHandoff(projectName, session) {
  758:   const operations = session.operations || {};
  759:   return (
  760:     getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
  761:     getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
  762:     getSharedHandoff(projectName, "content-studio", operations)
  763:   );
  764: }
  765: 
  766: function applyInboundHandoff(projectName, session) {
  767:   const handoff = getInboundHandoff(projectName, session);
  768:   if (!handoff) return;
  769:   const summary = buildInboundSummary(handoff);
  770:   if (!summary.id || summary.id === session.loadedHandoffId) return;
  771:   session.loadedHandoffId = summary.id;
  772: }
  773: 
  774: async function loadWorkspace(projectName, state, session, rerender) {
  775:   if (!projectName || session.loading || session.loaded) return;
  776:   session.loading = true;
  777:   session.error = "";
  778:   rerender();
  779: 
  780:   try {
  781:     const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
  782:       listProjectContentItems(projectName, { limit: 120 }),
  783:       listProjectTasks(projectName, 120),
  784:       listProjectApprovals(projectName, 120),
  785:       listProjectHandoffs(projectName, { limit: 120 }),
  786:       listProjectEvents(projectName, 120),
  787:       fetchProjectOperations(projectName)
  788:     ]);
  789: 
  790:     const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
  791:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
  792:     session.items = mergeItems(backendItems, localItems);
  793:     session.tasks = asArray(tasks.items);
  794:     session.approvals = asArray(approvals.items);
  795:     session.handoffs = asArray(handoffs.items);
  796:     session.events = asArray(events.items);
  797:     session.operations = operations || null;
  798:     session.loaded = true;
  799:     applyInboundHandoff(projectName, session);
  800:     if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  801:   } catch (error) {
  802:     session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
  803:     session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
  804:     session.loaded = true;
  805:     applyInboundHandoff(projectName, session);
  806:   } finally {
  807:     session.loading = false;
  808:     rerender();
  809:   }
  810: }
  811: 
  812: function getMetrics(session) {
  813:   const items = asArray(session.items);
  814:   return {
  815:     total: items.length,
  816:     ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
  817:     needsReview: items.filter((item) => item.status === "needs_review").length,
  818:     approved: items.filter((item) => item.status === "approved").length,
  819:     sentMedia: items.filter((item) => item.status === "sent_to_media").length,
  820:     sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  821:   };
  822: }
  823: 
  824: function buildRecommendation(metrics, selectedItem) {
  825:   if (!selectedItem) {
  826:     return {
  827:       action: "Start a draft from the main brief",
  828:       why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
```

#### Match 3 — line 784

```js
  739:     id: asString(handoff?.id || payload.id || payload.workflow_id || payload.content_item_id),
  740:     sourcePage: asString(handoff?.source_page || "workflows"),
  741:     title: firstText(payload.title, output.title, selectedVersion.title),
  742:     project: firstText(payload.project, output.project),
  743:     campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
  744:     product: firstText(payload.product, output.product),
  745:     channel: firstText(payload.channel, output.channel),
  746:     mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
  747:     language: firstText(payload.language, selectedVersion.language),
  748:     tone: firstText(payload.tone, selectedVersion.tone),
  749:     objective: firstText(payload.objective, output.goal, output.objective),
  750:     brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
  751:     contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
  752:     readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
  753:     approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  754:   };
  755: }
  756: 
  757: function getInboundHandoff(projectName, session) {
  758:   const operations = session.operations || {};
  759:   return (
  760:     getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
  761:     getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
  762:     getSharedHandoff(projectName, "content-studio", operations)
  763:   );
  764: }
  765: 
  766: function applyInboundHandoff(projectName, session) {
  767:   const handoff = getInboundHandoff(projectName, session);
  768:   if (!handoff) return;
  769:   const summary = buildInboundSummary(handoff);
  770:   if (!summary.id || summary.id === session.loadedHandoffId) return;
  771:   session.loadedHandoffId = summary.id;
  772: }
  773: 
  774: async function loadWorkspace(projectName, state, session, rerender) {
  775:   if (!projectName || session.loading || session.loaded) return;
  776:   session.loading = true;
  777:   session.error = "";
  778:   rerender();
  779: 
  780:   try {
  781:     const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
  782:       listProjectContentItems(projectName, { limit: 120 }),
  783:       listProjectTasks(projectName, 120),
  784:       listProjectApprovals(projectName, 120),
  785:       listProjectHandoffs(projectName, { limit: 120 }),
  786:       listProjectEvents(projectName, 120),
  787:       fetchProjectOperations(projectName)
  788:     ]);
  789: 
  790:     const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
  791:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
  792:     session.items = mergeItems(backendItems, localItems);
  793:     session.tasks = asArray(tasks.items);
  794:     session.approvals = asArray(approvals.items);
  795:     session.handoffs = asArray(handoffs.items);
  796:     session.events = asArray(events.items);
  797:     session.operations = operations || null;
  798:     session.loaded = true;
  799:     applyInboundHandoff(projectName, session);
  800:     if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  801:   } catch (error) {
  802:     session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
  803:     session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
  804:     session.loaded = true;
  805:     applyInboundHandoff(projectName, session);
  806:   } finally {
  807:     session.loading = false;
  808:     rerender();
  809:   }
  810: }
  811: 
  812: function getMetrics(session) {
  813:   const items = asArray(session.items);
  814:   return {
  815:     total: items.length,
  816:     ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
  817:     needsReview: items.filter((item) => item.status === "needs_review").length,
  818:     approved: items.filter((item) => item.status === "approved").length,
  819:     sentMedia: items.filter((item) => item.status === "sent_to_media").length,
  820:     sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  821:   };
  822: }
  823: 
  824: function buildRecommendation(metrics, selectedItem) {
  825:   if (!selectedItem) {
  826:     return {
  827:       action: "Start a draft from the main brief",
  828:       why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
  829:     };
```

#### Match 4 — line 785

```js
  740:     sourcePage: asString(handoff?.source_page || "workflows"),
  741:     title: firstText(payload.title, output.title, selectedVersion.title),
  742:     project: firstText(payload.project, output.project),
  743:     campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
  744:     product: firstText(payload.product, output.product),
  745:     channel: firstText(payload.channel, output.channel),
  746:     mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
  747:     language: firstText(payload.language, selectedVersion.language),
  748:     tone: firstText(payload.tone, selectedVersion.tone),
  749:     objective: firstText(payload.objective, output.goal, output.objective),
  750:     brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
  751:     contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
  752:     readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
  753:     approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  754:   };
  755: }
  756: 
  757: function getInboundHandoff(projectName, session) {
  758:   const operations = session.operations || {};
  759:   return (
  760:     getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
  761:     getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
  762:     getSharedHandoff(projectName, "content-studio", operations)
  763:   );
  764: }
  765: 
  766: function applyInboundHandoff(projectName, session) {
  767:   const handoff = getInboundHandoff(projectName, session);
  768:   if (!handoff) return;
  769:   const summary = buildInboundSummary(handoff);
  770:   if (!summary.id || summary.id === session.loadedHandoffId) return;
  771:   session.loadedHandoffId = summary.id;
  772: }
  773: 
  774: async function loadWorkspace(projectName, state, session, rerender) {
  775:   if (!projectName || session.loading || session.loaded) return;
  776:   session.loading = true;
  777:   session.error = "";
  778:   rerender();
  779: 
  780:   try {
  781:     const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
  782:       listProjectContentItems(projectName, { limit: 120 }),
  783:       listProjectTasks(projectName, 120),
  784:       listProjectApprovals(projectName, 120),
  785:       listProjectHandoffs(projectName, { limit: 120 }),
  786:       listProjectEvents(projectName, 120),
  787:       fetchProjectOperations(projectName)
  788:     ]);
  789: 
  790:     const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
  791:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
  792:     session.items = mergeItems(backendItems, localItems);
  793:     session.tasks = asArray(tasks.items);
  794:     session.approvals = asArray(approvals.items);
  795:     session.handoffs = asArray(handoffs.items);
  796:     session.events = asArray(events.items);
  797:     session.operations = operations || null;
  798:     session.loaded = true;
  799:     applyInboundHandoff(projectName, session);
  800:     if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  801:   } catch (error) {
  802:     session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
  803:     session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
  804:     session.loaded = true;
  805:     applyInboundHandoff(projectName, session);
  806:   } finally {
  807:     session.loading = false;
  808:     rerender();
  809:   }
  810: }
  811: 
  812: function getMetrics(session) {
  813:   const items = asArray(session.items);
  814:   return {
  815:     total: items.length,
  816:     ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
  817:     needsReview: items.filter((item) => item.status === "needs_review").length,
  818:     approved: items.filter((item) => item.status === "approved").length,
  819:     sentMedia: items.filter((item) => item.status === "sent_to_media").length,
  820:     sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  821:   };
  822: }
  823: 
  824: function buildRecommendation(metrics, selectedItem) {
  825:   if (!selectedItem) {
  826:     return {
  827:       action: "Start a draft from the main brief",
  828:       why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
  829:     };
  830:   }
```

#### Match 5 — line 786

```js
  741:     title: firstText(payload.title, output.title, selectedVersion.title),
  742:     project: firstText(payload.project, output.project),
  743:     campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
  744:     product: firstText(payload.product, output.product),
  745:     channel: firstText(payload.channel, output.channel),
  746:     mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
  747:     language: firstText(payload.language, selectedVersion.language),
  748:     tone: firstText(payload.tone, selectedVersion.tone),
  749:     objective: firstText(payload.objective, output.goal, output.objective),
  750:     brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
  751:     contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
  752:     readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
  753:     approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  754:   };
  755: }
  756: 
  757: function getInboundHandoff(projectName, session) {
  758:   const operations = session.operations || {};
  759:   return (
  760:     getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
  761:     getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
  762:     getSharedHandoff(projectName, "content-studio", operations)
  763:   );
  764: }
  765: 
  766: function applyInboundHandoff(projectName, session) {
  767:   const handoff = getInboundHandoff(projectName, session);
  768:   if (!handoff) return;
  769:   const summary = buildInboundSummary(handoff);
  770:   if (!summary.id || summary.id === session.loadedHandoffId) return;
  771:   session.loadedHandoffId = summary.id;
  772: }
  773: 
  774: async function loadWorkspace(projectName, state, session, rerender) {
  775:   if (!projectName || session.loading || session.loaded) return;
  776:   session.loading = true;
  777:   session.error = "";
  778:   rerender();
  779: 
  780:   try {
  781:     const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
  782:       listProjectContentItems(projectName, { limit: 120 }),
  783:       listProjectTasks(projectName, 120),
  784:       listProjectApprovals(projectName, 120),
  785:       listProjectHandoffs(projectName, { limit: 120 }),
  786:       listProjectEvents(projectName, 120),
  787:       fetchProjectOperations(projectName)
  788:     ]);
  789: 
  790:     const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
  791:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
  792:     session.items = mergeItems(backendItems, localItems);
  793:     session.tasks = asArray(tasks.items);
  794:     session.approvals = asArray(approvals.items);
  795:     session.handoffs = asArray(handoffs.items);
  796:     session.events = asArray(events.items);
  797:     session.operations = operations || null;
  798:     session.loaded = true;
  799:     applyInboundHandoff(projectName, session);
  800:     if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  801:   } catch (error) {
  802:     session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
  803:     session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
  804:     session.loaded = true;
  805:     applyInboundHandoff(projectName, session);
  806:   } finally {
  807:     session.loading = false;
  808:     rerender();
  809:   }
  810: }
  811: 
  812: function getMetrics(session) {
  813:   const items = asArray(session.items);
  814:   return {
  815:     total: items.length,
  816:     ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
  817:     needsReview: items.filter((item) => item.status === "needs_review").length,
  818:     approved: items.filter((item) => item.status === "approved").length,
  819:     sentMedia: items.filter((item) => item.status === "sent_to_media").length,
  820:     sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  821:   };
  822: }
  823: 
  824: function buildRecommendation(metrics, selectedItem) {
  825:   if (!selectedItem) {
  826:     return {
  827:       action: "Start a draft from the main brief",
  828:       why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
  829:     };
  830:   }
  831: 
```

#### Match 6 — line 787

```js
  742:     project: firstText(payload.project, output.project),
  743:     campaign: firstText(payload.campaign, output.campaign, payload.campaign_id),
  744:     product: firstText(payload.product, output.product),
  745:     channel: firstText(payload.channel, output.channel),
  746:     mode: firstText(payload.content_type, selectedVersion.mode, payload.type),
  747:     language: firstText(payload.language, selectedVersion.language),
  748:     tone: firstText(payload.tone, selectedVersion.tone),
  749:     objective: firstText(payload.objective, output.goal, output.objective),
  750:     brief: firstText(selectedVersion.prompt, payload.prompt, output.summary, payload.brief),
  751:     contentBody: firstText(selectedVersion.output_content, payload.content, payload.body, output.content_item),
  752:     readinessStatus: firstText(selectedVersion.readiness_status, payload.readiness_status, "draft"),
  753:     approvalStatus: firstText(selectedVersion.approval_status, payload.approval_status, "draft")
  754:   };
  755: }
  756: 
  757: function getInboundHandoff(projectName, session) {
  758:   const operations = session.operations || {};
  759:   return (
  760:     getSharedHandoff(projectName, "content-studio", operations, "workflows") ||
  761:     getSharedHandoff(projectName, "content-studio", operations, "ai-command") ||
  762:     getSharedHandoff(projectName, "content-studio", operations)
  763:   );
  764: }
  765: 
  766: function applyInboundHandoff(projectName, session) {
  767:   const handoff = getInboundHandoff(projectName, session);
  768:   if (!handoff) return;
  769:   const summary = buildInboundSummary(handoff);
  770:   if (!summary.id || summary.id === session.loadedHandoffId) return;
  771:   session.loadedHandoffId = summary.id;
  772: }
  773: 
  774: async function loadWorkspace(projectName, state, session, rerender) {
  775:   if (!projectName || session.loading || session.loaded) return;
  776:   session.loading = true;
  777:   session.error = "";
  778:   rerender();
  779: 
  780:   try {
  781:     const [contentItems, tasks, approvals, handoffs, events, operations] = await Promise.all([
  782:       listProjectContentItems(projectName, { limit: 120 }),
  783:       listProjectTasks(projectName, 120),
  784:       listProjectApprovals(projectName, 120),
  785:       listProjectHandoffs(projectName, { limit: 120 }),
  786:       listProjectEvents(projectName, 120),
  787:       fetchProjectOperations(projectName)
  788:     ]);
  789: 
  790:     const backendItems = asArray(contentItems.items).map((item) => normalizeContentItem(item));
  791:     const localItems = loadLocalDrafts(projectName).map((item) => normalizeContentItem(item));
  792:     session.items = mergeItems(backendItems, localItems);
  793:     session.tasks = asArray(tasks.items);
  794:     session.approvals = asArray(approvals.items);
  795:     session.handoffs = asArray(handoffs.items);
  796:     session.events = asArray(events.items);
  797:     session.operations = operations || null;
  798:     session.loaded = true;
  799:     applyInboundHandoff(projectName, session);
  800:     if (!session.selectedId) session.selectedId = session.items[0]?.id || "";
  801:   } catch (error) {
  802:     session.error = "Backend content data unavailable. Content Studio is running in local draft mode.";
  803:     session.items = mergeItems([], loadLocalDrafts(projectName).map((item) => normalizeContentItem(item)));
  804:     session.loaded = true;
  805:     applyInboundHandoff(projectName, session);
  806:   } finally {
  807:     session.loading = false;
  808:     rerender();
  809:   }
  810: }
  811: 
  812: function getMetrics(session) {
  813:   const items = asArray(session.items);
  814:   return {
  815:     total: items.length,
  816:     ready: items.filter((item) => ["prompt_ready"].includes(item.status)).length,
  817:     needsReview: items.filter((item) => item.status === "needs_review").length,
  818:     approved: items.filter((item) => item.status === "approved").length,
  819:     sentMedia: items.filter((item) => item.status === "sent_to_media").length,
  820:     sentPublishing: items.filter((item) => item.status === "sent_to_publishing").length
  821:   };
  822: }
  823: 
  824: function buildRecommendation(metrics, selectedItem) {
  825:   if (!selectedItem) {
  826:     return {
  827:       action: "Start a draft from the main brief",
  828:       why: "A clear first draft unlocks versioning, review, and downstream media/publishing handoffs."
  829:     };
  830:   }
  831: 
  832:   if (selectedItem.status === "needs_review") {
```
### Local storage writes

_No match found._

### Shared context writes

#### Match 1 — line 16

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
```

#### Match 2 — line 1690

```js
 1645:     product: firstText(session.form.product, selectedItem?.product),
 1646:     channel: firstText(session.form.channel, selectedItem?.channel),
 1647:     media_type: firstText(selected.mode, session.form.mode),
 1648:     asset_type: mapLibraryAssetType(firstText(selected.mode, session.form.mode)),
 1649:     version_id: selected.id,
 1650:     prompt: selected.prompt,
 1651:     output_payload: {
 1652:       content_output: selected.output_content,
 1653:       language: selected.language,
 1654:       tone: selected.tone,
 1655:       channel: selected.channel,
 1656:       mode: selected.mode
 1657:     },
 1658:     readiness_status: normalizeStatus(selected.readiness_status || "draft", "draft"),
 1659:     approval_status: firstText(selected.approval_status, "draft"),
 1660:     notes: firstText(selected.notes, selectedItem?.notes?.join("\n")),
 1661:     created_at: selected.timestamp || nowIso(),
 1662:     updated_at: nowIso()
 1663:   };
 1664: 
 1665:   const handoff = {
 1666:     id: asString(existing.backend?.id || ""),
 1667:     source_page: "content-studio",
 1668:     destination_page: "library",
 1669:     source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
 1670:     destination_role: CONTENT_ROLE_DEFAULTS.reviewRole,
 1671:     source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
 1672:     destination_service_domain: "library",
 1673:     linked_entity: {
 1674:       entity_type: "content_item",
 1675:       entity_id: firstText(selectedItem?.id, session.formSourceId),
 1676:       route: "content-studio",
 1677:       label: firstText(selectedItem?.title, session.form.title, "Content draft")
 1678:     },
 1679:     payload: {
 1680:       library_asset: libraryAsset,
 1681:       project: libraryAsset.project,
 1682:       campaign: libraryAsset.campaign,
 1683:       asset_type: libraryAsset.asset_type,
 1684:       content_type: libraryAsset.media_type
 1685:     },
 1686:     status: "available",
 1687:     actor: "content-studio"
 1688:   };
 1689: 
 1690:   setSharedHandoff(projectName || "__default__", "library", handoff);
 1691:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1692:     setSharedHandoff("__default__", "library", handoff);
 1693:   }
 1694: 
 1695:   if (projectName) {
 1696:     try {
 1697:       const result = await createProjectHandoff(projectName, handoff);
 1698:       const saved = asObject(result?.handoff);
 1699:       const handoffId = asString(saved.id || handoff.id);
 1700:       upsertLocalLibraryAsset(projectName, {
 1701:         ...libraryAsset,
 1702:         id: handoffId || libraryAsset.id,
 1703:         handoff_id: handoffId,
 1704:         local_only: false
 1705:       });
 1706:       selected.library_asset_ref = {
 1707:         handoff_id: handoffId,
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
```

#### Match 3 — line 1692

```js
 1647:     media_type: firstText(selected.mode, session.form.mode),
 1648:     asset_type: mapLibraryAssetType(firstText(selected.mode, session.form.mode)),
 1649:     version_id: selected.id,
 1650:     prompt: selected.prompt,
 1651:     output_payload: {
 1652:       content_output: selected.output_content,
 1653:       language: selected.language,
 1654:       tone: selected.tone,
 1655:       channel: selected.channel,
 1656:       mode: selected.mode
 1657:     },
 1658:     readiness_status: normalizeStatus(selected.readiness_status || "draft", "draft"),
 1659:     approval_status: firstText(selected.approval_status, "draft"),
 1660:     notes: firstText(selected.notes, selectedItem?.notes?.join("\n")),
 1661:     created_at: selected.timestamp || nowIso(),
 1662:     updated_at: nowIso()
 1663:   };
 1664: 
 1665:   const handoff = {
 1666:     id: asString(existing.backend?.id || ""),
 1667:     source_page: "content-studio",
 1668:     destination_page: "library",
 1669:     source_role: CONTENT_ROLE_DEFAULTS.ownerRole,
 1670:     destination_role: CONTENT_ROLE_DEFAULTS.reviewRole,
 1671:     source_service_domain: CONTENT_ROLE_DEFAULTS.serviceDomain,
 1672:     destination_service_domain: "library",
 1673:     linked_entity: {
 1674:       entity_type: "content_item",
 1675:       entity_id: firstText(selectedItem?.id, session.formSourceId),
 1676:       route: "content-studio",
 1677:       label: firstText(selectedItem?.title, session.form.title, "Content draft")
 1678:     },
 1679:     payload: {
 1680:       library_asset: libraryAsset,
 1681:       project: libraryAsset.project,
 1682:       campaign: libraryAsset.campaign,
 1683:       asset_type: libraryAsset.asset_type,
 1684:       content_type: libraryAsset.media_type
 1685:     },
 1686:     status: "available",
 1687:     actor: "content-studio"
 1688:   };
 1689: 
 1690:   setSharedHandoff(projectName || "__default__", "library", handoff);
 1691:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1692:     setSharedHandoff("__default__", "library", handoff);
 1693:   }
 1694: 
 1695:   if (projectName) {
 1696:     try {
 1697:       const result = await createProjectHandoff(projectName, handoff);
 1698:       const saved = asObject(result?.handoff);
 1699:       const handoffId = asString(saved.id || handoff.id);
 1700:       upsertLocalLibraryAsset(projectName, {
 1701:         ...libraryAsset,
 1702:         id: handoffId || libraryAsset.id,
 1703:         handoff_id: handoffId,
 1704:         local_only: false
 1705:       });
 1706:       selected.library_asset_ref = {
 1707:         handoff_id: handoffId,
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
```

#### Match 4 — line 1746

```js
 1701:         ...libraryAsset,
 1702:         id: handoffId || libraryAsset.id,
 1703:         handoff_id: handoffId,
 1704:         local_only: false
 1705:       });
 1706:       selected.library_asset_ref = {
 1707:         handoff_id: handoffId,
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
 1738:     };
 1739:     showMessage?.("Content draft saved to Library (local handoff).");
 1740:   }
 1741: 
 1742:   session.validation = { ...session.validation, version: "" };
 1743: }
 1744: 
 1745: async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
 1746:   setSharedHandoff(projectName || "__default__", handoff.destination_page, handoff);
 1747:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1748:     setSharedHandoff("__default__", handoff.destination_page, handoff);
 1749:   }
 1750: 
 1751:   if (projectName) {
 1752:     try {
 1753:       await createProjectHandoff(projectName, handoff);
 1754:       showMessage?.(successMessage);
 1755:       return true;
 1756:     } catch (_) {
 1757:       showMessage?.(failMessage);
 1758:       return false;
 1759:     }
 1760:   }
 1761: 
 1762:   showMessage?.(localMessage);
 1763:   return true;
 1764: }
 1765: 
 1766: function buildAssetGate(state, escapeHtml) {
 1767:   const keys = ["brand_guideline", "product_csv", "product_photos", "product_videos", "testimonials_reviews", "legal_doc"];
 1768:   const assetData = asObject(state.data?.assets);
 1769:   const nextAction = getAssetNextAction(assetData, keys);
 1770:   return `
 1771:     <section class="card content-card">
 1772:       <div class="card-head">
 1773:         <div>
 1774:           <div class="setup-kicker">Content Inputs</div>
 1775:           <h3>Library dependency gate</h3>
 1776:         </div>
 1777:         <span class="card-badge neutral">Assets</span>
 1778:       </div>
 1779:       ${renderAssetDependencyRows(assetData, keys, escapeHtml, "Content dependencies are covered.")}
 1780:       <div class="simple-banner" style="margin-top:12px;">${escapeHtml(nextAction)}</div>
 1781:     </section>
 1782:   `;
 1783: }
 1784: 
 1785: function bindPage({
 1786:   projectName,
 1787:   state,
 1788:   session,
 1789:   handoff,
 1790:   navigateTo,
 1791:   showMessage,
```

#### Match 5 — line 1748

```js
 1703:         handoff_id: handoffId,
 1704:         local_only: false
 1705:       });
 1706:       selected.library_asset_ref = {
 1707:         handoff_id: handoffId,
 1708:         source_signature: signature,
 1709:         local_only: false,
 1710:         saved_at: nowIso()
 1711:       };
 1712:       showMessage?.(existing.backend ? "Already saved. Library metadata updated." : "Content draft saved to Library.");
 1713:     } catch (_) {
 1714:       upsertLocalLibraryAsset(projectName, {
 1715:         ...libraryAsset,
 1716:         id: libraryAsset.id,
 1717:         local_only: true
 1718:       });
 1719:       selected.library_asset_ref = {
 1720:         handoff_id: "",
 1721:         source_signature: signature,
 1722:         local_only: true,
 1723:         saved_at: nowIso()
 1724:       };
 1725:       showMessage?.("Library backend unavailable. Saved as local library handoff.");
 1726:     }
 1727:   } else {
 1728:     upsertLocalLibraryAsset(projectName, {
 1729:       ...libraryAsset,
 1730:       id: libraryAsset.id,
 1731:       local_only: true
 1732:     });
 1733:     selected.library_asset_ref = {
 1734:       handoff_id: "",
 1735:       source_signature: signature,
 1736:       local_only: true,
 1737:       saved_at: nowIso()
 1738:     };
 1739:     showMessage?.("Content draft saved to Library (local handoff).");
 1740:   }
 1741: 
 1742:   session.validation = { ...session.validation, version: "" };
 1743: }
 1744: 
 1745: async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
 1746:   setSharedHandoff(projectName || "__default__", handoff.destination_page, handoff);
 1747:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1748:     setSharedHandoff("__default__", handoff.destination_page, handoff);
 1749:   }
 1750: 
 1751:   if (projectName) {
 1752:     try {
 1753:       await createProjectHandoff(projectName, handoff);
 1754:       showMessage?.(successMessage);
 1755:       return true;
 1756:     } catch (_) {
 1757:       showMessage?.(failMessage);
 1758:       return false;
 1759:     }
 1760:   }
 1761: 
 1762:   showMessage?.(localMessage);
 1763:   return true;
 1764: }
 1765: 
 1766: function buildAssetGate(state, escapeHtml) {
 1767:   const keys = ["brand_guideline", "product_csv", "product_photos", "product_videos", "testimonials_reviews", "legal_doc"];
 1768:   const assetData = asObject(state.data?.assets);
 1769:   const nextAction = getAssetNextAction(assetData, keys);
 1770:   return `
 1771:     <section class="card content-card">
 1772:       <div class="card-head">
 1773:         <div>
 1774:           <div class="setup-kicker">Content Inputs</div>
 1775:           <h3>Library dependency gate</h3>
 1776:         </div>
 1777:         <span class="card-badge neutral">Assets</span>
 1778:       </div>
 1779:       ${renderAssetDependencyRows(assetData, keys, escapeHtml, "Content dependencies are covered.")}
 1780:       <div class="simple-banner" style="margin-top:12px;">${escapeHtml(nextAction)}</div>
 1781:     </section>
 1782:   `;
 1783: }
 1784: 
 1785: function bindPage({
 1786:   projectName,
 1787:   state,
 1788:   session,
 1789:   handoff,
 1790:   navigateTo,
 1791:   showMessage,
 1792:   showError,
 1793:   rerender
```

#### Match 6 — line 2041

```js
 1996:       try {
 1997:         await executeProjectAiCommand(projectName, {
 1998:           message: `Adapt this content brief to ${language} while preserving brand tone and campaign intent:\n\n${session.form.brief}`,
 1999:           route_target: "content-studio",
 2000:           actor: "content-studio"
 2001:         });
 2002:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation request sent for ${language}.`;
 2003:         syncVersionFromForm(session);
 2004:         session.draftMessage = `Translate/adapt request sent for ${language}.`;
 2005:       } catch (_) {
 2006:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: backend unavailable for ${language}; prompt-ready adaptation added.`;
 2007:         syncVersionFromForm(session);
 2008:         session.draftMessage = "Translate/adapt backend unavailable. Prompt-ready adaptation saved.";
 2009:       }
 2010:       rerender();
 2011:     };
 2012:   }
 2013: 
 2014:   const saveBtn = document.getElementById("contentSaveDraftBtn");
 2015:   if (saveBtn) {
 2016:     saveBtn.onclick = async () => {
 2017:       sync();
 2018:       if (!validateComposer(session, "save")) {
 2019:         rerender();
 2020:         return;
 2021:       }
 2022:       session.form.status = normalizeStatus(session.form.status || "draft", "draft");
 2023:       await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
 2024:       rerender();
 2025:     };
 2026:   }
 2027: 
 2028:   const sendAiBtn = document.getElementById("contentSendAiBtn");
 2029:   if (sendAiBtn) {
 2030:     sendAiBtn.onclick = () => {
 2031:       sync();
 2032:       const selectedItem = selected();
 2033:       const prompt = buildAiPrompt(projectName, session, selectedItem);
 2034:       const aiDraft = {
 2035:         projectName,
 2036:         modeId: "content",
 2037:         lastCommand: prompt,
 2038:         lastResponseTitle: firstText(selectedItem?.title, session.form.title, "Content Draft"),
 2039:         routeSuggestions: []
 2040:       };
 2041:       setSharedAiDraft(projectName || "__default__", aiDraft);
 2042:       setSharedHandoff(projectName || "__default__", "ai-command", {
 2043:         source_page: "content-studio",
 2044:         destination_page: "ai-command",
 2045:         linked_entity: {
 2046:           entity_type: "content_item",
 2047:           entity_id: firstText(selectedItem?.id, session.formSourceId)
 2048:         },
 2049:         payload: {
 2050:           prompt,
 2051:           title: firstText(selectedItem?.title, session.form.title),
 2052:           content_item_id: firstText(selectedItem?.id, session.formSourceId),
 2053:           draft_context: aiDraft,
 2054:           content: buildContentPayload(session, session.form.status || "draft")
 2055:         },
 2056:         status: "available"
 2057:       });
 2058:       navigateTo("ai-command");
 2059:       showMessage?.("Content context sent to AI Command.");
 2060:     };
 2061:   }
 2062: 
 2063:   const sendMediaBtn = document.getElementById("contentSendMediaBtn");
 2064:   if (sendMediaBtn) {
 2065:     sendMediaBtn.onclick = async () => {
 2066:       sync();
 2067:       if (!validateComposer(session, "save")) {
 2068:         rerender();
 2069:         return;
 2070:       }
 2071:       const selectedItem = selected();
 2072:       const handoffPayload = buildMediaHandoff(projectName, session, selectedItem);
 2073:       const ok = await sendHandoff({
 2074:         projectName,
 2075:         handoff: handoffPayload,
 2076:         session,
 2077:         showMessage,
 2078:         failMessage: "Design brief kept locally because backend handoff save is unavailable.",
 2079:         successMessage: "Design brief sent to Media Studio.",
 2080:         localMessage: "Design brief prepared for Media Studio locally."
 2081:       });
 2082:       if (ok) {
 2083:         const selectedVersion = selectedVersionEntry(session);
 2084:         if (selectedVersion) {
 2085:           selectedVersion.readiness_status = "sent_to_media";
 2086:         }
```

#### Match 7 — line 2042

```js
 1997:         await executeProjectAiCommand(projectName, {
 1998:           message: `Adapt this content brief to ${language} while preserving brand tone and campaign intent:\n\n${session.form.brief}`,
 1999:           route_target: "content-studio",
 2000:           actor: "content-studio"
 2001:         });
 2002:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation request sent for ${language}.`;
 2003:         syncVersionFromForm(session);
 2004:         session.draftMessage = `Translate/adapt request sent for ${language}.`;
 2005:       } catch (_) {
 2006:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: backend unavailable for ${language}; prompt-ready adaptation added.`;
 2007:         syncVersionFromForm(session);
 2008:         session.draftMessage = "Translate/adapt backend unavailable. Prompt-ready adaptation saved.";
 2009:       }
 2010:       rerender();
 2011:     };
 2012:   }
 2013: 
 2014:   const saveBtn = document.getElementById("contentSaveDraftBtn");
 2015:   if (saveBtn) {
 2016:     saveBtn.onclick = async () => {
 2017:       sync();
 2018:       if (!validateComposer(session, "save")) {
 2019:         rerender();
 2020:         return;
 2021:       }
 2022:       session.form.status = normalizeStatus(session.form.status || "draft", "draft");
 2023:       await persistContentRecord({ projectName, state, session, status: session.form.status, showMessage });
 2024:       rerender();
 2025:     };
 2026:   }
 2027: 
 2028:   const sendAiBtn = document.getElementById("contentSendAiBtn");
 2029:   if (sendAiBtn) {
 2030:     sendAiBtn.onclick = () => {
 2031:       sync();
 2032:       const selectedItem = selected();
 2033:       const prompt = buildAiPrompt(projectName, session, selectedItem);
 2034:       const aiDraft = {
 2035:         projectName,
 2036:         modeId: "content",
 2037:         lastCommand: prompt,
 2038:         lastResponseTitle: firstText(selectedItem?.title, session.form.title, "Content Draft"),
 2039:         routeSuggestions: []
 2040:       };
 2041:       setSharedAiDraft(projectName || "__default__", aiDraft);
 2042:       setSharedHandoff(projectName || "__default__", "ai-command", {
 2043:         source_page: "content-studio",
 2044:         destination_page: "ai-command",
 2045:         linked_entity: {
 2046:           entity_type: "content_item",
 2047:           entity_id: firstText(selectedItem?.id, session.formSourceId)
 2048:         },
 2049:         payload: {
 2050:           prompt,
 2051:           title: firstText(selectedItem?.title, session.form.title),
 2052:           content_item_id: firstText(selectedItem?.id, session.formSourceId),
 2053:           draft_context: aiDraft,
 2054:           content: buildContentPayload(session, session.form.status || "draft")
 2055:         },
 2056:         status: "available"
 2057:       });
 2058:       navigateTo("ai-command");
 2059:       showMessage?.("Content context sent to AI Command.");
 2060:     };
 2061:   }
 2062: 
 2063:   const sendMediaBtn = document.getElementById("contentSendMediaBtn");
 2064:   if (sendMediaBtn) {
 2065:     sendMediaBtn.onclick = async () => {
 2066:       sync();
 2067:       if (!validateComposer(session, "save")) {
 2068:         rerender();
 2069:         return;
 2070:       }
 2071:       const selectedItem = selected();
 2072:       const handoffPayload = buildMediaHandoff(projectName, session, selectedItem);
 2073:       const ok = await sendHandoff({
 2074:         projectName,
 2075:         handoff: handoffPayload,
 2076:         session,
 2077:         showMessage,
 2078:         failMessage: "Design brief kept locally because backend handoff save is unavailable.",
 2079:         successMessage: "Design brief sent to Media Studio.",
 2080:         localMessage: "Design brief prepared for Media Studio locally."
 2081:       });
 2082:       if (ok) {
 2083:         const selectedVersion = selectedVersionEntry(session);
 2084:         if (selectedVersion) {
 2085:           selectedVersion.readiness_status = "sent_to_media";
 2086:         }
 2087:         session.form.status = "sent_to_media";
```

#### Match 8 — line 2222

```js
 2177:           notes: `Regenerated from ${current.id}.`
 2178:         });
 2179:         session.form.brief = nextPrompt;
 2180:         session.form.status = "prompt_ready";
 2181:         session.draftMessage = "New prompt-ready version created.";
 2182:         await persistContentRecord({ projectName, state, session, status: "prompt_ready", showMessage });
 2183:       }
 2184: 
 2185:       if (action === "save-draft") {
 2186:         await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
 2187:         session.draftMessage = "Version saved as draft.";
 2188:       }
 2189: 
 2190:       if (action === "save-library") {
 2191:         await saveToLibrary({ projectName, session, selectedItem: selected(), showMessage, rerender });
 2192:         await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
 2193:       }
 2194: 
 2195:       rerender();
 2196:     };
 2197:   });
 2198: 
 2199:   Array.from(document.querySelectorAll("[data-content-agent-use], [data-content-agent-save], [data-content-agent-ai]")).forEach((button) => {
 2200:     button.onclick = async () => {
 2201:       const id = button.getAttribute("data-content-agent-use") || button.getAttribute("data-content-agent-save") || button.getAttribute("data-content-agent-ai") || "";
 2202:       const agent = WRITING_AGENTS.find((entry) => entry.id === id);
 2203:       if (!agent) return;
 2204: 
 2205:       session.form.brief = [agent.suggestedPrompt, session.form.brief].filter(Boolean).join("\n\n");
 2206:       syncVersionFromForm(session);
 2207:       session.draftMessage = `${agent.title} prompt added.`;
 2208: 
 2209:       if (button.hasAttribute("data-content-agent-save")) {
 2210:         await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || "draft", "draft"), showMessage });
 2211:       }
 2212: 
 2213:       if (button.hasAttribute("data-content-agent-ai")) {
 2214:         const prompt = buildAiPrompt(projectName, session, selected());
 2215:         const aiDraft = {
 2216:           projectName,
 2217:           modeId: "content",
 2218:           lastCommand: prompt,
 2219:           lastResponseTitle: `${agent.title} Assist`,
 2220:           routeSuggestions: []
 2221:         };
 2222:         setSharedAiDraft(projectName || "__default__", aiDraft);
 2223:         setSharedHandoff(projectName || "__default__", "ai-command", {
 2224:           source_page: "content-studio",
 2225:           destination_page: "ai-command",
 2226:           linked_entity: {
 2227:             entity_type: "content_item",
 2228:             entity_id: session.formSourceId || ""
 2229:           },
 2230:           payload: {
 2231:             prompt,
 2232:             title: `${agent.title} Assist`,
 2233:             draft_context: aiDraft,
 2234:             content: buildContentPayload(session, session.form.status || "draft")
 2235:           },
 2236:           status: "available"
 2237:         });
 2238:         navigateTo("ai-command");
 2239:         showMessage?.(`${agent.title} prompt sent to AI Command.`);
 2240:       }
 2241: 
 2242:       rerender();
 2243:     };
 2244:   });
 2245: }
 2246: 
 2247: export const contentStudioRoute = {
 2248:   id: "content-studio",
 2249:   disableStandardLayout: true,
 2250:   meta: {
 2251:     eyebrow: "Operations",
 2252:     title: "Content Studio",
 2253:     description: "Smart content production hub for draft generation, review, and routing to Media Studio and Publishing."
 2254:   },
 2255:   template: `
 2256:     <section class="page is-active" data-page="content-studio">
 2257:       <div id="contentStudioRoot"></div>
 2258:     </section>
 2259:   `,
 2260:   render({
 2261:     getState,
 2262:     $,
 2263:     escapeHtml,
 2264:     navigateTo,
 2265:     showMessage,
 2266:     showError
 2267:   }) {
```

#### Match 9 — line 2223

```js
 2178:         });
 2179:         session.form.brief = nextPrompt;
 2180:         session.form.status = "prompt_ready";
 2181:         session.draftMessage = "New prompt-ready version created.";
 2182:         await persistContentRecord({ projectName, state, session, status: "prompt_ready", showMessage });
 2183:       }
 2184: 
 2185:       if (action === "save-draft") {
 2186:         await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
 2187:         session.draftMessage = "Version saved as draft.";
 2188:       }
 2189: 
 2190:       if (action === "save-library") {
 2191:         await saveToLibrary({ projectName, session, selectedItem: selected(), showMessage, rerender });
 2192:         await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || current.readiness_status || "draft", "draft"), showMessage });
 2193:       }
 2194: 
 2195:       rerender();
 2196:     };
 2197:   });
 2198: 
 2199:   Array.from(document.querySelectorAll("[data-content-agent-use], [data-content-agent-save], [data-content-agent-ai]")).forEach((button) => {
 2200:     button.onclick = async () => {
 2201:       const id = button.getAttribute("data-content-agent-use") || button.getAttribute("data-content-agent-save") || button.getAttribute("data-content-agent-ai") || "";
 2202:       const agent = WRITING_AGENTS.find((entry) => entry.id === id);
 2203:       if (!agent) return;
 2204: 
 2205:       session.form.brief = [agent.suggestedPrompt, session.form.brief].filter(Boolean).join("\n\n");
 2206:       syncVersionFromForm(session);
 2207:       session.draftMessage = `${agent.title} prompt added.`;
 2208: 
 2209:       if (button.hasAttribute("data-content-agent-save")) {
 2210:         await persistContentRecord({ projectName, state, session, status: normalizeStatus(session.form.status || "draft", "draft"), showMessage });
 2211:       }
 2212: 
 2213:       if (button.hasAttribute("data-content-agent-ai")) {
 2214:         const prompt = buildAiPrompt(projectName, session, selected());
 2215:         const aiDraft = {
 2216:           projectName,
 2217:           modeId: "content",
 2218:           lastCommand: prompt,
 2219:           lastResponseTitle: `${agent.title} Assist`,
 2220:           routeSuggestions: []
 2221:         };
 2222:         setSharedAiDraft(projectName || "__default__", aiDraft);
 2223:         setSharedHandoff(projectName || "__default__", "ai-command", {
 2224:           source_page: "content-studio",
 2225:           destination_page: "ai-command",
 2226:           linked_entity: {
 2227:             entity_type: "content_item",
 2228:             entity_id: session.formSourceId || ""
 2229:           },
 2230:           payload: {
 2231:             prompt,
 2232:             title: `${agent.title} Assist`,
 2233:             draft_context: aiDraft,
 2234:             content: buildContentPayload(session, session.form.status || "draft")
 2235:           },
 2236:           status: "available"
 2237:         });
 2238:         navigateTo("ai-command");
 2239:         showMessage?.(`${agent.title} prompt sent to AI Command.`);
 2240:       }
 2241: 
 2242:       rerender();
 2243:     };
 2244:   });
 2245: }
 2246: 
 2247: export const contentStudioRoute = {
 2248:   id: "content-studio",
 2249:   disableStandardLayout: true,
 2250:   meta: {
 2251:     eyebrow: "Operations",
 2252:     title: "Content Studio",
 2253:     description: "Smart content production hub for draft generation, review, and routing to Media Studio and Publishing."
 2254:   },
 2255:   template: `
 2256:     <section class="page is-active" data-page="content-studio">
 2257:       <div id="contentStudioRoot"></div>
 2258:     </section>
 2259:   `,
 2260:   render({
 2261:     getState,
 2262:     $,
 2263:     escapeHtml,
 2264:     navigateTo,
 2265:     showMessage,
 2266:     showError
 2267:   }) {
 2268:     const state = getState();
```
### Button/action handlers

#### Match 1 — line 1147

```js
 1102:   ];
 1103: 
 1104:   return `
 1105:     <section class="card content-card">
 1106:       <div class="card-head">
 1107:         <div>
 1108:           <div class="setup-kicker">Smart Recommendation</div>
 1109:           <h3>${escapeHtml(recommendation.action)}</h3>
 1110:           <p class="content-copy">${escapeHtml(recommendation.why)}</p>
 1111:         </div>
 1112:         <span class="card-badge ${statusTone(normalizeStatus(selectedItem?.status || "draft", "draft"))}">${escapeHtml(titleCase(selectedItem?.status || "draft"))}</span>
 1113:       </div>
 1114:       <div class="content-impact-grid">
 1115:         ${chips.map(([label, value]) => `<span class="content-impact-chip"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(value)}</small></span>`).join("")}
 1116:       </div>
 1117:     </section>
 1118:   `;
 1119: }
 1120: 
 1121: function renderQueue(session, escapeHtml) {
 1122:   if (!session.items.length) {
 1123:     return `
 1124:       <section class="card content-card">
 1125:         <div class="card-head">
 1126:           <div>
 1127:             <div class="setup-kicker">Draft Queue</div>
 1128:             <h3>Saved content records</h3>
 1129:           </div>
 1130:         </div>
 1131:         <div class="empty-box">No drafts yet. Start from composer and save the first draft.</div>
 1132:       </section>
 1133:     `;
 1134:   }
 1135: 
 1136:   return `
 1137:     <section class="card content-card">
 1138:       <div class="card-head">
 1139:         <div>
 1140:           <div class="setup-kicker">Draft Queue</div>
 1141:           <h3>Saved content records</h3>
 1142:         </div>
 1143:         <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
```

#### Match 2 — line 1161

```js
 1116:       </div>
 1117:     </section>
 1118:   `;
 1119: }
 1120: 
 1121: function renderQueue(session, escapeHtml) {
 1122:   if (!session.items.length) {
 1123:     return `
 1124:       <section class="card content-card">
 1125:         <div class="card-head">
 1126:           <div>
 1127:             <div class="setup-kicker">Draft Queue</div>
 1128:             <h3>Saved content records</h3>
 1129:           </div>
 1130:         </div>
 1131:         <div class="empty-box">No drafts yet. Start from composer and save the first draft.</div>
 1132:       </section>
 1133:     `;
 1134:   }
 1135: 
 1136:   return `
 1137:     <section class="card content-card">
 1138:       <div class="card-head">
 1139:         <div>
 1140:           <div class="setup-kicker">Draft Queue</div>
 1141:           <h3>Saved content records</h3>
 1142:         </div>
 1143:         <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
```

#### Match 3 — line 1165

```js
 1120: 
 1121: function renderQueue(session, escapeHtml) {
 1122:   if (!session.items.length) {
 1123:     return `
 1124:       <section class="card content-card">
 1125:         <div class="card-head">
 1126:           <div>
 1127:             <div class="setup-kicker">Draft Queue</div>
 1128:             <h3>Saved content records</h3>
 1129:           </div>
 1130:         </div>
 1131:         <div class="empty-box">No drafts yet. Start from composer and save the first draft.</div>
 1132:       </section>
 1133:     `;
 1134:   }
 1135: 
 1136:   return `
 1137:     <section class="card content-card">
 1138:       <div class="card-head">
 1139:         <div>
 1140:           <div class="setup-kicker">Draft Queue</div>
 1141:           <h3>Saved content records</h3>
 1142:         </div>
 1143:         <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
```

#### Match 4 — line 1175

```js
 1130:         </div>
 1131:         <div class="empty-box">No drafts yet. Start from composer and save the first draft.</div>
 1132:       </section>
 1133:     `;
 1134:   }
 1135: 
 1136:   return `
 1137:     <section class="card content-card">
 1138:       <div class="card-head">
 1139:         <div>
 1140:           <div class="setup-kicker">Draft Queue</div>
 1141:           <h3>Saved content records</h3>
 1142:         </div>
 1143:         <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
```

#### Match 5 — line 1179

```js
 1134:   }
 1135: 
 1136:   return `
 1137:     <section class="card content-card">
 1138:       <div class="card-head">
 1139:         <div>
 1140:           <div class="setup-kicker">Draft Queue</div>
 1141:           <h3>Saved content records</h3>
 1142:         </div>
 1143:         <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
 1221:         <div class="setup-field-group">
 1222:           <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
 1223:           <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
 1224:         </div>
```

#### Match 6 — line 1184

```js
 1139:         <div>
 1140:           <div class="setup-kicker">Draft Queue</div>
 1141:           <h3>Saved content records</h3>
 1142:         </div>
 1143:         <span class="card-badge neutral">${escapeHtml(formatCount(session.items.length))} visible</span>
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
 1221:         <div class="setup-field-group">
 1222:           <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
 1223:           <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
 1224:         </div>
 1225:       </form>
 1226: 
 1227:       <div class="content-action-row">
 1228:         <button id="contentGenerateDraftBtn" class="btn btn-primary" type="button">Generate Draft</button>
 1229:         <button id="contentImproveBtn" class="btn btn-secondary" type="button">Improve</button>
```

#### Match 7 — line 1189

```js
 1144:       </div>
 1145:       <div class="content-queue-list">
 1146:         ${session.items.map((item) => `
 1147:           <button class="content-queue-item${item.id === session.selectedId ? " is-active" : ""}" type="button" data-content-select="${escapeHtml(item.id)}">
 1148:             <span class="content-queue-title">${escapeHtml(item.title || "Untitled")}</span>
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
 1221:         <div class="setup-field-group">
 1222:           <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
 1223:           <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
 1224:         </div>
 1225:       </form>
 1226: 
 1227:       <div class="content-action-row">
 1228:         <button id="contentGenerateDraftBtn" class="btn btn-primary" type="button">Generate Draft</button>
 1229:         <button id="contentImproveBtn" class="btn btn-secondary" type="button">Improve</button>
 1230:         <button id="contentTranslateBtn" class="btn btn-secondary" type="button">Translate / Adapt</button>
 1231:         <button id="contentSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
 1232:         <button id="contentSendMediaBtn" class="btn btn-secondary" type="button">Send Design Brief to Media Studio</button>
 1233:         <button id="contentSendPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
 1234:         <button id="contentSendAiBtn" class="btn btn-secondary" type="button">Open AI: Send Context to AI Workspace</button>
```

#### Match 8 — line 1194

```js
 1149:             <span class="content-queue-meta">${escapeHtml(modeLabel(item.mode))} • ${escapeHtml(item.channel || "channel")} • ${escapeHtml(item.source || "source")}</span>
 1150:             <span class="card-badge ${statusTone(item.status)}" style="margin-top:8px;display:inline-flex;">${escapeHtml(titleCase(item.status))}</span>
 1151:           </button>
 1152:         `).join("")}
 1153:       </div>
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
 1221:         <div class="setup-field-group">
 1222:           <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
 1223:           <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
 1224:         </div>
 1225:       </form>
 1226: 
 1227:       <div class="content-action-row">
 1228:         <button id="contentGenerateDraftBtn" class="btn btn-primary" type="button">Generate Draft</button>
 1229:         <button id="contentImproveBtn" class="btn btn-secondary" type="button">Improve</button>
 1230:         <button id="contentTranslateBtn" class="btn btn-secondary" type="button">Translate / Adapt</button>
 1231:         <button id="contentSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
 1232:         <button id="contentSendMediaBtn" class="btn btn-secondary" type="button">Send Design Brief to Media Studio</button>
 1233:         <button id="contentSendPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
 1234:         <button id="contentSendAiBtn" class="btn btn-secondary" type="button">Open AI: Send Context to AI Workspace</button>
 1235:       </div>
 1236: 
 1237:       ${handoff ? `<div class="simple-banner" style="margin-top:12px;">Inbound handoff from ${escapeHtml(titleCase(handoff.sourcePage || "workflow"))} is available below.</div>` : ""}
 1238:       ${session.draftMessage ? `<div class="simple-banner" style="margin-top:12px;">${escapeHtml(session.draftMessage)}</div>` : ""}
 1239:     </section>
```

#### Match 9 — line 1199

```js
 1154:     </section>
 1155:   `;
 1156: }
 1157: 
 1158: function renderComposer(session, state, handoff, escapeHtml) {
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
 1221:         <div class="setup-field-group">
 1222:           <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
 1223:           <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
 1224:         </div>
 1225:       </form>
 1226: 
 1227:       <div class="content-action-row">
 1228:         <button id="contentGenerateDraftBtn" class="btn btn-primary" type="button">Generate Draft</button>
 1229:         <button id="contentImproveBtn" class="btn btn-secondary" type="button">Improve</button>
 1230:         <button id="contentTranslateBtn" class="btn btn-secondary" type="button">Translate / Adapt</button>
 1231:         <button id="contentSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
 1232:         <button id="contentSendMediaBtn" class="btn btn-secondary" type="button">Send Design Brief to Media Studio</button>
 1233:         <button id="contentSendPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
 1234:         <button id="contentSendAiBtn" class="btn btn-secondary" type="button">Open AI: Send Context to AI Workspace</button>
 1235:       </div>
 1236: 
 1237:       ${handoff ? `<div class="simple-banner" style="margin-top:12px;">Inbound handoff from ${escapeHtml(titleCase(handoff.sourcePage || "workflow"))} is available below.</div>` : ""}
 1238:       ${session.draftMessage ? `<div class="simple-banner" style="margin-top:12px;">${escapeHtml(session.draftMessage)}</div>` : ""}
 1239:     </section>
 1240:   `;
 1241: }
 1242: 
 1243: function previewPost(content, escapeHtml) {
 1244:   return `
```

#### Match 10 — line 1204

```js
 1159:   const form = session.form;
 1160:   const modeTabs = CONTENT_MODES.map((mode) => `
 1161:     <button class="content-mode-tab${form.mode === mode ? " is-active" : ""}" type="button" data-content-mode="${escapeHtml(mode)}">${escapeHtml(modeLabel(mode))}</button>
 1162:   `).join("");
 1163: 
 1164:   return `
 1165:     <section class="card content-card" id="contentComposerPanel">
 1166:       <div class="card-head">
 1167:         <div>
 1168:           <div class="setup-kicker">Content Composer</div>
 1169:           <h3>Brief -> Draft -> Version -> Review -> Approve -> Send</h3>
 1170:         </div>
 1171:         <span class="card-badge ${statusTone(normalizeStatus(form.status || "draft", "draft"))}">${escapeHtml(titleCase(form.status || "draft"))}</span>
 1172:       </div>
 1173: 
 1174:       <div class="content-mode-tabs">${modeTabs}</div>
 1175:       <form id="contentComposerForm" class="content-composer-form">
 1176:         <div class="content-preview-grid">
 1177:           <div class="setup-field-group">
 1178:             <div class="setup-field-head"><label class="setup-label" for="contentProjectInput">Project</label></div>
 1179:             <input id="contentProjectInput" name="project" class="setup-input" type="text" value="${escapeHtml(form.project || "")}">
 1180:             ${fieldError(session, "project", escapeHtml)}
 1181:           </div>
 1182:           <div class="setup-field-group">
 1183:             <div class="setup-field-head"><label class="setup-label" for="contentCampaignInput">Campaign</label></div>
 1184:             <input id="contentCampaignInput" name="campaign" class="setup-input" type="text" value="${escapeHtml(form.campaign || "")}">
 1185:             ${fieldError(session, "campaign", escapeHtml)}
 1186:           </div>
 1187:           <div class="setup-field-group">
 1188:             <div class="setup-field-head"><label class="setup-label" for="contentProductInput">Product</label></div>
 1189:             <input id="contentProductInput" name="product" class="setup-input" type="text" value="${escapeHtml(form.product || "")}">
 1190:             ${fieldError(session, "product", escapeHtml)}
 1191:           </div>
 1192:           <div class="setup-field-group">
 1193:             <div class="setup-field-head"><label class="setup-label" for="contentChannelInput">Channel</label></div>
 1194:             <input id="contentChannelInput" name="channel" class="setup-input" type="text" value="${escapeHtml(form.channel || "")}">
 1195:             ${fieldError(session, "channel", escapeHtml)}
 1196:           </div>
 1197:           <div class="setup-field-group">
 1198:             <div class="setup-field-head"><label class="setup-label" for="contentLanguageInput">Language</label></div>
 1199:             <input id="contentLanguageInput" name="language" class="setup-input" type="text" value="${escapeHtml(form.language || "")}">
 1200:             ${fieldError(session, "language", escapeHtml)}
 1201:           </div>
 1202:           <div class="setup-field-group">
 1203:             <div class="setup-field-head"><label class="setup-label" for="contentToneInput">Tone</label></div>
 1204:             <input id="contentToneInput" name="tone" class="setup-input" type="text" value="${escapeHtml(form.tone || "")}">
 1205:             ${fieldError(session, "tone", escapeHtml)}
 1206:           </div>
 1207:         </div>
 1208: 
 1209:         <div class="setup-field-group">
 1210:           <div class="setup-field-head"><label class="setup-label" for="contentObjectiveInput">Objective</label></div>
 1211:           <input id="contentObjectiveInput" name="objective" class="setup-input" type="text" value="${escapeHtml(form.objective || "")}">
 1212:           ${fieldError(session, "objective", escapeHtml)}
 1213:         </div>
 1214: 
 1215:         <div class="setup-field-group">
 1216:           <div class="setup-field-head"><label class="setup-label" for="contentBriefInput">Main prompt / brief</label></div>
 1217:           <textarea id="contentBriefInput" name="brief" class="setup-input setup-textarea" rows="6">${escapeHtml(form.brief || "")}</textarea>
 1218:           ${fieldError(session, "brief", escapeHtml)}
 1219:         </div>
 1220: 
 1221:         <div class="setup-field-group">
 1222:           <div class="setup-field-head"><label class="setup-label" for="contentTitleInput">Draft title</label></div>
 1223:           <input id="contentTitleInput" name="title" class="setup-input" type="text" value="${escapeHtml(form.title || "")}">
 1224:         </div>
 1225:       </form>
 1226: 
 1227:       <div class="content-action-row">
 1228:         <button id="contentGenerateDraftBtn" class="btn btn-primary" type="button">Generate Draft</button>
 1229:         <button id="contentImproveBtn" class="btn btn-secondary" type="button">Improve</button>
 1230:         <button id="contentTranslateBtn" class="btn btn-secondary" type="button">Translate / Adapt</button>
 1231:         <button id="contentSaveDraftBtn" class="btn btn-secondary" type="button">Save Draft</button>
 1232:         <button id="contentSendMediaBtn" class="btn btn-secondary" type="button">Send Design Brief to Media Studio</button>
 1233:         <button id="contentSendPublishingBtn" class="btn btn-secondary" type="button">Send to Publishing</button>
 1234:         <button id="contentSendAiBtn" class="btn btn-secondary" type="button">Open AI: Send Context to AI Workspace</button>
 1235:       </div>
 1236: 
 1237:       ${handoff ? `<div class="simple-banner" style="margin-top:12px;">Inbound handoff from ${escapeHtml(titleCase(handoff.sourcePage || "workflow"))} is available below.</div>` : ""}
 1238:       ${session.draftMessage ? `<div class="simple-banner" style="margin-top:12px;">${escapeHtml(session.draftMessage)}</div>` : ""}
 1239:     </section>
 1240:   `;
 1241: }
 1242: 
 1243: function previewPost(content, escapeHtml) {
 1244:   return `
 1245:     <div class="content-preview-social">
 1246:       <div class="headline">Social Preview</div>
 1247:       <div class="content-text-box">${escapeHtml(content || "No social post body yet.")}</div>
 1248:     </div>
 1249:   `;
```
### Publishing/send labels

#### Match 1 — line 28

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
```

#### Match 2 — line 39

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
```

#### Match 3 — line 49

```js
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
```

#### Match 4 — line 50

```js
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
```

#### Match 5 — line 58

```js
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
```

#### Match 6 — line 66

```js
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
```

#### Match 7 — line 67

```js
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
```

#### Match 8 — line 86

```js
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
  119: 
  120: function asArray(value) {
  121:   return Array.isArray(value) ? value : [];
  122: }
  123: 
  124: function asObject(value) {
  125:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  126: }
  127: 
  128: function asString(value) {
  129:   if (value == null) return "";
  130:   return String(value);
  131: }
```

#### Match 9 — line 87

```js
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
  119: 
  120: function asArray(value) {
  121:   return Array.isArray(value) ? value : [];
  122: }
  123: 
  124: function asObject(value) {
  125:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  126: }
  127: 
  128: function asString(value) {
  129:   if (value == null) return "";
  130:   return String(value);
  131: }
  132: 
```

#### Match 10 — line 91

```js
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
  119: 
  120: function asArray(value) {
  121:   return Array.isArray(value) ? value : [];
  122: }
  123: 
  124: function asObject(value) {
  125:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  126: }
  127: 
  128: function asString(value) {
  129:   if (value == null) return "";
  130:   return String(value);
  131: }
  132: 
  133: function clean(value) {
  134:   return asString(value).trim();
  135: }
  136: 
```
### Confirmation gates

_No match found._

### Disabled/review-only safety copy

#### Match 1 — line 3

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
```

#### Match 2 — line 11

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
```

#### Match 3 — line 16

```js
    1: import {
    2:   createProjectApproval,
    3:   createProjectHandoff,
    4:   createProjectTask,
    5:   decideProjectApproval,
    6:   executeProjectAiCommand,
    7:   fetchProjectOperations,
    8:   listProjectApprovals,
    9:   listProjectContentItems,
   10:   listProjectEvents,
   11:   listProjectHandoffs,
   12:   listProjectTasks,
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
```

#### Match 4 — line 58

```js
   13:   saveProjectContentItem
   14: } from "../api.js";
   15: import { getAssetNextAction, renderAssetDependencyRows } from "../asset-library.js";
   16: import { getSharedHandoff, setSharedAiDraft, setSharedHandoff } from "../shared-context.js";
   17: 
   18: const contentStudioSessions = new Map();
   19: const CONTENT_LOCAL_DRAFTS_KEY = "mh-content-studio-local-drafts-v1";
   20: const CONTENT_LIBRARY_LOCAL_ASSETS_KEY = "mh-media-library-assets-v1";
   21: 
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
```

#### Match 5 — line 67

```js
   22: const CONTENT_MODES = [
   23:   "social-post",
   24:   "caption",
   25:   "reel-script",
   26:   "video-script",
   27:   "blog-draft",
   28:   "email",
   29:   "marketplace-copy",
   30:   "ad-copy"
   31: ];
   32: 
   33: const CONTENT_MODE_LABELS = {
   34:   "social-post": "Social Post",
   35:   caption: "Caption",
   36:   "reel-script": "Reel Script",
   37:   "video-script": "Video Script",
   38:   "blog-draft": "Blog Draft",
   39:   email: "Email",
   40:   "marketplace-copy": "Marketplace Copy",
   41:   "ad-copy": "Ad Copy"
   42: };
   43: 
   44: const CONTENT_STATUSES = [
   45:   "draft",
   46:   "prompt_ready",
   47:   "needs_review",
   48:   "approved",
   49:   "sent_to_media",
   50:   "sent_to_publishing"
   51: ];
   52: 
   53: const CONTENT_ROLE_DEFAULTS = {
   54:   serviceDomain: "content",
   55:   ownerRole: "writer",
   56:   reviewRole: "compliance_reviewer",
   57:   mediaRole: "designer",
   58:   handoffRole: "publisher"
   59: };
   60: 
   61: const WRITING_AGENTS = [
   62:   {
   63:     id: "content-strategist",
   64:     title: "Content Strategist",
   65:     purpose: "Plan message angles and format mix that moves campaign readiness quickly.",
   66:     bestUse: "When choosing what to write first across social, email, and marketplace.",
   67:     suggestedPrompt: "Act as Content Strategist. Build a priority content plan by channel with hooks, outcomes, and handoff order."
   68:   },
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
```

#### Match 6 — line 114

```js
   69:   {
   70:     id: "copywriter",
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
  119: 
  120: function asArray(value) {
  121:   return Array.isArray(value) ? value : [];
  122: }
  123: 
  124: function asObject(value) {
  125:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  126: }
  127: 
  128: function asString(value) {
  129:   if (value == null) return "";
  130:   return String(value);
  131: }
  132: 
  133: function clean(value) {
  134:   return asString(value).trim();
  135: }
  136: 
  137: function toKey(value) {
  138:   return clean(value).toLowerCase();
  139: }
  140: 
  141: function firstText(...values) {
  142:   for (const value of values) {
  143:     const text = clean(value);
  144:     if (text) return text;
  145:   }
  146:   return "";
  147: }
  148: 
  149: function titleCase(value) {
  150:   return asString(value)
  151:     .replace(/[_-]+/g, " ")
  152:     .replace(/\b\w/g, (match) => match.toUpperCase());
  153: }
  154: 
  155: function formatCount(value) {
  156:   const parsed = Number(value);
  157:   if (!Number.isFinite(parsed)) return "0";
  158:   return String(Math.max(0, Math.round(parsed)));
  159: }
```

#### Match 7 — line 116

```js
   71:     title: "Copywriter",
   72:     purpose: "Write concise, conversion-focused copy with clear value framing.",
   73:     bestUse: "When you need strong post copy, ad text, or direct-response messaging.",
   74:     suggestedPrompt: "Act as Copywriter. Produce high-conversion copy with a strong hook, body value stack, and clear CTA."
   75:   },
   76:   {
   77:     id: "seo-writer",
   78:     title: "SEO Writer",
   79:     purpose: "Draft discoverable long-form content with search intent alignment.",
   80:     bestUse: "When creating blog drafts and landing content for organic traffic.",
   81:     suggestedPrompt: "Act as SEO Writer. Produce an SEO-structured draft with intent match, metadata, headings, and semantic coverage."
   82:   },
   83:   {
   84:     id: "social-writer",
   85:     title: "Social Media Writer",
   86:     purpose: "Create channel-native posts with platform-fit pacing and style.",
   87:     bestUse: "When preparing Instagram, TikTok, Facebook, or YouTube text assets.",
   88:     suggestedPrompt: "Act as Social Media Writer. Write platform-native content variants with hook lines, scroll-stopping openings, and CTA endings."
   89:   },
   90:   {
   91:     id: "email-writer",
   92:     title: "Email Writer",
   93:     purpose: "Create subject, preheader, and body copy that improves open and click-through.",
   94:     bestUse: "When building campaign newsletters, launch emails, and promos.",
   95:     suggestedPrompt: "Act as Email Writer. Generate subject, preheader, and body with clear structure, benefit-led copy, and CTA clarity."
   96:   },
   97:   {
   98:     id: "script-writer",
   99:     title: "Script Writer",
  100:     purpose: "Turn ideas into scene-ready scripts with hooks, beats, and CTA flow.",
  101:     bestUse: "When creating reel/video scripts that will feed Media Studio production.",
  102:     suggestedPrompt: "Act as Script Writer. Create a short-form script with opening hook, scene beats, voiceover-friendly lines, and CTA close."
  103:   },
  104:   {
  105:     id: "marketplace-copywriter",
  106:     title: "Marketplace Copywriter",
  107:     purpose: "Write listing-optimized product copy for conversion and clarity.",
  108:     bestUse: "When drafting marketplace titles, bullets, and descriptions.",
  109:     suggestedPrompt: "Act as Marketplace Copywriter. Draft title, bullet points, and description focused on conversion while keeping product truth."
  110:   },
  111:   {
  112:     id: "brand-guardian",
  113:     title: "Brand Guardian",
  114:     purpose: "Validate tone, claims, and compliance before downstream handoffs.",
  115:     bestUse: "Before approval or sending drafts to Media Studio or Publishing.",
  116:     suggestedPrompt: "Act as Brand Guardian. Audit this draft for brand tone, claim risk, and handoff readiness."
  117:   }
  118: ];
  119: 
  120: function asArray(value) {
  121:   return Array.isArray(value) ? value : [];
  122: }
  123: 
  124: function asObject(value) {
  125:   return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  126: }
  127: 
  128: function asString(value) {
  129:   if (value == null) return "";
  130:   return String(value);
  131: }
  132: 
  133: function clean(value) {
  134:   return asString(value).trim();
  135: }
  136: 
  137: function toKey(value) {
  138:   return clean(value).toLowerCase();
  139: }
  140: 
  141: function firstText(...values) {
  142:   for (const value of values) {
  143:     const text = clean(value);
  144:     if (text) return text;
  145:   }
  146:   return "";
  147: }
  148: 
  149: function titleCase(value) {
  150:   return asString(value)
  151:     .replace(/[_-]+/g, " ")
  152:     .replace(/\b\w/g, (match) => match.toUpperCase());
  153: }
  154: 
  155: function formatCount(value) {
  156:   const parsed = Number(value);
  157:   if (!Number.isFinite(parsed)) return "0";
  158:   return String(Math.max(0, Math.round(parsed)));
  159: }
  160: 
  161: function nowIso() {
```

#### Match 8 — line 187

```js
  142:   for (const value of values) {
  143:     const text = clean(value);
  144:     if (text) return text;
  145:   }
  146:   return "";
  147: }
  148: 
  149: function titleCase(value) {
  150:   return asString(value)
  151:     .replace(/[_-]+/g, " ")
  152:     .replace(/\b\w/g, (match) => match.toUpperCase());
  153: }
  154: 
  155: function formatCount(value) {
  156:   const parsed = Number(value);
  157:   if (!Number.isFinite(parsed)) return "0";
  158:   return String(Math.max(0, Math.round(parsed)));
  159: }
  160: 
  161: function nowIso() {
  162:   return new Date().toISOString();
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function projectKey(projectName) {
  177:   return toKey(projectName) || "__default__";
  178: }
  179: 
  180: function normalizeStatus(value, fallback = "draft") {
  181:   const normalized = toKey(value);
  182:   if (!normalized) return fallback;
  183:   if (["draft"].includes(normalized)) return "draft";
  184:   if (["prompt_ready", "ready", "prompt ready"].includes(normalized)) return "prompt_ready";
  185:   if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  186:   if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  187:   if (["sent_to_media", "sent to media", "media_handoff", "media handoff"].includes(normalized)) return "sent_to_media";
  188:   if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
  189:   return fallback;
  190: }
  191: 
  192: function statusTone(status) {
  193:   if (["approved", "sent_to_media", "sent_to_publishing"].includes(status)) return "success";
  194:   if (["prompt_ready", "needs_review"].includes(status)) return "warning";
  195:   return "neutral";
  196: }
  197: 
  198: function modeLabel(mode) {
  199:   return CONTENT_MODE_LABELS[mode] || titleCase(mode || "social-post");
  200: }
  201: 
  202: function requestTypeForMode(mode) {
  203:   if (["reel-script", "video-script"].includes(mode)) return "script";
  204:   if (mode === "blog-draft") return "blog";
  205:   if (mode === "marketplace-copy") return "marketplace";
  206:   if (mode === "ad-copy") return "ad";
  207:   if (mode === "email") return "email";
  208:   return "social";
  209: }
  210: 
  211: function defaultForm(state, mode = "social-post") {
  212:   const context = asObject(state.context);
  213:   const overview = asObject(state.data.overview?.overview);
  214:   return {
  215:     mode,
  216:     project: firstText(context.currentProject, overview.project_name),
  217:     campaign: firstText(context.activeCampaign, overview.active_campaign),
  218:     product: firstText(overview.project_name, context.currentProject),
  219:     channel: "instagram",
  220:     language: "English",
  221:     tone: firstText(overview.brand_voice, "Premium, direct, clear"),
  222:     objective: firstText(overview.primary_goal, "Create conversion-ready content"),
  223:     brief: "",
  224:     title: "",
  225:     status: "draft"
  226:   };
  227: }
  228: 
  229: function readDraftMap() {
  230:   if (typeof window === "undefined") return {};
  231:   try {
  232:     const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LOCAL_DRAFTS_KEY) || "{}");
```

#### Match 9 — line 188

```js
  143:     const text = clean(value);
  144:     if (text) return text;
  145:   }
  146:   return "";
  147: }
  148: 
  149: function titleCase(value) {
  150:   return asString(value)
  151:     .replace(/[_-]+/g, " ")
  152:     .replace(/\b\w/g, (match) => match.toUpperCase());
  153: }
  154: 
  155: function formatCount(value) {
  156:   const parsed = Number(value);
  157:   if (!Number.isFinite(parsed)) return "0";
  158:   return String(Math.max(0, Math.round(parsed)));
  159: }
  160: 
  161: function nowIso() {
  162:   return new Date().toISOString();
  163: }
  164: 
  165: function formatDateTime(value) {
  166:   const date = new Date(value);
  167:   if (Number.isNaN(date.getTime())) return "Not recorded";
  168:   return new Intl.DateTimeFormat(undefined, {
  169:     month: "short",
  170:     day: "numeric",
  171:     hour: "numeric",
  172:     minute: "2-digit"
  173:   }).format(date);
  174: }
  175: 
  176: function projectKey(projectName) {
  177:   return toKey(projectName) || "__default__";
  178: }
  179: 
  180: function normalizeStatus(value, fallback = "draft") {
  181:   const normalized = toKey(value);
  182:   if (!normalized) return fallback;
  183:   if (["draft"].includes(normalized)) return "draft";
  184:   if (["prompt_ready", "ready", "prompt ready"].includes(normalized)) return "prompt_ready";
  185:   if (["needs_review", "needs review", "review", "pending_approval"].includes(normalized)) return "needs_review";
  186:   if (["approved", "complete", "completed"].includes(normalized)) return "approved";
  187:   if (["sent_to_media", "sent to media", "media_handoff", "media handoff"].includes(normalized)) return "sent_to_media";
  188:   if (["sent_to_publishing", "sent to publishing", "publishing_handoff", "publishing handoff"].includes(normalized)) return "sent_to_publishing";
  189:   return fallback;
  190: }
  191: 
  192: function statusTone(status) {
  193:   if (["approved", "sent_to_media", "sent_to_publishing"].includes(status)) return "success";
  194:   if (["prompt_ready", "needs_review"].includes(status)) return "warning";
  195:   return "neutral";
  196: }
  197: 
  198: function modeLabel(mode) {
  199:   return CONTENT_MODE_LABELS[mode] || titleCase(mode || "social-post");
  200: }
  201: 
  202: function requestTypeForMode(mode) {
  203:   if (["reel-script", "video-script"].includes(mode)) return "script";
  204:   if (mode === "blog-draft") return "blog";
  205:   if (mode === "marketplace-copy") return "marketplace";
  206:   if (mode === "ad-copy") return "ad";
  207:   if (mode === "email") return "email";
  208:   return "social";
  209: }
  210: 
  211: function defaultForm(state, mode = "social-post") {
  212:   const context = asObject(state.context);
  213:   const overview = asObject(state.data.overview?.overview);
  214:   return {
  215:     mode,
  216:     project: firstText(context.currentProject, overview.project_name),
  217:     campaign: firstText(context.activeCampaign, overview.active_campaign),
  218:     product: firstText(overview.project_name, context.currentProject),
  219:     channel: "instagram",
  220:     language: "English",
  221:     tone: firstText(overview.brand_voice, "Premium, direct, clear"),
  222:     objective: firstText(overview.primary_goal, "Create conversion-ready content"),
  223:     brief: "",
  224:     title: "",
  225:     status: "draft"
  226:   };
  227: }
  228: 
  229: function readDraftMap() {
  230:   if (typeof window === "undefined") return {};
  231:   try {
  232:     const parsed = JSON.parse(window.localStorage?.getItem(CONTENT_LOCAL_DRAFTS_KEY) || "{}");
  233:     return parsed && typeof parsed === "object" ? parsed : {};
```

#### Match 10 — line 498

```js
  453:   const versions = asArray(raw.content_versions || raw.output_versions || raw.versions)
  454:     .map((entry, index) => normalizeVersionEntry(entry, index))
  455:     .filter((entry) => entry.id);
  456:   if (versions.length) {
  457:     return {
  458:       selectedVersionId: versions[versions.length - 1].id,
  459:       compareMode: false,
  460:       compareNotes: "",
  461:       versions
  462:     };
  463:   }
  464:   return createVersioningState({
  465:     mode: firstText(raw.type, raw.mode, "social-post"),
  466:     prompt: firstText(raw.prompt, raw.brief),
  467:     outputContent: firstText(raw.draft),
  468:     language: firstText(raw.language, "English"),
  469:     tone: firstText(raw.tone),
  470:     channel: firstText(raw.channel),
  471:     readinessStatus: firstText(raw.status, "draft"),
  472:     approvalStatus: firstText(raw.approval_status, "draft")
  473:   });
  474: }
  475: 
  476: function normalizeContentItem(rawItem) {
  477:   const raw = asObject(rawItem);
  478:   const mode = firstText(raw.type, raw.content_type, raw.mode, "social-post");
  479:   return {
  480:     id: firstText(raw.id, raw.content_item_id),
  481:     title: firstText(raw.title, `${modeLabel(mode)} draft`),
  482:     mode: CONTENT_MODES.includes(mode) ? mode : "social-post",
  483:     project: firstText(raw.project, raw.project_name),
  484:     campaign: firstText(raw.campaign, raw.campaign_id, raw.campaign_name),
  485:     product: firstText(raw.product),
  486:     channel: firstText(raw.channel, raw.destination),
  487:     language: firstText(raw.language, "English"),
  488:     tone: firstText(raw.tone),
  489:     objective: firstText(raw.objective),
  490:     brief: firstText(raw.prompt, raw.brief),
  491:     draft: firstText(raw.draft, raw.body),
  492:     status: normalizeStatus(raw.status, "draft"),
  493:     approval_status: asString(raw.approval_status || "draft"),
  494:     destination: firstText(raw.destination, raw.publishing_destination),
  495:     notes: asArray(raw.notes),
  496:     linked_tasks: asArray(raw.linked_tasks),
  497:     linked_approvals: asArray(raw.linked_approvals),
  498:     linked_handoffs: asArray(raw.linked_handoffs),
  499:     content_versions: asArray(raw.content_versions || raw.output_versions || []),
  500:     source: firstText(raw.source, raw.localOnly ? "Local draft" : "Backend"),
  501:     localOnly: Boolean(raw.localOnly),
  502:     created_at: firstText(raw.created_at),
  503:     updated_at: firstText(raw.updated_at)
  504:   };
  505: }
  506: 
  507: function compareContentItems(a, b) {
  508:   const order = {
  509:     needs_review: 0,
  510:     approved: 1,
  511:     sent_to_media: 2,
  512:     sent_to_publishing: 3,
  513:     prompt_ready: 4,
  514:     draft: 5
  515:   };
  516:   const aOrder = order[a.status] ?? 99;
  517:   const bOrder = order[b.status] ?? 99;
  518:   if (aOrder !== bOrder) return aOrder - bOrder;
  519:   return (Date.parse(b.updated_at || b.created_at) || 0) - (Date.parse(a.updated_at || a.created_at) || 0);
  520: }
  521: 
  522: function mergeItems(backendItems, localItems) {
  523:   const backendIds = new Set(backendItems.map((item) => asString(item.id)));
  524:   return [
  525:     ...localItems.filter((item) => !backendIds.has(asString(item.id))),
  526:     ...backendItems
  527:   ].sort(compareContentItems);
  528: }
  529: 
  530: function ensureSession(projectName, state) {
  531:   const key = projectKey(projectName);
  532:   if (!contentStudioSessions.has(key)) {
  533:     contentStudioSessions.set(key, {
  534:       loaded: false,
  535:       loading: false,
  536:       error: "",
  537:       items: [],
  538:       tasks: [],
  539:       approvals: [],
  540:       handoffs: [],
  541:       events: [],
  542:       operations: null,
  543:       selectedId: "",
```
### Copy defect candidates

_No match found._


## Preliminary Verdict

| Area | Verdict |
|---|---|
| saveProjectContentItem calls | Found 1 - likely durable write, proof required |
| executeProjectAiCommand calls | Found 2 - generation/provider proof required |
| createProjectTask calls | Not found |
| createProjectHandoff calls | Found 2 - handoff write proof required |
| createProjectApproval calls | Not found |
| decideProjectApproval calls | Not found |
| Read-only API calls | Found 6 |
| Confirmation gates | Not found |
| Local storage writes | Not found |
| Shared context writes | Found 9 - route/handoff proof required |

## Decision Guidance
- If durable writes exist without confirmation, add minimal confirmation gates only after this proof.
- If AI generation executes provider/backend actions, require explicit confirmation or prove it is prompt/draft-only.
- If publish/send/schedule is route-only or handoff-only, document it.
- Do not patch from T51 alone unless the next step explicitly decides the minimal patch.
- Do not change CSS.
- Do not change backend authority.
- Do not change data/projects.
