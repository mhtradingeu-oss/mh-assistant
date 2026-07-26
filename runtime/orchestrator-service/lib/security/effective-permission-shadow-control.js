"use strict";

const SHADOW_CONTROL_VERSION =
  "effective-permission-shadow-control/v1";

const SHADOW_ENABLED_ENV =
  "MH_EFFECTIVE_PERMISSION_SHADOW_ENABLED";

const SHADOW_KILL_SWITCH_ENV =
  "MH_EFFECTIVE_PERMISSION_SHADOW_KILL_SWITCH";

const FEATURE_FLAG_STATES = Object.freeze({
  ENABLED: "ENABLED",
  DISABLED: "DISABLED"
});

const KILL_SWITCH_STATES = Object.freeze({
  CLEAR: "CLEAR",
  ENGAGED: "ENGAGED"
});

const CONTROL_REASONS = Object.freeze({
  ACTIVE:
    "ACTIVE",

  FEATURE_FLAG_MISSING:
    "FEATURE_FLAG_MISSING",

  FEATURE_FLAG_DISABLED:
    "FEATURE_FLAG_DISABLED",

  FEATURE_FLAG_INVALID:
    "FEATURE_FLAG_INVALID",

  KILL_SWITCH_MISSING:
    "KILL_SWITCH_MISSING",

  KILL_SWITCH_ENGAGED:
    "KILL_SWITCH_ENGAGED",

  KILL_SWITCH_INVALID:
    "KILL_SWITCH_INVALID"
});

function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function readEnvironmentValue(
  environment,
  name
) {
  if (
    !isPlainObject(environment) ||
    !Object.prototype.hasOwnProperty.call(
      environment,
      name
    )
  ) {
    return Object.freeze({
      present: false,
      valid_type: false,
      value: null
    });
  }

  const rawValue =
    environment[name];

  if (typeof rawValue !== "string") {
    return Object.freeze({
      present: true,
      valid_type: false,
      value: null
    });
  }

  return Object.freeze({
    present: true,
    valid_type: true,
    value: rawValue.trim()
  });
}

function classifyFeatureFlag(reading) {
  if (!reading.present) {
    return Object.freeze({
      state:
        FEATURE_FLAG_STATES.DISABLED,

      reason:
        CONTROL_REASONS
          .FEATURE_FLAG_MISSING
    });
  }

  if (
    !reading.valid_type ||
    (
      reading.value !== "0" &&
      reading.value !== "1"
    )
  ) {
    return Object.freeze({
      state:
        FEATURE_FLAG_STATES.DISABLED,

      reason:
        CONTROL_REASONS
          .FEATURE_FLAG_INVALID
    });
  }

  if (reading.value === "1") {
    return Object.freeze({
      state:
        FEATURE_FLAG_STATES.ENABLED,

      reason:
        CONTROL_REASONS.ACTIVE
    });
  }

  return Object.freeze({
    state:
      FEATURE_FLAG_STATES.DISABLED,

    reason:
      CONTROL_REASONS
        .FEATURE_FLAG_DISABLED
  });
}

function classifyKillSwitch(reading) {
  if (!reading.present) {
    return Object.freeze({
      state:
        KILL_SWITCH_STATES.ENGAGED,

      reason:
        CONTROL_REASONS
          .KILL_SWITCH_MISSING
    });
  }

  if (
    !reading.valid_type ||
    (
      reading.value !== "0" &&
      reading.value !== "1"
    )
  ) {
    return Object.freeze({
      state:
        KILL_SWITCH_STATES.ENGAGED,

      reason:
        CONTROL_REASONS
          .KILL_SWITCH_INVALID
    });
  }

  if (reading.value === "1") {
    return Object.freeze({
      state:
        KILL_SWITCH_STATES.ENGAGED,

      reason:
        CONTROL_REASONS
          .KILL_SWITCH_ENGAGED
    });
  }

  return Object.freeze({
    state:
      KILL_SWITCH_STATES.CLEAR,

    reason:
      CONTROL_REASONS.ACTIVE
  });
}

function resolveEffectivePermissionShadowControl(
  environment = {}
) {
  const featureReading =
    readEnvironmentValue(
      environment,
      SHADOW_ENABLED_ENV
    );

  const killSwitchReading =
    readEnvironmentValue(
      environment,
      SHADOW_KILL_SWITCH_ENV
    );

  const featureFlag =
    classifyFeatureFlag(
      featureReading
    );

  const killSwitch =
    classifyKillSwitch(
      killSwitchReading
    );

  const active =
    featureFlag.state ===
      FEATURE_FLAG_STATES.ENABLED &&
    killSwitch.state ===
      KILL_SWITCH_STATES.CLEAR;

  let admissionReason =
    CONTROL_REASONS.ACTIVE;

  if (
    killSwitch.state ===
    KILL_SWITCH_STATES.ENGAGED
  ) {
    admissionReason =
      killSwitch.reason;
  } else if (
    featureFlag.state ===
    FEATURE_FLAG_STATES.DISABLED
  ) {
    admissionReason =
      featureFlag.reason;
  }

  return Object.freeze({
    contract_version:
      SHADOW_CONTROL_VERSION,

    feature_flag:
      Object.freeze({
        environment_name:
          SHADOW_ENABLED_ENV,

        state:
          featureFlag.state,

        reason:
          featureFlag.reason
      }),

    kill_switch:
      Object.freeze({
        environment_name:
          SHADOW_KILL_SWITCH_ENV,

        state:
          killSwitch.state,

        reason:
          killSwitch.reason
      }),

    active,

    admission_reason:
      admissionReason,

    default_enabled:
      false,

    kill_switch_precedence:
      "HIGHEST",

    shadow_control:
      Object.freeze({
        enabled:
          active,

        kill_switch_engaged:
          killSwitch.state ===
          KILL_SWITCH_STATES.ENGAGED
      })
  });
}

module.exports = Object.freeze({
  SHADOW_CONTROL_VERSION,
  SHADOW_ENABLED_ENV,
  SHADOW_KILL_SWITCH_ENV,
  FEATURE_FLAG_STATES,
  KILL_SWITCH_STATES,
  CONTROL_REASONS,
  resolveEffectivePermissionShadowControl
});
