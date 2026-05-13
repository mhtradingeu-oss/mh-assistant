/**
 * Lifecycle Registry
 * 
 * Provides a safe, reusable registry for managing frontend listeners and timers.
 * Enables pages to register cleanup handlers and ensures proper cleanup on route transitions.
 * 
 * This is a transient UX cleanup mechanism only.
 * Backend authority (orchestrator-service) remains unchanged.
 * 
 * Example:
 * 
 *   const registry = createLifecycleRegistry('page-library');
 *   registry.addEventListener(document, 'click', handleClick);
 *   registry.addTimeout(() => console.log('cleanup'), 5000);
 *   registry.addDisposer(() => console.log('custom cleanup'));
 *   
 *   // Later, when page closes or route changes:
 *   registry.cleanup();  // removes all listeners, clears timers, runs disposers
 */

/**
 * Create a new lifecycle registry instance.
 * 
 * @param {string|object} nameOrOptions - Registry name (string) or options object {name, debug}
 * @returns {object} Registry with addEventListener, addTimeout, addInterval, addAnimationFrame, 
 *                   addDisposer, cleanup, size, isCleanedUp, getErrors
 */
function createLifecycleRegistry(nameOrOptions = 'lifecycle-registry') {
  // Parse options
  const options = typeof nameOrOptions === 'string' 
    ? { name: nameOrOptions, debug: false }
    : { name: 'lifecycle-registry', debug: false, ...nameOrOptions };

  // Private state
  const listeners = [];      // {target, type, handler, options, disposer}
  const timers = [];         // {id, type}
  const frames = [];         // {id}
  const disposers = [];      // {fn, run}
  const errors = [];         // {error, phase, handler}
  
  let isCleanedUpFlag = false;

  // No-op disposer for invalid targets/handlers
  const noopDisposer = () => {};

  // Validate target
  function isValidEventTarget(target) {
    return target && (
      typeof target.addEventListener === 'function' ||
      typeof target.addListener === 'function'
    );
  }

  // Validate handler
  function isValidHandler(handler) {
    return typeof handler === 'function';
  }

  // Registry API
  const registry = {
    /**
     * Add event listener with automatic cleanup on registry cleanup.
     * @param {EventTarget} target - DOM element, document, window, or similar
     * @param {string} type - Event type (e.g., 'click', 'resize')
     * @param {function} handler - Event handler function
     * @param {object} options - addEventListener options (capture, once, passive, etc.)
     * @returns {function} Disposer function for manual removal before cleanup
     */
    addEventListener(target, type, handler, options = {}) {
      // If already cleaned up, return no-op
      if (isCleanedUpFlag) {
        return noopDisposer;
      }

      // Validate target and handler
      if (!isValidEventTarget(target)) {
        if (options.debug) {
          console.warn(
            `[${options.name}] addEventListener: invalid target`,
            { target, type, handler: handler.name || 'anonymous' }
          );
        }
        return noopDisposer;
      }

      if (!isValidHandler(handler)) {
        if (options.debug) {
          console.warn(
            `[${options.name}] addEventListener: invalid handler for type ${type}`
          );
        }
        return noopDisposer;
      }

      // Create disposer
      const disposer = () => {
        try {
          if (target && typeof target.removeEventListener === 'function') {
            target.removeEventListener(type, handler, options);
          }
        } catch (err) {
          errors.push({
            error: err,
            phase: 'listener-disposal',
            context: type
          });
        }
      };

      // Store listener
      listeners.push({
        target,
        type,
        handler,
        options,
        disposer
      });

      // Attach listener
      try {
        target.addEventListener(type, handler, options);
      } catch (err) {
        errors.push({
          error: err,
          phase: 'addEventListener',
          context: type
        });
        return noopDisposer;
      }

      return disposer;
    },

    /**
     * Add timeout with automatic cleanup.
     * @param {function} callback - Callback function
     * @param {number} delay - Delay in milliseconds
     * @returns {function} Disposer function
     */
    addTimeout(callback, delay) {
      // If already cleaned up, return no-op
      if (isCleanedUpFlag) {
        return noopDisposer;
      }

      // Validate callback
      if (!isValidHandler(callback)) {
        if (options.debug) {
          console.warn(`[${options.name}] addTimeout: invalid callback`);
        }
        return noopDisposer;
      }

      const id = setTimeout(callback, delay);
      timers.push({ id, type: 'timeout' });

      return () => {
        if (id !== null && id !== undefined) {
          clearTimeout(id);
        }
      };
    },

    /**
     * Add interval with automatic cleanup.
     * @param {function} callback - Callback function
     * @param {number} delay - Interval delay in milliseconds
     * @returns {function} Disposer function
     */
    addInterval(callback, delay) {
      // If already cleaned up, return no-op
      if (isCleanedUpFlag) {
        return noopDisposer;
      }

      // Validate callback
      if (!isValidHandler(callback)) {
        if (options.debug) {
          console.warn(`[${options.name}] addInterval: invalid callback`);
        }
        return noopDisposer;
      }

      const id = setInterval(callback, delay);
      timers.push({ id, type: 'interval' });

      return () => {
        if (id !== null && id !== undefined) {
          clearInterval(id);
        }
      };
    },

    /**
     * Add animation frame callback with automatic cleanup.
     * @param {function} callback - Callback function
     * @returns {function} Disposer function
     */
    addAnimationFrame(callback) {
      // If already cleaned up, return no-op
      if (isCleanedUpFlag) {
        return noopDisposer;
      }

      // Validate callback
      if (!isValidHandler(callback)) {
        if (options.debug) {
          console.warn(`[${options.name}] addAnimationFrame: invalid callback`);
        }
        return noopDisposer;
      }

      const id = requestAnimationFrame(callback);
      frames.push({ id });

      return () => {
        if (id !== null && id !== undefined) {
          cancelAnimationFrame(id);
        }
      };
    },

    /**
     * Add a custom disposer function to run on cleanup.
     * Useful for custom cleanup logic beyond listeners/timers.
     * @param {function} disposer - Function to run during cleanup
     * @returns {function} Disposer function
     */
    addDisposer(disposer) {
      // If already cleaned up, run immediately
      if (isCleanedUpFlag) {
        if (isValidHandler(disposer)) {
          try {
            disposer();
          } catch (err) {
            errors.push({
              error: err,
              phase: 'disposer-post-cleanup',
              context: 'custom'
            });
          }
        }
        return noopDisposer;
      }

      // Validate disposer
      if (!isValidHandler(disposer)) {
        if (options.debug) {
          console.warn(`[${options.name}] addDisposer: invalid disposer function`);
        }
        return noopDisposer;
      }

      disposers.push({ fn: disposer, run: false });

      return () => {
        // Manual pre-cleanup disposer execution (idempotent)
        const idx = disposers.findIndex(d => d.fn === disposer);
        if (idx >= 0) {
          const entry = disposers[idx];
          if (!entry.run) {
            entry.run = true;
            try {
              disposer();
            } catch (err) {
              errors.push({
                error: err,
                phase: 'disposer-manual',
                context: 'custom'
              });
            }
          }
        }
      };
    },

    /**
     * Clean up all listeners, timers, animation frames, and run disposers.
     * Idempotent: safe to call multiple times.
     */
    cleanup() {
      // Early exit if already cleaned up
      if (isCleanedUpFlag) {
        return;
      }

      isCleanedUpFlag = true;

      // Remove all event listeners
      for (const listener of listeners) {
        try {
          listener.disposer();
        } catch (err) {
          errors.push({
            error: err,
            phase: 'cleanup-listeners',
            context: listener.type
          });
        }
      }
      listeners.length = 0;

      // Clear all timers
      for (const timer of timers) {
        try {
          if (timer.type === 'timeout') {
            clearTimeout(timer.id);
          } else if (timer.type === 'interval') {
            clearInterval(timer.id);
          }
        } catch (err) {
          errors.push({
            error: err,
            phase: 'cleanup-timers',
            context: timer.type
          });
        }
      }
      timers.length = 0;

      // Cancel animation frames
      for (const frame of frames) {
        try {
          cancelAnimationFrame(frame.id);
        } catch (err) {
          errors.push({
            error: err,
            phase: 'cleanup-frames',
            context: 'animationFrame'
          });
        }
      }
      frames.length = 0;

      // Run all disposers
      for (const disposer of disposers) {
        try {
          if (!disposer.run) {
            disposer.run = true;
            disposer.fn();
          }
        } catch (err) {
          errors.push({
            error: err,
            phase: 'cleanup-disposers',
            context: 'custom'
          });
        }
      }
      disposers.length = 0;
    },

    /**
     * Get the current count of registered items.
     * @returns {number} Total count of listeners + timers + frames + disposers
     */
    size() {
      return listeners.length + timers.length + frames.length + disposers.length;
    },

    /**
     * Check if registry has been cleaned up.
     * After cleanup, the registry will not add new active listeners/timers.
     * @returns {boolean} True if cleanup() has been called
     */
    isCleanedUp() {
      return isCleanedUpFlag;
    },

    /**
     * Get cleanup errors that occurred during cleanup operations.
     * @returns {array} Array of error objects {error, phase, context}
     */
    getErrors() {
      return [...errors];
    }
  };

  return registry;
}

/**
 * Create a no-op lifecycle registry.
 * Useful for testing or when lifecycle management is not needed.
 * All operations return no-op disposers.
 * 
 * @returns {object} No-op registry with same API as createLifecycleRegistry
 */
function createNoopLifecycleRegistry() {
  const noopFn = () => {};

  return {
    addEventListener: () => noopFn,
    addTimeout: () => noopFn,
    addInterval: () => noopFn,
    addAnimationFrame: () => noopFn,
    addDisposer: () => noopFn,
    cleanup: () => {},
    size: () => 0,
    isCleanedUp: () => false,
    getErrors: () => []
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createLifecycleRegistry,
    createNoopLifecycleRegistry
  };
}

export { createLifecycleRegistry, createNoopLifecycleRegistry };
