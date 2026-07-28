'use strict';

const LIFECYCLE_STATES = Object.freeze({
  DISABLED: 'DISABLED',
  UNINITIALIZED: 'UNINITIALIZED',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  DEGRADED: 'DEGRADED',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED',
});

const VALID_TRANSITIONS = Object.freeze({
  DISABLED: Object.freeze(['DISABLED']),
  UNINITIALIZED: Object.freeze(['INITIALIZING', 'CLOSING']),
  INITIALIZING: Object.freeze(['READY', 'FAILED']),
  READY: Object.freeze(['DEGRADED', 'CLOSING']),
  DEGRADED: Object.freeze(['READY', 'CLOSING']),
  FAILED: Object.freeze(['CLOSING']),
  CLOSING: Object.freeze(['CLOSED']),
  CLOSED: Object.freeze([]),
});

class PostgreSQLPoolLifecycleError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PostgreSQLPoolLifecycleError';
    this.code = code;
  }
}

function freeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value)) {
    freeze(child);
  }

  return Object.freeze(value);
}

function validateDependencies(dependencies) {
  if (
    !dependencies
    || typeof dependencies.constructPool !== 'function'
    || typeof dependencies.scheduleTimeout !== 'function'
    || typeof dependencies.clearTimeout !== 'function'
    || typeof dependencies.now !== 'function'
  ) {
    throw new PostgreSQLPoolLifecycleError(
      'DATABASE_POOL_INITIALIZATION_FAILED',
      'PostgreSQL Pool lifecycle dependencies are invalid',
    );
  }

  return dependencies;
}

function validateRuntimeOptions(runtimeOptions) {
  if (
    !runtimeOptions
    || typeof runtimeOptions !== 'object'
    || typeof runtimeOptions.host !== 'string'
    || runtimeOptions.host.trim() === ''
    || !Number.isSafeInteger(runtimeOptions.port)
    || typeof runtimeOptions.database !== 'string'
    || runtimeOptions.database.trim() === ''
    || typeof runtimeOptions.user !== 'string'
    || runtimeOptions.user.trim() === ''
    || typeof runtimeOptions.password !== 'string'
    || runtimeOptions.password === ''
    || !Number.isSafeInteger(runtimeOptions.max)
    || !Object.hasOwn(runtimeOptions, 'ssl')
  ) {
    throw new PostgreSQLPoolLifecycleError(
      'DATABASE_POOL_OPTIONS_INVALID',
      'PostgreSQL runtime Pool options are invalid',
    );
  }

  return runtimeOptions;
}

