const SENSITIVE_KEY_PATTERN = /(secret|token|password|api[_-]?key|authorization|credential|cookie)/i;

function sanitizeValue(value, depth = 0) {
  if (value == null) return value;

  if (typeof value === 'string') {
    if (/^Bearer\s+/i.test(value)) {
      return '[REDACTED]';
    }
    return value.length > 2000 ? `${value.slice(0, 1997)}...` : value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (depth >= 4) {
    return '[TRUNCATED]';
  }

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => sanitizeValue(item, depth + 1));
  }

  const output = {};
  Object.entries(value).forEach(([key, entryValue]) => {
    if (SENSITIVE_KEY_PATTERN.test(String(key || ''))) {
      output[key] = '[REDACTED]';
      return;
    }

    output[key] = sanitizeValue(entryValue, depth + 1);
  });

  return output;
}

function serializeErrorForLog(error) {
  if (!error) {
    return { message: 'Unknown error' };
  }

  return {
    name: String(error.name || 'Error'),
    message: String(error.message || 'Unknown error'),
    code: error.code ? String(error.code) : undefined,
    status: error.status || error.statusCode || error.response?.status || undefined,
    stack: error.stack || undefined,
    responseData: sanitizeValue(error.response?.data)
  };
}

function createLogger(defaultContext = {}) {
  function write(level, message, context = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message: String(message || 'log'),
      ...sanitizeValue(defaultContext),
      ...sanitizeValue(context)
    };

    const line = JSON.stringify(entry);

    if (level === 'error') {
      console.error(line);
      return;
    }

    if (level === 'warn') {
      console.warn(line);
      return;
    }

    console.info(line);
  }

  return {
    info(message, context = {}) {
      write('info', message, context);
    },
    warn(message, context = {}) {
      write('warn', message, context);
    },
    error(message, context = {}) {
      write('error', message, context);
    }
  };
}

function createConsoleLikeLogger(logger, defaultContext = {}) {
  function collectContext(args = []) {
    if (!args.length) {
      return {};
    }

    if (args.length === 1 && typeof args[0] === 'object') {
      return { details: sanitizeValue(args[0]) };
    }

    if (args.length === 1) {
      return { details: String(args[0]) };
    }

    return {
      details: args.map((item) => (typeof item === 'object' ? sanitizeValue(item) : String(item)))
    };
  }

  function write(level, first, rest) {
    const message = typeof first === 'string' ? first : 'runtime_log';
    const context = {
      ...defaultContext,
      ...collectContext(typeof first === 'string' ? rest : [first, ...rest])
    };

    if (level === 'error') {
      logger.error(message, context);
      return;
    }

    if (level === 'warn') {
      logger.warn(message, context);
      return;
    }

    logger.info(message, context);
  }

  return {
    log(...args) {
      const [first, ...rest] = args;
      write('info', first, rest);
    },
    info(...args) {
      const [first, ...rest] = args;
      write('info', first, rest);
    },
    warn(...args) {
      const [first, ...rest] = args;
      write('warn', first, rest);
    },
    error(...args) {
      const [first, ...rest] = args;
      write('error', first, rest);
    }
  };
}

module.exports = {
  createLogger,
  createConsoleLikeLogger,
  sanitizeValue,
  serializeErrorForLog
};
