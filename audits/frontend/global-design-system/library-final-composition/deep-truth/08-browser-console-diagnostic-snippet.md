# Browser Console Diagnostic Snippet

Run this in the browser console while Library page is open.

```js
(() => {
  const root = document.querySelector('[data-page="library"]') || document.body;
  const workspace = document.getElementById("libraryAssetWorkspace");
  const dropZone = document.getElementById("libraryDropZone");
  const requiredButtons = [...document.querySelectorAll("[data-library-required-action]")];

  return {
    page: location.hash,
    hasRoot: !!root,
    hasWorkspace: !!workspace,
    hasDropZone: !!dropZone,
    requiredButtons: requiredButtons.map((btn) => ({
      text: btn.textContent.trim(),
      action: btn.getAttribute("data-library-required-action"),
      key: btn.getAttribute("data-library-required-key"),
      uploadType: btn.getAttribute("data-library-upload-type")
    })),
    documentScrollY: window.scrollY,
    scrollContainers: [...document.querySelectorAll("*")]
      .filter((el) => {
        const s = getComputedStyle(el);
        return /(auto|scroll)/.test(`${s.overflow} ${s.overflowY} ${s.overflowX}`) && el.scrollHeight > el.clientHeight;
      })
      .slice(0, 20)
      .map((el) => ({
        tag: el.tagName,
        id: el.id,
        className: String(el.className || ""),
        scrollTop: el.scrollTop,
        clientHeight: el.clientHeight,
        scrollHeight: el.scrollHeight
      }))
  };
})();

