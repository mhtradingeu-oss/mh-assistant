"use strict";

/**
 * Reserved Governance storage partition used by the legacy Approval Engine.
 *
 * This is not a customer Project, not a Workspace, and not a user-selectable
 * Project scope. The Approval Engine may continue to expose the storage key in
 * its legacy `project` field; external governance contracts call it an
 * authority partition.
 */
const GOVERNANCE_AUTHORITY_PARTITION = "governance-system";

module.exports = Object.freeze({ GOVERNANCE_AUTHORITY_PARTITION });
