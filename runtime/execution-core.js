"use strict";

class ExecutionCore {
  requestApproval(action) {
    return {
      id: `APPROVAL_${Date.now()}`,
      action,
      status: "PENDING_APPROVAL",
      allowed: false
    };
  }

  approve(request = {}) {
    return {
      ...request,
      status: "APPROVED",
      allowed: true
    };
  }

  run(plan = {}, requireApproval = true) {
    const approval = this.requestApproval(plan);

    if (requireApproval) {
      return {
        mode: "CONTROLLED",
        approvalRequired: true,
        approval,
        status: "PENDING_APPROVAL",
        forwardTo: "runtime/execution-core.js"
      };
    }

    return {
      plan,
      status: "EXECUTED",
      execution_state: "executed",
      execution_backend: "execution_core",
      executed_at: new Date().toISOString()
    };
  }

  execute(plan = {}, options = {}) {
    return this.run(plan, options.requireApproval !== false);
  }

  executeSafe(request = {}) {
    return this.run(request, true);
  }

  wrap(input = {}, executor) {
    const result = typeof executor === "function" ? executor(input) : this.run(input, true);
    return {
      input,
      result,
      timestamp: Date.now(),
      status: "EXECUTION_WRAPPED_BY_CORE"
    };
  }

  getOrchestratorEntryPoint() {
    return {
      service: "orchestrator-service",
      entry: "runtime/orchestrator-service/server.js",
      status: "CANONICAL_ORCHESTRATOR_ENTRY_POINT"
    };
  }
}

const executionCore = new ExecutionCore();

module.exports = executionCore;
module.exports.ExecutionCore = ExecutionCore;
