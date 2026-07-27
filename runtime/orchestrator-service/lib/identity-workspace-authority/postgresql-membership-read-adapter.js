'use strict';

const {
  deepFreeze,
} = require('./postgresql-config');

const READ_ADAPTER_STATES = Object.freeze({
  DISABLED: 'DISABLED',
  SKELETON_ONLY: 'SKELETON_ONLY',
});

const READ_OPERATIONS = Object.freeze([
  'getPrincipalById',
  'getOrganizationById',
  'getWorkspaceById',
  'getProjectById',
  'listWorkspaceMembershipsForPrincipal',
  'listProjectMembershipsForPrincipal',
  'listScopedPermissionGrants',
]);

function unavailableResult(operation, enabled) {
  return deepFreeze({
    ok: false,
    operation,
    state: enabled
      ? READ_ADAPTER_STATES.SKELETON_ONLY
      : READ_ADAPTER_STATES.DISABLED,
    code: enabled
      ? 'DATABASE_AUTHORITY_NOT_READY'
      : 'DATABASE_AUTHORITY_DISABLED',
    result: null,
    databaseContacted: false,
    sqlExecuted: false,
    productionAuthority: false,
  });
}

function createPostgreSQLMembershipReadAdapter(options = {}) {
  const enabled = Boolean(
    options.configuration
    && options.configuration.enabled === true,
  );

  const adapter = {
    adapterType: 'postgresql-membership-read-adapter',
    adapterVersion: 1,
    state: enabled
      ? READ_ADAPTER_STATES.SKELETON_ONLY
      : READ_ADAPTER_STATES.DISABLED,
    operations: READ_OPERATIONS,

    getPrincipalById() {
      return unavailableResult('getPrincipalById', enabled);
    },

    getOrganizationById() {
      return unavailableResult('getOrganizationById', enabled);
    },

    getWorkspaceById() {
      return unavailableResult('getWorkspaceById', enabled);
    },

    getProjectById() {
      return unavailableResult('getProjectById', enabled);
    },

    listWorkspaceMembershipsForPrincipal() {
      return unavailableResult(
        'listWorkspaceMembershipsForPrincipal',
        enabled,
      );
    },

    listProjectMembershipsForPrincipal() {
      return unavailableResult(
        'listProjectMembershipsForPrincipal',
        enabled,
      );
    },

    listScopedPermissionGrants() {
      return unavailableResult(
        'listScopedPermissionGrants',
        enabled,
      );
    },
  };

  return deepFreeze(adapter);
}

module.exports = Object.freeze({
  READ_ADAPTER_STATES,
  READ_OPERATIONS,
  createPostgreSQLMembershipReadAdapter,
});
