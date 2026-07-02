function createInMemoryRateLimiter(options = {}) {
  const windowMs = Number(options.windowMs || 60_000);
  const max = Number(options.max || 60);
  const state = new Map();

  function prune(now) {
    for (const [key, value] of state.entries()) {
      if (!value || value.resetAt <= now) {
        state.delete(key);
      }
    }
  }

  function check(identity, now = Date.now()) {
    const key = String(identity || 'anonymous').trim() || 'anonymous';
    prune(now);

    const existing = state.get(key);
    if (!existing || existing.resetAt <= now) {
      const fresh = {
        count: 1,
        resetAt: now + windowMs
      };
      state.set(key, fresh);
      return {
        allowed: true,
        remaining: Math.max(max - fresh.count, 0),
        retryAfterMs: 0
      };
    }

    existing.count += 1;

    if (existing.count > max) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(existing.resetAt - now, 0)
      };
    }

    return {
      allowed: true,
      remaining: Math.max(max - existing.count, 0),
      retryAfterMs: 0
    };
  }

  return {
    check,
    options: {
      windowMs,
      max
    }
  };
}

module.exports = {
  createInMemoryRateLimiter
};
