import { createLifecycleRegistry } from "../../runtime/lifecycle/lifecycle-registry.js";

export function createListenerRegistry() {
  // Runtime cleanup plumbing only. Backend authority remains unchanged.
  const registry = createLifecycleRegistry("library-listeners");

  function add(target, type, handler, options) {
    return registry.addEventListener(target, type, handler, options);
  }

  function disposeAll() {
    const errorCountBefore = registry.getErrors().length;
    registry.cleanup();
    const cleanupErrors = registry.getErrors().slice(errorCountBefore);
    cleanupErrors.forEach((entry) => {
      console.warn("[Library] listener dispose failed", entry.error);
    });
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

  const documentClickHandlers = Array.isArray(handlers.onDocumentClickHandlers)
    ? handlers.onDocumentClickHandlers
    : [];

  documentClickHandlers
    .filter((handler) => typeof handler === "function")
    .forEach((handler) => {
      registry.add(documentRef, "click", handler);
    });

  const beforeUnloadHandlers = Array.isArray(handlers.onBeforeUnloadHandlers)
    ? handlers.onBeforeUnloadHandlers
    : [];

  beforeUnloadHandlers
    .filter((handler) => typeof handler === "function")
    .forEach((handler) => {
      registry.add(windowRef, "beforeunload", handler);
    });

  if (windowRef && typeof handlers.onBeforeUnload === "function") {
    registry.add(windowRef, "beforeunload", handlers.onBeforeUnload);
  }

  return () => registry.disposeAll();
}
