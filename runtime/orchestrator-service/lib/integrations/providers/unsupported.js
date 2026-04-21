function createUnsupportedAdapter(integrationIds = [], message) {
  async function unsupported(ctx) {
    const error = new Error(message);
    error.status = 'reconnect_required';
    throw error;
  }

  return {
    integrationIds,
    connect: unsupported,
    testConnection: unsupported,
    syncCurrent: unsupported,
    importHistory: unsupported
  };
}

module.exports = {
  createUnsupportedAdapter
};
