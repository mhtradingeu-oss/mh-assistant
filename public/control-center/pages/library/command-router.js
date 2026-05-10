const LIBRARY_COMMANDS = Object.freeze({
  SELECT_ASSET: "select-asset",
  SET_FILTER: "set-filter",
  SET_VIEW_MODE: "set-view-mode",
  SET_PAGE: "set-page",
  OPEN_UPLOAD: "open-upload",
  REFRESH_LIBRARY: "refresh-library",
  OPEN_PREVIEW: "open-preview",
  SET_SOURCE_OF_TRUTH: "set-source-of-truth",
  UPDATE_STATUS: "update-status",
  RENAME_ASSET: "rename-asset",
  ARCHIVE_ASSET: "archive-asset",
  DELETE_ASSET: "delete-asset",
  SEND_TO_AI: "send-to-ai"
});

export function getLibraryCommands() {
  return LIBRARY_COMMANDS;
}

export function createLibraryCommand(command, payload = {}) {
  return {
    command,
    payload,
    createdAt: new Date().toISOString()
  };
}

export function isLibraryMutationCommand(command) {
  return [
    LIBRARY_COMMANDS.REFRESH_LIBRARY,
    LIBRARY_COMMANDS.SET_SOURCE_OF_TRUTH,
    LIBRARY_COMMANDS.UPDATE_STATUS,
    LIBRARY_COMMANDS.RENAME_ASSET,
    LIBRARY_COMMANDS.ARCHIVE_ASSET,
    LIBRARY_COMMANDS.DELETE_ASSET
  ].includes(command);
}

export function isLibraryAiCommand(command) {
  return command === LIBRARY_COMMANDS.SEND_TO_AI;
}

export function routeLibraryCommand(commandEnvelope, handlers = {}) {
  const envelope = commandEnvelope || {};
  const command = envelope.command;
  const handler = handlers[command];

  if (typeof handler !== "function") {
    return {
      handled: false,
      command,
      reason: "No handler registered for Library command."
    };
  }

  return {
    handled: true,
    command,
    result: handler(envelope.payload || {}, envelope)
  };
}
