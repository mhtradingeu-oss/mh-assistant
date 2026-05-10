export function createListenerRegistry() {
  const disposers = [];

  function add(target, type, handler, options) {
    if (!target || typeof target.addEventListener !== "function" || typeof handler !== "function") {
      return () => {};
    }

    target.addEventListener(type, handler, options);

    const dispose = () => {
      target.removeEventListener(type, handler, options);
    };

    disposers.push(dispose);
    return dispose;
  }

  function disposeAll() {
    while (disposers.length) {
      const dispose = disposers.pop();
      try {
        dispose();
      } catch (error) {
        console.warn("[Library] listener dispose failed", error);
      }
    }
  }

  return {
    add,
    disposeAll
  };
}

export function mountLibraryListeners({ root, documentRef = document, windowRef = window, handlers = {} } = {}) {
  const registry = createListenerRegistry();

  if (root && typeof handlers.onRootClick === "function") {
    registry.add(root, "click", handlers.onRootClick);
  }

  if (documentRef && typeof handlers.onDocumentClick === "function") {
    registry.add(documentRef, "click", handlers.onDocumentClick);
  }

  if (windowRef && typeof handlers.onBeforeUnload === "function") {
    registry.add(windowRef, "beforeunload", handlers.onBeforeUnload);
  }

  return () => registry.disposeAll();
}
