"use strict";

const assert =
  require("node:assert/strict");

const childProcess =
  require("node:child_process");

const fs =
  require("node:fs");

const http =
  require("node:http");

const os =
  require("node:os");

const path =
  require("node:path");

const repositoryRoot =
  path.resolve(
    __dirname,
    ".."
  );

const installationVerifierPath =
  path.resolve(
    repositoryRoot,
    "scripts/verify-effective-permission-shadow-runtime-installation.js"
  );

const control =
  require(
    path.resolve(
      repositoryRoot,
      "runtime/orchestrator-service/lib/security/effective-permission-shadow-control.js"
    )
  );

const observer =
  require(
    path.resolve(
      repositoryRoot,
      "runtime/orchestrator-service/lib/security/effective-permission-shadow-observer.js"
    )
  );

const LOOPBACK_HOST =
  "127.0.0.1";

const SYNTHETIC_PROJECT =
  "e3n-synthetic-project";

const CASE_HEADER =
  "x-mh-e3n-case";

const REQUEST_TIMEOUT_MS =
  5000;

const MIDDLEWARE_TIMEOUT_MS =
  3000;

const TEMP_MARKER_NAME =
  "ephemeral-proof-marker.json";

const secretValues = [
  "e3n-bearer-synthetic-secret",
  "e3n-cookie-synthetic-secret",
  "e3n-api-key-synthetic-secret"
];

function redactSecrets(value) {
  let output =
    String(value);

  for (const secret of secretValues) {
    output =
      output.split(secret).join(
        "[REDACTED]"
      );
  }

  return output;
}

function hasExactValue(
  value,
  target
) {
  if (value === target) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(
      (entry) =>
        hasExactValue(
          entry,
          target
        )
    );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.values(
      value
    ).some(
      (entry) =>
        hasExactValue(
          entry,
          target
        )
    );
  }

  return false;
}

function containsSecret(
  value
) {
  const serialized =
    JSON.stringify(value);

  return secretValues.some(
    (secret) =>
      serialized.includes(secret)
  );
}

function runInstallationVerifier() {
  const result =
    childProcess.spawnSync(
      process.execPath,
      [
        installationVerifierPath
      ],
      {
        cwd:
          repositoryRoot,

        encoding:
          "utf8",

        shell:
          false,

        timeout:
          60000,

        maxBuffer:
          2 * 1024 * 1024
      }
    );

  assert.equal(
    result.error,
    undefined,
    "Installation verifier process failed"
  );

  assert.equal(
    result.signal,
    null,
    "Installation verifier was terminated by a signal"
  );

  assert.equal(
    result.status,
    0,
    "Installation verifier returned a non-zero exit code"
  );

  assert.equal(
    result.stderr.trim(),
    "",
    "Installation verifier produced stderr"
  );

  const report =
    JSON.parse(
      result.stdout
    );

  assert.equal(
    report.ok,
    true
  );

  assert.equal(
    report.phase,
    "L5C_E3K_CANONICAL_ROUTE_RUNTIME_SHADOW_INSTALLATION"
  );

  assert.equal(
    report.cases,
    14
  );

  assert.equal(
    report.runtime_installation,
    true
  );

  assert.equal(
    report.default_state,
    "DISABLED"
  );

  assert.equal(
    report.public_alias_changed,
    false
  );

  assert.equal(
    report.head_changed,
    false
  );

  assert.equal(
    report.handler_changed,
    false
  );

  assert.equal(
    report.response_contract_changed,
    false
  );

  assert.equal(
    report.persistent_sink,
    null
  );

  assert.equal(
    report.production_observation_authorized,
    false
  );

  assert.equal(
    report.production_authority_granted,
    false
  );

  assert.equal(
    report.server_started,
    false
  );

  assert.equal(
    report.http_requests_performed,
    false
  );

  return {
    ok:
      true,

    cases:
      report.cases,

    canonical_route:
      report.canonical_route,

    public_alias:
      report.public_alias
  };
}

function invokeMiddleware(
  middleware,
  request,
  response
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      let settled = false;
      let completionScheduled = false;
      let nextCalls = 0;

      const finish =
        (
          error,
          value
        ) => {
          if (settled) {
            return;
          }

          settled = true;
          clearTimeout(timer);

          if (error) {
            reject(error);
            return;
          }

          resolve(value);
        };

      const timer =
        setTimeout(
          () => {
            finish(
              new Error(
                "Shadow middleware did not continue within timeout"
              )
            );
          },
          MIDDLEWARE_TIMEOUT_MS
        );

      const next =
        (error) => {
          nextCalls += 1;

          if (error) {
            finish(error);
            return;
          }

          if (!completionScheduled) {
            completionScheduled = true;

            setImmediate(
              () => {
                finish(
                  null,
                  nextCalls
                );
              }
            );
          }
        };

      try {
        const possiblePromise =
          middleware(
            request,
            response,
            next
          );

        if (
          possiblePromise &&
          typeof possiblePromise.then ===
          "function"
        ) {
          possiblePromise.catch(
            (error) => {
              finish(error);
            }
          );
        }
      } catch (error) {
        finish(error);
      }
    }
  );
}

