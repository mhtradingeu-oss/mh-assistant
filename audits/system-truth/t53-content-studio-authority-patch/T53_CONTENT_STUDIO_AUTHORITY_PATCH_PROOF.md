# T53 — Content Studio Authority Patch Proof

## Status
Patch proof.

## Target
- `public/control-center/pages/content-studio-workspace.js`

## Purpose
Verify that T52 added explicit operator confirmation gates before sensitive Content Studio backend actions.

## Counts

| Area | Count |
|---|---:|
| confirmContentStudioAuthorityAction references | 6 |
| window.confirm / confirm references | 2 |
| saveProjectContentItem calls | 1 |
| createProjectHandoff calls | 2 |
| executeProjectAiCommand calls | 2 |

## Required Snippet Check

| Snippet | Present |
|---|---|
| Confirm Content Studio action | yes |
| Save backend content draft | yes |
| Create Library handoff | yes |
| Create Content Studio handoff | yes |
| Generate draft with AI backend | yes |
| Translate/adapt brief with AI backend | yes |
| This does not publish, send externally, or approve anything automatically. | yes |

## Evidence

### Confirmation helper

```js
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
  161: function confirmContentStudioAuthorityAction(action, detail = "") {
  162:   if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
  163: 
  164:   const message = [
  165:     `Confirm Content Studio action: ${action}`,
  166:     "",
  167:     detail || "This action may create or update backend Content Studio records, AI drafts, or handoffs.",
  168:     "",
  169:     "Authority: This does not publish, send externally, or approve anything automatically.",
  170:     "Select Cancel to review the draft, evidence, and destination before continuing."
  171:   ].join("\n");
  172: 
  173:   return window.confirm(message);
  174: }
  175: 
  176: function nowIso() {
  177:   return new Date().toISOString();
  178: }
  179: 
  180: function formatDateTime(value) {
  181:   const date = new Date(value);
  182:   if (Number.isNaN(date.getTime())) return "Not recorded";
  183:   return new Intl.DateTimeFormat(undefined, {
```

### Backend content save confirmation

```js
  687: function syncItemsWithLocalSave(session, projectName, payload) {
  688:   const saved = saveLocalDraft(projectName, payload);
  689:   const normalized = normalizeContentItem(saved);
  690:   session.items = mergeItems(
  691:     session.items.filter((item) => asString(item.id) !== asString(normalized.id)),
  692:     [normalized]
  693:   );
  694:   session.selectedId = normalized.id;
  695:   session.formSourceId = normalized.id;
  696:   return normalized;
  697: }
  698: 
  699: async function persistContentRecord({ projectName, state, session, status, showMessage }) {
  700:   const payload = buildContentPayload(session, status);
  701:   const localItem = syncItemsWithLocalSave(session, projectName, payload);
  702: 
  703:   if (!projectName) {
  704:     showMessage?.("Content draft saved locally.");
  705:     return localItem;
  706:   }
  707: 
  708:   if (!confirmContentStudioAuthorityAction(
  709:     "Save backend content draft",
  710:     `This will save or update a Content Studio draft for ${projectName}.`
  711:   )) {
  712:     showMessage?.("Backend content save cancelled.");
  713:     return localItem;
  714:   }
  715: 
  716:   try {
  717:     const result = await saveProjectContentItem(projectName, payload);
  718:     const backendItem = normalizeContentItem(result.content_item || payload);
  719:     session.items = mergeItems(
  720:       session.items.filter((item) => asString(item.id) !== asString(localItem.id)),
  721:       [backendItem]
  722:     );
  723:     session.selectedId = backendItem.id || localItem.id;
  724:     session.formSourceId = session.selectedId;
  725:     showMessage?.("Content draft saved.");
  726:     return backendItem;
  727:   } catch (_) {
  728:     showMessage?.("Backend content save unavailable; local draft kept.");
  729:     return localItem;
  730:   }
  731: }
```

### Library handoff confirmation

