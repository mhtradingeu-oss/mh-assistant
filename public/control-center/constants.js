// public/control-center/constants.js

export const CONTROL_ACCESS_KEY_STORAGE_KEY = "mh-control-write-key";

// Legacy keys are read-only fallbacks to preserve older browser state.
export const CONTROL_ACCESS_KEY_LEGACY_STORAGE_KEYS = [
  "mh-control-center-write-key",
  "mh-control-center-read-key",
  "mh-control-read-key",
  "mh-control-key",
  "mh-control-center-key",
  "mh_control_key",
  "mh_control_center_key",
  "MH_CONTROL_CENTER_KEY",
  "control_center_key",
  "mhControlKey",
  "mh_access_key",
  "controlCenterAccessKey"
];