function listenLoopback(
  server
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const onError =
        (error) => {
          reject(error);
        };

      server.once(
        "error",
        onError
      );

      server.listen(
        {
          host:
            LOOPBACK_HOST,

          port:
            0,

          exclusive:
            true
        },
        () => {
          server.removeListener(
            "error",
            onError
          );

          resolve();
        }
      );
    }
  );
}

function closeServer(
  server
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      server.close(
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        }
      );
    }
  );
}

function requestLoopback({
  port,
  caseName,
  method,
  pathname,
  headers,
  targets
}) {
  assert.equal(
    Number.isInteger(port),
    true
  );

  assert.equal(
    port > 0,
    true
  );

  const target = {
    hostname:
      LOOPBACK_HOST,

    port,

    method,

    path:
      pathname
  };

  assert.equal(
    target.hostname,
    LOOPBACK_HOST
  );

  targets.push(target);

  return new Promise(
    (
      resolve,
      reject
    ) => {
      const request =
        http.request(
          {
            hostname:
              target.hostname,

            port:
              target.port,

            method:
              target.method,

            path:
              target.path,

            agent:
              false,

            headers: {
              connection:
                "close",

              [CASE_HEADER]:
                caseName,

              ...(headers || {})
            }
          },
          (response) => {
            const chunks = [];

            response.on(
              "data",
              (chunk) => {
                chunks.push(
                  Buffer.from(chunk)
                );
              }
            );

            response.on(
              "end",
              () => {
                resolve({
                  status_code:
                    response.statusCode,

                  headers:
                    response.headers,

                  body:
                    Buffer.concat(
                      chunks
                    ).toString("utf8")
                });
              }
            );
          }
        );

      request.setTimeout(
        REQUEST_TIMEOUT_MS,
        () => {
          request.destroy(
            new Error(
              "Loopback request timed out"
            )
          );
        }
      );

      request.on(
        "error",
        reject
      );

      request.end();
    }
  );
}