```js
 1698:       entity_id: firstText(selectedItem?.id, session.formSourceId),
 1699:       route: "content-studio",
 1700:       label: firstText(selectedItem?.title, session.form.title, "Content draft")
 1701:     },
 1702:     payload: {
 1703:       library_asset: libraryAsset,
 1704:       project: libraryAsset.project,
 1705:       campaign: libraryAsset.campaign,
 1706:       asset_type: libraryAsset.asset_type,
 1707:       content_type: libraryAsset.media_type
 1708:     },
 1709:     status: "available",
 1710:     actor: "content-studio"
 1711:   };
 1712: 
 1713:   setSharedHandoff(projectName || "__default__", "library", handoff);
 1714:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1715:     setSharedHandoff("__default__", "library", handoff);
 1716:   }
 1717: 
 1718:   if (projectName) {
 1719:     if (!confirmContentStudioAuthorityAction(
 1720:       "Create Library handoff",
 1721:       "This will create a backend handoff from Content Studio to Library for review and asset preparation."
 1722:     )) {
 1723:       showMessage?.("Library handoff cancelled.");
 1724:       return;
 1725:     }
 1726: 
 1727:     try {
 1728:       const result = await createProjectHandoff(projectName, handoff);
 1729:       const saved = asObject(result?.handoff);
 1730:       const handoffId = asString(saved.id || handoff.id);
 1731:       upsertLocalLibraryAsset(projectName, {
 1732:         ...libraryAsset,
 1733:         id: handoffId || libraryAsset.id,
 1734:         handoff_id: handoffId,
 1735:         local_only: false
 1736:       });
 1737:       selected.library_asset_ref = {
 1738:         handoff_id: handoffId,
 1739:         source_signature: signature,
 1740:         local_only: false,
 1741:         saved_at: nowIso()
 1742:       };
```

### Generic handoff confirmation

```js
 1762:       local_only: true
 1763:     });
 1764:     selected.library_asset_ref = {
 1765:       handoff_id: "",
 1766:       source_signature: signature,
 1767:       local_only: true,
 1768:       saved_at: nowIso()
 1769:     };
 1770:     showMessage?.("Content draft saved to Library (local handoff).");
 1771:   }
 1772: 
 1773:   session.validation = { ...session.validation, version: "" };
 1774: }
 1775: 
 1776: async function sendHandoff({ projectName, handoff, session, showMessage, failMessage, successMessage, localMessage }) {
 1777:   setSharedHandoff(projectName || "__default__", handoff.destination_page, handoff);
 1778:   if (!clean(projectName) || toKey(projectName) === "workspace") {
 1779:     setSharedHandoff("__default__", handoff.destination_page, handoff);
 1780:   }
 1781: 
 1782:   if (projectName) {
 1783:     if (!confirmContentStudioAuthorityAction(
 1784:       "Create Content Studio handoff",
 1785:       `This will create a backend handoff to ${handoff.destination_page || "the selected workspace"} for review.`
 1786:     )) {
 1787:       showMessage?.("Content Studio handoff cancelled.");
 1788:       return false;
 1789:     }
 1790: 
 1791:     try {
 1792:       await createProjectHandoff(projectName, handoff);
 1793:       showMessage?.(successMessage);
 1794:       return true;
 1795:     } catch (_) {
 1796:       showMessage?.(failMessage);
 1797:       return false;
 1798:     }
 1799:   }
 1800: 
 1801:   showMessage?.(localMessage);
 1802:   return true;
 1803: }
 1804: 
 1805: function buildAssetGate(state, escapeHtml) {
 1806:   const keys = ["brand_guideline", "product_csv", "product_photos", "product_videos", "testimonials_reviews", "legal_doc"];
```

### Generate draft AI confirmation