function createPostgreSQLPoolLifecycleOwner(options = {}) {
  const enabled = options.enabled !== false;
  const dependencies = validateDependencies(options.dependencies);

  const shutdownTimeoutMs = Number.isSafeInteger(options.shutdownTimeoutMs)
    && options.shutdownTimeoutMs >= 100
    && options.shutdownTimeoutMs <= 60000
    ? options.shutdownTimeoutMs
    : 5000;

  let state = enabled
    ? LIFECYCLE_STATES.UNINITIALIZED
    : LIFECYCLE_STATES.DISABLED;

  let pool = null;
  let initializationPromise = null;
  let shutdownPromise = null;
  let lastErrorCode = null;
  let initializedAt = null;
  let closedAt = null;

  function transition(nextState) {
    const permitted = VALID_TRANSITIONS[state] || [];

    if (!permitted.includes(nextState)) {
      throw new PostgreSQLPoolLifecycleError(
        'DATABASE_AUTHORITY_STATE_INVALID',
        `Invalid PostgreSQL authority transition from ${state} to ${nextState}`,
      );
    }

    state = nextState;
  }

  function getHealth() {
    return freeze({
      authority: 'identity-workspace-membership',
      state,
      enabled,
      poolPresent: pool !== null,
      initializationPending: initializationPromise !== null,
      shutdownPending: shutdownPromise !== null,
      lastErrorCode,
      initializedAt,
      closedAt,
      databaseContacted: false,
      productionAuthority: false,
    });
  }

  function getReadiness() {
    return freeze({
      ready: state === LIFECYCLE_STATES.READY,
      state,
      reason:
        state === LIFECYCLE_STATES.READY
          ? null
          : state === LIFECYCLE_STATES.DISABLED
            ? 'DATABASE_AUTHORITY_DISABLED'
            : 'DATABASE_AUTHORITY_NOT_READY',
      databaseContacted: false,
      productionAuthority: false,
    });
  }

  function initialize(runtimeOptions) {
    if (!enabled) {
      return Promise.reject(
        new PostgreSQLPoolLifecycleError(
          'DATABASE_AUTHORITY_DISABLED',
          'PostgreSQL authority is disabled',
        ),
      );
    }

    if (state === LIFECYCLE_STATES.CLOSED) {
      return Promise.reject(
        new PostgreSQLPoolLifecycleError(
          'DATABASE_POOL_ALREADY_CLOSED',
          'PostgreSQL Pool authority is already closed',
        ),
      );
    }

    if (state === LIFECYCLE_STATES.CLOSING) {
      return Promise.reject(
        new PostgreSQLPoolLifecycleError(
          'DATABASE_POOL_CLOSING',
          'PostgreSQL Pool authority is closing',
        ),
      );
    }

    if (state === LIFECYCLE_STATES.READY) {
      return Promise.resolve(getHealth());
    }

    if (initializationPromise) {
      return initializationPromise;
    }

    let validatedOptions;

    try {
      validatedOptions = validateRuntimeOptions(runtimeOptions);
      transition(LIFECYCLE_STATES.INITIALIZING);
    } catch (error) {
      return Promise.reject(error);
    }

    initializationPromise = Promise.resolve()
      .then(() => dependencies.constructPool(validatedOptions))
      .then((constructedPool) => {
        if (
          !constructedPool
          || typeof constructedPool !== 'object'
          || typeof constructedPool.end !== 'function'
        ) {
          throw new PostgreSQLPoolLifecycleError(
            'DATABASE_POOL_INITIALIZATION_FAILED',
            'Injected Pool constructor returned an invalid Pool',
          );
        }

        pool = constructedPool;
        initializedAt = dependencies.now();
        lastErrorCode = null;
        transition(LIFECYCLE_STATES.READY);

        return getHealth();
      })
      .catch((error) => {
        pool = null;
        lastErrorCode =
          error instanceof PostgreSQLPoolLifecycleError
            ? error.code
            : 'DATABASE_POOL_INITIALIZATION_FAILED';

        if (state === LIFECYCLE_STATES.INITIALIZING) {
          transition(LIFECYCLE_STATES.FAILED);
        }

        if (error instanceof PostgreSQLPoolLifecycleError) {
          throw error;
        }

        throw new PostgreSQLPoolLifecycleError(
          'DATABASE_POOL_INITIALIZATION_FAILED',
          'PostgreSQL Pool initialization failed',
        );
      })
      .finally(() => {
        initializationPromise = null;
      });

    return initializationPromise;
  }

  function markDegraded() {
    if (state !== LIFECYCLE_STATES.READY) {
      throw new PostgreSQLPoolLifecycleError(
        'DATABASE_AUTHORITY_STATE_INVALID',
        'PostgreSQL authority cannot enter degraded state',
      );
    }

    transition(LIFECYCLE_STATES.DEGRADED);
    return getHealth();
  }

  function markReady() {
    if (state !== LIFECYCLE_STATES.DEGRADED) {
      throw new PostgreSQLPoolLifecycleError(
        'DATABASE_AUTHORITY_STATE_INVALID',
        'PostgreSQL authority cannot return to ready state',
      );
    }

    transition(LIFECYCLE_STATES.READY);
    return getHealth();
  }

  function shutdown() {
    if (state === LIFECYCLE_STATES.CLOSED) {
      return Promise.resolve(getHealth());
    }

    if (shutdownPromise) {
      return shutdownPromise;
    }

    if (state === LIFECYCLE_STATES.DISABLED) {
      return Promise.resolve(getHealth());
    }

    if (state === LIFECYCLE_STATES.INITIALIZING) {
      return Promise.reject(
        new PostgreSQLPoolLifecycleError(
          'DATABASE_AUTHORITY_NOT_READY',
          'PostgreSQL Pool initialization is still pending',
        ),
      );
    }

    transition(LIFECYCLE_STATES.CLOSING);

    shutdownPromise = new Promise((resolve, reject) => {
      let timeoutHandle = null;
      let settled = false;

      const settleSuccess = () => {
        if (settled) {
          return;
        }

        settled = true;

        if (timeoutHandle !== null) {
          dependencies.clearTimeout(timeoutHandle);
        }

        pool = null;
        closedAt = dependencies.now();
        transition(LIFECYCLE_STATES.CLOSED);
        resolve(getHealth());
      };

      const settleFailure = () => {
        if (settled) {
          return;
        }

        settled = true;

        if (timeoutHandle !== null) {
          dependencies.clearTimeout(timeoutHandle);
        }

        pool = null;
        closedAt = dependencies.now();
        lastErrorCode = 'DATABASE_POOL_SHUTDOWN_FAILED';

        if (state === LIFECYCLE_STATES.CLOSING) {
          transition(LIFECYCLE_STATES.CLOSED);
        }

        reject(
          new PostgreSQLPoolLifecycleError(
            'DATABASE_POOL_SHUTDOWN_FAILED',
            'PostgreSQL Pool shutdown failed',
          ),
        );
      };

      timeoutHandle = dependencies.scheduleTimeout(
        settleFailure,
        shutdownTimeoutMs,
      );

      if (!pool) {
        settleSuccess();
        return;
      }

      Promise.resolve()
        .then(() => pool.end())
        .then(settleSuccess)
        .catch(settleFailure);
    }).finally(() => {
      shutdownPromise = null;
    });

    return shutdownPromise;
  }

  return Object.freeze({
    initialize,
    shutdown,
    markDegraded,
    markReady,
    getHealth,
    getReadiness,
  });
}

module.exports = Object.freeze({
  LIFECYCLE_STATES,
  PostgreSQLPoolLifecycleError,
  createPostgreSQLPoolLifecycleOwner,
});
