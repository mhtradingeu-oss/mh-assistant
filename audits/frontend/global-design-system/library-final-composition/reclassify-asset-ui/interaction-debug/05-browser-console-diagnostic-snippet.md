# 05 — Runtime Browser Console Diagnostic Snippet

Paste this in browser console while on:

http://127.0.0.1:3000/control-center/#library

```js
(() => {
  const panel = document.querySelector("[data-library-action-panel]");
  const details = document.querySelector(".library-panel-move-details");
  const summary = document.querySelector(".library-panel-move-details summary");
  const grid = document.querySelector(".library-panel-choice-grid");
  const buttons = [...document.querySelectorAll("[data-library-reclassify]")];

  function rect(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top),
      left: Math.round(r.left),
      width: Math.round(r.width),
      height: Math.round(r.height),
      bottom: Math.round(r.bottom),
      right: Math.round(r.right)
    };
  }

  function style(el) {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      display: s.display,
      visibility: s.visibility,
      opacity: s.opacity,
      pointerEvents: s.pointerEvents,
      position: s.position,
      zIndex: s.zIndex,
      overflow: s.overflow,
      overflowY: s.overflowY,
      overflowX: s.overflowX
    };
  }

  const summaryRect = summary?.getBoundingClientRect();
  const centerX = summaryRect ? summaryRect.left + summaryRect.width / 2 : 0;
  const centerY = summaryRect ? summaryRect.top + summaryRect.height / 2 : 0;
  const topElement = summaryRect ? document.elementFromPoint(centerX, centerY) : null;

  const beforeOpen = details?.open;
  if (details) details.open = !details.open;
  const afterManualToggle = details?.open;
  if (details) details.open = beforeOpen || false;

  return {
    exists: {
      panel: !!panel,
      details: !!details,
      summary: !!summary,
      grid: !!grid,
      buttons: buttons.length
    },
    openState: {
      beforeOpen,
      afterManualToggle,
      restoredOpen: details?.open
    },
    rects: {
      panel: rect(panel),
      details: rect(details),
      summary: rect(summary),
      grid: rect(grid)
    },
    styles: {
      panel: style(panel),
      details: style(details),
      summary: style(summary),
      grid: style(grid),
      topElement: style(topElement)
    },
    hitTest: {
      centerX: Math.round(centerX),
      centerY: Math.round(centerY),
      topElementTag: topElement?.tagName,
      topElementId: topElement?.id,
      topElementClass: String(topElement?.className || ""),
      topElementText: String(topElement?.textContent || "").trim().slice(0, 120),
      summaryIsTopElement: topElement === summary,
      summaryContainsTopElement: summary?.contains(topElement),
      topElementContainsSummary: topElement?.contains?.(summary)
    },
    buttons: buttons.map((button) => ({
      text: button.textContent.trim(),
      target: button.getAttribute("data-target-asset-type"),
      disabled: button.disabled,
      ariaDisabled: button.getAttribute("aria-disabled"),
      rect: rect(button),
      style: style(button)
    }))
  };
})();
```