```js
 1904:         notes: `Loaded from ${titleCase(handoff.sourcePage || "handoff")}.`
 1905:       });
 1906:       session.draftMessage = "Handoff loaded into composer.";
 1907:       rerender();
 1908:     };
 1909:   }
 1910: 
 1911:   const generateBtn = document.getElementById("contentGenerateDraftBtn");
 1912:   if (generateBtn) {
 1913:     generateBtn.onclick = async () => {
 1914:       sync();
 1915:       if (!validateComposer(session, "generate")) {
 1916:         rerender();
 1917:         return;
 1918:       }
 1919: 
 1920:       const promptUsed = clean(session.form.brief);
 1921:       session.form.status = "prompt_ready";
 1922:       session.draftMessage = "Draft is prompt-ready.";
 1923: 
 1924:       if (projectName) {
 1925:         if (!confirmContentStudioAuthorityAction(
 1926:           "Generate draft with AI backend",
 1927:           "This will send the current brief to the AI command backend and create a review draft inside Content Studio."
 1928:         )) {
 1929:           session.draftMessage = "AI draft generation cancelled.";
 1930:           rerender();
 1931:           return;
 1932:         }
 1933: 
 1934:         try {
 1935:           const aiResult = await executeProjectAiCommand(projectName, {
 1936:             message: buildAiPrompt(projectName, session, selected()),
 1937:             route_target: "content-studio",
 1938:             actor: "content-studio"
 1939:           });
 1940:           const generatedText = firstText(
 1941:             aiResult?.response?.answer,
 1942:             aiResult?.response?.summary,
 1943:             aiResult?.response?.content,
 1944:             aiResult?.summary
 1945:           );
 1946: 
 1947:           if (clean(generatedText)) {
 1948:             appendVersion(session, {
```

### Translate/adapt AI confirmation

```js
 2023:   }
 2024: 
 2025:   const translateBtn = document.getElementById("contentTranslateBtn");
 2026:   if (translateBtn) {
 2027:     translateBtn.onclick = async () => {
 2028:       sync();
 2029:       if (!clean(session.form.brief)) {
 2030:         session.validation = { ...session.validation, brief: "Main prompt / brief is required." };
 2031:         rerender();
 2032:         return;
 2033:       }
 2034: 
 2035:       const language = clean(session.form.language || "English");
 2036:       if (!projectName) {
 2037:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: Local mode only. Translate/adapt target language = ${language}.`;
 2038:         syncVersionFromForm(session);
 2039:         session.draftMessage = "Translate/adapt prepared in local mode.";
 2040:         rerender();
 2041:         return;
 2042:       }
 2043: 
 2044:       if (!confirmContentStudioAuthorityAction(
 2045:         "Translate/adapt brief with AI backend",
 2046:         `This will send the current Content Studio brief to the AI command backend for ${language} adaptation.`
 2047:       )) {
 2048:         session.draftMessage = "Translate/adapt request cancelled.";
 2049:         rerender();
 2050:         return;
 2051:       }
 2052: 
 2053:       try {
 2054:         await executeProjectAiCommand(projectName, {
 2055:           message: `Adapt this content brief to ${language} while preserving brand tone and campaign intent:\n\n${session.form.brief}`,
 2056:           route_target: "content-studio",
 2057:           actor: "content-studio"
 2058:         });
 2059:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation request sent for ${language}.`;
 2060:         syncVersionFromForm(session);
 2061:         session.draftMessage = `Translate/adapt request sent for ${language}.`;
 2062:       } catch (_) {
 2063:         session.form.brief = `${clean(session.form.brief)}\n\nAdaptation note: backend unavailable for ${language}; prompt-ready adaptation added.`;
 2064:         syncVersionFromForm(session);
 2065:         session.draftMessage = "Translate/adapt backend unavailable. Prompt-ready adaptation saved.";
 2066:       }
 2067:       rerender();
```


## Verdict
Patch proof complete. All sensitive Content Studio backend write/generation/handoff paths have explicit confirmation copy.

## What Changed
- Added one Content Studio confirmation helper.
- Added confirmation before backend content save.
- Added confirmation before backend Library handoff.
- Added confirmation before generic backend Content Studio handoff.
- Added confirmation before AI draft generation.
- Added confirmation before AI translate/adapt request.

## What Did Not Change
- No CSS changed.
- No backend code changed.
- No data/projects changed.
- No route behavior changed.
- No direct publishing/sending/approval was added.
