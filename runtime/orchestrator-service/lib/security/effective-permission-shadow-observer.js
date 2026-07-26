"use strict";

const {
  SELECTED_ROUTE_TEMPLATE,
  PUBLIC_ALIAS_TEMPLATE,
  SELECTED_ROUTE_CONTRACT_ID,
  evaluateSelectedRouteShadow
} = require(
  "./effective-permission-shadow-adapter"
);

const {
  classifyRoute
} = require(
  "./route-permission-catalog"
);

const {
  recordShadowObservation
} = require(
  "./identity-adapter"
);

const {
  resolveEffectivePermissionShadowControl
} = require(
  "./effective-permission-shadow-control"
);

const SHADOW_OBSERVER_VERSION =
  "effective-permission-shadow-observer/v1";

const REQUEST_OBSERVATION_PROPERTY =
  "mhEffectivePermissionShadowObservation";

const OBSERVER_REASONS = Object.freeze({
  OBSERVED:
    "OBSERVED",

  OBSERVER_INTERNAL_ERROR:
    "OBSERVER_INTERNAL_ERROR"
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

function safeText(
  value,
  maximumLength = 240
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(
      /[\u0000-\u001f\u007f]/g,
      ""
    )
    .trim()
    .slice(0, maximumLength);
}

function normalizeProjectSlug(value) {
  const text =
    safeText(value, 80)
      .toLowerCase();

  if (
    !/^[a-z0-9][a-z0-9._-]{0,79}$/.test(
      text
    )
  ) {
    return "";
  }

  return text;
}

function copySafePlainValue(
  value,
  depth = 0
) {
  if (depth > 8) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(
      (item) =>
        copySafePlainValue(
          item,
          depth + 1
        )
    );
  }

  if (isPlainObject(value)) {
    const result = {};

    for (
      const key
      of Object.keys(value).sort()
    ) {
      result[key] =
        copySafePlainValue(
          value[key],
          depth + 1
        );
    }

    return result;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  return null;
}

function extractRouteTemplate(request) {
  const route =
    isPlainObject(request?.route)
      ? request.route
      : null;

  if (
    route &&
    typeof route.path === "string"
  ) {
    return safeText(
      route.path,
      320
    );
  }

  return "";
}

function defaultRuntimeSecurityExtractor() {
  return null;
}

function defaultRequestedAtExtractor() {
  return "1970-01-01T00:00:00.000Z";
}

function buildDecisionRequestId({
  method,
  routeTemplate,
  projectSlug
}) {
  return [
    "runtime-shadow",
    safeText(method, 20) || "unknown",
    safeText(
      routeTemplate,
      160
    ) || "unknown",
    projectSlug || "unestablished"
  ].join(":");
}

function buildInternalErrorObservation({
  method,
  routeTemplate,
  projectSlug
}) {
  return Object.freeze({
    observation_id:
      [
        "shadow-observer-error",
        safeText(method, 20) ||
          "unknown",
        projectSlug ||
          "unestablished"
      ].join(":"),

    observer_version:
      SHADOW_OBSERVER_VERSION,

    request_method:
      safeText(method, 20) ||
      null,

    route_contract_id:
      routeTemplate ===
        SELECTED_ROUTE_TEMPLATE
        ? SELECTED_ROUTE_CONTRACT_ID
        : null,

    route_template:
      safeText(
        routeTemplate,
        320
      ) || null,

    project_slug:
      projectSlug || null,

    admitted:
      false,

    admission_reason:
      OBSERVER_REASONS
        .OBSERVER_INTERNAL_ERROR,

    resolver_invoked:
      false,

    decision_outcome:
      null,

    shadow:
      true,

    enforcement_effect:
      "NONE",

    current_result_changed:
      false,

    handler_result_changed:
      false,

    response_changed:
      false,

    persistent_sink:
      null,

    internal_error:
      true
  });
}

function attachRequestLocalObservation(
  request,
  observation
) {
  if (
    !request ||
    typeof request !== "object"
  ) {
    return false;
  }

  request[
    REQUEST_OBSERVATION_PROPERTY
  ] = Object.freeze(
    copySafePlainValue(
      observation
    )
  );

  return true;
}

function createEffectivePermissionShadowObserver(
  options = {}
) {
  const configuration =
    isPlainObject(options)
      ? options
      : {};

  const environment =
    isPlainObject(
      configuration.environment
    )
      ? configuration.environment
      : {};

  const controlResolver =
    typeof configuration
      .resolveControl === "function"
      ? configuration.resolveControl
      : resolveEffectivePermissionShadowControl;

  const permissionEvaluator =
    typeof configuration
      .evaluateShadow === "function"
      ? configuration.evaluateShadow
      : evaluateSelectedRouteShadow;

  const routeClassifier =
    typeof configuration
      .classifyRoute === "function"
      ? configuration.classifyRoute
      : classifyRoute;

  const observationRecorder =
    typeof configuration
      .recordObservation === "function"
      ? configuration.recordObservation
      : recordShadowObservation;

  const runtimeSecurityExtractor =
    typeof configuration
      .getRuntimeSecurityContext ===
      "function"
      ? configuration
          .getRuntimeSecurityContext
      : defaultRuntimeSecurityExtractor;

  const requestedAtExtractor =
    typeof configuration
      .getRequestedAt === "function"
      ? configuration.getRequestedAt
      : defaultRequestedAtExtractor;

  const control =
    controlResolver(environment);

  if (
    !control ||
    typeof control !== "object" ||
    !control.shadow_control
  ) {
    throw new Error(
      "Invalid runtime shadow control"
    );
  }

  return function
  observeEffectivePermissionShadow(
    request,
    response,
    next
  ) {
    let nextCalled = false;

    function callNextOnce() {
      if (nextCalled) {
        return undefined;
      }

      nextCalled = true;

      if (typeof next === "function") {
        return next();
      }

      return undefined;
    }

    if (control.active !== true) {
      return callNextOnce();
    }

    const method =
      safeText(
        request?.method,
        20
      ).toUpperCase();

    const routeTemplate =
      extractRouteTemplate(request);

    if (
      method !== "GET" ||
      routeTemplate !==
        SELECTED_ROUTE_TEMPLATE ||
      routeTemplate ===
        PUBLIC_ALIAS_TEMPLATE
    ) {
      return callNextOnce();
    }

    const projectSlug =
      normalizeProjectSlug(
        request?.params?.project
      );

    try {
      const classificationPath =
        SELECTED_ROUTE_TEMPLATE.replace(
          ":project",
          projectSlug ||
            "unestablished-project"
        );

      const routeClassification =
        routeClassifier(
          "GET",
          classificationPath
        );

      const authorityContext =
        isPlainObject(
          request?.mhAuthorityContext
        )
          ? request
              .mhAuthorityContext
          : null;

      const runtimeSecurityContext =
        runtimeSecurityExtractor(
          request
        );

      const requestedAt =
        requestedAtExtractor(
          request
        );

      const result =
        permissionEvaluator({
          decision_request_id:
            buildDecisionRequestId({
              method,
              routeTemplate,
              projectSlug
            }),

          correlation_id:
            null,

          requested_at:
            requestedAt,

          request_method:
            method,

          route_contract_id:
            SELECTED_ROUTE_CONTRACT_ID,

          route_template:
            routeTemplate,

          project_slug:
            projectSlug,

          shadow_control:
            control.shadow_control,

          route_classification:
            routeClassification,

          authority_context:
            authorityContext,

          runtime_security_context:
            isPlainObject(
              runtimeSecurityContext
            )
              ? runtimeSecurityContext
              : null
        });

      const observation =
        isPlainObject(
          result?.observation
        )
          ? result.observation
          : buildInternalErrorObservation({
              method,
              routeTemplate,
              projectSlug
            });

      if (authorityContext) {
        const authorityContextClone =
          copySafePlainValue(
            authorityContext
          );

        observationRecorder(
          authorityContextClone,
          observation
        );
      }

      attachRequestLocalObservation(
        request,
        observation
      );
    } catch (error) {
      try {
        attachRequestLocalObservation(
          request,
          buildInternalErrorObservation({
            method,
            routeTemplate,
            projectSlug
          })
        );
      } catch (attachmentError) {
        void attachmentError;
      }

      void error;
    }

    return callNextOnce();
  };
}

module.exports = Object.freeze({
  SHADOW_OBSERVER_VERSION,
  REQUEST_OBSERVATION_PROPERTY,
  OBSERVER_REASONS,
  SELECTED_ROUTE_TEMPLATE,
  PUBLIC_ALIAS_TEMPLATE,
  SELECTED_ROUTE_CONTRACT_ID,
  createEffectivePermissionShadowObserver
});