async function main() {
  let tempRoot = null;
  let server = null;
  let serverStarted = false;
  let serverClosed = false;

  try {
    const installationProof =
      runInstallationVerifier();

    assert.equal(
      typeof observer
        .createEffectivePermissionShadowObserver,
      "function"
    );

    assert.equal(
      typeof observer
        .SELECTED_ROUTE_TEMPLATE,
      "string"
    );

    assert.equal(
      typeof observer
        .PUBLIC_ALIAS_TEMPLATE,
      "string"
    );

    assert.equal(
      typeof observer
        .REQUEST_OBSERVATION_PROPERTY,
      "string"
    );

    const canonicalActualPath =
      observer
        .SELECTED_ROUTE_TEMPLATE
        .replace(
          ":project",
          encodeURIComponent(
            SYNTHETIC_PROJECT
          )
        );

    const publicActualPath =
      observer
        .PUBLIC_ALIAS_TEMPLATE
        .replace(
          ":project",
          encodeURIComponent(
            SYNTHETIC_PROJECT
          )
        );

    tempRoot =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "mhos-e3n-controlled-local-"
        )
      );

    const tempMarkerPath =
      path.join(
        tempRoot,
        TEMP_MARKER_NAME
      );

    fs.writeFileSync(
      tempMarkerPath,
      JSON.stringify({
        synthetic:
          true,

        phase:
          "L5C_E3N"
      }) + "\n",
      {
        encoding:
          "utf8",

        mode:
          0o600
      }
    );

    const disabledEnvironment = {
      [control.SHADOW_ENABLED_ENV]:
        "0",

      [control.SHADOW_KILL_SWITCH_ENV]:
        "0"
    };

    const activeEnvironment = {
      [control.SHADOW_ENABLED_ENV]:
        "1",

      [control.SHADOW_KILL_SWITCH_ENV]:
        "0"
    };

    const killedEnvironment = {
      [control.SHADOW_ENABLED_ENV]:
        "1",

      [control.SHADOW_KILL_SWITCH_ENV]:
        "1"
    };

    const missingKillSwitchEnvironment = {
      [control.SHADOW_ENABLED_ENV]:
        "1"
    };

    const invalidKillSwitchEnvironment = {
      [control.SHADOW_ENABLED_ENV]:
        "1",

      [control.SHADOW_KILL_SWITCH_ENV]:
        "invalid"
    };

    const observers = new Map([
      [
        "disabled",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              disabledEnvironment
          })
      ],
      [
        "active",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              activeEnvironment
          })
      ],
      [
        "killed",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              killedEnvironment
          })
      ],
      [
        "missing_kill_switch",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              missingKillSwitchEnvironment
          })
      ],
      [
        "invalid_kill_switch",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              invalidKillSwitchEnvironment
          })
      ],
      [
        "public_alias",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              activeEnvironment
          })
      ],
      [
        "canonical_head",
        observer
          .createEffectivePermissionShadowObserver({
            environment:
              activeEnvironment
          })
      ]
    ]);

    const fixedResponseBody =
      JSON.stringify({
        ok:
          true,

        source:
          "e3n-controlled-local-harness",

        project:
          SYNTHETIC_PROJECT
      });

    const captures =
      new Map();

    const serverErrors = [];

    server =
      http.createServer(
        (
          request,
          response
        ) => {
          const handleRequest =
            async () => {
              const caseHeader =
                request.headers[
                  CASE_HEADER
                ];

              assert.equal(
                typeof caseHeader,
                "string",
                "Controlled case header is missing"
              );

              assert.equal(
                observers.has(
                  caseHeader
                ),
                true,
                "Unknown controlled proof case"
              );

              assert.equal(
                captures.has(
                  caseHeader
                ),
                false,
                "Controlled case was requested more than once"
              );

              const requestUrl =
                new URL(
                  request.url,
                  `http://${LOOPBACK_HOST}`
                );

              const expectedMethod =
                caseHeader ===
                "canonical_head"
                  ? "HEAD"
                  : "GET";

              const expectedPath =
                caseHeader ===
                "public_alias"
                  ? publicActualPath
                  : canonicalActualPath;

              assert.equal(
                request.method,
                expectedMethod
              );

              assert.equal(
                requestUrl.pathname,
                expectedPath
              );

              const routeTemplate =
                caseHeader ===
                "public_alias"
                  ? observer
                      .PUBLIC_ALIAS_TEMPLATE
                  : observer
                      .SELECTED_ROUTE_TEMPLATE;

              request.route = {
                path:
                  routeTemplate
              };

              request.params = {
                project:
                  SYNTHETIC_PROJECT
              };

              const headersSentBefore =
                response.headersSent;

              assert.equal(
                headersSentBefore,
                false
              );

              const nextCalls =
                await invokeMiddleware(
                  observers.get(
                    caseHeader
                  ),
                  request,
                  response
                );

              assert.equal(
                nextCalls,
                1
              );

              assert.equal(
                response.headersSent,
                false,
                "Observer changed the HTTP response"
              );

              const observationProperty =
                observer
                  .REQUEST_OBSERVATION_PROPERTY;

              const observationPresent =
                Object.prototype
                  .hasOwnProperty.call(
                    request,
                    observationProperty
                  );

              captures.set(
                caseHeader,
                {
                  next_calls:
                    nextCalls,

                  observation_present:
                    observationPresent,

                  observation:
                    observationPresent
                      ? request[
                          observationProperty
                        ]
                      : null
                }
              );

              response.statusCode = 200;

              response.setHeader(
                "content-type",
                "application/json; charset=utf-8"
              );

              response.setHeader(
                "content-length",
                Buffer.byteLength(
                  fixedResponseBody
                )
              );

              response.end(
                fixedResponseBody
              );
            };

          handleRequest().catch(
            (error) => {
              serverErrors.push(
                redactSecrets(
                  error &&
                  error.stack
                    ? error.stack
                    : error
                )
              );

              if (!response.headersSent) {
                response.statusCode = 500;
                response.end(
                  JSON.stringify({
                    ok:
                      false,

                    error:
                      "controlled_local_proof_failed"
                  })
                );
              } else {
                response.destroy();
              }
            }
          );
        }
      );

    await listenLoopback(
      server
    );

    serverStarted = true;

    const address =
      server.address();

    assert.notEqual(
      address,
      null
    );

    assert.equal(
      typeof address,
      "object"
    );

    assert.equal(
      address.address,
      LOOPBACK_HOST
    );

    assert.equal(
      address.family,
      "IPv4"
    );

    assert.equal(
      Number.isInteger(
        address.port
      ),
      true
    );

    assert.equal(
      address.port > 0,
      true
    );

    const targets = [];

    const responses = {};

    responses.disabled =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "disabled",

        method:
          "GET",

        pathname:
          canonicalActualPath,

        headers:
          null,

        targets
      });

    responses.active =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "active",

        method:
          "GET",

        pathname:
          canonicalActualPath,

        headers: {
          authorization:
            "Bearer "
            + secretValues[0],

          cookie:
            "session="
            + secretValues[1],

          "x-api-key":
            secretValues[2]
        },

        targets
      });

    responses.killed =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "killed",

        method:
          "GET",

        pathname:
          canonicalActualPath,

        headers:
          null,

        targets
      });

    responses.missing_kill_switch =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "missing_kill_switch",

        method:
          "GET",

        pathname:
          canonicalActualPath,

        headers:
          null,

        targets
      });

    responses.invalid_kill_switch =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "invalid_kill_switch",

        method:
          "GET",

        pathname:
          canonicalActualPath,

        headers:
          null,

        targets
      });

    responses.public_alias =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "public_alias",

        method:
          "GET",

        pathname:
          publicActualPath,

        headers:
          null,

        targets
      });

    responses.canonical_head =
      await requestLoopback({
        port:
          address.port,

        caseName:
          "canonical_head",

        method:
          "HEAD",

        pathname:
          canonicalActualPath,

        headers:
          null,

        targets
      });

    assert.deepEqual(
      serverErrors,
      []
    );

    assert.equal(
      captures.size,
      7
    );

    assert.equal(
      targets.length,
      7
    );

    assert.equal(
      targets.every(
        (target) =>
          target.hostname ===
          LOOPBACK_HOST
      ),
      true
    );

    assert.equal(
      targets.every(
        (target) =>
          target.port ===
          address.port
      ),
      true
    );

    for (
      const response
      of Object.values(responses)
    ) {
      assert.equal(
        response.status_code,
        200
      );
    }

    assert.equal(
      captures.get(
        "disabled"
      ).next_calls,
      1
    );

    assert.equal(
      captures.get(
        "disabled"
      ).observation_present,
      false
    );

    assert.equal(
      captures.get(
        "active"
      ).next_calls,
      1
    );

    assert.equal(
      captures.get(
        "active"
      ).observation_present,
      true
    );

    assert.equal(
      captures.get(
        "killed"
      ).observation_present,
      false
    );

    assert.equal(
      captures.get(
        "missing_kill_switch"
      ).observation_present,
      false
    );

    assert.equal(
      captures.get(
        "invalid_kill_switch"
      ).observation_present,
      false
    );

    assert.equal(
      captures.get(
        "public_alias"
      ).observation_present,
      false
    );

    assert.equal(
      captures.get(
        "canonical_head"
      ).observation_present,
      false
    );

    const activeObservation =
      captures.get(
        "active"
      ).observation;

    assert.notEqual(
      activeObservation,
      null
    );

    assert.equal(
      hasExactValue(
        activeObservation,
        "ALLOW"
      ),
      false
    );

    const observationsPresent =
      [
        ...captures.values()
      ].filter(
        (capture) =>
          capture
            .observation_present
      ).length;

    assert.equal(
      observationsPresent,
      1
    );

    assert.equal(
      responses.active.status_code,
      responses.disabled.status_code
    );

    assert.equal(
      responses.active.body,
      responses.disabled.body
    );

    assert.equal(
      Buffer.from(
        responses.active.body
      ).equals(
        Buffer.from(
          responses.disabled.body
        )
      ),
      true
    );

    assert.equal(
      responses.active.body,
      fixedResponseBody
    );

    assert.equal(
      responses.disabled.body,
      fixedResponseBody
    );

    assert.equal(
      responses.canonical_head.body,
      ""
    );

    const deniedRequests =
      Object.values(
        responses
      ).filter(
        (response) =>
          response.status_code >= 400
      ).length;

    assert.equal(
      deniedRequests,
      0
    );

    const leakSurface = {
      observations:
        [
          ...captures.entries()
        ].map(
          (
            [
              caseName,
              capture
            ]
          ) => ({
            case_name:
              caseName,

            observation:
              capture.observation
          })
        ),

      response_bodies:
        Object.fromEntries(
          Object.entries(
            responses
          ).map(
            (
              [
                caseName,
                response
              ]
            ) => [
              caseName,
              response.body
            ]
          )
        )
    };

    assert.equal(
      containsSecret(
        leakSurface
      ),
      false
    );

    const tempEntriesBeforeCleanup =
      fs.readdirSync(
        tempRoot
      ).sort();

    assert.deepEqual(
      tempEntriesBeforeCleanup,
      [
        TEMP_MARKER_NAME
      ]
    );

    await closeServer(
      server
    );

    serverClosed = true;

    assert.equal(
      server.listening,
      false
    );

    fs.rmSync(
      tempRoot,
      {
        recursive:
          true,

        force:
          true
      }
    );

    const temporaryEvidenceRemoved =
      !fs.existsSync(
        tempRoot
      );

    assert.equal(
      temporaryEvidenceRemoved,
      true
    );

    const caseNames = [
      "installed_composition_recertification_passes",
      "disabled_canonical_get_no_observation_and_continues",
      "active_canonical_get_one_request_local_observation_and_continues",
      "active_observation_contains_no_allow",
      "kill_switch_suppresses_observation_and_continues",
      "missing_kill_switch_suppresses_observation_and_continues",
      "invalid_kill_switch_suppresses_observation_and_continues",
      "public_alias_get_excluded",
      "canonical_head_excluded",
      "enabled_disabled_response_bodies_byte_equivalent",
      "synthetic_credentials_do_not_leak",
      "no_request_denied",
      "no_persistent_sink_created",
      "all_http_targets_loopback_only",
      "temporary_evidence_removed_after_proof"
    ];

    assert.equal(
      caseNames.length,
      15
    );

    const report = {
      ok:
        true,

      phase:
        "L5C_E3N_CONTROLLED_LOCAL_RUNTIME_SHADOW_OBSERVATION_PROOF",

      cases:
        caseNames.length,

      case_names:
        caseNames,

      installation_recertification_cases:
        installationProof.cases,

      canonical_route:
        observer
          .SELECTED_ROUTE_TEMPLATE,

      canonical_actual_path:
        canonicalActualPath,

      public_alias:
        observer
          .PUBLIC_ALIAS_TEMPLATE,

      public_alias_actual_path:
        publicActualPath,

      synthetic_project:
        SYNTHETIC_PROJECT,

      request_observation_property:
        observer
          .REQUEST_OBSERVATION_PROPERTY,

      proof_method:
        "EPHEMERAL_LOOPBACK_NODE_HTTP_HARNESS",

      bind_address:
        LOOPBACK_HOST,

      port_semantics:
        "EPHEMERAL_OS_ASSIGNED",

      local_harness_server_started:
        serverStarted,

      local_harness_server_closed:
        serverClosed,

      production_orchestrator_started:
        false,

      production_server_module_required:
        false,

      http_requests_performed:
        true,

      http_request_count:
        targets.length,

      loopback_http_request_count:
        targets.length,

      external_network_requests:
        0,

      all_http_targets_loopback_only:
        true,

      disabled_canonical_observation_count:
        0,

      active_canonical_observation_count:
        1,

      killed_canonical_observation_count:
        0,

      missing_kill_switch_observation_count:
        0,

      invalid_kill_switch_observation_count:
        0,

      public_alias_observation_count:
        0,

      canonical_head_observation_count:
        0,

      active_observation_contains_allow:
        false,

      request_denied:
        false,

      denied_request_count:
        deniedRequests,

      response_changed:
        false,

      enabled_disabled_response_byte_equivalent:
        true,

      synthetic_credentials_only:
        true,

      synthetic_credentials_leaked:
        false,

      real_project_data_used:
        false,

      real_credentials_used:
        false,

      observation_capture:
        "BOUNDED_IN_MEMORY_TEST_ONLY",

      persistent_sink:
        null,

      repository_files_written:
        false,

      temporary_root_used:
        true,

      temporary_evidence_removed:
        temporaryEvidenceRemoved,

      production_observation_authorized:
        false,

      production_authority_granted:
        false,

      verifier_registered:
        false,

      governance_classification_deferred:
        true
    };

    assert.equal(
      report.local_harness_server_started,
      true
    );

    assert.equal(
      report.local_harness_server_closed,
      true
    );

    const serializedReport =
      JSON.stringify(
        report,
        null,
        2
      );

    for (const secret of secretValues) {
      assert.equal(
        serializedReport.includes(
          secret
        ),
        false
      );
    }

    console.log(
      serializedReport
    );
  } finally {
    if (
      server &&
      server.listening
    ) {
      try {
        await closeServer(
          server
        );
      } catch {
      }
    }

    if (
      tempRoot &&
      fs.existsSync(
        tempRoot
      )
    ) {
      fs.rmSync(
        tempRoot,
        {
          recursive:
            true,

          force:
            true
        }
      );
    }
  }
}

main().catch(
  (error) => {
    const message =
      error &&
      error.stack
        ? error.stack
        : error;

    console.error(
      redactSecrets(
        message
      )
    );

    process.exitCode = 1;
  }
);
