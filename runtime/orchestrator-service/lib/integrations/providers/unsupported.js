function createUnsupportedAdapter(integrationIds = [], message) {
  async function unsupported(ctx) {
    const error = new Error(message);
    error.status = 'unsupported_provider';
    throw error;
  }

  return {
    integrationIds,
    unsupportedMessage: message,
    connect: unsupported,
    testConnection: unsupported,
    syncCurrent: unsupported,
    importHistory: unsupported
  };
}

module.exports = {
  createUnsupportedAdapter
};
