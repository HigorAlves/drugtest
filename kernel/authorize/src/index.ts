/**
 * RBAC/ABAC Authorization System
 *
 * This module provides a flexible and powerful authorization system that supports
 * both Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).
 *
 * @module rbac
 */

export type { AppAbility } from './abilityFactory'
export { createAbacSubject, defineAbilityFor } from './abilityFactory'
export type { NamedPolicyHandler, PolicyCheckResult } from './checkPolicies'
export { checkNamedPolicies, checkPolicies, createPolicyHandler, enforcePolicies } from './checkPolicies'
export type { PermissionCheckResult } from './performAction'
export { checkPermission, filterFields, performAction } from './performAction'
export { RBACConfig } from './rbacConfig'
export * from './types'
